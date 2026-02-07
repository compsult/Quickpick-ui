#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing process on port 3005
lsof -ti:3005 2>/dev/null | xargs -r kill -9 2>/dev/null

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Time Select Widget on http://localhost:3005"
npm run dev
