const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to check Git integrity
function checkGitIntegrity() {
  try {
    const currentCommitHash = execSync('git rev-parse HEAD').toString().trim();
    const hashFilePath = path.join(__dirname, '..', '.cursor', 'last-hash');
    
    // If the hash file exists, compare it with the current commit hash
    if (fs.existsSync(hashFilePath)) {
      const savedHash = fs.readFileSync(hashFilePath, 'utf8').trim();
      
      if (currentCommitHash !== savedHash) {
        console.error('ERROR: Git commit hash mismatch!');
        console.error(`Current hash: ${currentCommitHash}`);
        console.error(`Saved hash:   ${savedHash}`);
        console.error('\nThis indicates the codebase has changed since the last verification.');
        console.error('To resolve this issue:');
        console.error('1. Check if you have uncommitted changes: git status');
        console.error('2. If needed, restore to the last savepoint: git checkout savepoint-<tag>');
        console.error('3. Or update the hash file if changes are intentional');
        process.exit(1);
      }
      
      console.log('Git integrity check passed');
    } else {
      console.log('No previous hash file found. Creating it with current commit hash.');
      
      // Create .cursor directory if it doesn't exist
      const cursorDir = path.join(__dirname, '..', '.cursor');
      if (!fs.existsSync(cursorDir)) {
        fs.mkdirSync(cursorDir, { recursive: true });
      }
      
      fs.writeFileSync(hashFilePath, currentCommitHash);
      console.log(`Saved current commit hash: ${currentCommitHash}`);
    }
  } catch (error) {
    console.error('Error during Git integrity check:', error.message);
    process.exit(1);
  }
}

// Call the function
checkGitIntegrity(); 