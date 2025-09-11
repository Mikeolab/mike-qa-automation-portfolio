describe('Tcall - User Login and Dashboard Access', () => {
    it('should log in successfully and navigate to the dashboard', () => {
        cy.visit('https://dashboard.tcall.ai/login/');

        cy.get('.o-login__form > :nth-child(1) > .o-login__input').type('jaychovatiya');
        cy.get('.password-input-wrapper > .o-login__input').type('Tcall@2024#');
        cy.get('button[type="submit"]').click();

        // Wait for dashboard page to load
        cy.url().should('include', '/dashboard');

        //View Purchased phone number
        cy.get('.medium-media_splide_dlist1 > .o-dasboard__dslink > span').click();
        cy.get('.o-dasboard__backbtn').click();

        //Profile Selection
        cy.get('a.flex').click();
        cy.get('.absolute > :nth-child(1) > .w-full').click();

        //Agent Selection
        cy.get('.o-dasboard__leftlist > :nth-child(2) > .o-cusror-pointer').click();

        //View Inbound Agents
        cy.get(':nth-child(1) > .agent-calls__btnarea > .agent-calls__agentbtn').click();
        cy.get('.o-dasboard__backbtn').click();

        //View Outbound Agents
        cy.get(':nth-child(2) > .agent-calls__btnarea > .agent-calls__agentbtn').click();
        cy.get('.o-dasboard__backbtn').click();

        //Call Section
        cy.get(':nth-child(3) > .o-cusror-pointer > .o-dasboard__itemscenter').click();

        //Campaign 
        cy.get(':nth-child(1) > .o-dasboard__dslink > span').click();
        cy.get('.o-dasboard__backbtn').click();

        //Contacts
        cy.get(':nth-child(2) > .o-dasboard__dslink > span').click();
        cy.get('.o-dasboard__backbtn').click();

        //Call Logs
        cy.get(':nth-child(3) > .o-dasboard__dslink > span').click();
        cy.get('a.flex').click();

        //Logout
        cy.get(':nth-child(3) > .w-full').click();

        // Access Contact details after logout(-)
        
    });
});