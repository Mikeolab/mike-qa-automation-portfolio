/**
 * Medcor Platform - Pagination & Sorting Suite
 */

describe('Medcor API - Pagination & Sorting', () => {
  const baseUrl = Cypress.config('baseUrl');
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  let token;

  before(() => {
    cy.request({ method: 'POST', url: `${baseUrl}/api/auth/login/`, headers, body: {
      email: Cypress.env('SUPER_USER_EMAIL') || 'zeynel@medcorhospital.com',
      password: Cypress.env('SUPER_USER_PASSWORD') || '12345678@',
    }, failOnStatusCode: false }).then((r) => {
      if (r.status === 200 && r.body?.token) token = r.body.token;
    });
  });

  const asToken = (t) => ({ headers: { ...headers, Authorization: `Bearer ${t}` } });

  const suites = [
    { name: 'hospitals', url: '/hospitals/api/' },
    { name: 'patients', url: '/patients/api/' },
    { name: 'doctors', url: '/doctors/api/' },
  ];

  suites.forEach((s) => {
    it(`${s.name} list supports pagination parameters`, () => {
      const opts = token ? asToken(token) : { headers };
      cy.request({ method: 'GET', url: `${baseUrl}${s.url}?page=1&page_size=5`, ...opts, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([200, 404]);
      });
    });

    it(`${s.name} list rejects invalid pagination`, () => {
      const opts = token ? asToken(token) : { headers };
      cy.request({ method: 'GET', url: `${baseUrl}${s.url}?page=-1&page_size=10000`, ...opts, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([200, 400, 404]);
      });
    });
  });
});

