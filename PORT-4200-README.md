# Cloudbridge Menu Frontend Server

## Port 4200 Server Configuration

This project is configured to always run on port 4200. The following instructions explain how to start the server and handle any port conflict issues.

### Starting the Server

Use one of these commands to start the development server:

```bash
# Standard start (port 4200)
npm run dev

# Enhanced start with port conflict resolution and auto-restart
npm run dev:stable

# Check if port 4200 is in use and clear it before starting
npm run dev:check-port
```

### Handling Port Conflicts

If you encounter a "port already in use" or "connection refused" error:

1. Check what process is using port 4200:
   - Windows: `netstat -ano | findstr :4200`
   - macOS/Linux: `lsof -i :4200`

2. Kill the process:
   - Windows: `taskkill /PID <PID> /F`
   - macOS/Linux: `kill -9 <PID>`

3. Restart the server with: `npm run dev:stable`

### Important Notes

- **DO NOT** change the port number from 4200
- If server errors persist, check the console logs and report the issue

### Server Scripts

The following scripts have been implemented to ensure stability:

- `scripts/check-port.js` - Checks if port 4200 is in use and clears it
- `scripts/run-server.js` - Runs the server with monitoring and auto-restart
- `scripts/prestart.js` - Verifies Git integrity before starting
- `server.js` - Main launcher script that coordinates the above

### Git Workflow

When working on this project:

1. When starting work: `git checkout savepoint-<LATEST_TAG>`
2. After making changes: 
   ```
   git add -A
   git commit -m "feat: <description> - <YYYY-MM-DD_HH:mm>"
   git tag -a savepoint-<YYYYMMDD-HHmm> -m "Savepoint"
   ```

### Recovering from Errors

If errors occur, restore to the last savepoint:
```
git reset --hard savepoint-<LATEST_TAG>
git clean -fd
``` 