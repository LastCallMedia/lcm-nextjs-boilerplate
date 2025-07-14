#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Force IPv4 for Docker/act environments
process.env.HOST = '0.0.0.0';
process.env.HOSTNAME = '0.0.0.0';

const serverPath = path.join(process.cwd(), '.next/standalone/server.js');

// Check if the standalone server file exists
if (!fs.existsSync(serverPath)) {
  console.error('Standalone server file not found at:', serverPath);
  console.error('Make sure to run "next build" first to generate the standalone output.');
  process.exit(1);
}

console.log('Starting standalone Next.js server...');
// Import and start the Next.js standalone server
require(serverPath);
