describe('TCall Smoke Tests', () => {
  it('should load the TCall homepage', () => {
    cy.visit('/');
    cy.contains('TCall').should('be.visible');
  });

  it('should have basic navigation elements', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
