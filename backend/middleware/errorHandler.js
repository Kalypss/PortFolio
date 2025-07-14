import { logSecurityEvent, securityAlert } from './monitoring.js';

// Classe d'erreur personnalisée pour les erreurs de sécurité
export class SecurityError extends Error {
  constructor(message, type = 'SECURITY_VIOLATION', statusCode = 403) {
    super(message);
    this.name = 'SecurityError';
    this.type = type;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

// Classe d'erreur pour la validation
export class ValidationError extends Error {
  constructor(message, fields = [], statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

// Classe d'erreur pour les limites de taux
export class RateLimitError extends Error {
  constructor(message = 'Trop de requêtes', retryAfter = 900) {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.retryAfter = retryAfter;
    this.timestamp = new Date().toISOString();
  }
}

// Gestionnaire d'erreur global
export const globalErrorHandler = (err, req, res, next) => {
  // Logger l'erreur
  console.error('❌ Erreur capturée:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  // Gestion spécifique selon le type d'erreur
  if (err instanceof SecurityError) {
    logSecurityEvent(err.type, req, {
      message: err.message,
      stack: err.stack
    });
    
    securityAlert(err.type, {
      ip: req.ip,
      url: req.url,
      message: err.message
    });
    
    return res.status(err.statusCode).json({
      error: 'Violation de sécurité',
      message: process.env.NODE_ENV === 'production' 
        ? 'Accès non autorisé' 
        : err.message,
      type: err.type,
      timestamp: err.timestamp
    });
  }
  
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: 'Données invalides',
      message: err.message,
      fields: err.fields,
      timestamp: err.timestamp
    });
  }
  
  if (err instanceof RateLimitError) {
    logSecurityEvent('RATE_LIMIT_HIT', req, {
      message: err.message,
      retryAfter: err.retryAfter
    });
    
    return res.status(err.statusCode).json({
      error: 'Limite de taux dépassée',
      message: err.message,
      retryAfter: err.retryAfter,
      timestamp: err.timestamp
    });
  }
  
  // Erreurs spécifiques aux APIs externes
  if (err.response && err.response.status) {
    const apiError = handleApiError(err, req);
    return res.status(apiError.statusCode).json(apiError.response);
  }
  
  // Erreurs de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logSecurityEvent('MALFORMED_JSON', req, {
      message: 'JSON malformé détecté'
    });
    
    return res.status(400).json({
      error: 'Format JSON invalide',
      message: 'Le corps de la requête contient du JSON malformé',
      timestamp: new Date().toISOString()
    });
  }
  
  // Erreurs CORS
  if (err.message && err.message.includes('CORS')) {
    logSecurityEvent('CORS_VIOLATION', req, {
      origin: req.get('Origin'),
      message: err.message
    });
    
    return res.status(403).json({
      error: 'Erreur CORS',
      message: 'Origine non autorisée',
      timestamp: new Date().toISOString()
    });
  }
  
  // Erreur générique - ne pas exposer les détails en production
  const statusCode = err.statusCode || err.status || 500;
  const response = {
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur interne s\'est produite' 
      : err.message,
    timestamp: new Date().toISOString()
  };
  
  // Ajouter la stack trace seulement en développement
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }
  
  // Logger les erreurs 500 comme critiques
  if (statusCode >= 500) {
    logSecurityEvent('SERVER_ERROR', req, {
      message: err.message,
      stack: err.stack,
      statusCode
    });
  }
  
  res.status(statusCode).json(response);
};

