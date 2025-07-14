import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuration des logs
const logStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });
const securityLogStream = fs.createWriteStream(path.join(logsDir, 'security.log'), { flags: 'a' });

// Format personnalisé pour les logs
morgan.token('real-ip', (req) => {
  return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
});

morgan.token('user-agent', (req) => {
  return req.get('User-Agent') || 'Unknown';
});

morgan.token('timestamp', () => {
  return new Date().toISOString();
});

// Format de log sécurisé
const securityLogFormat = ':timestamp :real-ip ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Middleware de logging principal
export const accessLogger = morgan(securityLogFormat, {
  stream: logStream,
  skip: (req, res) => {
    // Ne pas logger les requêtes statiques en développement
    return process.env.NODE_ENV === 'development' && req.url.includes('/static');
  }
});

// Logger pour la console en développement
export const consoleLogger = morgan('dev', {
  skip: (req, res) => process.env.NODE_ENV === 'production'
});

// Logger spécifique pour les erreurs
export const errorLogger = (err, req, res, next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    error: {
      message: err.message,
      stack: err.stack,
      status: err.status || 500
    },
    body: req.body,
    params: req.params,
    query: req.query
  };
  
  errorLogStream.write(JSON.stringify(errorLog) + '\n');
  
  // Log aussi dans la console en développement
  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 Erreur:', errorLog);
  }
  
  next(err);
};

// Logger pour les événements de sécurité
export const logSecurityEvent = (event, req, details = {}) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    ip: req?.ip || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    url: req?.url || 'unknown',
    method: req?.method || 'unknown',
    details
  };
  
  securityLogStream.write(JSON.stringify(securityLog) + '\n');
  
  // Log critique dans la console
  if (['BLOCKED_IP', 'MALICIOUS_BOT', 'INJECTION_ATTEMPT', 'BRUTE_FORCE'].includes(event)) {
    console.warn('🚨 SÉCURITÉ:', securityLog);
  }
};

// Middleware de monitoring des performances
export const performanceMonitor = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Logger les requêtes lentes (> 1 seconde)
    if (duration > 1000) {
      logSecurityEvent('SLOW_REQUEST', req, {
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode
      });
    }
    
    // Surveiller l'utilisation mémoire
    const memUsage = process.memoryUsage();
    if (memUsage.heapUsed > 100 * 1024 * 1024) { // > 100MB
      console.warn('⚠️  Utilisation mémoire élevée:', {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
      });
    }
  });
  
  next();
};

// Rotation des logs
export const rotateLogs = () => {
  const timestamp = new Date().toISOString().split('T')[0];
  const logFiles = ['access.log', 'error.log', 'security.log'];
  
  logFiles.forEach(logFile => {
    const currentPath = path.join(logsDir, logFile);
    const archivedPath = path.join(logsDir, `${timestamp}-${logFile}`);
    
    if (fs.existsSync(currentPath)) {
      const stats = fs.statSync(currentPath);
      // Rotation si le fichier fait plus de 10MB
      if (stats.size > 10 * 1024 * 1024) {
        fs.renameSync(currentPath, archivedPath);
        console.log(`📁 Log rotaté: ${logFile} -> ${timestamp}-${logFile}`);
      }
    }
  });
};

// Fonction de nettoyage des vieux logs (> 30 jours)
export const cleanOldLogs = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  fs.readdir(logsDir, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        if (stats.mtime < thirtyDaysAgo) {
          fs.unlink(filePath, (err) => {
            if (!err) {
              console.log(`🗑️  Ancien log supprimé: ${file}`);
            }
          });
        }
      });
    });
  });
};

// Système d'alertes pour événements critiques
const alertThresholds = {
  BLOCKED_IP: { count: 10, window: 3600000 }, // 10 en 1h
  INJECTION_ATTEMPT: { count: 5, window: 600000 }, // 5 en 10min
  RATE_LIMIT_HIT: { count: 50, window: 3600000 } // 50 en 1h
};

const eventCounts = new Map();

export const securityAlert = (eventType, details) => {
  const now = Date.now();
  const threshold = alertThresholds[eventType];
  
  if (!threshold) return;
  
  if (!eventCounts.has(eventType)) {
    eventCounts.set(eventType, []);
  }
  
  const events = eventCounts.get(eventType);
  
  // Nettoyer les événements anciens
  const validEvents = events.filter(timestamp => now - timestamp < threshold.window);
  validEvents.push(now);
  eventCounts.set(eventType, validEvents);
  
  // Déclencher une alerte si le seuil est atteint
  if (validEvents.length >= threshold.count) {
    console.error(`🚨🚨 ALERTE SÉCURITÉ: ${eventType} - ${validEvents.length} événements en ${threshold.window/60000} minutes`);
    console.error('Détails:', details);
    
    // Ici on pourrait envoyer un email, webhook, etc.
    // sendAlertNotification(eventType, validEvents.length, details);
    
    // Reset pour éviter le spam d'alertes
    eventCounts.set(eventType, []);
  }
};

export { logsDir };
