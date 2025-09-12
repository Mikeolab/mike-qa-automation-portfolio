const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Base URL will be set dynamically based on environment
    baseUrl: "https://api.staging.tcall.ai:8006",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Environment variables
    env: {
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL || "test@tcall.ai",
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || "test123",
      ADMIN_EMAIL: process.env.CYPRESS_ADMIN_EMAIL || "admin@tcall.ai",
      ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD || "admin123",
      ENVIRONMENT: process.env.CYPRESS_ENVIRONMENT || "staging"
    },
    
    // Setup and teardown
    setupNodeEvents(on, config) {
      const environment = config.env.ENVIRONMENT || 'staging';
      
      // Set base URL based on environment
      switch (environment) {
        case 'staging':
          config.baseUrl = 'https://api.staging.tcall.ai:8006';
          console.log('🚀 TCALL STAGING ENVIRONMENT - https://api.staging.tcall.ai:8006');
          console.log('🌐 Website: https://test.tcall.ai');
          break;
        case 'production':
          config.baseUrl = 'https://api.tcall.ai:8006';
          console.log('🚀 TCALL PRODUCTION ENVIRONMENT - https://api.tcall.ai:8006');
          console.log('🌐 Website: https://tcall.ai');
          break;
        default:
          config.baseUrl = 'https://api.staging.tcall.ai:8006';
          console.log('🚀 TCALL STAGING ENVIRONMENT (default) - https://api.staging.tcall.ai:8006');
          console.log('🌐 Website: https://test.tcall.ai');
      }
      
      return config;
    }
  },
  
  // Reporter configuration
  reporter: 'spec',
  
  // Retry configuration
  retries: {
    runMode: 2,
    openMode: 0
  }
});