const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const MAX_RESTART_ATTEMPTS = 5;
const RESTART_DELAY_MS = 3000;

let currentAttempt = 0;
let serverProcess = null;

// Check and store Git commit hash for integrity checks
function checkGitIntegrity() {
  try {
    const currentCommitHash = execSync('git rev-parse HEAD').toString().trim();
    const hashFilePath = path.join(__dirname, '..', '.cursor', 'last-hash');
    
    // Create .cursor directory if it doesn't exist
    const cursorDir = path.join(__dirname, '..', '.cursor');
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir, { recursive: true });
    }
    
    fs.writeFileSync(hashFilePath, currentCommitHash);
    console.log(`Saved current commit hash: ${currentCommitHash}`);
  } catch (error) {
    console.error('Error recording git hash:', error.message);
  }
}

// Function to start the server
function startServer() {
  // First clear the port
  try {
    require('./check-port');
  } catch (error) {
    console.error('Error running port check script:', error);
  }
  
  console.log(`Attempt ${currentAttempt + 1}/${MAX_RESTART_ATTEMPTS}: Starting server on port ${PORT}...`);
  
  // Log timestamp for server start
  const startTime = new Date().toISOString();
  console.log(`Server start time: ${startTime}`);
  
  // Start the Next.js dev server with fixed port
  serverProcess = spawn('npm', ['run', 'dev', '--', '--port', PORT], {
    stdio: 'inherit',
    shell: true
  });
  
  // Handle server process events
  serverProcess.on('error', (error) => {
    console.error(`Server process error: ${error.message}`);
    handleServerFailure(error.message);
  });
  
  serverProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Server process exited with code ${code}`);
      handleServerFailure(`Exit code: ${code}`);
    } else {
      console.log('Server process closed normally');
    }
  });
  
  // Keep track of current attempt
  currentAttempt++;
}

// Handle server failure with potential restart
function handleServerFailure(errorMessage) {
  if (currentAttempt < MAX_RESTART_ATTEMPTS) {
    console.log(`Server failed. Waiting ${RESTART_DELAY_MS/1000} seconds before restart...`);
    console.log(`Error details: ${errorMessage}`);
    
    // Wait before restarting
    setTimeout(() => {
      startServer();
    }, RESTART_DELAY_MS);
  } else {
    console.error('Maximum restart attempts reached. Server could not be started.');
    console.error('Please check the following:');
    console.error('1. Are there any other processes using port 4000?');
    console.error('2. Is there a network configuration issue?');
    console.error('3. Check for Next.js compatibility issues with your code');
    console.error('\nPlease fix the issues and try again.');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:');
  console.error(reason);
});

// Start the process
checkGitIntegrity();
startServer(); 