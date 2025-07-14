import Redis from 'redis';
import cron from 'node-cron';
import axios from 'axios';

class WeatherCacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    
    // Liste des 20 grandes villes mondiales pour le cache permanent
    this.majorCities = [
      'Paris', 'London', 'New York', 'Tokyo', 'Sydney',
      'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Barcelona',
      'Moscow', 'Dubai', 'Singapore', 'Hong Kong', 'Los Angeles',
      'Chicago', 'Toronto', 'Montreal', 'Mumbai', 'Cairo'
    ];
  }

  // Initialiser la connexion Redis
  async init() {
    try {
      this.client = Redis.createClient({
        url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('Redis server is not available');
            return new Error('Redis server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      await this.client.connect();
      
      // Initialiser le cache avec les grandes villes
      await this.initMajorCitiesCache();
      
      // Programmer les mises à jour automatiques
      this.scheduleUpdates();
      
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.isConnected = false;
    }
  }

  // Générer la clé de cache pour une ville
  getCacheKey(city) {
    return `weather:${city.toLowerCase().replace(/\s+/g, '_')}`;
  }

  // Obtenir les données météo du cache
  async getWeatherFromCache(city) {
    if (!this.isConnected) return null;
    
    try {
      const key = this.getCacheKey(city);
      const cachedData = await this.client.get(key);
      
      if (cachedData) {
        console.log(`📦 Cache hit for ${city}`);
        const data = JSON.parse(cachedData);
        
        // Mettre à jour le TTL pour les villes non-majeures (30 minutes)
        if (!this.majorCities.some(major => major.toLowerCase() === city.toLowerCase())) {
          await this.client.expire(key, 30 * 60); // 30 minutes
        }
        
        return data;
      }
      
      console.log(`❌ Cache miss for ${city}`);
      return null;
    } catch (error) {
      console.error('Error getting weather from cache:', error);
      return null;
    }
  }

  // Mettre en cache les données météo
  async setWeatherCache(city, weatherData) {
    if (!this.isConnected) return;
    
    try {
      const key = this.getCacheKey(city);
      const dataWithTimestamp = {
        ...weatherData,
        cachedAt: new Date().toISOString()
      };
      
      await this.client.set(key, JSON.stringify(dataWithTimestamp));
      
      // Définir le TTL selon le type de ville
      const isMajorCity = this.majorCities.some(major => major.toLowerCase() === city.toLowerCase());
      const ttl = isMajorCity ? 60 * 60 : 30 * 60; // 1h pour les grandes villes, 30min pour les autres
      
      await this.client.expire(key, ttl);
      
      console.log(`💾 Cached weather for ${city} (TTL: ${ttl/60}min)`);
    } catch (error) {
      console.error('Error setting weather cache:', error);
    }
  }

  // Initialiser le cache avec les grandes villes
  async initMajorCitiesCache() {
    console.log('🌍 Initializing cache for major cities...');
    
    for (const city of this.majorCities) {
      try {
        // Vérifier si la ville est déjà en cache
        const cached = await this.getWeatherFromCache(city);
        if (!cached) {
          console.log(`🔄 Pre-loading ${city}...`);
          // Ici on peut faire une requête API pour pré-charger
          // Pour l'instant, on va juste marquer qu'il faut les charger
          await this.refreshCityWeather(city);
        }
      } catch (error) {
        console.error(`Error pre-loading ${city}:`, error);
      }
    }
  }

  // Rafraîchir la météo d'une ville
  async refreshCityWeather(city) {
    try {
      const API_KEY = '90ba3eded8e74d88a5a194946250207';
      
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`);
      const data = response.data;
      
      // Processus de mapping des icônes (même logique que dans server.js)
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
      
      const iconCode = data.current.condition.code;
      const isDay = data.current.is_day === 1;
      let iconFile = weatherIcons[iconCode] || 'clear-mostly-clear.png';
      
      if (!isDay) {
        switch(iconCode) {
          case 1000:
            iconFile = 'clear-mostly-clear-night.png';
            break;
          case 1003:
            iconFile = 'partly-cloudy-night.png';
            break;
          case 1150:
          case 1153:
          case 1168:
          case 1171:
            iconFile = 'drizzle-night.png';
            break;
        }
      }
      
      const weatherData = {
        location: {
          name: data.location.name,
          country: data.location.country
        },
        current: {
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: iconFile,
          iconUrl: `http://localhost:${process.env.PORT || 3001}/weather-icons/${iconFile}`,
          humidity: data.current.humidity,
          uvIndex: data.current.uv || 0,
          isDay: isDay
        },
        lastUpdated: new Date().toISOString()
      };
      
      await this.setWeatherCache(city, weatherData);
      return weatherData;
      
    } catch (error) {
      console.error(`Error refreshing weather for ${city}:`, error);
      return null;
    }
  }

  // Programmer les mises à jour automatiques
  scheduleUpdates() {
    // Mettre à jour les grandes villes toutes les heures
    cron.schedule('0 * * * *', async () => {
      console.log('🔄 Scheduled update for major cities...');
      for (const city of this.majorCities) {
        await this.refreshCityWeather(city);
        // Attendre 2 secondes entre chaque requête pour éviter la surcharge
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    });

    console.log('⏰ Scheduled updates configured');
  }

  // Nettoyer les entrées expirées
  async cleanup() {
    if (!this.isConnected) return;
    
    try {
      const keys = await this.client.keys('weather:*');
      let cleaned = 0;
      
      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl === -1) { // Clé sans expiration
          const city = key.replace('weather:', '').replace(/_/g, ' ');
          const isMajorCity = this.majorCities.some(major => major.toLowerCase() === city.toLowerCase());
          
          if (!isMajorCity) {
            await this.client.del(key);
            cleaned++;
          }
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Fermer la connexion Redis
  async close() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      console.log('Redis connection closed');
    }
  }
}

export default new WeatherCacheService();
