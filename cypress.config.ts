const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // or whatever your dev server URL is
    specPattern: 'cypress/integration/**/*.spec.js',
  },
});
