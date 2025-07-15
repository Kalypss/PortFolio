import express from 'express';
import cors from 'cors';
import { GraphQLClient } from 'graphql-request';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import weatherCache from './services/weatherCache.js';

// Import des middlewares de sécurité
import {
  helmetConfig,
  globalRateLimit,
  strictRateLimit,
  githubRateLimit,
  weatherRateLimit,
  speedLimiter,
  validateGithubUsername,
  validateWeatherCity,
  validateQueryParams,
  sanitizeInput,
  simpleNoSQLProtection,
  securityLogger,
  botDetection,
  corsConfig,
  ipBlocking
} from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===== CONFIGURATION SÉCURITÉ =====
// Configuration CORS sécurisée
app.use(cors(corsConfig));

// Middleware de sécurité des headers
app.use(helmetConfig);

// Trust proxy pour les headers X-Forwarded-*
app.set('trust proxy', 1);

// Rate limiting global
app.use(globalRateLimit);

// Speed limiter pour réduire la vitesse des requêtes répétées
app.use(speedLimiter);

// Protection NoSQL simplifiée
app.use(simpleNoSQLProtection);

// Détection des bots malveillants
app.use(botDetection);

// Blocage d'IP automatique
app.use(ipBlocking);

// Logging sécurisé
app.use(securityLogger);

// Sanitization des entrées XSS
app.use(sanitizeInput);

// Middleware Express basiques
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques avec headers CORS
app.use('/weather-icons', (req, res, next) => {
  // Headers CORS pour les ressources météo
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
}, express.static(path.join(__dirname, 'public/weather-icons')));

// Configuration GitHub GraphQL
const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

// GraphQL query pour récupérer les contributions
const CONTRIBUTIONS_QUERY = `
  query($userName: String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          stargazerCount
          createdAt
          updatedAt
          primaryLanguage {
            name
          }
        }
      }
      followers {
        totalCount
      }
      following {
        totalCount
      }
    }
  }
`;

// Route pour récupérer les données de contribution GitHub
app.get('/api/github/:username', 
  githubRateLimit,
  validateGithubUsername,
  async (req, res) => {
  try {
    const { username } = req.params;
    
    // Vérifier si le token GitHub est configuré
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({ 
        error: 'GitHub token non configuré',
        message: 'Veuillez ajouter votre GITHUB_TOKEN dans le fichier .env'
      });
    }

    // Créer le client GraphQL avec le token
    const graphQLClient = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    // Exécuter la requête GraphQL
    const data = await graphQLClient.request(CONTRIBUTIONS_QUERY, { userName: username });
    
    if (!data.user) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé',
        message: `L'utilisateur ${username} n'existe pas sur GitHub`
      });
    }

    const user = data.user;
    const contributions = user.contributionsCollection.contributionCalendar;
    const repos = user.repositories.nodes;

    // Calculer les statistiques
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazerCount, 0);
    const totalRepos = user.repositories.totalCount;
    const totalContributions = contributions.totalContributions;

    // Calculer les streaks
    const { currentStreak, longestStreak } = calculateStreaks(contributions.weeks);

    // Transformer les données de contribution pour le frontend
    console.log('🔍 Number of weeks:', contributions.weeks.length);
    console.log('🔍 Days in first week:', contributions.weeks[0]?.contributionDays?.length);
    
    const contributionGrid = contributions.weeks.flatMap(week => 
      week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: getContributionLevel(day.contributionCount)
      }))
    );
    
    console.log('🔍 Total contribution grid items:', contributionGrid.length);

    // Activité de la semaine dernière
    const weeklyActivity = getWeeklyActivity(contributions.weeks);

    // Activité mensuelle
    const monthlyActivity = getMonthlyActivity(contributions.weeks);

    // Réponse formatée
    const response = {
      username,
      totalCommits: totalContributions,
      totalRepos,
      totalStars,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      currentStreak,
      longestStreak,
      contributionGrid,
      weeklyActivity,
      monthlyActivity,
      repositories: repos.slice(0, 10), // Top 10 repos
      lastUpdated: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Erreur lors de la récupération des données GitHub:', error);
    
    if (error.message.includes('Bad credentials')) {
      return res.status(401).json({ 
        error: 'Token GitHub invalide',
        message: 'Vérifiez votre GITHUB_TOKEN dans le fichier .env'
      });
    }

    if (error.message.includes('API rate limit exceeded')) {
      return res.status(429).json({ 
        error: 'Limite de l\'API dépassée',
        message: 'Trop de requêtes à l\'API GitHub. Réessayez plus tard.'
      });
    }

    res.status(500).json({ 
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les données GitHub'
    });
  }
});

