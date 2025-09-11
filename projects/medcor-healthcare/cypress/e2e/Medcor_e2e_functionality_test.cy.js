describe('Medcor End-to-End User Functional Flow', () => {
    it('Opers Chatbot', () => {
        //Visit Medcor Login Page
        cy.visit('https://medcor.ai');

        //wait for page to load
        cy.wait(20000);

        //Type a message in the chatbot input box
        cy.get('input').type('What services do you offer?{enter}');

        //Wait for a reply from the chatbot
        cy.contains(/I can provide|answer questions/i, { timeout: 20000 }).should('be.visible');

        //Take a Screenshot
        cy.screenshot('Medcor-chatbot-full-page');


    });
});