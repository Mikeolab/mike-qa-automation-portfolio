describe('Medcor Smoke Tests', () => {
  it('should load the Medcor homepage', () => {
    cy.visit('/');
    cy.contains('Medcor').should('be.visible');
  });

  it('should have basic navigation elements', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
