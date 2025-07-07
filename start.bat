@echo off
echo Starting LLMAI - Islamic Knowledge Assistant...
echo.
echo Please make sure you have Node.js installed.
echo.

rem Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

rem Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: npm is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

rem Check if dependencies are installed
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %ERRORLEVEL% neq 0 (
    echo Error installing dependencies.
    pause
    exit /b 1
  )
)

rem Start the application
echo Starting the application...
echo.
echo Once the server is running, open your browser and go to the URL shown in the console.
echo.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev

pause 