// Route pour récupérer les données météo
app.get('/api/weather/:city',
  weatherRateLimit,
  validateWeatherCity,
  async (req, res) => {
  try {
    const { city } = req.params;
    
    // Vérifier d'abord le cache Redis
    const cachedWeather = await weatherCache.getWeatherFromCache(city);
    if (cachedWeather) {
      return res.json(cachedWeather);
    }
    
    // const API_KEY = process.env.WEATHER_API; // Votre clé API WeatherAPI
    const API_KEY = process.env.WEATHER_API_KEY; // Votre clé API WeatherAPI
    
    // Faire la requête à l'API WeatherAPI
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`);
    const data = response.data;
    
    // Mapping des icônes météo (même que dans votre HTML)
    const weatherIcons = {
      // Clear/Sunny conditions
      1000: 'clear-mostly-clear.png', // Sunny/Clear
      
      // Partly cloudy
      1003: 'partly-cloudy.png', // Partly cloudy
      
      // Cloudy/Overcast
      1006: 'cloudy-mostly-cloudy.png', // Cloudy
      1009: 'cloudy-mostly-cloudy.png', // Overcast
      
      // Fog/Mist/Haze
      1030: 'haze.png', // Mist
      1135: 'fog.png', // Fog
      1147: 'fog.png', // Freezing fog
      
      // Drizzle
      1150: 'drizzle-freezing-drizzle.png', // Patchy light drizzle
      1153: 'drizzle-freezing-drizzle.png', // Light drizzle
      1168: 'drizzle-freezing-drizzle.png', // Freezing drizzle
      1171: 'drizzle-freezing-drizzle.png', // Heavy freezing drizzle
      
      // Rain - light to moderate
      1063: 'rain.png', // Patchy rain possible
      1180: 'rain.png', // Patchy light rain
      1183: 'rain.png', // Light rain
      1186: 'rain.png', // Moderate rain at times
      1189: 'rain.png', // Moderate rain
      1240: 'rain.png', // Light rain shower
      1243: 'rain.png', // Moderate rain shower
      
      // Heavy rain
      1192: 'heavy-rain.png', // Heavy rain at times
      1195: 'heavy-rain.png', // Heavy rain
      1246: 'heavy-rain.png', // Torrential rain shower
      
      // Freezing rain/Sleet
      1198: 'freezing-rain-sleet-wintry-mix.png', // Light freezing rain
      1201: 'freezing-rain-sleet-wintry-mix.png', // Moderate or heavy freezing rain
      1204: 'freezing-rain-sleet-wintry-mix.png', // Light sleet
      1207: 'freezing-rain-sleet-wintry-mix.png', // Moderate or heavy sleet
      1249: 'freezing-rain-sleet-wintry-mix.png', // Light sleet showers
      1252: 'freezing-rain-sleet-wintry-mix.png', // Moderate or heavy sleet showers
      1069: 'freezing-rain-sleet-wintry-mix.png', // Patchy sleet possible
      1072: 'drizzle-freezing-drizzle.png', // Patchy freezing drizzle possible
      
      // Snow
      1066: 'snow.png', // Patchy snow possible
      1210: 'snow.png', // Patchy light snow
      1213: 'snow.png', // Light snow
      1216: 'snow.png', // Patchy moderate snow
      1219: 'snow.png', // Moderate snow
      1255: 'snow.png', // Light snow showers
      1258: 'snow.png', // Moderate or heavy snow showers
      
      // Heavy snow/Blizzard
      1222: 'heavy-snow-blizzard.png', // Patchy heavy snow
      1225: 'heavy-snow-blizzard.png', // Heavy snow
      1114: 'heavy-snow-blizzard.png', // Blowing snow
      1117: 'heavy-snow-blizzard.png', // Blizzard
      1237: 'heavy-snow-blizzard.png', // Ice pellets
      1261: 'heavy-snow-blizzard.png', // Light showers of ice pellets
      1264: 'heavy-snow-blizzard.png', // Moderate or heavy showers of ice pellets
      
      // Thunderstorm
      1087: 'thunderstorm.png', // Thundery outbreaks possible
      1273: 'thunderstorm.png', // Patchy light rain with thunder
      1276: 'thunderstorm.png', // Moderate or heavy rain with thunder
      1279: 'thunderstorm.png', // Patchy light snow with thunder
      1282: 'thunderstorm.png', // Moderate or heavy snow with thunder
      
      // Windy/Breezy
      1006: 'windy-breezy.png', // Can be used for windy conditions
    };
    
    // Déterminer l'icône avec variantes jour/nuit
    const iconCode = data.current.condition.code;
    const isDay = data.current.is_day === 1;
    let iconFile = weatherIcons[iconCode] || 'clear-mostly-clear.png';
    
    // Appliquer les variantes de nuit pour certaines conditions
    if (!isDay) {
      switch(iconCode) {
        case 1000: // Clear
          iconFile = 'clear-mostly-clear-night.png';
          break;
        case 1003: // Partly cloudy
          iconFile = 'partly-cloudy-night.png';
          break;
        case 1150: // Drizzle
        case 1153:
        case 1168:
        case 1171:
          iconFile = 'drizzle-night.png';
          break;
        // Pour les autres conditions, garder la version jour car elles fonctionnent pour les deux
      }
    }
    
    // Réponse formatée
    const weatherData = {
      location: {
        name: data.location.name,
        country: data.location.country
      },
      current: {
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        icon: iconFile,
        iconUrl: `http://localhost:${PORT}/weather-icons/${iconFile}`,
        humidity: data.current.humidity,
        uvIndex: data.current.uv || 0,
        isDay: isDay
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Mettre en cache les données météo
    await weatherCache.setWeatherCache(city, weatherData);
    
    res.json(weatherData);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo:', error);
    
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ 
        error: 'Ville non trouvée',
        message: 'La ville spécifiée n\'a pas été trouvée'
      });
    }
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ 
        error: 'Clé API invalide',
        message: 'La clé API météo est invalide'
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les données météo'
    });
  }
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    hasGitHubToken: !!process.env.GITHUB_TOKEN
  });
});

