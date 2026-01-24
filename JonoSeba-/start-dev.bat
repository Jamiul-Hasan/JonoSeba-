@echo off
REM JonoSeba - Windows Development Mode Startup Script

echo Starting JonoSeba in Development Mode...
echo ==========================================

REM Check Java
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check Maven
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed. Please install Maven.
    pause
    exit /b 1
)

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Create frontend .env if not exists
if not exist "frontend\.env.development" (
    echo Creating frontend .env.development file...
    (
        echo VITE_API_URL=http://localhost:8080/api
        echo VITE_WS_URL=http://localhost:8080/ws
    ) > frontend\.env.development
)

REM Start Backend
echo.
echo Starting Backend (Spring Boot)...
start "JonoSeba Backend" cmd /k "cd backend && mvn spring-boot:run"

REM Wait a bit for backend to start
timeout /t 15 /nobreak

REM Start Frontend
echo.
echo Starting Frontend (React + Vite)...
start "JonoSeba Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Development servers are starting...
echo ========================================
echo.
echo Frontend:     http://localhost:5173
echo Backend API:  http://localhost:8080/api
echo Swagger UI:   http://localhost:8080/swagger-ui.html
echo.
echo Close the command windows to stop the servers.
echo.
pause
