@echo off
echo 🚀 Setting up GitHub synchronization for ilmAI...
echo.

cd /d "d:\Codes\LLMAI"

echo 📁 Current directory: %CD%
echo.

echo 🔧 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)
echo ✅ Git repository initialized

echo.
echo 📝 Adding all files to Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)
echo ✅ Files added to Git

echo.
echo 💾 Creating initial commit...
git commit -m "Initial commit: Complete ilmAI application with SSL deployment"
if %errorlevel% neq 0 (
    echo ❌ Failed to create commit
    pause
    exit /b 1
)
echo ✅ Initial commit created

echo.
echo 🔗 Adding GitHub remote...
git remote add origin https://github.com/gazzycodes/ilmAI.git
if %errorlevel% neq 0 (
    echo ❌ Failed to add remote
    pause
    exit /b 1
)
echo ✅ GitHub remote added

echo.
echo 📤 Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    echo 💡 You may need to authenticate with GitHub
    echo 💡 Make sure you have Git configured with your credentials
    pause
    exit /b 1
)
echo ✅ Code pushed to GitHub successfully!

echo.
echo 🎉 GitHub synchronization setup complete!
echo.
echo 📋 Next steps:
echo 1. Go to https://github.com/gazzycodes/ilmAI/settings/secrets/actions
echo 2. Add the following secrets:
echo    - VPS_HOST: 45.58.127.18
echo    - VPS_USERNAME: root
echo    - SSH_PRIVATE_KEY: (content of ilmai_deploy file)
echo    - GEMINI_API_KEY: (your Gemini API key)
echo.
echo 🔄 After adding secrets, any push to main branch will auto-deploy to VPS
echo.
pause
