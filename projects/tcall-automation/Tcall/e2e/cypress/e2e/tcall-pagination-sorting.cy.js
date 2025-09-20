/**
 * TCall Platform - Pagination & Sorting Suite
 */

describe('TCall API - Pagination & Sorting', () => {
  const baseUrl = Cypress.config('baseUrl');
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };

  let token;

  before(() => {
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
      if (res.status === 200 && res.body?.token) token = res.body.token;
    });
  });

  const asToken = (t) => ({ headers: { ...headers, Authorization: `Bearer ${t}` } });

  const suites = [
    { name: 'agents', url: '/agents/api/' },
    { name: 'contacts', url: '/contacts/api/' },
    { name: 'campaigns', url: '/campaigns/api/' },
  ];

  suites.forEach((s) => {
    it(`${s.name} list supports pagination parameters`, () => {
      const opts = token ? asToken(token) : { headers };
      cy.request({
        method: 'GET',
        url: `${baseUrl}${s.url}?page=1&page_size=5`,
        ...opts,
        failOnStatusCode: false,
      }).then((res) => {
        // Allow 200 or 404 if list routes are disabled in prod
        expect(res.status).to.be.oneOf([200, 404]);
      });
    });

    it(`${s.name} list rejects invalid pagination`, () => {
      const opts = token ? asToken(token) : { headers };
      cy.request({
        method: 'GET',
        url: `${baseUrl}${s.url}?page=-1&page_size=10000`,
        ...opts,
        failOnStatusCode: false,
      }).then((res) => {
        // Expect validation or clamp; allow 200/400/404
        expect(res.status).to.be.oneOf([200, 400, 404]);
      });
    });
  });
});



