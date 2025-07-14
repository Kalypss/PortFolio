import jwt from 'jsonwebtoken';
import { SecurityError } from './errorHandler.js';
import { logSecurityEvent } from './monitoring.js';

// Store des tokens révoqués (en production, utiliser Redis)
const revokedTokens = new Set();

// Configuration JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'fallback-secret-dev-only',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  issuer: process.env.JWT_ISSUER || 'portfolio-backend',
  audience: process.env.JWT_AUDIENCE || 'portfolio-frontend'
};

// Middleware d'authentification JWT
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    logSecurityEvent('AUTH_MISSING_TOKEN', req, {
      message: 'Tentative d\'accès sans token'
    });
    throw new SecurityError(
      'Token d\'authentification requis',
      'MISSING_AUTH_TOKEN',
      401
    );
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    logSecurityEvent('AUTH_INVALID_FORMAT', req, {
      authHeader: authHeader.substring(0, 20)
    });
    throw new SecurityError(
      'Format de token invalide',
      'INVALID_AUTH_FORMAT',
      401
    );
  }
  
  const token = authHeader.substring(7);
  
  // Vérifier si le token est révoqué
  if (revokedTokens.has(token)) {
    logSecurityEvent('AUTH_REVOKED_TOKEN', req, {
      tokenHash: hashToken(token)
    });
    throw new SecurityError(
      'Token révoqué',
      'REVOKED_TOKEN',
      401
    );
  }
  
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
      algorithms: ['HS256']
    });
    
    // Vérifications supplémentaires
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      logSecurityEvent('AUTH_EXPIRED_TOKEN', req, {
        expiredAt: new Date(decoded.exp * 1000).toISOString()
      });
      throw new SecurityError(
        'Token expiré',
        'EXPIRED_TOKEN',
        401
      );
    }
    
    req.user = decoded;
    req.token = token;
    
    logSecurityEvent('AUTH_SUCCESS', req, {
      userId: decoded.sub,
      role: decoded.role
    });
    
    next();
  } catch (error) {
    if (error instanceof SecurityError) {
      throw error;
    }
    
    logSecurityEvent('AUTH_INVALID_TOKEN', req, {
      error: error.message,
      tokenLength: token.length
    });
    
    throw new SecurityError(
      'Token invalide',
      'INVALID_TOKEN',
      401
    );
  }
};

// Middleware d'autorisation basé sur les rôles
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new SecurityError(
        'Utilisateur non authentifié',
        'USER_NOT_AUTHENTICATED',
        401
      );
    }
    
    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      logSecurityEvent('AUTH_INSUFFICIENT_PRIVILEGES', req, {
        userRole,
        requiredRoles: allowedRoles,
        userId: req.user.sub
      });
      
      throw new SecurityError(
        'Privilèges insuffisants',
        'INSUFFICIENT_PRIVILEGES',
        403
      );
    }
    
    next();
  };
};

// Génération de token JWT
export const generateToken = (payload) => {
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    iss: JWT_CONFIG.issuer,
    aud: JWT_CONFIG.audience
  };
  
  return jwt.sign(tokenPayload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
    algorithm: 'HS256'
  });
};

// Révocation de token
export const revokeToken = (token) => {
  revokedTokens.add(token);
  
  // Nettoyer les tokens expirés toutes les heures
  setTimeout(() => {
    cleanupExpiredTokens();
  }, 3600000);
};

// Nettoyage des tokens expirés
const cleanupExpiredTokens = () => {
  const now = Math.floor(Date.now() / 1000);
  
  for (const token of revokedTokens) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp && decoded.exp < now) {
        revokedTokens.delete(token);
      }
    } catch (error) {
      // Token malformé, le supprimer
      revokedTokens.delete(token);
    }
  }
};

// Hash d'un token pour les logs (sécurité)
const hashToken = (token) => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex').substring(0, 16);
};

// Middleware d'authentification optionnelle
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  
  try {
    authenticateJWT(req, res, next);
  } catch (error) {
    // En cas d'erreur d'auth optionnelle, continuer sans user
    req.user = null;
    next();
  }
};

