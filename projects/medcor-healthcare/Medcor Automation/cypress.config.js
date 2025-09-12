const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
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
    retries: {
      runMode: 2,
      openMode: 0
    },
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
    setupNodeEvents(on, config) {
      const environment = config.env.ENVIRONMENT || 'staging';
      switch (environment) {
        case 'production':
          config.baseUrl = 'https://api.medcor.ai';
          console.log('🏥 RUNNING MEDCOR PRODUCTION TESTS - https://api.medcor.ai');
          break;
        default:
          config.baseUrl = 'https://api.medcor.ai';
          console.log('🏥 RUNNING MEDCOR STAGING TESTS - https://api.medcor.ai');
      }
      return config;
    }
  }
});
