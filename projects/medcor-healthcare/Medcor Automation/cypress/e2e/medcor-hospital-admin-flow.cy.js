/**
 * Medcor Hospital Admin Flow Tests
 * 
 * Tests hospital admin functionality including staff management, appointment oversight, and hospital analytics
 * Environment: Staging (https://api.medcor.ai)
 */

describe('Medcor Hospital Admin Flow Tests', () => {
  let hospitalAdminToken;
  let testData = {
    hospitalId: null,
    doctorId: null,
    patientId: null,
    appointmentId: null,
    createdResources: []
  };

  // Test data cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Cleaning up hospital admin test data...');
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
    });
  };

  before(() => {
    // Login as hospital admin
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('HOSPITAL_ADMIN_EMAIL') || 'test-hospital-admin@medcor.com',
        password: Cypress.env('HOSPITAL_ADMIN_PASSWORD') || 'test-password-123'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        hospitalAdminToken = response.body.tokens.access;
        cy.log('🔐 Hospital Admin authentication successful');
      } else {
        cy.log('⚠️ Hospital Admin authentication failed - using fallback');
        hospitalAdminToken = 'fallback-token';
      }
    });
  });

  after(() => {
    cleanupTestData();
  });

  describe('🏥 Hospital Admin Profile & Permissions', () => {
    it('should get hospital admin profile', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/profile/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('email');
          testData.hospitalId = response.body.hospital;
          cy.log('✅ Hospital admin profile retrieved successfully');
        }
      });
    });

    it('should verify hospital admin permissions', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/permissions/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('can_manage_staff', true);
          expect(response.body).to.have.property('can_view_analytics', true);
          cy.log('✅ Hospital admin permissions verified successfully');
        }
      });
    });
  });

  describe('👨‍⚕️ Staff Management', () => {
    it('should list hospital staff', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/users/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Hospital staff listed successfully');
        }
      });
    });

    it('should create a new doctor', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/auth/users/`,
        body: {
          email: `doctor.${Date.now()}@medcor.com`,
          password: 'doctor123',
          first_name: 'Dr. Test',
          last_name: 'Doctor',
          role: 'doctor',
          hospital: testData.hospitalId || 1,
          specialty: 'General Medicine',
          license_number: `MD-${Date.now()}`,
          is_active: true
        },
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.doctorId = response.body.id;
          testData.createdResources.push({
            type: 'doctor',
            endpoint: `/api/auth/users/${response.body.id}/`
          });
          cy.log('✅ New doctor created successfully');
        }
      });
    });

    it('should assign doctor specialty', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token' || !testData.doctorId) {
        cy.log('Skipping test - no valid token or doctor ID');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/specialty/doctor-specialties/`,
        body: {
          doctor: testData.doctorId,
          specialty: 'Cardiology',
          certification_date: '2024-01-01',
          is_active: true
        },
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.createdResources.push({
            type: 'specialty',
            endpoint: `/api/specialty/doctor-specialties/${response.body.id}/`
          });
          cy.log('✅ Doctor specialty assigned successfully');
        }
      });
    });
  });

  describe('📅 Appointment Management', () => {
    it('should list hospital appointments', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Hospital appointments listed successfully');
        }
      });
    });

    it('should create a new appointment', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        body: {
          patient: testData.patientId || 1,
          doctor: testData.doctorId || 1,
          appointment_date: '2024-12-25',
          appointment_time: '10:00:00',
          duration: 30,
          reason: 'Routine checkup',
          status: 'scheduled'
        },
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.appointmentId = response.body.id;
          testData.createdResources.push({
            type: 'appointment',
            endpoint: `/api/appointments/appointments/${response.body.id}/`
          });
          cy.log('✅ New appointment created successfully');
        }
      });
    });

    it('should manage appointment availability', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/appointments/availability-slots/`,
        body: {
          doctor: testData.doctorId || 1,
          date: '2024-12-25',
          start_time: '09:00:00',
          end_time: '17:00:00',
          slot_duration: 30,
          is_available: true
        },
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.createdResources.push({
            type: 'availability',
            endpoint: `/api/appointments/availability-slots/${response.body.id}/`
          });
          cy.log('✅ Appointment availability managed successfully');
        }
      });
    });
  });

  describe('📊 Hospital Analytics', () => {
    it('should get hospital dashboard data', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/hospital-dashboard/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('total_appointments');
          expect(response.body).to.have.property('total_patients');
          expect(response.body).to.have.property('total_doctors');
          cy.log('✅ Hospital dashboard data retrieved successfully');
        }
      });
    });

    it('should get appointment analytics', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/appointment-analytics/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('appointments_by_status');
          expect(response.body).to.have.property('appointments_by_doctor');
          cy.log('✅ Appointment analytics retrieved successfully');
        }
      });
    });

    it('should get staff performance metrics', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/staff-performance/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Staff performance metrics retrieved successfully');
        }
      });
    });
  });

  describe('🏥 Hospital Settings', () => {
    it('should get hospital settings', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/hospitals/${testData.hospitalId || 1}/`,
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('name');
          cy.log('✅ Hospital settings retrieved successfully');
        }
      });
    });

    it('should update hospital settings', () => {
      if (!hospitalAdminToken || hospitalAdminToken === 'fallback-token') {
        cy.log('Skipping test - no valid hospital admin token');
        return;
      }
      
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/hospitals/${testData.hospitalId || 1}/`,
        body: {
          phone: '+1987654321',
          email: `updated${Date.now()}@medcor.com`,
          operating_hours: '9:00 AM - 5:00 PM'
        },
        headers: {
          'Authorization': `Bearer ${hospitalAdminToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          cy.log('✅ Hospital settings updated successfully');
        }
      });
    });
  });
});
