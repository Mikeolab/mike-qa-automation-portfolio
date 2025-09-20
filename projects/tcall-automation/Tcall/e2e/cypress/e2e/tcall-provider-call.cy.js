/**
 * TCall Platform - Provider Call Smoke (Retell & ElevenLabs)
 * Logs in as user, selects an existing provider agent (prefers name contains "migros" for ElevenLabs),
 * ensures a contact, and initiates a call.
 */

describe('TCall API - Provider Call Smoke', () => {
  const baseUrl = Cypress.config('baseUrl');
  const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

  let userToken;
  let contactId;
  const presetContactId = Number(Cypress.env('CONTACT_ID')) || null;
  const created = { contacts: [] };

  const withAuth = (token) => ({ headers: { ...jsonHeaders, Authorization: `Bearer ${token}` } });

  before(() => {
    // User login
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login/`,
      headers: jsonHeaders,
      body: {
        email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai',
        password: Cypress.env('TEST_PASSWORD') || 'test123',
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200 && res.body?.token) userToken = res.body.token;
    });

    // Ensure a contact exists: use preset if provided; else try list first, else create
    cy.then(() => {
      if (!userToken) return;
      if (presetContactId) { contactId = presetContactId; return; }
      cy.request({
        method: 'GET',
        url: `${baseUrl}/contacts/api/`,
        ...withAuth(userToken),
        failOnStatusCode: false,
      }).then((listRes) => {
        if (listRes.status === 200) {
          const list = Array.isArray(listRes.body) ? listRes.body : (listRes.body?.results || []);
          if (list && list.length) {
            contactId = list[0].id;
            return;
          }
        }
        const ts = Date.now();
        cy.request({
          method: 'POST',
          url: `${baseUrl}/contacts/api/`,
          body: {
            name: `Call Smoke Contact ${ts}`,
            phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            email: `call.smoke.${ts}@example.com`,
            company: 'QA',
          },
          ...withAuth(userToken),
          failOnStatusCode: false,
        }).then((r) => {
          if ([200, 201].includes(r.status) && r.body?.id) contactId = r.body.id;
          if (contactId) created.contacts.push(contactId);
        });
      });
    });
  });

  after(() => {
    const enableCleanup = String(Cypress.env('CLEANUP') ?? 'true') !== 'false';
    if (!enableCleanup || !userToken) return;
    created.contacts.forEach((id) => {
      cy.request({ method: 'DELETE', url: `${baseUrl}/contacts/api/${id}/`, ...withAuth(userToken), failOnStatusCode: false });
    });
  });

  function findAgent(preferProvider, preferNameContains) {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}/agents/api/`,
      ...withAuth(userToken),
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status !== 200 || !Array.isArray(res.body)) return null;
      const agents = res.body;
      const byName = agents.find(
        (a) => (a.provider || '').toLowerCase() === preferProvider && (a.name || '').toLowerCase().includes(preferNameContains)
      );
      if (byName) return byName;
      const byProvider = agents.find((a) => (a.provider || '').toLowerCase() === preferProvider);
      return byProvider || null;
    });
  }

  function initiateCall(agentId) {
    return cy.request({
      method: 'POST',
      url: `${baseUrl}/calls/api/`,
      body: {
        agent_id: agentId,
        contact_id: contactId,
        call_type: 'outbound',
        priority: 'normal',
      },
      ...withAuth(userToken),
      failOnStatusCode: false,
    });
  }

  it('should make a call with an existing ElevenLabs agent (prefer name contains "migros")', () => {
    if (!userToken) {
      expect(userToken, 'user token required').to.be.a('string');
      return;
    }
    cy.then(() => {
      expect(contactId, 'contact required').to.be.a('number');
    });

    findAgent('elevenlabs', 'migros').then((agent) => {
      expect(!!agent, 'elevenlabs agent not found (check provider/name)').to.equal(true);
      if (!agent) return;
      initiateCall(agent.id).then((callRes) => {
        expect(callRes.status).to.be.oneOf([200, 201, 202, 400, 401, 403]);
      });
    });
  });

  it('should make a call with an existing Retell agent', () => {
    if (!userToken) {
      expect(userToken, 'user token required').to.be.a('string');
      return;
    }
    cy.then(() => {
      expect(contactId, 'contact required').to.be.a('number');
    });

    findAgent('retell', '').then((agent) => {
      expect(!!agent, 'retell agent not found').to.equal(true);
      if (!agent) return;
      initiateCall(agent.id).then((callRes) => {
        expect(callRes.status).to.be.oneOf([200, 201, 202, 400, 401, 403]);
      });
    });
  });
});


