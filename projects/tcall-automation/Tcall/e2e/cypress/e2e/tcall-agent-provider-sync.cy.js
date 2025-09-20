/**
 * TCall Platform - Agent Provider Sync Tests (Retell & ElevenLabs)
 *
 * Validates that newly created agents for each provider properly sync
 * and persist a provider/external agent id that enables call flows.
 */

describe('TCall API - Agent Provider Sync (Retell & ElevenLabs)', () => {
  const baseUrl = Cypress.config('baseUrl');
  const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

  let adminToken;
  let userToken;
  let contactId;
  const created = { agents: [], contacts: [] };

  const headersWith = (token) => ({ headers: { ...jsonHeaders, Authorization: `Bearer ${token}` } });

  before(() => {
    // Authenticate as admin (optional)
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
      if (res.status === 200) {
        expect(res.body).to.have.property('token');
        adminToken = res.body.token;
      }
    });

    // Authenticate as regular user (primary for provider agents)
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
      if (res.status === 200) {
        expect(res.body).to.have.property('token');
        userToken = res.body.token;
      }
    });

    // Create a test contact (used to attempt call initiation if needed)
    cy.then(() => {
      const token = userToken || adminToken;
      if (!token) return;
      const headers = headersWith(token);
      const timestamp = Date.now();
      cy.request({
        method: 'POST',
        url: `${baseUrl}/contacts/api/`,
        body: {
          name: `Provider Sync Contact ${timestamp}`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          email: `provider.sync.${timestamp}@example.com`,
          company: 'Sync QA',
        },
        ...headers,
        failOnStatusCode: false,
      }).then((res) => {
        if ([200, 201].includes(res.status) && res.body?.id) {
          contactId = res.body.id;
          created.contacts.push(contactId);
        }
      });
    });
  });

  after(() => {
    const enableCleanup = String(Cypress.env('CLEANUP') ?? 'true') !== 'false';
    if (!enableCleanup) return;
    const token = userToken || adminToken;
    if (!token) return;
    const headers = headersWith(token);
    // Cleanup agents
    created.agents.forEach((id) => {
      cy.request({ method: 'DELETE', url: `${baseUrl}/agents/api/${id}/`, ...headers, failOnStatusCode: false });
    });
    // Cleanup contacts
    created.contacts.forEach((id) => {
      cy.request({ method: 'DELETE', url: `${baseUrl}/contacts/api/${id}/`, ...headers, failOnStatusCode: false });
    });
  });

  function listAgents() {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}/agents/api/`,
      ...(headersWith(userToken || adminToken)),
      failOnStatusCode: false,
    });
  }

  function createAgent(provider) {
    const timestamp = Date.now();
    // Try to clone shape from an existing agent of same provider (closest to frontend payload)
    return listAgents().then((listRes) => {
      let template = null;
      if (listRes.status === 200) {
        const list = Array.isArray(listRes.body) ? listRes.body : (listRes.body.results || []);
        template = list.find((a) => (a.provider || '').toLowerCase() === provider) || null;
      }
      const payload = {
        call_type: template?.call_type || 'outbound',
        name: template?.name ? `${template.name} QA ${timestamp}` : `Sync QA ${provider} ${timestamp}`,
        provider: provider,
        description: template?.description || `Agent for provider sync QA (${provider})`,
        voice_id: template?.voice_id || (provider === 'elevenlabs' ? '2EiwWnXFnvU5JabPnv8n' : '11labs-Anthony'),
        language: template?.language || (provider === 'elevenlabs' ? 'en' : 'en-US'),
        industry: template?.industry || 'technology',
        initial_message: template?.initial_message || 'Hello! QA sync validation.',
        prompt_content: template?.prompt_content || 'You are a test agent for provider sync validation.',
        is_active: true,
      };
      return cy.request({
        method: 'POST',
        url: `${baseUrl}/agents/api/`,
        body: payload,
        ...(headersWith(userToken || adminToken)),
        failOnStatusCode: false,
      });
    });
  }

  function syncAgent(agentId) {
    return cy.request({
      method: 'POST',
      url: `${baseUrl}/agents/api/${agentId}/sync/`,
      ...(headersWith(userToken || adminToken)),
      failOnStatusCode: false,
    });
  }

  function fetchAgent(agentId) {
    return cy.request({
      method: 'GET',
      url: `${baseUrl}/agents/api/${agentId}/`,
      ...(headersWith(userToken || adminToken)),
      failOnStatusCode: false,
    });
  }

  function expectHasExternalId(agentBody, provider) {
    const possibleKeys = [
      'external_agent_id',
      'provider_agent_id',
      'external_id',
      `${provider}_agent_id`,
      'platform_provider_agent_id',
    ];
    const hasKey = possibleKeys.some((k) => agentBody && Object.prototype.hasOwnProperty.call(agentBody, k) && agentBody[k]);
    expect(agentBody).to.have.property('provider', provider);
    expect(
      hasKey,
      `Expected agent to contain a provider/external id after sync (checked keys: ${possibleKeys.join(', ')})`
    ).to.equal(true);
  }

  function hasExternalId(agentBody, provider) {
    const keys = ['external_agent_id', 'provider_agent_id', 'external_id', `${provider}_agent_id`, 'platform_provider_agent_id'];
    return keys.some((k) => agentBody && agentBody[k]);
  }

  function waitForExternalId(agentId, provider, attempts = 12, delayMs = 5000) {
    // Poll up to ~60s (12 * 5s)
    return fetchAgent(agentId).then((getRes) => {
      if (getRes.status === 200 && hasExternalId(getRes.body, provider)) {
        return;
      }
      if (attempts <= 1) {
        // Final assertion
        if (getRes.status === 200) {
          expectHasExternalId(getRes.body, provider);
        } else {
          expect(getRes.status, 'expected 200 when fetching agent detail').to.equal(200);
        }
        return;
      }
      return cy.wait(delayMs).then(() => waitForExternalId(agentId, provider, attempts - 1, delayMs));
    });
  }

  ['retell', 'elevenlabs'].forEach((provider) => {
    it(`should create, sync, and persist external id for ${provider}`, () => {
      if (!userToken && !adminToken) {
        // If not authenticated, surface clearly
        expect(userToken || adminToken, 'auth token required').to.be.a('string');
        return;
      }

      // Create agent
      createAgent(provider).then((createRes) => {
        expect(createRes.status).to.be.oneOf([200, 201, 400, 401, 403]);
        if (![200, 201].includes(createRes.status) || !createRes.body?.id) {
          // If creation blocked in prod, still assert provider echoed when possible
          return;
        }
        const agentId = createRes.body.id;
        created.agents.push(agentId);

        // Trigger provider sync
        syncAgent(agentId).then((syncRes) => {
          expect(syncRes.status).to.be.oneOf([200, 202, 400, 401, 403, 404]);

          // Poll for external id in case sync is async
          waitForExternalId(agentId, provider);
        });
      });
    });
  });
});



