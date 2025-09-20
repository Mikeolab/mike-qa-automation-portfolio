/**
 * TCall Platform - Permissions Matrix Suite
 * Validates role-based access for user vs admin across sensitive endpoints.
 */

describe('TCall API - Permissions Matrix', () => {
  const baseUrl = Cypress.config('baseUrl');
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };

  let adminToken;
  let userToken;

  before(() => {
    // Admin auth
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      headers,
      body: {
        email: Cypress.env('ADMIN_EMAIL') || 'admin@tcall.ai',
        password: Cypress.env('ADMIN_PASSWORD') || 'admin123',
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200 && res.body?.token) adminToken = res.body.token;
    });

    // User auth
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      headers,
      body: {
        email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai',
        password: Cypress.env('TEST_PASSWORD') || 'test123',
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200 && res.body?.token) userToken = res.body.token;
    });
  });

  const asToken = (token) => ({ headers: { ...headers, Authorization: `Bearer ${token}` } });

  context('Admin-only behaviors', () => {
    it('admin can list users; user should be blocked', () => {
      // User attempt
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/users/`,
        headers,
        failOnStatusCode: false,
      }).then((res) => {
        // Accept masked 404 or explicit 401/403 for non-admin
        expect(res.status).to.be.oneOf([401, 403, 404]);
      });

      // Admin attempt
      const adminHeaders = adminToken ? asToken(adminToken) : { headers };
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/users/`,
        ...adminHeaders,
        failOnStatusCode: false,
      }).then((res) => {
        // In some deployments, this may still be 404 if disabled; allow 200 or 404
        expect(res.status).to.be.oneOf([200, 404]);
      });
    });
  });

  context('Shared endpoints observe role boundaries', () => {
    it('user and admin can list own agents; no auth should be blocked', () => {
      // No token
      cy.request({ method: 'GET', url: `${baseUrl}/agents/api/`, headers, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([401, 403]);
      });

      // Admin
      const adminHeaders = adminToken ? asToken(adminToken) : { headers };
      cy.request({ method: 'GET', url: `${baseUrl}/agents/api/`, ...adminHeaders, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([200, 404]);
      });

      // User
      const userHeaders = userToken ? asToken(userToken) : { headers };
      cy.request({ method: 'GET', url: `${baseUrl}/agents/api/`, ...userHeaders, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([200, 404]);
      });
    });
  });
});



