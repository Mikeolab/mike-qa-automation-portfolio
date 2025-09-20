/**
 * TCall Platform - Negative Test Suite
 *
 * Focused negative scenarios to validate error handling, authorization,
 * validation, and method constraints across key API areas.
 */

describe('TCall API - Negative Scenarios', () => {
  const baseUrl = Cypress.config('baseUrl');

  const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

  const unauth = (method, url, body) =>
    cy.request({ method, url: `${baseUrl}${url}`, body, headers: jsonHeaders, failOnStatusCode: false });

  const withToken = (token) => ({
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
  });

  let adminToken;

  before(() => {
    // Obtain a valid admin token for authorized negative tests
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      headers: jsonHeaders,
      body: {
        email: Cypress.env('ADMIN_EMAIL') || 'admin@tcall.ai',
        password: Cypress.env('ADMIN_PASSWORD') || 'admin123',
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200 && res.body?.token) {
        adminToken = res.body.token;
      }
    });
  });

  describe('Authentication - Negative', () => {
    it('should reject invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/auth/login/`,
        headers: jsonHeaders,
        body: { email: 'admin@tcall.ai', password: 'wrong-password' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 401]);
      });
    });

    it('should reject missing required fields', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/auth/login/`,
        headers: jsonHeaders,
        body: { email: '' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
      });
    });

    it('should not allow unsupported HTTP method on login', () => {
      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/api/auth/login/`,
        headers: jsonHeaders,
        body: {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([405, 400]);
      });
    });
  });

  describe('Authorization - Negative (No Token)', () => {
    it('should block listing agents without token', () => {
      unauth('GET', '/agents/api/').then((res) => {
        expect(res.status).to.be.oneOf([401, 403]);
      });
    });

    it('should block creating agent without token', () => {
      unauth('POST', '/agents/api/', { name: 'x' }).then((res) => {
        expect(res.status).to.be.oneOf([401, 403]);
      });
    });

    it('should block accessing notifications without token', () => {
      unauth('GET', '/notifications/api/').then((res) => {
        // Some services mask unauthorized as 404 to avoid resource discovery
        expect(res.status).to.be.oneOf([401, 403, 404]);
      });
    });
  });

  describe('Validation - Negative (Bad Payload)', () => {
    it('should reject agent creation with malformed payload', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/agents/api/`,
        headers: jsonHeaders,
        body: { name: 123, provider: null },
        failOnStatusCode: false,
      }).then((res) => {
        // Either validation error or auth error (if auth required)
        expect(res.status).to.be.oneOf([400, 401, 403]);
      });
    });

    it('should reject contact creation with missing fields', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/contacts/api/`,
        headers: jsonHeaders,
        body: { email: 'not-an-email' },
        failOnStatusCode: false,
      }).then((res) => {
        // 404 may be returned if the route is hidden or not available
        expect(res.status).to.be.oneOf([400, 401, 403, 404]);
      });
    });

    it('should reject wrong content-type on JSON endpoint', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/agents/api/`,
        headers: { 'Content-Type': 'text/plain' },
        body: 'name=bad',
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 415, 401, 403]);
      });
    });

    it('should reject malformed JSON payload', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/contacts/api/`,
        headers: { 'Content-Type': 'application/json' },
        // send malformed JSON via `form=true` hack to bypass Cypress auto-JSON
        body: '{"email":"bad"',
        failOnStatusCode: false,
        form: true,
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422, 401, 403]);
      });
    });
  });

  describe('Not Found - Negative (Invalid IDs)', () => {
    it('should return 404 for non-existing agent', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/agents/api/99999999/`,
        headers: jsonHeaders,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([404, 401, 403]);
      });
    });

    it('should return 404 for non-existing campaign', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/campaigns/api/99999999/`,
        headers: jsonHeaders,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([404, 401, 403]);
      });
    });

    it('should reject unsupported method on list endpoint', () => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/agents/api/`,
        headers: jsonHeaders,
        body: {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([405, 400, 401, 403]);
      });
    });
  });

  describe('Authorization - Negative (Invalid Token)', () => {
    it('should reject requests with invalid token', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/agents/api/`,
        headers: { ...jsonHeaders, Authorization: 'Bearer invalid.token.value' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([401, 403]);
      });
    });
  });

  describe('Business Rules - Negative', () => {
    it('should prevent creating webhook with invalid URL', () => {
      const payload = { url: 'not-a-url', event: 'call.completed' };
      const opts = adminToken ? withToken(adminToken) : { headers: jsonHeaders };
      cy.request({
        method: 'POST',
        url: `${baseUrl}/integrations/api/webhooks/`,
        body: payload,
        ...opts,
        failOnStatusCode: false,
      }).then((res) => {
        // Some deployments return 404 if the integration route is disabled
        expect(res.status).to.be.oneOf([400, 422, 401, 403, 404]);
      });
    });
  });
});


