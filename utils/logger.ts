// utils/logger.ts
// Environment-gated logger to replace console.log statements
// Prevents PII leakage and reduces production noise

const isDevelopment = __DEV__;

interface LogLevel {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

/**
 * Sanitizes log arguments to remove sensitive information
 */
const sanitizeArgs = (args: any[]): any[] => {
  return args.map(arg => {
    if (typeof arg === 'string') {
      // Remove potential token patterns
      return arg.replace(/token["\s:=]+[^\s"']+/gi, 'token=***');
    }
    if (typeof arg === 'object' && arg !== null) {
      // Remove sensitive fields from objects
      const sanitized = { ...arg };
      const sensitiveFields = ['token', 'password', 'secret', 'authorization', 'apiKey'];
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '***';
        }
      });
      return sanitized;
    }
    return arg;
  });
};

/**
 * Logger utility that gates logs based on environment
 * Only logs in development mode to prevent PII leakage in production
 */
export const logger: LogLevel = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      const sanitized = sanitizeArgs(args);
      console.log(...sanitized);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, but sanitize them
    const sanitized = sanitizeArgs(args);
    if (isDevelopment) {
      console.error(...sanitized);
    } else {
      // In production, you could send to error tracking service
      // Example: Sentry.captureException(...sanitized);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      const sanitized = sanitizeArgs(args);
      console.warn(...sanitized);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      const sanitized = sanitizeArgs(args);
      console.info(...sanitized);
    }
  },
};

export default logger;

