const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://test.tcall.ai",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720
  },
  env: {
    TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL || "test@example.com",
    TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || "testpassword"
  },
  retries: {
    runMode: 2,
    openMode: 0
  }
});
