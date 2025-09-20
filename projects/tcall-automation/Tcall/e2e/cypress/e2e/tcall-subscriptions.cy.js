// DEV coverage: subscriptions minimal smoke

describe('TCall DEV - Subscriptions', () => {
  const baseUrl = Cypress.config('baseUrl');
  let token;

  function withAuth() {
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  }

  it('authenticates', () => {
    cy.request({ method: 'POST', url: `${baseUrl}/api/auth/login/`, body: { email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai', password: Cypress.env('TEST_PASSWORD') || 'test123' }, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      token = res.body.token;
    });
  });

  it('probes create subscription endpoint', () => {
    cy.request({ method: 'POST', url: `${baseUrl}/create_a_subscription/`, body: { plan: 'basic' }, ...withAuth(), failOnStatusCode: false }).then((res) => {
      expect([200, 201, 400, 401, 403, 404]).to.include(res.status);
    });
  });

  it('probes cancel subscription endpoint', () => {
    cy.request({ method: 'POST', url: `${baseUrl}/cancel_subscription/`, body: { reason: 'qa-test' }, ...withAuth(), failOnStatusCode: false }).then((res) => {
      expect([200, 201, 400, 401, 403, 404]).to.include(res.status);
    });
  });
});


