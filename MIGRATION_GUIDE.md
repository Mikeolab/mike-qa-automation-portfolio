# 🚀 Project Migration Guide

This guide will help you migrate your existing TCall, Medcor, and QA portfolio projects into this unified repository.

## 📋 Migration Checklist

### ✅ Completed
- [x] Portfolio repository structure created
- [x] Professional README with case studies
- [x] Unified CI/CD pipeline configured
- [x] Project directories organized

### 🔄 In Progress
- [ ] TCall automation project files
- [ ] Medcor healthcare project files  
- [ ] QA portfolio project files

## 🗂️ Migration Steps

### Step 1: TCall Automation Project
```bash
# Copy files from your TCall repository
cp -r /path/to/tcall-repo/* projects/tcall-automation/

# Or use git to merge
git remote add tcall-original /path/to/tcall-repo
git fetch tcall-original
git merge tcall-original/main --allow-unrelated-histories
```

### Step 2: Medcor Healthcare Project
```bash
# Copy files from your Medcor repository
cp -r /path/to/medcor-repo/* projects/medcor-healthcare/

# Or use git to merge
git remote add medcor-original /path/to/medcor-repo
git fetch medcor-original
git merge medcor-original/main --allow-unrelated-histories
```

### Step 3: QA Portfolio Project
```bash
# Copy files from your QA portfolio repository
cp -r /path/to/qa-portfolio-repo/* projects/shared-framework/

# Or use git to merge
git remote add qa-portfolio-original /path/to/qa-portfolio-repo
git fetch qa-portfolio-original
git merge qa-portfolio-original/main --allow-unrelated-histories
```

## 📁 Expected File Structure After Migration

```
mike-qa-automation-portfolio/
├── README.md                           # Main portfolio README
├── package.json                        # Root package.json
├── .github/
│   └── workflows/
│       └── qa-automation-pipeline.yml  # Unified CI/CD
├── projects/
│   ├── tcall-automation/               # TCall project files
│   │   ├── cypress/                    # Cypress tests
│   │   ├── webhook-proxy/              # Custom webhook solution
│   │   ├── test-data/                  # Test scenarios
│   │   ├── docs/                       # Project documentation
│   │   ├── docker/                     # Docker configuration
│   │   ├── package.json                # Project dependencies
│   │   └── README.md                   # Project README
│   ├── medcor-healthcare/              # Medcor project files
│   │   ├── cypress/                    # Healthcare tests
│   │   ├── test-data/                  # Encrypted test data
│   │   ├── security/                   # Security utilities
│   │   ├── docs/                       # Compliance docs
│   │   ├── docker/                     # Docker configuration
│   │   ├── package.json                # Project dependencies
│   │   └── README.md                   # Project README
│   └── shared-framework/               # Shared utilities
│       ├── src/                        # Framework source code
│       ├── config/                     # Configuration files
│       ├── templates/                  # Test templates
│       ├── docs/                       # Framework docs
│       ├── package.json                # Framework dependencies
│       └── README.md                   # Framework README
├── docs/
│   ├── case-studies/                   # Detailed case studies
│   ├── best-practices/                 # Testing methodologies
│   └── technical-specs/                # Technical documentation
└── tools/
    ├── webhook-proxy/                  # Shared webhook utilities
    └── test-data-generator/            # Test data generation tools
```

## 🔧 Post-Migration Tasks

### 1. Update Package Dependencies
```bash
# Install root dependencies
npm install

# Install project-specific dependencies
cd projects/tcall-automation && npm install
cd projects/medcor-healthcare && npm install
cd projects/shared-framework && npm install
```

### 2. Update Configuration Files
- Update `package.json` scripts for unified execution
- Configure environment variables for each project
- Update Docker configurations for unified deployment
- Configure Cypress settings for multi-project setup

### 3. Update Documentation
- Update project READMEs with new structure
- Update case studies with actual implementation details
- Create migration notes for future reference

### 4. Test Integration
```bash
# Test TCall project
cd projects/tcall-automation
npm run test

# Test Medcor project
cd projects/medcor-healthcare
npm run test

# Test shared framework
cd projects/shared-framework
npm run test

# Run unified CI/CD pipeline
npm run ci:all
```

## 🚨 Important Notes

### File Conflicts
If you encounter file conflicts during migration:
1. Review each conflict carefully
2. Preserve the most recent/complete version
3. Update paths and references as needed
4. Test thoroughly after resolution

### Environment Variables
Update environment variables for the new structure:
```bash
# TCall specific
TCALL_API_URL=https://api.tcall.com
TCALL_WEBHOOK_URL=https://your-proxy.com/webhook

# Medcor specific
MEDCOR_API_URL=https://api.medcor.com
MEDCOR_DB_URL=postgresql://user:pass@localhost/medcor_test

# Shared framework
FRAMEWORK_CONFIG_PATH=./config/environments
```

### Git History
To preserve git history from original repositories:
```bash
# Add original repos as remotes
git remote add tcall-original <tcall-repo-url>
git remote add medcor-original <medcor-repo-url>
git remote add qa-portfolio-original <qa-portfolio-repo-url>

# Fetch and merge with history
git fetch tcall-original
git merge tcall-original/main --allow-unrelated-histories
```

## 🎯 Next Steps

1. **Clone your existing repositories** to local directories
2. **Copy files** using the commands above
3. **Update configurations** for the new structure
4. **Test everything** to ensure it works
5. **Update documentation** with actual implementation details
6. **Commit and push** the unified portfolio

## 📞 Need Help?

If you encounter any issues during migration:
1. Check this guide for common solutions
2. Review the case studies for implementation details
3. Test each project individually before integration
4. Update this guide with any new findings

---

*This migration will create a powerful, unified portfolio showcasing your QA automation expertise across multiple industries and technologies.*
