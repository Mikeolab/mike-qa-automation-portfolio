#!/bin/bash

# 🚀 QA Automation Portfolio Migration Script
# This script helps migrate existing projects into the unified portfolio

set -e

echo "🚀 Starting QA Automation Portfolio Migration..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        print_error "Directory $1 does not exist!"
        return 1
    fi
    return 0
}

# Function to copy project files
copy_project_files() {
    local source_dir=$1
    local target_dir=$2
    local project_name=$3
    
    print_status "Copying $project_name files from $source_dir to $target_dir..."
    
    if check_directory "$source_dir"; then
        # Create target directory if it doesn't exist
        mkdir -p "$target_dir"
        
        # Copy files, excluding common directories we don't want
        rsync -av --exclude='node_modules' \
                  --exclude='.git' \
                  --exclude='cypress/videos' \
                  --exclude='cypress/screenshots' \
                  --exclude='cypress/results' \
                  --exclude='coverage' \
                  --exclude='dist' \
                  --exclude='.env' \
                  "$source_dir/" "$target_dir/"
        
        print_success "$project_name files copied successfully!"
        return 0
    else
        print_error "Failed to copy $project_name files"
        return 1
    fi
}

# Function to setup project dependencies
setup_project_dependencies() {
    local project_dir=$1
    local project_name=$2
    
    print_status "Setting up dependencies for $project_name..."
    
    if [ -f "$project_dir/package.json" ]; then
        cd "$project_dir"
        npm install
        cd - > /dev/null
        print_success "$project_name dependencies installed!"
    else
        print_warning "No package.json found for $project_name, skipping dependency installation"
    fi
}

# Function to update project configuration
update_project_config() {
    local project_dir=$1
    local project_name=$2
    
    print_status "Updating configuration for $project_name..."
    
    # Update package.json scripts if needed
    if [ -f "$project_dir/package.json" ]; then
        # Add portfolio-specific scripts if they don't exist
        print_status "Package.json found for $project_name"
    fi
    
    # Update Cypress configuration
    if [ -f "$project_dir/cypress.config.ts" ] || [ -f "$project_dir/cypress.config.js" ]; then
        print_status "Cypress configuration found for $project_name"
    fi
    
    print_success "$project_name configuration updated!"
}

# Main migration function
migrate_project() {
    local project_name=$1
    local source_path=$2
    local target_path="projects/$project_name"
    
    echo ""
    print_status "Starting migration for $project_name..."
    echo "Source: $source_path"
    echo "Target: $target_path"
    
    # Copy files
    if copy_project_files "$source_path" "$target_path" "$project_name"; then
        # Setup dependencies
        setup_project_dependencies "$target_path" "$project_name"
        
        # Update configuration
        update_project_config "$target_path" "$project_name"
        
        print_success "$project_name migration completed!"
    else
        print_error "$project_name migration failed!"
        return 1
    fi
}

# Interactive migration
interactive_migration() {
    echo ""
    print_status "Starting interactive migration process..."
    echo ""
    
    # TCall Project Migration
    echo "📞 TCall Automation Project"
    echo "=========================="
    read -p "Enter the path to your TCall project directory: " tcall_path
    if [ -n "$tcall_path" ]; then
        migrate_project "tcall-automation" "$tcall_path"
    else
        print_warning "Skipping TCall project migration"
    fi
    
    echo ""
    
    # Medcor Project Migration
    echo "🏥 Medcor Healthcare Project"
    echo "==========================="
    read -p "Enter the path to your Medcor project directory: " medcor_path
    if [ -n "$medcor_path" ]; then
        migrate_project "medcor-healthcare" "$medcor_path"
    else
        print_warning "Skipping Medcor project migration"
    fi
    
    echo ""
    
    # QA Portfolio Project Migration
    echo "🛠️ QA Portfolio Project"
    echo "======================"
    read -p "Enter the path to your QA portfolio project directory: " qa_portfolio_path
    if [ -n "$qa_portfolio_path" ]; then
        migrate_project "shared-framework" "$qa_portfolio_path"
    else
        print_warning "Skipping QA portfolio project migration"
    fi
}

# Command line migration
command_line_migration() {
    local tcall_path=$1
    local medcor_path=$2
    local qa_portfolio_path=$3
    
    if [ -n "$tcall_path" ]; then
        migrate_project "tcall-automation" "$tcall_path"
    fi
    
    if [ -n "$medcor_path" ]; then
        migrate_project "medcor-healthcare" "$medcor_path"
    fi
    
    if [ -n "$qa_portfolio_path" ]; then
        migrate_project "shared-framework" "$qa_portfolio_path"
    fi
}

# Post-migration setup
post_migration_setup() {
    print_status "Running post-migration setup..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Create .env template files
    print_status "Creating environment template files..."
    
    # TCall environment template
    cat > projects/tcall-automation/.env.template << EOF
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
EOF

    # Medcor environment template
    cat > projects/medcor-healthcare/.env.template << EOF
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
EOF

    # Shared framework environment template
    cat > projects/shared-framework/.env.template << EOF
# Shared Framework Configuration
FRAMEWORK_CONFIG_PATH=./config/environments
TEST_DATA_PATH=./test-data
REPORTS_PATH=./reports

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/framework.log
EOF

    print_success "Environment template files created!"
    
    # Create gitignore entries
    print_status "Updating .gitignore..."
    cat >> .gitignore << EOF

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
EOF

    print_success "Post-migration setup completed!"
}

# Main execution
main() {
    echo "🚀 QA Automation Portfolio Migration Script"
    echo "=========================================="
    echo ""
    echo "This script will help you migrate your existing projects into the unified portfolio."
    echo ""
    
    # Check if running in interactive mode
    if [ $# -eq 0 ]; then
        interactive_migration
    else
        command_line_migration "$1" "$2" "$3"
    fi
    
    # Run post-migration setup
    post_migration_setup
    
    echo ""
    print_success "🎉 Migration completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review the migrated files in the projects/ directory"
    echo "2. Update environment variables in .env files"
    echo "3. Run 'npm run setup:dev' to start development environment"
    echo "4. Test each project individually: 'npm run test:tcall', 'npm run test:medcor', 'npm run test:shared'"
    echo "5. Run unified tests: 'npm run test:all'"
    echo ""
    echo "For more information, see MIGRATION_GUIDE.md"
}

# Show usage if help requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [tcall_path] [medcor_path] [qa_portfolio_path]"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Interactive mode"
    echo "  $0 /path/to/tcall /path/to/medcor /path/to/qa-portfolio"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    exit 0
fi

# Run main function
main "$@"
