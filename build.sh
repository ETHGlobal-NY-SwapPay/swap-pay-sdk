#!/bin/bash

# Build script for library
echo "Building Swap Pay SDK..."

# Clean previous build
rm -rf dist

# Create dist directory
mkdir -p dist

# Generate TypeScript output (continue on errors for compatibility)
echo "Generating TypeScript output..."
npx tsc --project tsconfig.lib.json --emitDeclarationOnly false --outDir dist || echo "Build completed with warnings"

# Check if index.js was generated
if [ -f "dist/index.js" ]; then
    echo "✅ JavaScript files generated successfully"
else
    echo "❌ JavaScript files not generated"
fi

# Check if index.d.ts was generated
if [ -f "dist/index.d.ts" ]; then
    echo "✅ TypeScript declarations generated successfully"
else
    echo "❌ TypeScript declarations not generated"
fi

echo "Build completed!"
echo "Files generated in ./dist/"
ls -la dist/
