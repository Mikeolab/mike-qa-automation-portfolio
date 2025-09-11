describe('Tcall - User Login and Dashboard Access', () => {
    it('should log in successfully and navigate to the dashboard', () => {
        cy.visit('https://dashboard.tcall.ai/login/');

        cy.get('.o-login__form > :nth-child(1) > .o-login__input').type('jaychovatiya');
        cy.get('.password-input-wrapper > .o-login__input').type('Tcall@2024#');
        cy.get('button[type="submit"]').click();

        // Wait for dashboard page to load
        cy.url().should('include', '/dashboard');
        cy.contains('Welcome').should('be.visible');

        //
    });
});