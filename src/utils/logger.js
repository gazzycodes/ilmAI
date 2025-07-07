/**
 * Simple logger utility for LLMAI
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Set default log level based on environment
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

// Current log level
let currentLogLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : DEFAULT_LOG_LEVEL;

/**
 * Format the current timestamp
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

/**
 * Log an error message
 * @param {string} message - Error message
 * @param {Error|Object} [error] - Optional error object
 */
function error(message, error) {
  if (currentLogLevel >= LOG_LEVELS.ERROR) {
    console.error(`[ERROR] ${getTimestamp()} - ${message}`);
    if (error) {
      if (error instanceof Error) {
        console.error(error.stack || error.message);
      } else {
        console.error(error);
      }
    }
  }
}

/**
 * Log a warning message
 * @param {string} message - Warning message
 */
function warn(message) {
  if (currentLogLevel >= LOG_LEVELS.WARN) {
    console.warn(`[WARN] ${getTimestamp()} - ${message}`);
  }
}

/**
 * Log an info message
 * @param {string} message - Info message
 */
function info(message) {
  if (currentLogLevel >= LOG_LEVELS.INFO) {
    console.log(`[INFO] ${getTimestamp()} - ${message}`);
  }
}

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {Object} [data] - Optional data to log
 */
function debug(message, data) {
  if (currentLogLevel >= LOG_LEVELS.DEBUG) {
    console.log(`[DEBUG] ${getTimestamp()} - ${message}`);
    if (data) {
      console.log(data);
    }
  }
}

/**
 * Set the current log level
 * @param {number} level - Log level from LOG_LEVELS
 */
function setLogLevel(level) {
  if (Object.values(LOG_LEVELS).includes(level)) {
    currentLogLevel = level;
    info(`Log level set to ${Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level)}`);
  } else {
    warn(`Invalid log level: ${level}`);
  }
}

module.exports = {
  LOG_LEVELS,
  error,
  warn,
  info,
  debug,
  setLogLevel
}; 