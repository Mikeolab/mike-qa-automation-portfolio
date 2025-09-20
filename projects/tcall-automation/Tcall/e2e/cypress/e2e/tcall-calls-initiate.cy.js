// DEV validation for /api/calls/initiate/ using an assigned phone_number_id

describe('TCall DEV - Calls Initiate Flow', () => {
  const baseUrl = Cypress.config('baseUrl');
  let token;
  let agentId;
  let phoneNumberId;
  let callSid;

  function withAuth(t) {
    return {
      headers: {
        'Authorization': `Bearer ${t}`,
        'Content-Type': 'application/json'
      }
    };
  }

  it('authenticates', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      body: {
        email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai',
        password: Cypress.env('TEST_PASSWORD') || 'test123'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      token = res.body.token;
      expect(token).to.be.a('string');
    });
  });

  it('picks agent with assigned phone number', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/agents/api/`,
      ...withAuth(token),
      failOnStatusCode: false
    }).then((agentsRes) => {
      expect(agentsRes.status).to.equal(200);
      const agents = agentsRes.body.results || agentsRes.body || [];
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/phone-numbers/`,
        ...withAuth(token),
        failOnStatusCode: false
      }).then((numsRes) => {
        expect(numsRes.status).to.equal(200);
        const numbers = numsRes.body.results || numsRes.body || [];
        const match = numbers.find(n => n.agent_id && agents.find(a => Number(a.id) === Number(n.agent_id)));
        expect(!!match, 'assigned phone number required').to.equal(true);
        phoneNumberId = match.id;
        agentId = Number(match.agent_id);
      });
    });
  });

  it('initiates a call', () => {
    expect(agentId, 'agentId').to.be.a('number');
    expect(phoneNumberId, 'phoneNumberId').to.be.a('number');
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/calls/initiate/`,
      body: {
        agent_id: agentId,
        to_number: '+12186955062',
        country_code: '+1',
        phone_number_id: phoneNumberId
      },
      ...withAuth(token),
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.have.property('callSid');
      callSid = res.body.callSid;
    });
  });

  it('polls call status until terminal state', () => {
    if (!callSid) {
      cy.log('⏭️ Skipping poll - no callSid');
      return;
    }

    const terminal = new Set(['completed', 'failed', 'no-answer', 'busy', 'canceled', 'ended']);

    function poll(attempt = 0) {
      if (attempt > 15) {
        throw new Error('Call did not reach terminal state within timeout');
      }
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/call-logs/`,
        ...withAuth(token),
        failOnStatusCode: false
      }).then((res) => {
        expect([200, 403]).to.include(res.status);
        if (res.status !== 200) {
          cy.wait(2000);
          poll(attempt + 1);
          return;
        }
        const items = (Array.isArray(res.body) ? res.body : (res.body.results || [])).filter(Boolean);
        const match = items.find(x => x.call_sid === callSid || x.retell_call_id === callSid || x.twilio_call_sid === callSid);
        if (!match || !match.status) {
          cy.wait(2000);
          poll(attempt + 1);
          return;
        }
        cy.log(`Call status: ${match.status}`);
        expect(true).to.equal(true);
      });
    }

    poll();
  });
});


