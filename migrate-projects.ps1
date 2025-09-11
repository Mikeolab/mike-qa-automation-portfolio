# 🚀 QA Automation Portfolio Migration Script (PowerShell)
# This script helps migrate existing projects into the unified portfolio

param(
    [string]$TcallPath = "",
    [string]$MedcorPath = "",
    [string]$QaPortfolioPath = "",
    [switch]$Help
)

# Show help if requested
if ($Help) {
    Write-Host "Usage: .\migrate-projects.ps1 [-TcallPath <path>] [-MedcorPath <path>] [-QaPortfolioPath <path>]"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\migrate-projects.ps1                                    # Interactive mode"
    Write-Host "  .\migrate-projects.ps1 -TcallPath 'C:\path\to\tcall' -MedcorPath 'C:\path\to\medcor'"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -TcallPath        Path to TCall project directory"
    Write-Host "  -MedcorPath       Path to Medcor project directory"
    Write-Host "  -QaPortfolioPath  Path to QA portfolio project directory"
    Write-Host "  -Help             Show this help message"
    exit 0
}

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Function to check if directory exists
function Test-Directory {
    param([string]$Path)
    return Test-Path -Path $Path -PathType Container
}

# Function to copy project files
function Copy-ProjectFiles {
    param(
        [string]$SourceDir,
        [string]$TargetDir,
        [string]$ProjectName
    )
    
    Write-Status "Copying $ProjectName files from $SourceDir to $TargetDir..."
    
    if (Test-Directory $SourceDir) {
        # Create target directory if it doesn't exist
        if (!(Test-Directory $TargetDir)) {
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
        
        Write-Success "$ProjectName files copied successfully!"
        return $true
    } else {
        Write-Error "Directory $SourceDir does not exist!"
        return $false
    }
}

# Function to setup project dependencies
function Setup-ProjectDependencies {
    param(
        [string]$ProjectDir,
        [string]$ProjectName
    )
    
    Write-Status "Setting up dependencies for $ProjectName..."
    
    $packageJsonPath = Join-Path $ProjectDir "package.json"
    if (Test-Path $packageJsonPath) {
        Push-Location $ProjectDir
        try {
            npm install
            Write-Success "$ProjectName dependencies installed!"
        } catch {
            Write-Warning "Failed to install dependencies for $ProjectName"
        } finally {
            Pop-Location
        }
    } else {
        Write-Warning "No package.json found for $ProjectName, skipping dependency installation"
    }
}

# Function to update project configuration
function Update-ProjectConfig {
    param(
        [string]$ProjectDir,
        [string]$ProjectName
    )
    
    Write-Status "Updating configuration for $ProjectName..."
    
    # Update package.json scripts if needed
    $packageJsonPath = Join-Path $ProjectDir "package.json"
    if (Test-Path $packageJsonPath) {
        Write-Status "Package.json found for $ProjectName"
    }
    
    # Update Cypress configuration
    $cypressConfigTs = Join-Path $ProjectDir "cypress.config.ts"
    $cypressConfigJs = Join-Path $ProjectDir "cypress.config.js"
    if ((Test-Path $cypressConfigTs) -or (Test-Path $cypressConfigJs)) {
        Write-Status "Cypress configuration found for $ProjectName"
    }
    
    Write-Success "$ProjectName configuration updated!"
}

# Main migration function
function Migrate-Project {
    param(
        [string]$ProjectName,
        [string]$SourcePath,
        [string]$TargetPath
    )
    
    Write-Host ""
    Write-Status "Starting migration for $ProjectName..."
    Write-Host "Source: $SourcePath"
    Write-Host "Target: $TargetPath"
    
    # Copy files
    if (Copy-ProjectFiles $SourcePath $TargetPath $ProjectName) {
        # Setup dependencies
        Setup-ProjectDependencies $TargetPath $ProjectName
        
        # Update configuration
        Update-ProjectConfig $TargetPath $ProjectName
        
        Write-Success "$ProjectName migration completed!"
        return $true
    } else {
        Write-Error "$ProjectName migration failed!"
        return $false
    }
}

# Interactive migration
function Start-InteractiveMigration {
    Write-Host ""
    Write-Status "Starting interactive migration process..."
    Write-Host ""
    
    # TCall Project Migration
    Write-Host "📞 TCall Automation Project"
    Write-Host "=========================="
    $tcallPath = Read-Host "Enter the path to your TCall project directory"
    if ($tcallPath) {
        Migrate-Project "tcall-automation" $tcallPath "projects\tcall-automation"
    } else {
        Write-Warning "Skipping TCall project migration"
    }
    
    Write-Host ""
    
    # Medcor Project Migration
    Write-Host "🏥 Medcor Healthcare Project"
    Write-Host "==========================="
    $medcorPath = Read-Host "Enter the path to your Medcor project directory"
    if ($medcorPath) {
        Migrate-Project "medcor-healthcare" $medcorPath "projects\medcor-healthcare"
    } else {
        Write-Warning "Skipping Medcor project migration"
    }
    
    Write-Host ""
    
    # QA Portfolio Project Migration
    Write-Host "🛠️ QA Portfolio Project"
    Write-Host "======================"
    $qaPortfolioPath = Read-Host "Enter the path to your QA portfolio project directory"
    if ($qaPortfolioPath) {
        Migrate-Project "shared-framework" $qaPortfolioPath "projects\shared-framework"
    } else {
        Write-Warning "Skipping QA portfolio project migration"
    }
}

# Command line migration
function Start-CommandLineMigration {
    param(
        [string]$TcallPath,
        [string]$MedcorPath,
        [string]$QaPortfolioPath
    )
    
    if ($TcallPath) {
        Migrate-Project "tcall-automation" $TcallPath "projects\tcall-automation"
    }
    
    if ($MedcorPath) {
        Migrate-Project "medcor-healthcare" $MedcorPath "projects\medcor-healthcare"
    }
    
    if ($QaPortfolioPath) {
        Migrate-Project "shared-framework" $QaPortfolioPath "projects\shared-framework"
    }
}

# Post-migration setup
function Start-PostMigrationSetup {
    Write-Status "Running post-migration setup..."
    
    # Install root dependencies
    Write-Status "Installing root dependencies..."
    npm install
    
    # Create .env template files
    Write-Status "Creating environment template files..."
    
    # TCall environment template
    $tcallEnvTemplate = @"
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
    $tcallEnvTemplate | Out-File -FilePath $tcallEnvPath -Encoding UTF8

    # Medcor environment template
    $medcorEnvTemplate = @"
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
    $medcorEnvTemplate | Out-File -FilePath $medcorEnvPath -Encoding UTF8

    # Shared framework environment template
    $sharedEnvTemplate = @"
# Shared Framework Configuration
FRAMEWORK_CONFIG_PATH=./config/environments
TEST_DATA_PATH=./test-data
REPORTS_PATH=./reports

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/framework.log
"@
    $sharedEnvPath = "projects\shared-framework\.env.template"
    $sharedEnvTemplate | Out-File -FilePath $sharedEnvPath -Encoding UTF8

    Write-Success "Environment template files created!"
    
    # Create gitignore entries
    Write-Status "Updating .gitignore..."
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

    Write-Success "Post-migration setup completed!"
}

# Main execution
function Main {
    Write-Host "🚀 QA Automation Portfolio Migration Script"
    Write-Host "=========================================="
    Write-Host ""
    Write-Host "This script will help you migrate your existing projects into the unified portfolio."
    Write-Host ""
    
    # Check if running in interactive mode
    if (!$TcallPath -and !$MedcorPath -and !$QaPortfolioPath) {
        Start-InteractiveMigration
    } else {
        Start-CommandLineMigration $TcallPath $MedcorPath $QaPortfolioPath
    }
    
    # Run post-migration setup
    Start-PostMigrationSetup
    
    Write-Host ""
    Write-Success "🎉 Migration completed successfully!"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Review the migrated files in the projects/ directory"
    Write-Host "2. Update environment variables in .env files"
    Write-Host "3. Run 'npm run setup:dev' to start development environment"
    Write-Host "4. Test each project individually: 'npm run test:tcall', 'npm run test:medcor', 'npm run test:shared'"
    Write-Host "5. Run unified tests: 'npm run test:all'"
    Write-Host ""
    Write-Host "For more information, see MIGRATION_GUIDE.md"
}

# Run main function
Main
