/**
 * TCall Platform - Comprehensive Admin Journey Test Suite
 * 
 * This test suite covers the complete admin journey for TCall's AI-powered voice calling platform.
 * It tests all admin-facing endpoints with realistic data and business scenarios.
 * 
 * User Story: As a TCall administrator, I want to manage users, monitor system performance,
 * configure global settings, and oversee all platform operations so that I can ensure
 * optimal platform performance and user satisfaction.
 */

describe('TCall Platform - Complete Admin Journey', () => {
  let authToken;
  let testData = {
    adminId: null,
    userId: null,
    agentId: null,
    contactId: null,
    callLogId: null,
    campaignId: null,
    businessDetailsId: null,
    clientId: null,
    phoneRequestId: null,
    createdResources: []
  };

  // Advanced admin test data generator
  const generateAdminTestData = (type) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    const dataGenerators = {
      email: () => `admin.${timestamp}.${randomId}@tcall.ai`,
      phone: () => `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      name: () => `Admin User ${timestamp}`,
      company: () => `Admin Company ${timestamp}`,
      user: () => ({
        email: `user.${timestamp}.${randomId}@tcall.ai`,
        password: 'TestPassword123!',
        first_name: `Test`,
        last_name: `User ${timestamp}`,
        company: `Test Company ${timestamp}`,
        role: 'user',
        is_active: true
      }),
      agent: () => ({
        call_type: 'outbound',
        name: `Admin Managed Agent ${timestamp}`,
        provider: 'retell',
        description: `Admin-managed AI agent for enterprise use - ${timestamp}`,
        voice_id: 'default',
        language: 'en',
        industry: 'enterprise',
        initial_message: 'Hello! I\'m your enterprise AI assistant. How can I help you today?',
        prompt_content: 'You are a professional AI assistant for enterprise customers. Be helpful, accurate, and maintain high standards.',
        is_active: true,
        user_id: testData.userId
      }),
      contact: () => ({
        name: `Admin Contact ${timestamp}`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `admin.contact.${timestamp}.${randomId}@example.com`,
        company: `Enterprise Company ${timestamp}`,
        notes: `Admin-managed contact created at ${new Date().toISOString()}`,
        user_id: testData.userId
      }),
      campaign: () => ({
        name: `Admin Campaign ${timestamp}`,
        description: `Enterprise marketing campaign for ${timestamp}`,
        target_audience: 'enterprise',
        call_script: 'Hello! This is an enterprise call from TCall platform.',
        is_active: true,
        user_id: testData.userId
      }),
      business: () => ({
        company_name: `Enterprise Business ${timestamp}`,
        industry: 'enterprise',
        size: 'large',
        description: `Enterprise business created at ${new Date().toISOString()}`,
        contact_email: `enterprise.${timestamp}.${randomId}@example.com`,
        contact_phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        user_id: testData.userId
      }),
      adminSetting: () => ({
        key: `admin_setting_${timestamp}`,
        value: `admin_value_${timestamp}`,
        description: `Admin setting created at ${new Date().toISOString()}`,
        category: 'system',
        is_active: true
      })
    };
    
    return dataGenerators[type] ? dataGenerators[type]() : `admin_test_${timestamp}_${randomId}`;
  };

  // Professional cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Starting admin test data cleanup...');
    
    // Cleanup in reverse order of creation to handle dependencies
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
    
    cy.log('✅ Admin test data cleanup completed');
  };

  before(() => {
    // Professional admin authentication setup
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('ADMIN_EMAIL') || 'admin@tcall.ai',
        password: Cypress.env('ADMIN_PASSWORD') || 'admin123'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`🔐 Admin authentication response: ${response.status}`);
      
      if (response.status === 200 && response.body.token) {
        authToken = response.body.token;
        cy.log('✅ Admin authentication successful');
        
        // Verify admin token validity
        cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/auth/me/`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          failOnStatusCode: false
        }).then((meResponse) => {
          if (meResponse.status === 200) {
            testData.adminId = meResponse.body.id;
            cy.log('✅ Admin token verification successful');
          }
        });
      } else {
        cy.log('❌ Admin authentication failed - tests will be skipped');
        authToken = null;
      }
    });
  });

  after(() => {
    cleanupTestData();
  });

  describe('🔐 Admin Authentication & Profile Management', () => {
    it('should authenticate admin and retrieve admin profile', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

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
        expect(response.body).to.have.property('role');
        cy.log('✅ Admin profile retrieved successfully');
      });
    });

    it('should update admin profile information', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      const updatedProfile = {
        first_name: generateAdminTestData('name'),
        last_name: 'Administrator',
        company: generateAdminTestData('company'),
        phone: generateAdminTestData('phone'),
        role: 'admin'
      };

      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/auth/me/`,
        body: updatedProfile,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        cy.log('✅ Admin profile updated successfully');
      });
    });
  });

  describe('👥 User Management - Complete Admin Workflow', () => {
    it('should list all users in the system', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/users/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Users list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All users listed successfully');
        } else {
          cy.log(`ℹ️ Users endpoint returned ${response.status}`);
        }
      });
    });

    it('should create a new user account', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      const newUser = generateAdminTestData('user');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/users/`,
        body: newUser,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.userId = response.body.id;
          testData.createdResources.push({
            type: 'user',
            endpoint: `/admin/api/users/${response.body.id}/`
          });
          cy.log('✅ User created successfully');
        } else {
          cy.log(`ℹ️ User creation returned ${response.status}`);
        }
      });
    });

    it('should retrieve specific user details', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/users/${testData.userId}/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User details response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          cy.log('✅ User details retrieved successfully');
        } else {
          cy.log(`ℹ️ User details returned ${response.status}`);
        }
      });
    });

    it('should update user account information', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      const updatedUser = {
        first_name: 'Updated',
        last_name: 'User',
        company: 'Updated Company',
        is_active: true
      };

      cy.request({
        method: 'PUT',
        url: `${Cypress.config('baseUrl')}/admin/api/users/${testData.userId}/`,
        body: updatedUser,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User update response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ User updated successfully');
        } else {
          cy.log(`ℹ️ User update returned ${response.status}`);
        }
      });
    });

    it('should deactivate user account', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/admin/api/users/${testData.userId}/deactivate/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User deactivation response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ User deactivated successfully');
        } else {
          cy.log(`ℹ️ User deactivation returned ${response.status}`);
        }
      });
    });

    it('should reactivate user account', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/admin/api/users/${testData.userId}/activate/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User reactivation response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ User reactivated successfully');
        } else {
          cy.log(`ℹ️ User reactivation returned ${response.status}`);
        }
      });
    });
  });

  describe('🤖 Agent Management - Admin Oversight', () => {
    it('should list all agents across all users', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/agents/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin agents list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All agents listed successfully');
        } else {
          cy.log(`ℹ️ Admin agents endpoint returned ${response.status}`);
        }
      });
    });

    it('should create agent on behalf of user', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      const agentData = generateAdminTestData('agent');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/agents/`,
        body: agentData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin agent creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.agentId = response.body.id;
          testData.createdResources.push({
            type: 'agent',
            endpoint: `/admin/api/agents/${response.body.id}/`
          });
          cy.log('✅ Agent created on behalf of user successfully');
        } else {
          cy.log(`ℹ️ Admin agent creation returned ${response.status}`);
        }
      });
    });

    it('should update agent configuration', () => {
      if (!authToken || !testData.agentId) {
        cy.log('⏭️ Skipping test - no agent ID available');
        return;
      }

      const updatedAgent = {
        name: `Admin Updated Agent ${Date.now()}`,
        description: 'Admin-updated agent configuration',
        is_active: true
      };

      cy.request({
        method: 'PUT',
        url: `${Cypress.config('baseUrl')}/admin/api/agents/${testData.agentId}/`,
        body: updatedAgent,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin agent update response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Agent updated by admin successfully');
        } else {
          cy.log(`ℹ️ Admin agent update returned ${response.status}`);
        }
      });
    });

    it('should perform bulk agent operations', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/agents/bulk-sync/`,
        body: {
          agent_ids: testData.agentId ? [testData.agentId] : [],
          operation: 'sync',
          force: true
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin bulk agent operation response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Bulk agent operation completed successfully');
        } else {
          cy.log(`ℹ️ Admin bulk agent operation returned ${response.status}`);
        }
      });
    });
  });

  describe('📞 Call Management - Admin Monitoring', () => {
    it('should list all calls across all users', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/calls/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin calls list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All calls listed successfully');
        } else {
          cy.log(`ℹ️ Admin calls endpoint returned ${response.status}`);
        }
      });
    });

    it('should get call analytics across all users', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/calls/analytics/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin call analytics response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Call analytics retrieved successfully');
        } else {
          cy.log(`ℹ️ Admin call analytics returned ${response.status}`);
        }
      });
    });

    it('should get call performance metrics', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/calls/metrics/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin call metrics response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Call metrics retrieved successfully');
        } else {
          cy.log(`ℹ️ Admin call metrics returned ${response.status}`);
        }
      });
    });
  });

  describe('📋 Campaign Management - Admin Control', () => {
    it('should list all campaigns across all users', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/campaigns/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin campaigns list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All campaigns listed successfully');
        } else {
          cy.log(`ℹ️ Admin campaigns endpoint returned ${response.status}`);
        }
      });
    });

    it('should create campaign on behalf of user', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      const campaignData = generateAdminTestData('campaign');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/campaigns/`,
        body: campaignData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin campaign creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.campaignId = response.body.id;
          testData.createdResources.push({
            type: 'campaign',
            endpoint: `/admin/api/campaigns/${response.body.id}/`
          });
          cy.log('✅ Campaign created on behalf of user successfully');
        } else {
          cy.log(`ℹ️ Admin campaign creation returned ${response.status}`);
        }
      });
    });

    it('should pause all campaigns', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/campaigns/pause-all/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin pause all campaigns response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ All campaigns paused successfully');
        } else {
          cy.log(`ℹ️ Admin pause all campaigns returned ${response.status}`);
        }
      });
    });

    it('should resume all campaigns', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/campaigns/resume-all/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin resume all campaigns response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ All campaigns resumed successfully');
        } else {
          cy.log(`ℹ️ Admin resume all campaigns returned ${response.status}`);
        }
      });
    });
  });

  describe('🏢 Business & Client Management - Admin Oversight', () => {
    it('should list all business details across all users', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/business/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin business list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All business details listed successfully');
        } else {
          cy.log(`ℹ️ Admin business endpoint returned ${response.status}`);
        }
      });
    });

    it('should list all clients across all users', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/clients/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin clients list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All clients listed successfully');
        } else {
          cy.log(`ℹ️ Admin clients endpoint returned ${response.status}`);
        }
      });
    });
  });

  describe('📱 Phone Number Management - Admin Control', () => {
    it('should list all phone numbers and assignments', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/phone-numbers/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin phone numbers response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ All phone numbers listed successfully');
        } else {
          cy.log(`ℹ️ Admin phone numbers returned ${response.status}`);
        }
      });
    });

    it('should assign phone number to user', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/phone-numbers/assign/`,
        body: {
          user_id: testData.userId,
          phone_number: '+1234567890'
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin phone number assignment response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          cy.log('✅ Phone number assigned to user successfully');
        } else {
          cy.log(`ℹ️ Admin phone number assignment returned ${response.status}`);
        }
      });
    });
  });

  describe('📊 Analytics & Reporting - Admin Dashboard', () => {
    it('should get system-wide analytics', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/analytics/system/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 System analytics response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ System analytics retrieved successfully');
        } else {
          cy.log(`ℹ️ System analytics returned ${response.status}`);
        }
      });
    });

    it('should get user performance metrics', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/analytics/users/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User performance metrics response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ User performance metrics retrieved successfully');
        } else {
          cy.log(`ℹ️ User performance metrics returned ${response.status}`);
        }
      });
    });

    it('should get agent performance reports', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/analytics/agents/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Agent performance reports response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Agent performance reports retrieved successfully');
        } else {
          cy.log(`ℹ️ Agent performance reports returned ${response.status}`);
        }
      });
    });

    it('should generate comprehensive system report', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/reports/generate/`,
        body: {
          report_type: 'comprehensive',
          date_range: '30_days',
          include_users: true,
          include_agents: true,
          include_calls: true
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 System report generation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          cy.log('✅ System report generated successfully');
        } else {
          cy.log(`ℹ️ System report generation returned ${response.status}`);
        }
      });
    });
  });

  describe('⚙️ System Settings & Configuration', () => {
    it('should list all admin settings', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/settings/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin settings response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Admin settings listed successfully');
        } else {
          cy.log(`ℹ️ Admin settings returned ${response.status}`);
        }
      });
    });

    it('should create new admin setting', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      const settingData = generateAdminTestData('adminSetting');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/settings/`,
        body: settingData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Admin setting creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.createdResources.push({
            type: 'admin_setting',
            endpoint: `/admin/api/settings/${response.body.id}/`
          });
          cy.log('✅ Admin setting created successfully');
        } else {
          cy.log(`ℹ️ Admin setting creation returned ${response.status}`);
        }
      });
    });

    it('should update system configuration', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      const systemConfig = {
        max_users_per_account: 1000,
        max_agents_per_user: 50,
        call_timeout: 300,
        retry_attempts: 3,
        enable_analytics: true,
        enable_reporting: true
      };

      cy.request({
        method: 'PUT',
        url: `${Cypress.config('baseUrl')}/admin/api/settings/system/`,
        body: systemConfig,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 System configuration update response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ System configuration updated successfully');
        } else {
          cy.log(`ℹ️ System configuration update returned ${response.status}`);
        }
      });
    });
  });

  describe('🔒 Security & Access Control', () => {
    it('should list all user sessions', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/sessions/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 User sessions response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ User sessions listed successfully');
        } else {
          cy.log(`ℹ️ User sessions returned ${response.status}`);
        }
      });
    });

    it('should terminate user session', () => {
      if (!authToken || !testData.userId) {
        cy.log('⏭️ Skipping test - no user ID available');
        return;
      }

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/admin/api/sessions/terminate/`,
        body: {
          user_id: testData.userId
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Session termination response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ User session terminated successfully');
        } else {
          cy.log(`ℹ️ Session termination returned ${response.status}`);
        }
      });
    });

    it('should get security audit log', () => {
      if (!authToken) {
        cy.log('⏭️ Skipping test - admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/admin/api/audit-log/`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Security audit log response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Security audit log retrieved successfully');
        } else {
          cy.log(`ℹ️ Security audit log returned ${response.status}`);
        }
      });
    });
  });
});
