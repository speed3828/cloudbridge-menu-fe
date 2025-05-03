#!/usr/bin/env node
/**
 * Server launcher for cloudbridge-menu-fe
 * Enforces running on port 4200 and handles connection rejections
 */
const path = require('path');

try {
  // Run prestart integrity check
  require('./scripts/prestart');
  
  // Run the server with monitoring and auto-restart
  require('./scripts/run-server');
} catch (error) {
  console.error('Critical server error:');
  console.error(error);
  console.error('\nPlease report this error to the development team.');
  process.exit(1);
} 