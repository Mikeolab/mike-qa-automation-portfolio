# 🚀 Manual Migration Guide

Since the PowerShell script has encoding issues, let's do the migration manually. Here's a step-by-step guide:

## Step 1: Prepare Your Project Paths

First, let's find where your existing projects are located. Can you tell me:

1. **TCall Project Path**: Where is your TCall automation project located?
2. **Medcor Project Path**: Where is your Medcor healthcare project located?  
3. **QA Portfolio Path**: Where is your QA portfolio project located?

## Step 2: Manual Copy Commands

Once you provide the paths, I'll give you the exact commands to run. For now, here's the general approach:

### For TCall Project:
```powershell
# Replace SOURCE_PATH with your actual TCall project path
$sourcePath = "C:\path\to\your\tcall\project"
$targetPath = "projects\tcall-automation"

# Copy all files except node_modules, .git, etc.
robocopy $sourcePath $targetPath /E /XD node_modules .git cypress\videos cypress\screenshots cypress\results coverage dist
```

### For Medcor Project:
```powershell
# Replace SOURCE_PATH with your actual Medcor project path
$sourcePath = "C:\path\to\your\medcor\project"
$targetPath = "projects\medcor-healthcare"

# Copy all files except node_modules, .git, etc.
robocopy $sourcePath $targetPath /E /XD node_modules .git cypress\videos cypress\screenshots cypress\results coverage dist
```

### For QA Portfolio Project:
```powershell
# Replace SOURCE_PATH with your actual QA portfolio project path
$sourcePath = "C:\path\to\your\qa-portfolio\project"
$targetPath = "projects\shared-framework"

# Copy all files except node_modules, .git, etc.
robocopy $sourcePath $targetPath /E /XD node_modules .git cypress\videos cypress\screenshots cypress\results coverage dist
```

## Step 3: Post-Migration Setup

After copying, run these commands:

```powershell
# Install root dependencies
npm install

# Install project dependencies
cd projects\tcall-automation
npm install
cd ..\..

cd projects\medcor-healthcare  
npm install
cd ..\..

cd projects\shared-framework
npm install
cd ..\..
```

## Step 4: Create Environment Files

I'll create the environment template files for you:

```powershell
# TCall environment template
@"
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
"@ | Out-File -FilePath "projects\tcall-automation\.env.template" -Encoding UTF8
```

## Ready to Start?

Please provide the paths to your existing projects, and I'll give you the exact commands to run for your specific setup!
