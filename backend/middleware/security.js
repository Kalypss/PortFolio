import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { body, param, query, validationResult } from 'express-validator';
import xss from 'xss';

// Configuration Helmet pour la sécurité des headers - CSP désactivé pour Nuxt
export const helmetConfig = helmet({
  contentSecurityPolicy: false, // Désactiver CSP côté backend, Nuxt le gère
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false, // Désactiver CORP pour permettre les ressources cross-origin
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

// Rate limiting global - Modéré pour un portfolio public
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requêtes par IP toutes les 15 minutes (plus généreux)
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Ne pas limiter les requêtes statiques
    return req.url.includes('/weather-icons') || req.url === '/health';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit dépassé',
      message: 'Trop de requêtes depuis votre IP. Veuillez réessayer dans 15 minutes.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting strict pour les API sensibles
export const strictRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 requêtes par fenêtre
  message: {
    error: 'Rate limit exceeded pour cette API',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting pour GitHub API - Plus généreux
export const githubRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 30, // 30 requêtes GitHub par heure (plus généreux)
  message: {
    error: 'Limite GitHub API atteinte',
    retryAfter: '1 hour'
  },
  keyGenerator: (req) => {
    return req.ip + ':github';
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting pour Weather API - Plus généreux
export const weatherRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 requêtes météo par 10 minutes (plus généreux)
  message: {
    error: 'Limite Weather API atteinte',
    retryAfter: '10 minutes'
  },
  keyGenerator: (req) => {
    return req.ip + ':weather';
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Slow down pour réduire la vitesse des requêtes répétées
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Ralentir après 50 requêtes
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 100;
  },
  maxDelayMs: 20000, // Maximum 20 secondes de délai
});

// Validation des paramètres GitHub
export const validateGithubUsername = [
  param('username')
    .isLength({ min: 1, max: 39 })
    .matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/)
    .withMessage('Nom d\'utilisateur GitHub invalide')
    .customSanitizer(value => xss(value)),
  handleValidationErrors
];

// Validation des paramètres météo
export const validateWeatherCity = [
  param('city')
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-ZÀ-ÿ\s\-\'\.]{1,100}$/)
    .withMessage('Nom de ville invalide')
    .customSanitizer(value => xss(value)),
  handleValidationErrors
];

// Validation des query parameters
export const validateQueryParams = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite doit être entre 1 et 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset doit être un nombre positif'),
  handleValidationErrors
];

// Gestion des erreurs de validation
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
}

// Middleware de sanitization XSS seulement
export const sanitizeInput = (req, res, next) => {
  // Nettoyer les paramètres de route
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key]);
      }
    });
  }

  // Nettoyer les query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    });
  }

  // Nettoyer le body s'il existe
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
};

// Fonction récursive pour nettoyer les objets
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return xss(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    Object.keys(obj).forEach(key => {
      sanitized[key] = sanitizeObject(obj[key]);
    });
    return sanitized;
  }
  return obj;
}

// Protection contre les injections NoSQL - Version simplifiée
export const simpleNoSQLProtection = (req, res, next) => {
  const checkForNoSQL = (obj) => {
    if (typeof obj === 'string') {
      // Bloquer les caractères suspects pour NoSQL
      if (obj.includes('$') || obj.includes('{') || obj.includes('}')) {
        return true;
      }
    }
    if (Array.isArray(obj)) {
      return obj.some(checkForNoSQL);
    }
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(checkForNoSQL);
    }
    return false;
  };

  // Vérifier params, query et body
  if (checkForNoSQL(req.params) || checkForNoSQL(req.query) || checkForNoSQL(req.body)) {
    console.warn(`🚨 Tentative d'injection NoSQL détectée de ${req.ip}`);
    return res.status(400).json({
      error: 'Requête invalide',
      message: 'Caractères suspects détectés'
    });
  }

  next();
};

// Middleware de logging sécurisé - Version portfolio
export const securityLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent')?.substring(0, 150) || 'Unknown',
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    };
    
    // Logger uniquement les erreurs et requêtes très lentes
    if (res.statusCode >= 400) {
      console.warn('🚨 Erreur HTTP:', JSON.stringify(logData, null, 2));
    } else if (duration > 3000) {
      console.warn('⏰ Requête lente:', JSON.stringify(logData, null, 2));
    } else if (process.env.NODE_ENV === 'development') {
      // En dev, logger toutes les requêtes API
      if (req.originalUrl.startsWith('/api/')) {
        console.log(`✅ ${logData.method} ${logData.url} - ${logData.statusCode} (${logData.duration})`);
      }
    }
  });
  
  next();
};

// Middleware de détection des bots malveillants - Version allégée pour portfolio
export const botDetection = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Liste de patterns vraiment suspects (outils d'attaque)
  const suspiciousPatterns = [
    /sqlmap/i,
    /nmap/i,
    /nikto/i,
    /burp.*scanner/i,
    /zap.*proxy/i,
    /masscan/i,
    /acunetix/i,
    /nessus/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    console.warn(`🤖 Bot suspect bloqué: ${userAgent} depuis ${req.ip}`);
    return res.status(403).json({
      error: 'Accès refusé',
      message: 'User-Agent non autorisé'
    });
  }
  
  // Log des bots légitimes pour monitoring
  if (userAgent.toLowerCase().includes('bot') || userAgent.toLowerCase().includes('crawler')) {
    console.log(`🤖 Bot légitime: ${userAgent.substring(0, 100)}`);
  }
  
  next();
};

// Configuration CORS sécurisée mais permissive pour un portfolio
export const corsConfig = {
  origin: function (origin, callback) {
    // Pour un portfolio, on est plus permissif
    const allowedOrigins = [
      // Développement local
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      // Docker
      'https://folio-frontend:3000',
      'http://folio-frontend:3000',
      // Production domains
      'https://floriansilva.dev',
      'http://floriansilva.dev',
      'https://api.floriansilva.dev',
      'http://api.floriansilva.dev'
    ];
    
    // Autoriser les requêtes sans origine (ex: applications mobiles, Postman)
    if (!origin) return callback(null, true);
    
    // En développement, être plus permissif
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 Origine CORS non autorisée: ${origin}`);
      callback(null, true); // Pour un portfolio, on reste permissif
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
};

// Middleware de blocage d'IP
const blockedIPs = new Set();
const suspiciousIPs = new Map(); // IP -> { count, lastAttempt }

export const ipBlocking = (req, res, next) => {
  const clientIP = req.ip;
  
  // Vérifier si l'IP est bloquée
  if (blockedIPs.has(clientIP)) {
    console.warn(`🚫 IP bloquée tentant d'accéder: ${clientIP}`);
    return res.status(403).json({
      error: 'Accès interdit',
      message: 'Votre adresse IP a été bloquée'
    });
  }
  
  // Surveiller les IPs suspectes
  if (req.route && req.route.path.includes('/api/')) {
    const now = Date.now();
    const suspicious = suspiciousIPs.get(clientIP) || { count: 0, lastAttempt: now };
    
    // Reset si plus d'une heure
    if (now - suspicious.lastAttempt > 3600000) {
      suspicious.count = 0;
    }
    
    suspicious.count++;
    suspicious.lastAttempt = now;
    
    // Bloquer après 100 tentatives suspectes
    if (suspicious.count > 100) {
      blockedIPs.add(clientIP);
      console.warn(`🚫 IP automatiquement bloquée: ${clientIP}`);
      return res.status(403).json({
        error: 'IP bloquée',
        message: 'Trop d\'activité suspecte détectée'
      });
    }
    
    suspiciousIPs.set(clientIP, suspicious);
  }
  
  next();
};

export { handleValidationErrors };
