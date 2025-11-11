#!/bin/bash

# Build script for compiling C++ to WebAssembly using Emscripten

set -e  # Exit on error

echo "Building Bank Statement Analyzer WASM module..."

# Emscripten SDK path (adjust if you moved emsdk)
EMSDK_PATH="../../emsdk"

# Check if emsdk exists
if [ ! -d "$EMSDK_PATH" ]; then
    echo "Error: Emscripten SDK not found at $EMSDK_PATH"
    echo "Please install Emscripten SDK or update EMSDK_PATH in this script."
    exit 1
fi

# Source Emscripten environment
echo "Setting up Emscripten environment..."
source "$EMSDK_PATH/emsdk_env.sh"

# Create build directory
BUILD_DIR="../cpp/build"
mkdir -p "$BUILD_DIR"

# Navigate to build directory
cd "$BUILD_DIR"

# Clean previous build
echo "Cleaning previous build..."
rm -rf *

# Run CMake with Emscripten toolchain
echo "Running CMake..."
python "$EMSDK_PATH/upstream/emscripten/emcmake.py" cmake ..

# Build the project
echo "Compiling to WASM..."
python "$EMSDK_PATH/upstream/emscripten/emmake.py" ninja

echo ""
echo "✅ Build complete!"
echo "📦 WASM files created at: frontend/public/wasm/"
echo "   - bank_analyzer.js ($(du -h ../../frontend/public/wasm/bank_analyzer.js 2>/dev/null | cut -f1))"
echo "   - bank_analyzer.wasm ($(du -h ../../frontend/public/wasm/bank_analyzer.wasm 2>/dev/null | cut -f1))"
echo ""
echo "Next step: cd frontend && npm run dev"