// Fonctions utilitaires

function getContributionLevel(count) {
  if (count === 0) return 0;
  if (count >= 1 && count <= 3) return 1;
  if (count >= 4 && count <= 6) return 2;
  if (count >= 7 && count <= 9) return 3;
  return 4; // 10+
}

function calculateStreaks(weeks) {
  const allDays = weeks.flat().map(week => week.contributionDays).flat();
  const dates = allDays
    .filter(day => day.contributionCount > 0)
    .map(day => new Date(day.date))
    .sort((a, b) => a - b);

  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Calculer le streak actuel
  const lastContributionDate = dates[dates.length - 1];
  if (isSameDay(lastContributionDate, today) || isSameDay(lastContributionDate, yesterday)) {
    currentStreak = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const currentDate = dates[i];
      const nextDate = dates[i + 1];
      const diffTime = nextDate - currentDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculer le plus long streak
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currDate = dates[i];
    const diffTime = currDate - prevDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

function getWeeklyActivity(weeks) {
  const lastWeek = weeks[weeks.length - 1];
  if (!lastWeek) return [];

  return lastWeek.contributionDays.map(day => ({
    day: new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    count: day.contributionCount,
    level: getContributionLevel(day.contributionCount),
    date: day.date
  }));
}

function getMonthlyActivity(weeks) {
  const monthlyData = {};
  
  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      const date = new Date(day.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          count: 0,
          fullMonth: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        };
      }
      
      monthlyData[monthKey].count += day.contributionCount;
    });
  });

  return Object.values(monthlyData).slice(-12); // 12 derniers mois
}

// Démarrer le serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 API GitHub disponible sur http://localhost:${PORT}/api/github/:username`);
  console.log(`🌤️  API Météo disponible sur http://localhost:${PORT}/api/weather/:city`);
  console.log(`💚 Token GitHub configuré: ${process.env.GITHUB_TOKEN ? 'Oui' : 'Non'}`);
  
  // Initialiser Redis et le cache météo
  console.log('🔧 Initializing Redis cache...');
  await weatherCache.init();
});

// ===== ROUTES DE SÉCURITÉ ET MONITORING =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route pour obtenir les limites de rate limiting
app.get('/api/limits', (req, res) => {
  res.json({
    globalLimit: '100 requêtes / 15 minutes',
    githubLimit: '10 requêtes / heure',
    weatherLimit: '30 requêtes / 10 minutes',
    message: 'Limites de taux pour protéger les APIs externes'
  });
});

// ===== GESTION D'ERREURS GLOBALE =====

// Middleware de gestion d'erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.originalUrl} n'existe pas`,
    availableRoutes: [
      'GET /health',
      'GET /api/limits',
      'GET /api/github/:username',
      'GET /api/weather/:city'
    ]
  });
});

// Middleware de gestion d'erreurs globales
app.use((err, req, res, next) => {
  console.error('🚨 Erreur serveur:', err);
  
  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: err.message
    });
  }
  
  // Erreur CORS
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Erreur CORS',
      message: 'Origine non autorisée'
    });
  }
  
  // Erreur de rate limiting
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Trop de requêtes',
      message: 'Limite de taux dépassée, réessayez plus tard'
    });
  }
  
  // Erreur générique du serveur
  res.status(err.status || 500).json({
    error: 'Erreur serveur interne',
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Gérer l'arrêt propre du serveur
process.on('SIGINT', async () => {
  console.log('🛑 Arrêt du serveur...');
  await weatherCache.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Signal SIGTERM reçu, arrêt propre...');
  await weatherCache.close();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Rejection non gérée:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Exception non catchée:', error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Arrêt du serveur...');
  await weatherCache.close();
  process.exit(0);
});
