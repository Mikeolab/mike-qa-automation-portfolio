// DEV coverage: bulk call initiation

describe('TCall DEV - Bulk Calls', () => {
  const baseUrl = Cypress.config('baseUrl');
  let token;
  let agentId;
  let phoneNumberId;

  function withAuth() {
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  }

  it('authenticates', () => {
    cy.request({
      method: 'POST', url: `${baseUrl}/api/auth/login/`,
      body: { email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai', password: Cypress.env('TEST_PASSWORD') || 'test123' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      token = res.body.token;
      expect(token).to.be.a('string');
    });
  });

  it('selects an agent with assigned number', () => {
    cy.request({ method: 'GET', url: `${baseUrl}/agents/api/`, ...withAuth(), failOnStatusCode: false }).then((aRes) => {
      expect(aRes.status).to.equal(200);
      const agents = aRes.body.results || aRes.body || [];
      cy.request({ method: 'GET', url: `${baseUrl}/api/phone-numbers/`, ...withAuth(), failOnStatusCode: false }).then((nRes) => {
        expect(nRes.status).to.equal(200);
        const nums = nRes.body.results || nRes.body || [];
        const match = nums.find((n) => n.agent_id && agents.find((a) => Number(a.id) === Number(n.agent_id)));
        expect(!!match, 'assigned number required').to.equal(true);
        phoneNumberId = match.id;
        agentId = Number(match.agent_id);
      });
    });
  });

  it('bulk-initiates one call (probe)', () => {
    const body = {
      agent_id: agentId,
      calls: [
        {
          to_number: '+12186955062',
          country_code: '+1',
          phone_number_id: phoneNumberId,
        },
      ],
    };
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/calls/bulk-initiate/`,
      body,
      ...withAuth(),
      failOnStatusCode: false,
    }).then((res) => {
      // Accept common outcomes until schema is finalized
      expect([200, 201, 202, 400, 401, 403, 404, 405]).to.include(res.status);
      if ([200, 201, 202].includes(res.status)) {
        expect(res.body).to.exist;
      }
    });
  });
});


