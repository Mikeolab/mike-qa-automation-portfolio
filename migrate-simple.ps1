# 🚀 QA Automation Portfolio Migration Script (PowerShell)
# Simple version for migrating existing projects

Write-Host "🚀 QA Automation Portfolio Migration Script" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue
Write-Host ""
Write-Host "This script will help you migrate your existing projects into the unified portfolio." -ForegroundColor Yellow
Write-Host ""

# Function to copy project files
function Copy-ProjectFiles {
    param(
        [string]$SourceDir,
        [string]$TargetDir,
        [string]$ProjectName
    )
    
    Write-Host "[INFO] Copying $ProjectName files from $SourceDir to $TargetDir..." -ForegroundColor Blue
    
    if (Test-Path -Path $SourceDir -PathType Container) {
        # Create target directory if it doesn't exist
        if (!(Test-Path -Path $TargetDir -PathType Container)) {
            New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
        }
        
        # Copy files, excluding common directories we don't want
        $ExcludeDirs = @('node_modules', '.git', 'cypress\videos', 'cypress\screenshots', 'cypress\results', 'coverage', 'dist', '.env')
        
        Get-ChildItem -Path $SourceDir -Recurse | Where-Object {
            $item = $_
            $shouldExclude = $false
            foreach ($excludeDir in $ExcludeDirs) {
                if ($item.FullName -like "*\$excludeDir\*" -or $item.Name -eq $excludeDir) {
                    $shouldExclude = $true
                    break
                }
            }
            return !$shouldExclude
        } | ForEach-Object {
            $relativePath = $_.FullName.Substring($SourceDir.Length + 1)
            $targetPath = Join-Path $TargetDir $relativePath
            
            if ($_.PSIsContainer) {
                if (!(Test-Path $targetPath)) {
                    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
                }
            } else {
                $targetDir = Split-Path $targetPath -Parent
                if (!(Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                Copy-Item $_.FullName $targetPath -Force
            }
        }
        
        Write-Host "[SUCCESS] $ProjectName files copied successfully!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] Directory $SourceDir does not exist!" -ForegroundColor Red
        return $false
    }
}

# Function to setup project dependencies
function Setup-ProjectDependencies {
    param(
        [string]$ProjectDir,
        [string]$ProjectName
    )
    
    Write-Host "[INFO] Setting up dependencies for $ProjectName..." -ForegroundColor Blue
    
    $packageJsonPath = Join-Path $ProjectDir "package.json"
    if (Test-Path $packageJsonPath) {
        Push-Location $ProjectDir
        try {
            npm install
            Write-Host "[SUCCESS] $ProjectName dependencies installed!" -ForegroundColor Green
        } catch {
            Write-Host "[WARNING] Failed to install dependencies for $ProjectName" -ForegroundColor Yellow
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "[WARNING] No package.json found for $ProjectName, skipping dependency installation" -ForegroundColor Yellow
    }
}

# Main migration function
function Migrate-Project {
    param(
        [string]$ProjectName,
        [string]$SourcePath,
        [string]$TargetPath
    )
    
    Write-Host ""
    Write-Host "[INFO] Starting migration for $ProjectName..." -ForegroundColor Blue
    Write-Host "Source: $SourcePath"
    Write-Host "Target: $TargetPath"
    
    # Copy files
    if (Copy-ProjectFiles $SourcePath $TargetPath $ProjectName) {
        # Setup dependencies
        Setup-ProjectDependencies $TargetPath $ProjectName
        
        Write-Host "[SUCCESS] $ProjectName migration completed!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] $ProjectName migration failed!" -ForegroundColor Red
        return $false
    }
}

# Interactive migration
Write-Host "📞 TCall Automation Project" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
$tcallPath = Read-Host "Enter the path to your TCall project directory (or press Enter to skip)"
if ($tcallPath) {
    Migrate-Project "tcall-automation" $tcallPath "projects\tcall-automation"
} else {
    Write-Host "[WARNING] Skipping TCall project migration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏥 Medcor Healthcare Project" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
$medcorPath = Read-Host "Enter the path to your Medcor project directory (or press Enter to skip)"
if ($medcorPath) {
    Migrate-Project "medcor-healthcare" $medcorPath "projects\medcor-healthcare"
} else {
    Write-Host "[WARNING] Skipping Medcor project migration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🛠️ QA Portfolio Project" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
$qaPortfolioPath = Read-Host "Enter the path to your QA portfolio project directory (or press Enter to skip)"
if ($qaPortfolioPath) {
    Migrate-Project "shared-framework" $qaPortfolioPath "projects\shared-framework"
} else {
    Write-Host "[WARNING] Skipping QA portfolio project migration" -ForegroundColor Yellow
}

# Post-migration setup
Write-Host ""
Write-Host "[INFO] Running post-migration setup..." -ForegroundColor Blue

# Install root dependencies
Write-Host "[INFO] Installing root dependencies..." -ForegroundColor Blue
npm install

# Create environment template files
Write-Host "[INFO] Creating environment template files..." -ForegroundColor Blue

# TCall environment template
$tcallEnvContent = @"
# TCall Configuration
TCALL_API_URL=https://api.tcall.com
TCALL_WEBHOOK_URL=https://your-webhook-proxy.com/webhook
TCALL_API_KEY=your_api_key_here

# Webhook Proxy Configuration
PROXY_PORT=3001
PROXY_HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tcall_test
DB_USER=test_user
DB_PASSWORD=test_password
"@

$tcallEnvPath = "projects\tcall-automation\.env.template"
$tcallEnvContent | Out-File -FilePath $tcallEnvPath -Encoding UTF8

# Medcor environment template
$medcorEnvContent = @"
# Medcor Configuration
MEDCOR_API_URL=https://api.medcor.com
MEDCOR_WEBHOOK_URL=https://your-webhook-proxy.com/webhook
MEDCOR_API_KEY=your_api_key_here

# Database Configuration (Encrypted)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medcor_test
DB_USER=test_user
DB_PASSWORD=test_password
DB_ENCRYPTION_KEY=your_encryption_key_here

# HIPAA Compliance
AUDIT_LOG_ENABLED=true
DATA_RETENTION_DAYS=2555
"@

$medcorEnvPath = "projects\medcor-healthcare\.env.template"
$medcorEnvContent | Out-File -FilePath $medcorEnvPath -Encoding UTF8

# Shared framework environment template
$sharedEnvContent = @"
# Shared Framework Configuration
FRAMEWORK_CONFIG_PATH=./config/environments
TEST_DATA_PATH=./test-data
REPORTS_PATH=./reports

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/framework.log
"@

$sharedEnvPath = "projects\shared-framework\.env.template"
$sharedEnvContent | Out-File -FilePath $sharedEnvPath -Encoding UTF8

Write-Host "[SUCCESS] Environment template files created!" -ForegroundColor Green

# Update gitignore
Write-Host "[INFO] Updating .gitignore..." -ForegroundColor Blue
$gitignoreContent = @"

# Project-specific ignores
projects/*/node_modules/
projects/*/cypress/videos/
projects/*/cypress/screenshots/
projects/*/cypress/results/
projects/*/coverage/
projects/*/dist/
projects/*/.env
projects/*/logs/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
"@

Add-Content -Path ".gitignore" -Value $gitignoreContent

Write-Host ""
Write-Host "[SUCCESS] 🎉 Migration completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the migrated files in the projects/ directory"
Write-Host "2. Update environment variables in .env files"
Write-Host "3. Run 'npm run setup:dev' to start development environment"
Write-Host "4. Test each project individually: 'npm run test:tcall', 'npm run test:medcor', 'npm run test:shared'"
Write-Host "5. Run unified tests: 'npm run test:all'"
Write-Host ""
Write-Host "For more information, see MIGRATION_GUIDE.md" -ForegroundColor Cyan
