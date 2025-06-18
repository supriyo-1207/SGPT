const winston = require("winston");
const fs = require("fs");
const path = require("path");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Always log to console
  ],
});

// Add file transports only in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const logDir = path.join(__dirname, '../logs');

  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  logger.add(new winston.transports.File({ filename: path.join(logDir, 'debug.log'), level: 'debug' }));
  logger.add(new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }));
  logger.add(new winston.transports.File({ filename: path.join(logDir, 'combined.log') }));
}

module.exports = logger;
