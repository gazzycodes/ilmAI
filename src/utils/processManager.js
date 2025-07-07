/**
 * Process Manager Utility
 * 
 * Helps manage processes and ports
 */

const { exec } = require('child_process');
const logger = require('./logger');

/**
 * Check if a port is in use
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if port is in use, false otherwise
 */
function isPortInUse(port) {
  return new Promise((resolve) => {
    const platform = process.platform;
    let command = '';
    
    if (platform === 'win32') {
      command = `netstat -ano | findstr :${port} | findstr LISTENING`;
    } else {
      command = `lsof -i:${port} -t`;
    }
    
    exec(command, (error, stdout) => {
      resolve(!!stdout.trim());
    });
  });
}

/**
 * Find a free port starting from the given port
 * @param {number} startPort - The port to start checking from
 * @param {number} [maxTries=10] - Maximum number of ports to check
 * @returns {Promise<number>} - A free port
 */
async function findFreePort(startPort, maxTries = 10) {
  // Ensure startPort is a number and within valid range
  startPort = parseInt(startPort, 10);
  
  if (isNaN(startPort) || startPort < 1 || startPort > 65535) {
    logger.warn(`Invalid start port: ${startPort}, defaulting to 3000`);
    startPort = 3000;
  }
  
  let port = startPort;
  let tries = 0;
  
  while (tries < maxTries) {
    logger.debug(`Checking if port ${port} is free...`);
    const inUse = await isPortInUse(port);
    
    if (!inUse) {
      logger.debug(`Found free port: ${port}`);
      return port;
    }
    
    logger.debug(`Port ${port} is in use`);
    // Increment by 1 instead of concatenating
    port = port + 1;
    tries++;
    
    // Ensure port is in valid range
    if (port > 65535) {
      logger.warn('Port exceeded maximum value, resetting to 3000');
      port = 3000;
    }
  }
  
  logger.warn(`Could not find a free port after ${maxTries} tries, using default port 3000`);
  return 3000;
}

/**
 * Kill processes using a specific port
 * @param {number} port - The port to free
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const platform = process.platform;
    let command = '';
    
    if (platform === 'win32') {
      // Windows: Find PID and kill
      exec(`netstat -ano | findstr :${port} | findstr LISTENING`, (error, stdout) => {
        if (error || !stdout.trim()) {
          logger.debug(`No process found on port ${port}`);
          resolve(false);
          return;
        }
        
        try {
          // Extract PID from the last column
          const pid = stdout.trim().split(/\s+/).pop();
          logger.debug(`Found process ${pid} on port ${port}, attempting to kill`);
          
          exec(`taskkill /F /PID ${pid}`, (killError) => {
            if (killError) {
              logger.warn(`Failed to kill process ${pid} on port ${port}`);
              resolve(false);
            } else {
              logger.info(`Successfully killed process ${pid} on port ${port}`);
              resolve(true);
            }
          });
        } catch (e) {
          logger.error(`Error parsing process info: ${e.message}`);
          resolve(false);
        }
      });
    } else {
      // Unix-like: Find PID and kill
      exec(`lsof -i:${port} -t`, (error, stdout) => {
        if (error || !stdout.trim()) {
          logger.debug(`No process found on port ${port}`);
          resolve(false);
          return;
        }
        
        const pid = stdout.trim();
        logger.debug(`Found process ${pid} on port ${port}, attempting to kill`);
        
        exec(`kill -9 ${pid}`, (killError) => {
          if (killError) {
            logger.warn(`Failed to kill process on port ${port}`);
            resolve(false);
          } else {
            logger.info(`Successfully killed process on port ${port}`);
            resolve(true);
          }
        });
      });
    }
  });
}

module.exports = {
  isPortInUse,
  findFreePort,
  killProcessOnPort
}; 