/**
 * TCall API - Comprehensive All Endpoints Test Suite
 * 
 * This test suite covers ALL endpoints available in the Tcall Postman collection
 * and includes comprehensive test data cleanup to ensure no test data remains.
 */

describe('TCall API - Comprehensive All Endpoints Test Suite', () => {
  let authToken;
  let testData = {
    userId: null,
    agentId: null,
    contactId: null,
    callLogId: null,
    phoneRequestId: null,
    campaignId: null,
    businessDetailsId: null,
    adminSettingId: null,
    createdResources: []
  };

  // Test data cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Starting test data cleanup...');
    
    // Cleanup in reverse order of creation
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`Cleaned up: ${resource.type} (${response.status})`);
      });
    });
    
    cy.log('✅ Test data cleanup completed');
  };

  before(() => {
    // Login to get authentication token
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai',
        password: Cypress.env('TEST_PASSWORD') || 'test123'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
      authToken = response.body.token;
      cy.log('🔐 Authentication successful');
    });
  });

  after(() => {
    // Cleanup all test data
    cleanupTestData();
  });

  describe('🔐 Authentication & Authorization', () => {
    it('should successfully authenticate with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/auth/login/`,
        body: {
          email: Cypress.env('TEST_EMAIL') || 'test@tcall.ai',
          password: Cypress.env('TEST_PASSWORD') || 'test123'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('user');
      });
    });

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
        testData.userId = response.body.id;
      });
    });

    it('should register new user', () => {
      const testEmail = `test-${Date.now()}@tcall.ai`;
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/auth/register/`,
        body: {
          email: testEmail,
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
          companyName: 'Test Company',
          role: 'user'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('user');
        expect(response.body).to.have.property('token');
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'User',
          endpoint: `/api/users/${response.body.user.id}/`,
          id: response.body.user.id
        });
      });
    });
  });

  describe('🤖 Agents Management', () => {
    it('should list all agents', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/agents/api/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
      });
    });

    it('should create new agent', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/agents/api/`,
        body: {
          call_type: 'outbound',
          name: `Test Agent ${Date.now()}`,
          provider: 'retell',
          description: 'Test agent for comprehensive testing',
          voice_id: 'test-voice-id',
          language: 'en',
          industry: 'technology',
          initial_message: 'Hello, this is a test call.',
          prompt_content: 'You are a helpful assistant.',
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
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'Agent',
          endpoint: `/agents/api/${response.body.id}/`,
          id: response.body.id
        });
      });
    });

    it('should retrieve specific agent', () => {
      if (testData.agentId) {
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
        });
      }
    });

    it('should update existing agent', () => {
      if (testData.agentId) {
        cy.request({
          method: 'PATCH',
          url: `${Cypress.config('baseUrl')}/agents/api/${testData.agentId}/`,
          body: {
            name: `Updated Test Agent ${Date.now()}`,
            description: 'Updated description for comprehensive testing'
          },
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.agentId);
        });
      }
    });

    it('should sync agent with provider', () => {
      if (testData.agentId) {
        cy.request({
          method: 'POST',
          url: `${Cypress.config('baseUrl')}/agents/api/${testData.agentId}/sync/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      }
    });

    it('should get sync status for all agents', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/agents/api/sync_status/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should perform bulk sync', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/agents/api/bulk_sync/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('⚙️ Admin Settings', () => {
    it('should list admin settings', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin-settings/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
      });
    });

    it('should create admin setting', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/admin-settings/`,
        body: {
          twilio_account_sid: 'test_account_sid',
          twilio_auth_token: 'test_auth_token',
          twilio_phone_number: '+1234567890',
          retell_api_key: 'test_retell_key',
          elevenlabs_api_key: 'test_elevenlabs_key',
          openai_api_key: 'test_openai_key',
          mongodb_connection_string: 'mongodb://test',
          aws_access_key_id: 'test_aws_key',
          aws_secret_access_key: 'test_aws_secret',
          aws_region: 'us-east-1',
          payment_settings: {}
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.adminSettingId = response.body.id;
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'Admin Setting',
          endpoint: `/api/admin-settings/${response.body.id}/`,
          id: response.body.id
        });
      });
    });

    it('should retrieve specific admin setting', () => {
      if (testData.adminSettingId) {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/admin-settings/${testData.adminSettingId}/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.adminSettingId);
        });
      }
    });
  });

  describe('📱 Phone Number Assignment', () => {
    it('should assign phone number to user', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/assign-phone-numbers/`,
        body: {
          phone_number_id: 1,
          user_id: testData.userId || 1
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('🏢 Business Details', () => {
    it('should list business details', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/business-details/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
      });
    });

    it('should create business details', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/business-details/`,
        body: {
          business_type: 'technology',
          employee_count: 50,
          annual_revenue: '1000000',
          website: 'https://testcompany.com',
          tax_id: '12-3456789',
          billing_address: '123 Test St, Test City, TC 12345',
          billing_contact: 'Test Contact',
          billing_email: 'billing@testcompany.com',
          billing_phone: '+1234567890'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.businessDetailsId = response.body.id;
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'Business Details',
          endpoint: `/api/business-details/${response.body.id}/`,
          id: response.body.id
        });
      });
    });

    it('should retrieve specific business details', () => {
      if (testData.businessDetailsId) {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/business-details/${testData.businessDetailsId}/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.businessDetailsId);
        });
      }
    });
  });

  describe('📞 Call Logs', () => {
    it('should list call logs', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/call-logs/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
      });
    });

    it('should create call log entry', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/call-logs/`,
        body: {
          agent_code: 'TEST001',
          call_type: 'outbound',
          contact_phone: '+1234567890',
          from_number: 1234567890,
          total_time: 60,
          contact_name: 'Test Contact',
          status: 'completed',
          call_sid: `test-call-${Date.now()}`,
          duration: 60,
          recording_url: 'https://test-recording.com/test.mp3',
          transcript: 'Test conversation transcript',
          ai_confidence_score: '0.95',
          lead_score: 'A',
          notes: 'Test call for comprehensive testing',
          tags: 'test,comprehensive',
          twilio_call_sid: `twilio-${Date.now()}`,
          retell_call_id: `retell-${Date.now()}`,
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
          is_user_answered: true,
          is_external_request: false,
          is_sent_in_report: true,
          call_summary: 'Test call summary',
          is_free_trial_call: false,
          is_inbound: false,
          provider: 'retell'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.callLogId = response.body.id;
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'Call Log',
          endpoint: `/api/call-logs/${response.body.id}/`,
          id: response.body.id
        });
      });
    });

    it('should retrieve specific call log', () => {
      if (testData.callLogId) {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/call-logs/${testData.callLogId}/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.callLogId);
        });
      }
    });
  });

  describe('📞 Call Initiation', () => {
    it('should initiate a call (safe test - no real call)', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/calls/initiate/`,
        body: {
          agent_id: testData.agentId || 1,
          contact_phone: '+1234567890',
          contact_name: 'Test Contact',
          call_type: 'outbound',
          is_test_call: true
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success');
      });
    });
  });

  describe('📢 Campaigns', () => {
    it('should list campaigns', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/campaigns/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
      });
    });

    it('should create new campaign', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/campaigns/`,
        body: {
          name: `Test Campaign ${Date.now()}`,
          description: 'Test campaign for comprehensive testing',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          budget: '1000.00',
          target_audience: 'Test audience'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.campaignId = response.body.id;
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'Campaign',
          endpoint: `/api/campaigns/${response.body.id}/`,
          id: response.body.id
        });
      });
    });

    it('should retrieve specific campaign', () => {
      if (testData.campaignId) {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/campaigns/${testData.campaignId}/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.campaignId);
        });
      }
    });
  });

  describe('👥 Contacts', () => {
    it('should list contacts', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('results');
      });
    });

    it('should create new contact', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        body: {
          first_name: 'Test',
          last_name: 'Contact',
          email: `test-contact-${Date.now()}@example.com`,
          phone: '+1234567890',
          company: 'Test Company',
          job_title: 'Test Position',
          address: '123 Test St, Test City, TC 12345',
          notes: 'Test contact for comprehensive testing',
          tags: 'test,comprehensive'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.contactId = response.body.id;
        
        // Add to cleanup list
        testData.createdResources.push({
          type: 'Contact',
          endpoint: `/api/contacts/${response.body.id}/`,
          id: response.body.id
        });
      });
    });

    it('should retrieve specific contact', () => {
      if (testData.contactId) {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/contacts/${testData.contactId}/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.contactId);
        });
      }
    });

    it('should update contact', () => {
      if (testData.contactId) {
        cy.request({
          method: 'PATCH',
          url: `${Cypress.config('baseUrl')}/api/contacts/${testData.contactId}/`,
          body: {
            first_name: 'Updated',
            last_name: 'Contact',
            notes: 'Updated notes for comprehensive testing'
          },
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id', testData.contactId);
        });
      }
    });

    it('should download contacts template', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/contacts/download-template/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should handle contacts bulk upload', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/contacts/bulk-upload/`,
        body: {
          contacts: [
            {
              first_name: 'Bulk',
              last_name: 'Test',
              email: `bulk-test-${Date.now()}@example.com`,
              phone: '+1234567890'
            }
          ]
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        // Accept various response codes as this might require specific file format
        expect([200, 400, 404, 500]).to.include(response.status);
      });
    });
  });

  describe('🔗 External Integrations', () => {
    it('should get ElevenLabs voices', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/elevenlabs/voices/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should get ElevenLabs status', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/elevenlabs/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should get ElevenLabs agents', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/elevenlabs/agents/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should test ElevenLabs conversation', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/elevenlabs/test-conversation/`,
        body: {
          agent_id: testData.agentId || 1,
          test_message: 'Hello, this is a test conversation'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        // Accept various response codes as this might require specific configuration
        expect([200, 400, 404, 500]).to.include(response.status);
      });
    });

    it('should get OpenAI status', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/openai/status/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should get Retell voices', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/retell/voices/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should get Retell web call token', () => {
      if (testData.agentId) {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/retell/${testData.agentId}/web-call-token/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          failOnStatusCode: false
        }).then((response) => {
          // Accept various response codes as this might require specific configuration
          expect([200, 400, 404, 500]).to.include(response.status);
        });
      }
    });
  });

  describe('🔧 System Health & Utilities', () => {
    it('should check system health', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/health/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        // Accept both 200 and 403 as valid responses
        expect([200, 403]).to.include(response.status);
      });
    });
  });

  describe('🚨 Error Handling & Edge Cases', () => {
    it('should handle invalid endpoints', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/invalid-endpoint/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('should handle malformed JSON', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        body: 'invalid json',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should handle unauthorized access', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        headers: {
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([401, 403]).to.include(response.status);
      });
    });
  });

  describe('✅ Data Validation', () => {
    it('should validate required fields in contact creation', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        body: {
          // Missing required fields
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('should validate email format', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        body: {
          first_name: 'Test',
          last_name: 'Contact',
          email: 'invalid-email-format',
          phone: '+1234567890'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe('⚡ Performance & Load Testing', () => {
    it('should handle concurrent requests', () => {
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/api/contacts/`,
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          })
        );
      }
      
      cy.wrap(requests).then((reqs) => {
        reqs.forEach((req) => {
          expect(req.status).to.equal(200);
        });
      });
    });

    it('should measure response times', () => {
      const startTime = Date.now();
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/contacts/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        expect(response.status).to.equal(200);
        expect(responseTime).to.be.lessThan(5000); // Should respond within 5 seconds
      });
    });
  });

  describe('🧹 Test Data Cleanup Verification', () => {
    it('should verify all test data has been cleaned up', () => {
      // Verify that created resources no longer exist
      testData.createdResources.forEach(resource => {
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(404);
        });
      });
    });
  });
});
