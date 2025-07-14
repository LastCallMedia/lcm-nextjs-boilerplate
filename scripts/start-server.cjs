#!/usr/bin/env node

// Force IPv4 for Docker/act environments
process.env.HOST = '0.0.0.0';
process.env.HOSTNAME = '0.0.0.0';

// Import and start the Next.js standalone server
require('.next/standalone/server.js');
