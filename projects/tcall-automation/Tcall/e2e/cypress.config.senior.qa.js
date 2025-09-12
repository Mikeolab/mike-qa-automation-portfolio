// cypress.config.senior.qa.js
// Senior QA Testing Configuration for Tcall API

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Base URL for different environments
    baseUrl: "https://api.dev.tcall.ai:8006",
    supportFile: "cypress/support/e2e.js",
    
    // Enhanced configuration for comprehensive testing
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    
    // Test retry configuration
    retries: {
      runMode: 2,
      openMode: 1
    },
    
    // Viewport configuration
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Environment variables
    env: {
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL || "test@tcall.ai",
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || "test123",
      ADMIN_EMAIL: process.env.CYPRESS_ADMIN_EMAIL || "admin@tcall.ai",
      ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD || "admin123",
      BASE_URL: process.env.CYPRESS_BASE_URL || "https://api.dev.tcall.ai:8006",
      ENVIRONMENT: process.env.CYPRESS_ENVIRONMENT || "staging"
    },
    
    // Test file patterns - organized by user flows
    specPattern: [
      "cypress/e2e/tcall-comprehensive-user-journey.cy.js",
      "cypress/e2e/tcall-comprehensive-admin-journey.cy.js",
      "cypress/e2e/tcall.smoke.cy.js",
      "cypress/e2e/tcall-comprehensive-api-coverage.cy.js",
      "cypress/e2e/tcall-comprehensive-endpoint-testing.cy.js"
      // Note: tcall-complete-endpoint-validation.cy.js is EXCLUDED from default runs
      // Run manually with: npm run test:endpoint-validation
    ],
    
    // Setup and teardown
    setupNodeEvents(on, config) {
      // Configure environment-specific settings
      const environment = config.env.ENVIRONMENT || 'staging';
      
      // Set base URL based on environment
      switch (environment) {
        case 'staging':
          config.baseUrl = 'https://api.dev.tcall.ai:8006';
          console.log('🚀 RUNNING TCall STAGING TESTS - https://api.dev.tcall.ai:8006');
          break;
        case 'production':
          config.baseUrl = 'https://prod.backend.tcall.ai';
          console.log('🚀 RUNNING TCall PRODUCTION TESTS - https://prod.backend.tcall.ai');
          break;
        default:
          config.baseUrl = 'https://api.dev.tcall.ai:8006';
          console.log('🚀 RUNNING TCall STAGING TESTS - https://api.dev.tcall.ai:8006');
      }
      
      // Add custom tasks for test data management
      on('task', {
        // Generate test data
        generateTestData: (dataType) => {
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substr(2, 9);
          
          switch (dataType) {
            case 'email':
              return `test.${timestamp}.${randomId}@tcall.ai`;
            case 'phone':
              return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
            case 'name':
              return `Test User ${timestamp}`;
            default:
              return `test_${timestamp}_${randomId}`;
          }
        },
        
        // Log test execution details
        logTestExecution: (details) => {
          console.log(`[${new Date().toISOString()}] Test Execution:`, details);
          return null;
        }
      });
      
      return config;
    }
  },
  
  // Component testing configuration (if needed)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  },
  
  // Reporter configuration - simplified
  reporter: 'spec',
  
  // Performance monitoring
  experimentalModifyObstructiveThirdPartyCode: true,
  
  // Security settings
  chromeWebSecurity: false,
  
  // Network settings
  numTestsKeptInMemory: 50,
  
  // Screenshot and video settings
  screenshotsFolder: 'cypress/screenshots/senior-qa',
  videosFolder: 'cypress/videos/senior-qa',
  
  // Download settings
  downloadsFolder: 'cypress/downloads/senior-qa'
});
