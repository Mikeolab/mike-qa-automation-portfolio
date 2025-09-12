/**
 * TCall User Flow Tests
 * 
 * Tests the complete user journey from registration to making calls
 * Environment: Staging (https://api.staging.tcall.ai:8006)
 */

describe('TCall User Flow Tests', () => {
  let authToken;
  let testData = {
    userId: null,
    agentId: null,
    contactId: null,
    callLogId: null,
    createdResources: []
  };

  // Test data cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Cleaning up user test data...');
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
    });
  };

  before(() => {
    // Login as regular user
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('TEST_EMAIL') || 'test-user@tcall.ai',
        password: Cypress.env('TEST_PASSWORD') || 'test-password-123'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
      authToken = response.body.token;
      cy.log('🔐 User authentication successful');
    });
  });

  after(() => {
    cleanupTestData();
  });

  describe('👤 User Registration & Profile', () => {
    it('should get current user profile', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/me/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('email');
        testData.userId = response.body.id;
        cy.log('✅ User profile retrieved successfully');
      });
    });

    it('should update user profile', () => {
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/auth/me/`,
        body: {
          first_name: 'Test',
          last_name: 'User',
          phone: '+1234567890'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        cy.log('✅ User profile updated successfully');
      });
    });
  });

  describe('🤖 Agent Management', () => {
    it('should create a new AI agent', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/agents/api/`,
        body: {
          call_type: 'outbound',
          name: `Test Agent ${Date.now()}`,
          provider: 'retell',
          description: 'Test agent for user flow',
          voice_id: 'default',
          language: 'en',
          industry: 'technology',
          initial_message: 'Hello, this is a test call.',
          prompt_content: 'You are a helpful AI assistant.',
          is_active: true
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.agentId = response.body.id;
        testData.createdResources.push({
          type: 'agent',
          endpoint: `/agents/api/${response.body.id}/`
        });
        cy.log('✅ AI agent created successfully');
      });
    });

    it('should list user agents', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/agents/api/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ User agents listed successfully');
      });
    });

    it('should get specific agent details', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/agents/api/${testData.agentId}/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', testData.agentId);
        cy.log('✅ Agent details retrieved successfully');
      });
    });
  });

  describe('📞 Contact Management', () => {
    it('should create a new contact', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/contacts/api/`,
        body: {
          name: `Test Contact ${Date.now()}`,
          phone: '+1987654321',
          email: `contact${Date.now()}@test.com`,
          company: 'Test Company',
          notes: 'Test contact for user flow'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.contactId = response.body.id;
        testData.createdResources.push({
          type: 'contact',
          endpoint: `/contacts/api/${response.body.id}/`
        });
        cy.log('✅ Contact created successfully');
      });
    });

    it('should list user contacts', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/contacts/api/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ User contacts listed successfully');
      });
    });
  });

  describe('📱 Call Management', () => {
    it('should initiate a call', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/calls/api/`,
        body: {
          agent_id: testData.agentId,
          contact_id: testData.contactId,
          call_type: 'outbound',
          phone_number: '+1987654321'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.callLogId = response.body.id;
        testData.createdResources.push({
          type: 'call',
          endpoint: `/calls/api/${response.body.id}/`
        });
        cy.log('✅ Call initiated successfully');
      });
    });

    it('should get call logs', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/calls/api/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ Call logs retrieved successfully');
      });
    });

    it('should get specific call details', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/calls/api/${testData.callLogId}/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', testData.callLogId);
        cy.log('✅ Call details retrieved successfully');
      });
    });
  });

  describe('📊 Analytics & Reports', () => {
    it('should get user analytics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/analytics/api/user/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('total_calls');
        expect(response.body).to.have.property('successful_calls');
        cy.log('✅ User analytics retrieved successfully');
      });
    });

    it('should get call performance metrics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/analytics/api/calls/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ Call performance metrics retrieved successfully');
      });
    });
  });
});
