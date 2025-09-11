const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://api.dev.tcall.ai:8006",
    supportFile: "cypress/support/e2e.js",
    video: false,
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    retries: {
      runMode: 1,
      openMode: 0
    },
    env: {
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL || "test@tcall.ai",
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || "test123"
    }
  }
});


