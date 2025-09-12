const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Base URL for Medcor staging environment
    baseUrl: "https://api.medcor.ai",
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
      SUPER_USER_EMAIL: process.env.CYPRESS_SUPER_USER_EMAIL || "zeynel@medcorhospital.com",
      SUPER_USER_PASSWORD: process.env.CYPRESS_SUPER_USER_PASSWORD || "12345678@",
      PATIENT_EMAIL: process.env.CYPRESS_PATIENT_EMAIL || "patient.davis@email.com",
      PATIENT_PASSWORD: process.env.CYPRESS_PATIENT_PASSWORD || "password123",
      DOCTOR_EMAIL: process.env.CYPRESS_DOCTOR_EMAIL || "dr.johnson@medcor.com",
      DOCTOR_PASSWORD: process.env.CYPRESS_DOCTOR_PASSWORD || "password123",
      HOSPITAL_ADMIN_EMAIL: process.env.CYPRESS_HOSPITAL_ADMIN_EMAIL || "admin@medcor.com",
      HOSPITAL_ADMIN_PASSWORD: process.env.CYPRESS_HOSPITAL_ADMIN_PASSWORD || "admin123",
      ENVIRONMENT: process.env.CYPRESS_ENVIRONMENT || "staging"
    },
    
    // Setup and teardown
    setupNodeEvents(on, config) {
      const environment = config.env.ENVIRONMENT || 'staging';
      
      // Set base URL based on environment
      switch (environment) {
        case 'staging':
          config.baseUrl = 'https://api.medcor.ai';
          console.log('🚀 MEDCOR STAGING ENVIRONMENT - https://api.medcor.ai');
          console.log('🏥 Multi-tenant Healthcare Platform');
          break;
        case 'production':
          config.baseUrl = 'https://api.medcor.ai'; // Update with production URL when available
          console.log('🚀 MEDCOR PRODUCTION ENVIRONMENT - https://api.medcor.ai');
          console.log('🏥 Multi-tenant Healthcare Platform');
          break;
        default:
          config.baseUrl = 'https://api.medcor.ai';
          console.log('🚀 MEDCOR STAGING ENVIRONMENT (default) - https://api.medcor.ai');
          console.log('🏥 Multi-tenant Healthcare Platform');
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