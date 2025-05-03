const { exec } = require('child_process');
const os = require('os');

const PORT = 4200;
const isWindows = os.platform() === 'win32';

console.log(`Checking if port ${PORT} is in use...`);

// Commands based on OS
const checkPortCmd = isWindows 
  ? `netstat -ano | findstr :${PORT}` 
  : `lsof -i :${PORT}`;

exec(checkPortCmd, (error, stdout, stderr) => {
  if (error && error.code !== 1) {
    // An error occurred, but not due to "no results found"
    console.error(`Error checking port: ${error.message}`);
    process.exit(1);
  }

  if (stderr) {
    console.error(`Error: ${stderr}`);
    process.exit(1);
  }

  if (stdout && stdout.trim()) {
    console.log(`Port ${PORT} is in use. Attempting to free it...`);
    
    // Parse PID from stdout
    let pid;
    if (isWindows) {
      // For Windows netstat output
      const lines = stdout.trim().split('\n');
      if (lines.length > 0) {
        const lastLine = lines[0];
        const pidMatch = lastLine.match(/\s+(\d+)$/);
        if (pidMatch && pidMatch[1]) {
          pid = pidMatch[1];
        }
      }
    } else {
      // For macOS/Linux lsof output
      const lines = stdout.trim().split('\n');
      if (lines.length > 1) {
        const secondLine = lines[1]; // Skip header line
        const parts = secondLine.trim().split(/\s+/);
        if (parts.length > 1) {
          pid = parts[1];
        }
      }
    }

    if (pid) {
      const killCmd = isWindows 
        ? `taskkill /PID ${pid} /F` 
        : `kill -9 ${pid}`;
      
      console.log(`Killing process with PID: ${pid}`);
      
      exec(killCmd, (killError, killStdout, killStderr) => {
        if (killError) {
          console.error(`Error killing process: ${killError.message}`);
          process.exit(1);
        }
        
        if (killStderr) {
          console.error(`Error: ${killStderr}`);
          process.exit(1);
        }
        
        console.log(`Successfully killed process on port ${PORT}`);
      });
    } else {
      console.error('Could not determine PID from port check output');
      console.log('Port check output:', stdout);
      process.exit(1);
    }
  } else {
    console.log(`Port ${PORT} is free and ready to use`);
  }
}); 