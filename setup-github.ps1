Write-Host "Setting up GitHub synchronization for ilmAI..." -ForegroundColor Green
Write-Host ""

Set-Location "d:\Codes\LLMAI"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Initializing Git repository..." -ForegroundColor Cyan
git init
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to initialize Git repository" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Git repository initialized" -ForegroundColor Green

Write-Host ""
Write-Host "Adding all files to Git..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add files to Git" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Files added to Git" -ForegroundColor Green

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Complete ilmAI application with SSL deployment"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Initial commit created" -ForegroundColor Green

Write-Host ""
Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
git remote add origin https://github.com/gazzycodes/ilmAI.git
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add remote (may already exist)" -ForegroundColor Yellow
}
Write-Host "GitHub remote configured" -ForegroundColor Green

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to GitHub" -ForegroundColor Red
    Write-Host "You may need to authenticate with GitHub" -ForegroundColor Yellow
    Write-Host "Make sure you have Git configured with your credentials" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
} else {
    Write-Host "Code pushed to GitHub successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "GitHub synchronization setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/gazzycodes/ilmAI/settings/secrets/actions"
Write-Host "2. Add the following secrets:"
Write-Host "   - VPS_HOST: 45.58.127.18"
Write-Host "   - VPS_USERNAME: root"
Write-Host "   - SSH_PRIVATE_KEY: (content of ilmai_deploy file)"
Write-Host "   - GEMINI_API_KEY: (your Gemini API key)"
Write-Host ""
Write-Host "After adding secrets, any push to main branch will auto-deploy to VPS" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
