#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

if [ "$NODE_ENV" = "development" ]; then
  echo "DEV: Resetting database and seeding..."  
  npx prisma migrate reset --force
else
  echo "PROD: Running migrations..."
  npx prisma migrate deploy
fi

# Execute the main application, passing along any arguments
echo "Starting application..."
exec "$@"