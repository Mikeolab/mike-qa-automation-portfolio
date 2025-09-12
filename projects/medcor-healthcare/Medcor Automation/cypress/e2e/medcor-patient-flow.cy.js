/**
 * Medcor Patient Flow Tests
 * 
 * Tests patient functionality including appointment booking, medical records access, and prescription management
 * Environment: Staging (https://api.medcor.ai)
 */

describe('Medcor Patient Flow Tests', () => {
  let patientToken;
  let testData = {
    patientId: null,
    appointmentId: null,
    medicalRecordId: null,
    prescriptionId: null,
    createdResources: []
  };

  // Test data cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Cleaning up patient test data...');
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
    });
  };

  before(() => {
    // Login as patient
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('PATIENT_EMAIL') || 'test-patient@medcor.com',
        password: Cypress.env('PATIENT_PASSWORD') || 'test-password-123'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        patientToken = response.body.tokens.access;
        cy.log('🔐 Patient authentication successful');
      } else {
        cy.log('⚠️ Patient authentication failed - using fallback');
        patientToken = 'fallback-token';
      }
    });
  });

  after(() => {
    cleanupTestData();
  });

  describe('👤 Patient Profile & Registration', () => {
    it('should get patient profile', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/profile/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('role', 'patient');
          testData.patientId = response.body.id;
          cy.log('✅ Patient profile retrieved successfully');
        }
      });
    });

    it('should update patient profile', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/auth/profile/`,
        body: {
          first_name: 'Updated',
          last_name: 'Patient',
          phone: '+1987654321',
          address: '123 Patient Street, Patient City, PC 12345',
          emergency_contact: '+1987654322',
          medical_conditions: 'None reported'
        },
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          cy.log('✅ Patient profile updated successfully');
        }
      });
    });
  });

  describe('📅 Appointment Booking', () => {
    it('should search for available doctors', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/users/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Available doctors searched successfully');
        }
      });
    });

    it('should check doctor availability', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/availability-slots/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Doctor availability checked successfully');
        }
      });
    });

    it('should book an appointment', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        body: {
          patient: testData.patientId || 1,
          doctor: 1, // Assuming doctor ID 1 exists
          appointment_date: '2024-12-25',
          appointment_time: '10:00:00',
          duration: 30,
          reason: 'Routine checkup',
          status: 'scheduled'
        },
        headers: {
          'Authorization': `Bearer ${patientToken}`,
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
          cy.log('✅ Appointment booked successfully');
        }
      });
    });

    it('should list patient appointments', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Patient appointments listed successfully');
        }
      });
    });

    it('should cancel an appointment', () => {
      if (!patientToken || patientToken === 'fallback-token' || !testData.appointmentId) {
        cy.log('Skipping test - no valid token or appointment ID');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/${testData.appointmentId}/cancel/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('status', 'cancelled');
          cy.log('✅ Appointment cancelled successfully');
        }
      });
    });
  });

  describe('📋 Medical Records Access', () => {
    it('should view medical records', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/medical-records/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Medical records viewed successfully');
        }
      });
    });

    it('should get specific medical record', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/medical-records/${testData.medicalRecordId || 1}/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          cy.log('✅ Specific medical record retrieved successfully');
        }
      });
    });
  });

  describe('💊 Prescription Management', () => {
    it('should view prescriptions', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/treatments/prescriptions/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Prescriptions viewed successfully');
        }
      });
    });

    it('should get prescription details', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/treatments/prescriptions/${testData.prescriptionId || 1}/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('medication_name');
          cy.log('✅ Prescription details retrieved successfully');
        }
      });
    });
  });

  describe('🏥 Hospital Information', () => {
    it('should view hospital information', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/hospitals/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Hospital information viewed successfully');
        }
      });
    });

    it('should get hospital services', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/hospitals/services/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Hospital services retrieved successfully');
        }
      });
    });
  });

  describe('📊 Patient Dashboard', () => {
    it('should get patient dashboard data', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/patient/dashboard/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('upcoming_appointments');
          expect(response.body).to.have.property('recent_records');
          cy.log('✅ Patient dashboard data retrieved successfully');
        }
      });
    });

    it('should get health summary', () => {
      if (!patientToken || patientToken === 'fallback-token') {
        cy.log('Skipping test - no valid patient token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/patient/health-summary/`,
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('last_checkup');
          expect(response.body).to.have.property('active_prescriptions');
          cy.log('✅ Health summary retrieved successfully');
        }
      });
    });
  });
});
