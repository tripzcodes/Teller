# Setup Guide

## Current Status

✅ **Node.js** required for both frontend and backend
✅ **WASM modules** are pre-compiled and ready in `frontend/public/wasm/`
✅ **Emscripten SDK** only needed if you modify C++ code

**You're all set!** Just install Node dependencies and run the app.

## Quick Setup (For New Developers)

If you're setting this up on a new machine:

### 1. Install Node.js

Download and install Node.js v18+ from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (optional, for development logging)
cd ../backend
npm install
```

### 3. Run the App

```bash
# Option 1: Development mode with logging (Windows)
start-dev.bat

# Option 2: Frontend only
cd frontend
npm run dev
```

Visit http://localhost:5173

## Installing Emscripten (Only if you need to modify C++ code)

### Windows

1. **Download Emscripten SDK**
   ```bash
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ```

2. **Install and Activate Specific Version**
   ```bash
   emsdk install 4.0.19
   emsdk activate 4.0.19
   ```

3. **Set up Environment Variables**
   ```bash
   emsdk_env.bat
   ```

   You'll need to run `emsdk_env.bat` each time you open a new terminal, or add Emscripten to your PATH permanently (see `ADD_TO_PATH.md`).

### Linux/Mac

1. **Download Emscripten SDK**
   ```bash
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ```

2. **Install and Activate Specific Version**
   ```bash
   ./emsdk install 4.0.19
   ./emsdk activate 4.0.19
   ```

3. **Set up Environment Variables**
   ```bash
   source ./emsdk_env.sh
   ```

   Add this to your `~/.bashrc` or `~/.zshrc` for permanent setup:
   ```bash
   source /path/to/emsdk/emsdk_env.sh
   ```

## Verifying Installation

After installing, verify Emscripten is available:

```bash
emcc --version
```

You should see output like:
```
emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) X.X.X
```

## Building the Project

Once Emscripten is installed:

```bash
cd scripts
./build_wasm.sh
```

Or on Windows:
```bash
cd scripts
bash build_wasm.sh
```

## Next Steps

After Emscripten is set up:
1. Build the WASM module with the script above
2. Start the frontend dev server: `cd frontend && npm run dev`
3. Visit `http://localhost:5173`

## Troubleshooting

**Issue**: `emcc: command not found`
- **Solution**: Make sure you've run `emsdk_env.bat` (Windows) or `source ./emsdk_env.sh` (Linux/Mac)

**Issue**: CMake errors
- **Solution**: Ensure CMake 3.20+ is installed: `cmake --version`

**Issue**: Build fails with "Python not found"
- **Solution**: Emscripten requires Python. Install Python 3.6+ and ensure it's in PATH
