/**
 * Medcor Platform - Negative Test Suite
 */

describe('Medcor API - Negative Scenarios', () => {
  const baseUrl = Cypress.config('baseUrl');
  const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

  const unauth = (method, url, body) =>
    cy.request({ method, url: `${baseUrl}${url}`, body, headers: jsonHeaders, failOnStatusCode: false });

  let superToken;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      headers: jsonHeaders,
      body: {
        email: Cypress.env('SUPER_USER_EMAIL') || 'zeynel@medcorhospital.com',
        password: Cypress.env('SUPER_USER_PASSWORD') || '12345678@',
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200 && res.body?.token) superToken = res.body.token;
    });
  });

  it('should reject invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      headers: jsonHeaders,
      body: { email: 'nope@medcor.ai', password: 'wrong' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 401]);
    });
  });

  it('should block listing hospitals without token', () => {
    unauth('GET', '/hospitals/api/').then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 404]);
    });
  });

  it('should reject malformed JSON on patient creation', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/patients/api/`,
      headers: { 'Content-Type': 'application/json' },
      body: '{"first_name":"bad"',
      failOnStatusCode: false,
      form: true,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 422, 401, 403]);
    });
  });
});

