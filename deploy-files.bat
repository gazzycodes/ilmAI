@echo off
echo 🚀 Deploying ilmAI application files to VPS server...
echo.

REM Set variables
set SERVER_IP=45.58.127.18
set SERVER_USER=root
set SERVER_PATH=/opt/ilmai
set SSH_KEY=ilmai_deploy

echo 📁 Creating temporary deployment directory...
if exist temp-deploy rmdir /s /q temp-deploy
mkdir temp-deploy

echo 📋 Copying application files to temp directory...
REM Copy main application files
copy package.json temp-deploy\
copy package-lock.json temp-deploy\
copy Dockerfile temp-deploy\
copy docker-compose.yml temp-deploy\
copy nginx.conf temp-deploy\
copy README.md temp-deploy\
copy DOCUMENTATION.md temp-deploy\

REM Copy source code
xcopy /E /I src temp-deploy\src
xcopy /E /I public temp-deploy\public
xcopy /E /I data temp-deploy\data
xcopy /E /I scripts temp-deploy\scripts

REM Create .env.production template
echo NODE_ENV=production > temp-deploy\.env.production
echo PORT=3000 >> temp-deploy\.env.production
echo MONGODB_URI=mongodb://localhost:27017/ilmai >> temp-deploy\.env.production
echo GEMINI_API_KEY=your_gemini_api_key_here >> temp-deploy\.env.production
echo CORS_ORIGIN=https://ilmai.live >> temp-deploy\.env.production

echo 📤 Uploading files to server...
scp -i %SSH_KEY% -r temp-deploy\* %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/

echo 🧹 Cleaning up temporary files...
rmdir /s /q temp-deploy

echo ✅ Application files deployed successfully!
echo.
echo 📋 Next steps:
echo 1. SSH into the server: ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP%
echo 2. Navigate to: cd %SERVER_PATH%
echo 3. Configure environment variables in .env.production
echo 4. Build and start the application: docker compose up -d --build
echo.
pause
