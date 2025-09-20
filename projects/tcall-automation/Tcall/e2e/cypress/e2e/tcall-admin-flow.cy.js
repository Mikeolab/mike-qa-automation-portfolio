/**
 * TCall Admin Flow Tests
 * 
 * Tests admin functionality including user management, system settings, and analytics
 * Environment: Staging (https://api.staging.tcall.ai:8006)
 */

describe('TCall Admin Flow Tests', () => {
  let adminToken;
  let testData = {
    adminUserId: null,
    managedUserId: null,
    systemSettingId: null,
    createdResources: []
  };

  // Test data cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Cleaning up admin test data...');
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
    });
  };

  before(() => {
    // Login as admin user
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('ADMIN_EMAIL') || 'admin@tcall.ai',
        password: Cypress.env('ADMIN_PASSWORD') || 'admin123'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
      adminToken = response.body.token;
      cy.log('🔐 Admin authentication successful');
    });
  });

  after(() => {
    cleanupTestData();
  });

  describe('👨‍💼 Admin Profile & Permissions', () => {
    it('should get admin profile with admin privileges', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/me/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('is_admin', true);
        testData.adminUserId = response.body.id;
        cy.log('✅ Admin profile retrieved successfully');
      });
    });

    it('should verify admin permissions', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/permissions/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('can_manage_users', true);
        expect(response.body).to.have.property('can_view_analytics', true);
        expect(response.body).to.have.property('can_manage_settings', true);
        cy.log('✅ Admin permissions verified successfully');
      });
    });
  });

  describe('👥 User Management', () => {
    it('should list all users', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/users/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        cy.log('✅ All users listed successfully');
      });
    });

    it('should create a new user', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/admin/users/`,
        body: {
          email: `managed.user.${Date.now()}@tcall.ai`,
          password: 'testpassword123',
          first_name: 'Managed',
          last_name: 'User',
          is_active: true,
          role: 'user'
        },
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        testData.managedUserId = response.body.id;
        testData.createdResources.push({
          type: 'user',
          endpoint: `/api/admin/users/${response.body.id}/`
        });
        cy.log('✅ New user created successfully');
      });
    });

    it('should update user details', () => {
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/admin/users/${testData.managedUserId}/`,
        body: {
          first_name: 'Updated',
          last_name: 'User',
          is_active: true
        },
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.first_name).to.equal('Updated');
        cy.log('✅ User details updated successfully');
      });
    });

    it('should get specific user details', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/users/${testData.managedUserId}/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', testData.managedUserId);
        cy.log('✅ User details retrieved successfully');
      });
    });
  });

  describe('⚙️ System Settings Management', () => {
    it('should get system settings', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/settings/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        cy.log('✅ System settings retrieved successfully');
      });
    });

    it('should update system settings', () => {
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/admin/settings/`,
        body: {
          max_calls_per_user: 1000,
          call_timeout: 300,
          webhook_enabled: true,
          analytics_retention_days: 90
        },
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.max_calls_per_user).to.equal(1000);
        cy.log('✅ System settings updated successfully');
      });
    });

    it('should get API rate limits', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/rate-limits/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('requests_per_minute');
        expect(response.body).to.have.property('requests_per_hour');
        cy.log('✅ API rate limits retrieved successfully');
      });
    });
  });

  describe('📊 System Analytics & Monitoring', () => {
    it('should get system-wide analytics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/analytics/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('total_users');
        expect(response.body).to.have.property('total_calls');
        expect(response.body).to.have.property('active_agents');
        cy.log('✅ System analytics retrieved successfully');
      });
    });

    it('should get user activity metrics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/analytics/users/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ User activity metrics retrieved successfully');
      });
    });

    it('should get call performance analytics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/analytics/calls/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success_rate');
        expect(response.body).to.have.property('average_duration');
        expect(response.body).to.have.property('total_calls');
        cy.log('✅ Call performance analytics retrieved successfully');
      });
    });

    it('should get system health status', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/health/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status', 'healthy');
        expect(response.body).to.have.property('database_status');
        expect(response.body).to.have.property('api_status');
        cy.log('✅ System health status retrieved successfully');
      });
    });
  });

  describe('🔐 Security & Audit', () => {
    it('should get audit logs', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/audit-logs/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ Audit logs retrieved successfully');
      });
    });

    it('should get security events', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/security-events/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ Security events retrieved successfully');
      });
    });

    it('should get API usage statistics', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/api-usage/`,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('total_requests');
        expect(response.body).to.have.property('requests_by_endpoint');
        cy.log('✅ API usage statistics retrieved successfully');
      });
    });
  });
});
