@echo off
echo Starting Teller Development Servers...
echo.

REM Start backend server
echo [1/2] Starting backend logging server on port 3001...
start "Teller Backend" cmd /k "cd backend && npm start"

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend server
echo [2/2] Starting frontend dev server on port 5174...
start "Teller Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Teller Development Servers Started
echo ========================================
echo.
echo   Frontend: http://localhost:5174
echo   Backend:  http://localhost:3001
echo   Logs Dir: logs/
echo.
echo Press any key to close this window...
pause >nul