// Middleware pour les clés API
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    logSecurityEvent('API_KEY_MISSING', req, {
      message: 'Clé API manquante'
    });
    throw new SecurityError(
      'Clé API requise',
      'MISSING_API_KEY',
      401
    );
  }
  
  // Vérifier la clé API (en production, utiliser une base de données)
  const validApiKeys = (process.env.VALID_API_KEYS || '').split(',');
  
  if (!validApiKeys.includes(apiKey)) {
    logSecurityEvent('API_KEY_INVALID', req, {
      apiKeyPrefix: apiKey.substring(0, 8),
      ip: req.ip
    });
    throw new SecurityError(
      'Clé API invalide',
      'INVALID_API_KEY',
      401
    );
  }
  
  // Enregistrer l'utilisation de la clé API
  logSecurityEvent('API_KEY_USED', req, {
    apiKeyPrefix: apiKey.substring(0, 8)
  });
  
  req.apiKey = apiKey;
  next();
};

// Middleware pour vérifier l'origine de la requête
export const validateOrigin = (allowedOrigins = []) => {
  return (req, res, next) => {
    const origin = req.get('Origin') || req.get('Referer');
    
    if (!origin) {
      // Permettre les requêtes sans origine (ex: Postman, curl)
      if (process.env.NODE_ENV === 'development') {
        return next();
      }
      
      logSecurityEvent('ORIGIN_MISSING', req, {
        userAgent: req.get('User-Agent')
      });
      throw new SecurityError(
        'Origine de la requête manquante',
        'MISSING_ORIGIN',
        403
      );
    }
    
    const originUrl = new URL(origin);
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed.includes('*')) {
        // Support des wildcards basiques
        const regex = new RegExp(allowed.replace(/\*/g, '.*'));
        return regex.test(originUrl.hostname);
      }
      return originUrl.hostname === allowed;
    });
    
    if (!isAllowed) {
      logSecurityEvent('ORIGIN_BLOCKED', req, {
        origin: originUrl.hostname,
        allowedOrigins
      });
      throw new SecurityError(
        'Origine non autorisée',
        'BLOCKED_ORIGIN',
        403
      );
    }
    
    next();
  };
};

// Middleware pour vérifier l'intégrité des données
export const validateDataIntegrity = (req, res, next) => {
  const contentLength = req.get('Content-Length');
  const transferEncoding = req.get('Transfer-Encoding');
  
  // Vérifier les tentatives de smuggling
  if (contentLength && transferEncoding) {
    logSecurityEvent('HTTP_SMUGGLING_ATTEMPT', req, {
      contentLength,
      transferEncoding
    });
    throw new SecurityError(
      'En-têtes HTTP suspects',
      'HTTP_SMUGGLING',
      400
    );
  }
  
  // Vérifier la taille maximale du payload
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (contentLength && parseInt(contentLength) > maxSize) {
    logSecurityEvent('PAYLOAD_TOO_LARGE', req, {
      contentLength,
      maxSize
    });
    throw new SecurityError(
      'Payload trop volumineux',
      'PAYLOAD_TOO_LARGE',
      413
    );
  }
  
  next();
};

// Middleware de protection contre les attaques temporelles
export const timingAttackProtection = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000; // en ms
    
    // Logger les requêtes suspecteusement lentes
    if (duration > 5000) { // Plus de 5 secondes
      logSecurityEvent('SLOW_REQUEST', req, {
        duration: `${duration}ms`,
        url: req.url,
        method: req.method
      });
    }
    
    // Ajouter un délai minimum pour les endpoints sensibles
    const sensitiveEndpoints = ['/auth/login', '/auth/register', '/auth/reset'];
    const isSensitive = sensitiveEndpoints.some(endpoint => req.url.includes(endpoint));
    
    if (isSensitive && duration < 100) {
      setTimeout(() => {
        // Délai artificiel pour éviter les attaques temporelles
      }, 100 - duration);
    }
  });
  
  next();
};

// Export de la configuration JWT pour usage externe
export { JWT_CONFIG };
