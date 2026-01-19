#!/bin/bash

# Clean all build artifacts and dependencies
# Usage: ./clean.sh

echo "🧹 Cleaning project..."

# Find and remove all node_modules directories
# Note: tsbuildinfo files are stored in node_modules/.cache/ and will be cleaned automatically
echo "📦 Removing node_modules..."
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Find and remove all .turbo directories
echo "⚡ Removing .turbo..."
find . -name ".turbo" -type d -prune -exec rm -rf '{}' +

# Find and remove all build directories
echo "📁 Removing dist..."
find . -name "dist" -type d -prune -exec rm -rf '{}' +
echo "📁 Removing build..."
find . -name "build" -type d -prune -exec rm -rf '{}' +
echo "📁 Removing .next..."
find . -name ".next" -type d -prune -exec rm -rf '{}' +

echo "✅ Clean complete!"
echo ""
echo "Next steps:"
echo "  pnpm install"
echo "  pnpm build"