// Gestionnaire pour les erreurs d'API externes
const handleApiError = (err, req) => {
  const { response } = err;
  
  // GitHub API errors
  if (req.url.includes('/github/')) {
    if (response.status === 401) {
      logSecurityEvent('GITHUB_AUTH_ERROR', req, {
        message: 'Token GitHub invalide ou expiré'
      });
      return {
        statusCode: 503,
        response: {
          error: 'Service temporairement indisponible',
          message: 'Problème d\'authentification avec l\'API GitHub',
          timestamp: new Date().toISOString()
        }
      };
    }
    
    if (response.status === 403) {
      logSecurityEvent('GITHUB_RATE_LIMIT', req, {
        message: 'Limite de l\'API GitHub atteinte'
      });
      return {
        statusCode: 429,
        response: {
          error: 'Limite API atteinte',
          message: 'Limite de l\'API GitHub temporairement atteinte',
          retryAfter: 3600,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
  
  // Weather API errors
  if (req.url.includes('/weather/')) {
    if (response.status === 401) {
      logSecurityEvent('WEATHER_AUTH_ERROR', req, {
        message: 'Clé API météo invalide'
      });
      return {
        statusCode: 503,
        response: {
          error: 'Service météo indisponible',
          message: 'Problème d\'authentification avec le service météo',
          timestamp: new Date().toISOString()
        }
      };
    }
    
    if (response.status === 404) {
      return {
        statusCode: 404,
        response: {
          error: 'Ville non trouvée',
          message: 'La ville demandée n\'a pas été trouvée',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
  
  // Erreur API générique
  return {
    statusCode: 502,
    response: {
      error: 'Erreur de service externe',
      message: 'Un service externe n\'est pas disponible',
      timestamp: new Date().toISOString()
    }
  };
};

// Middleware pour capturer les 404
export const notFoundHandler = (req, res, next) => {
  logSecurityEvent('NOT_FOUND', req, {
    url: req.url,
    method: req.method
  });
  
  res.status(404).json({
    error: 'Ressource non trouvée',
    message: `La route ${req.method} ${req.url} n'existe pas`,
    timestamp: new Date().toISOString()
  });
};

// Middleware pour capturer les erreurs async
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation des en-têtes de sécurité
export const validateSecurityHeaders = (req, res, next) => {
  const suspiciousHeaders = [
    'x-forwarded-host',
    'x-originating-ip',
    'x-remote-ip',
    'x-remote-addr'
  ];
  
  const foundSuspicious = suspiciousHeaders.filter(header => req.get(header));
  
  if (foundSuspicious.length > 0) {
    logSecurityEvent('SUSPICIOUS_HEADERS', req, {
      headers: foundSuspicious.map(h => `${h}: ${req.get(h)}`)
    });
  }
  
  // Vérifier les tentatives d'injection dans les headers
  const headerInjectionPatterns = [
    /[\r\n]/,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i
  ];
  
  Object.keys(req.headers).forEach(headerName => {
    const headerValue = req.headers[headerName];
    if (typeof headerValue === 'string') {
      const hasInjection = headerInjectionPatterns.some(pattern => pattern.test(headerValue));
      if (hasInjection) {
        logSecurityEvent('HEADER_INJECTION', req, {
          header: headerName,
          value: headerValue.substring(0, 100) // Limiter la longueur
        });
        
        throw new SecurityError(
          'Injection détectée dans les en-têtes',
          'HEADER_INJECTION'
        );
      }
    }
  });
  
  next();
};

// Gestionnaire d'arrêt gracieux
export const gracefulShutdown = (server) => {
  const shutdown = (signal) => {
    console.log(`📡 Signal ${signal} reçu, arrêt gracieux...`);
    
    server.close((err) => {
      if (err) {
        console.error('❌ Erreur lors de l\'arrêt du serveur:', err);
        process.exit(1);
      }
      
      console.log('✅ Serveur arrêté proprement');
      process.exit(0);
    });
    
    // Force l'arrêt après 10 secondes
    setTimeout(() => {
      console.error('🚫 Arrêt forcé après timeout');
      process.exit(1);
    }, 10000);
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Gestion des erreurs non capturées
  process.on('uncaughtException', (err) => {
    console.error('💥 Exception non capturée:', err);
    logSecurityEvent('UNCAUGHT_EXCEPTION', null, {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Promise rejetée non gérée:', reason);
    logSecurityEvent('UNHANDLED_REJECTION', null, {
      reason: reason.toString(),
      promise: promise.toString()
    });
  });
};
