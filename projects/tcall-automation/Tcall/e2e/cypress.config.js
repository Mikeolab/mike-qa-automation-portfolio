const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Hard-set for your smoke env; CI can still override with CYPRESS_BASE_URL
    baseUrl: "https://test.tcall.ai",
    supportFile: "cypress/support/e2e.js",
    video: false,
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 60000
  },
  env: {
    TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
    TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD
  }
});
