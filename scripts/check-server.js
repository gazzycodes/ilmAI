/**
 * Server Status Check Script
 * 
 * This script checks if the LLMAI server is running and which port it's using.
 */

const http = require('http');
const { exec } = require('child_process');

// List of ports to check
const portsToCheck = [3000, 3001, 3002, 3003, 3004, 3005];

/**
 * Check if a server is running on a specific port
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if server is running, false otherwise
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: 'localhost',
      port: port,
      path: '/api/health',
      timeout: 1000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response && response.status === 'ok') {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Check which processes are using specific ports
 */
function checkProcesses() {
  const platform = process.platform;
  let command = '';
  
  if (platform === 'win32') {
    command = 'netstat -ano | findstr :3000 | findstr LISTENING';
  } else {
    command = 'lsof -i:3000 -t';
  }
  
  exec(command, (error, stdout) => {
    if (error || !stdout.trim()) {
      console.log('No process found using port 3000');
    } else {
      console.log('Process found using port 3000:');
      console.log(stdout.trim());
    }
  });
}

/**
 * Main function to check server status
 */
async function checkServerStatus() {
  console.log('Checking LLMAI server status...');
  
  let serverRunning = false;
  let runningPort = null;
  
  for (const port of portsToCheck) {
    console.log(`Checking port ${port}...`);
    const isRunning = await checkPort(port);
    
    if (isRunning) {
      serverRunning = true;
      runningPort = port;
      break;
    }
  }
  
  if (serverRunning) {
    console.log(`\n✅ LLMAI server is running on port ${runningPort}`);
    console.log(`You can access it at: http://localhost:${runningPort}`);
  } else {
    console.log('\n❌ LLMAI server is not running');
    console.log('You can start it by running: npm run dev');
    
    // Check for processes that might be using the ports
    checkProcesses();
  }
}

// Run the check
checkServerStatus(); 