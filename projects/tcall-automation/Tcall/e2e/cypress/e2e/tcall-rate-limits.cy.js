/**
 * TCall Platform - Rate Limit & Burst Resilience Suite
 *
 * Light-weight checks to ensure the API handles bursts gracefully.
 * NOTE: This is NOT a load test. k6 covers performance/load elsewhere.
 */

describe('TCall API - Rate Limits & Burst Resilience', () => {
  const baseUrl = Cypress.config('baseUrl');
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };

  it('burst invalid logins should not cause 5xx and may return 429/401', () => {
    const attempts = Array.from({ length: 12 });
    const results = [];

    attempts.forEach((_, idx) => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/auth/login/`,
        headers,
        body: { email: `nope+${idx}@example.com`, password: 'wrong' },
        failOnStatusCode: false,
      }).then((res) => {
        results.push(res.status);
      });
    });

    cy.then(() => {
      // Ensure no server errors
      expect(results.some((s) => s >= 500)).to.equal(false);
      // Expect either 401s or some 429s if rate limiting is enabled
      expect(results.every((s) => [401, 400, 429].includes(s))).to.equal(true);
    });
  });
});



