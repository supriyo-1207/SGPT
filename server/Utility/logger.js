const winston = require("winston");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: "debug", // Set debug as the minimum level
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/debug.log", level: "debug" }), // Store debug logs
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Store errors separately
    new winston.transports.File({ filename: "logs/combined.log" }), // Store all logs
  ],
});

module.exports = logger;
