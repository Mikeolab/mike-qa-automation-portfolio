// Add tiny helpers so the spec stays clean
Cypress.Commands.add("fillIfExists", (selector, text) => {
  cy.get("body").then(($body) => {
    if ($body.find(selector).length) {
      cy.get(selector).clear().type(text, { log: false });
    }
  });
});

Cypress.Commands.add("clickIfExists", (selector) => {
  cy.get("body").then(($body) => {
    if ($body.find(selector).length) {
      cy.get(selector).first().click({ force: true });
    }
  });
});
