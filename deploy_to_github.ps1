# PowerShell script to deploy to GitHub
# Run this script after creating a new repository on GitHub

# Set repository name (change this to your desired repository name)
$REPO_NAME = "civic-anomaly-detector"

# Check if GitHub CLI is available
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "GitHub CLI found. Creating repository..."
    
    # Create repository on GitHub
    gh repo create $REPO_NAME --public --description "A machine learning system for detecting anomalies in civic infrastructure images"
    
    # Add remote origin
    git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"
    
    # Push to GitHub
    git branch -M main
    git push -u origin main
    
    Write-Host "Repository created and pushed to GitHub successfully!"
    Write-Host "Repository URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
} else {
    Write-Host "GitHub CLI not found. Please follow these manual steps:"
    Write-Host ""
    Write-Host "1. Go to https://github.com/new"
    Write-Host "2. Create a new repository named '$REPO_NAME'"
    Write-Host "3. Make it public"
    Write-Host "4. Do NOT initialize with README, .gitignore, or license (we already have these)"
    Write-Host "5. After creating the repository, run these commands:"
    Write-Host ""
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    Write-Host "git branch -M main"
    Write-Host "git push -u origin main"
    Write-Host ""
    Write-Host "Replace YOUR_USERNAME with your actual GitHub username."
}
