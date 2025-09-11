describe('API Testing with Form Data - Login and Access Protected Endpoints', () => {
  let accessToken = '';

  it('Should log in and extract access_token from response', () => {
    cy.request({
      method: 'POST',
      url: 'https://api.dev.tcall.ai/login/',
      form: true,
      body: {
        username_or_email: 'jaychovatiya',
        password: 'Tcall@2024#'
      },
      timeout: 300000
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Login response:', response.body);

      // ✅ Extract access_token safely
      const token = response.body?.data?.access_token;
      expect(token, 'Access token must exist').to.exist;

      accessToken = token;
      cy.log('Access Token:', accessToken);
    });
  });

  it('Should access client_details using the token', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.dev.tcall.ai/client_details/',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 300000
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Client Details:', response.body);
    });
  });

  it('Should access client_balance using the token', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.dev.tcall.ai/client_balance/',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 300000
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Client Balance:', response.body);
    });
  });
});
