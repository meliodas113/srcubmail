#!/bin/bash

# Srcubmail Chrome Extension Development Script
# This script starts the development mode with file watching

set -e  # Exit on any error

echo "🔧 Starting Srcubmail Development Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Initial build
echo "🔨 Performing initial build..."
npm run build

echo ""
echo "🚀 Development mode started!"
echo "📁 Watching for changes in src/ directory..."
echo "📋 TypeScript will automatically recompile on file changes"
echo "🔄 To reload the extension in Chrome:"
echo "   1. Go to chrome://extensions/"
echo "   2. Click the refresh icon on the Srcubmail extension"
echo ""
echo "⏹️  Press Ctrl+C to stop development mode"
echo ""

# Start development mode with file watching
npm run dev
