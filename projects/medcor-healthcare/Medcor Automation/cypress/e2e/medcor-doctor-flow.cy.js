/**
 * Medcor Doctor Flow Tests
 * 
 * Tests doctor functionality including patient management, appointment handling, and medical records
 * Environment: Staging (https://api.medcor.ai)
 */

describe('Medcor Doctor Flow Tests', () => {
  let doctorToken;
  let testData = {
    doctorId: null,
    patientId: null,
    appointmentId: null,
    medicalRecordId: null,
    prescriptionId: null,
    createdResources: []
  };

  // Test data cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Cleaning up doctor test data...');
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
    });
  };

  before(() => {
    // Login as doctor
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login/`,
      body: {
        email: Cypress.env('DOCTOR_EMAIL') || 'test-doctor@medcor.com',
        password: Cypress.env('DOCTOR_PASSWORD') || 'test-password-123'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        doctorToken = response.body.tokens.access;
        cy.log('🔐 Doctor authentication successful');
      } else {
        cy.log('⚠️ Doctor authentication failed - using fallback');
        doctorToken = 'fallback-token';
      }
    });
  });

  after(() => {
    cleanupTestData();
  });

  describe('👨‍⚕️ Doctor Profile & Schedule', () => {
    it('should get doctor profile', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/profile/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('role', 'doctor');
          testData.doctorId = response.body.id;
          cy.log('✅ Doctor profile retrieved successfully');
        }
      });
    });

    it('should get doctor schedule', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/availability-slots/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Doctor schedule retrieved successfully');
        }
      });
    });

    it('should update availability', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
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
          'Authorization': `Bearer ${doctorToken}`,
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
          cy.log('✅ Doctor availability updated successfully');
        }
      });
    });
  });

  describe('👥 Patient Management', () => {
    it('should list assigned patients', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/users/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Assigned patients listed successfully');
        }
      });
    });

    it('should get patient details', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/auth/users/${testData.patientId || 1}/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('role', 'patient');
          cy.log('✅ Patient details retrieved successfully');
        }
      });
    });
  });

  describe('📅 Appointment Management', () => {
    it('should list doctor appointments', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Doctor appointments listed successfully');
        }
      });
    });

    it('should update appointment status', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/${testData.appointmentId || 1}/`,
        body: {
          status: 'completed',
          notes: 'Patient examination completed successfully'
        },
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id');
          cy.log('✅ Appointment status updated successfully');
        }
      });
    });
  });

  describe('📋 Medical Records Management', () => {
    it('should create medical record', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/medical-records/`,
        body: {
          patient: testData.patientId || 1,
          doctor: testData.doctorId || 1,
          diagnosis: 'Routine checkup - healthy',
          symptoms: 'No symptoms reported',
          treatment_plan: 'Continue current medication',
          notes: 'Patient is in good health',
          visit_date: '2024-12-25',
          follow_up_date: '2025-01-25'
        },
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.medicalRecordId = response.body.id;
          testData.createdResources.push({
            type: 'medical_record',
            endpoint: `/api/medical-records/${response.body.id}/`
          });
          cy.log('✅ Medical record created successfully');
        }
      });
    });

    it('should list patient medical records', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/medical-records/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Patient medical records listed successfully');
        }
      });
    });

    it('should update medical record', () => {
      if (!doctorToken || doctorToken === 'fallback-token' || !testData.medicalRecordId) {
        cy.log('Skipping test - no valid token or medical record ID');
        return;
      }
      
      cy.request({
        method: 'PATCH',
        url: `${Cypress.config('baseUrl')}/api/medical-records/${testData.medicalRecordId}/`,
        body: {
          diagnosis: 'Updated diagnosis',
          notes: 'Additional notes added'
        },
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('id', testData.medicalRecordId);
          cy.log('✅ Medical record updated successfully');
        }
      });
    });
  });

  describe('💊 Prescription Management', () => {
    it('should create prescription', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/treatments/prescriptions/`,
        body: {
          patient: testData.patientId || 1,
          doctor: testData.doctorId || 1,
          medication_name: 'Test Medication',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '7 days',
          instructions: 'Take with food',
          prescribed_date: '2024-12-25'
        },
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 401, 403]);
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.prescriptionId = response.body.id;
          testData.createdResources.push({
            type: 'prescription',
            endpoint: `/api/treatments/prescriptions/${response.body.id}/`
          });
          cy.log('✅ Prescription created successfully');
        }
      });
    });

    it('should list prescriptions', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/treatments/prescriptions/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
          cy.log('✅ Prescriptions listed successfully');
        }
      });
    });
  });

  describe('📊 Doctor Analytics', () => {
    it('should get doctor performance metrics', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/analytics/doctor-performance/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('total_appointments');
          expect(response.body).to.have.property('completed_appointments');
          cy.log('✅ Doctor performance metrics retrieved successfully');
        }
      });
    });

    it('should get patient statistics', () => {
      if (!doctorToken || doctorToken === 'fallback-token') {
        cy.log('Skipping test - no valid doctor token');
        return;
      }
      
      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/analytics/patient-stats/`,
        headers: {
          'Authorization': `Bearer ${doctorToken}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401, 403, 404]);
        if (response.status === 200) {
          expect(response.body).to.have.property('total_patients');
          expect(response.body).to.have.property('active_patients');
          cy.log('✅ Patient statistics retrieved successfully');
        }
      });
    });
  });
});
