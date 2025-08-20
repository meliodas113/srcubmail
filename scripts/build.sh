#!/bin/bash

# Srcubmail Chrome Extension Build Script
# This script builds the TypeScript extension and copies all necessary assets

set -e  # Exit on any error

echo "🚀 Building Srcubmail Chrome Extension..."

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

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build TypeScript
echo "🔨 Compiling TypeScript..."
npm run build

# Verify build output
if [ -d "dist" ] && [ -f "dist/popup.js" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: dist/"
    echo "📋 Files generated:"
    ls -la dist/
    
    echo ""
    echo "🎉 Extension is ready to load in Chrome!"
    echo "📖 Instructions:"
    echo "   1. Open Chrome and go to chrome://extensions/"
    echo "   2. Enable 'Developer mode'"
    echo "   3. Click 'Load unpacked' and select the 'dist' folder"
    echo "   4. Pin the extension to your toolbar"
    
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi
