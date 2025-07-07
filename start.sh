#!/bin/bash

echo "Starting LLMAI - Islamic Knowledge Assistant..."
echo ""
echo "Please make sure you have Node.js installed."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed or not in your PATH."
  echo "Please install Node.js from https://nodejs.org/"
  echo ""
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed or not in your PATH."
  echo "Please install Node.js from https://nodejs.org/"
  echo ""
  exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo "Error installing dependencies."
    exit 1
  fi
fi

# Start the application
echo "Starting the application..."
echo ""
echo "Once the server is running, open your browser and go to the URL shown in the console."
echo ""
echo "Press Ctrl+C to stop the server."
echo ""
npm run dev 