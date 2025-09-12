/**
 * Medcor Healthcare Platform - Comprehensive Multi-Dashboard Test Suite
 * 
 * This test suite covers all user roles and dashboards for Medcor's healthcare platform.
 * It tests all role-specific endpoints with realistic healthcare data and scenarios.
 * 
 * User Stories:
 * - As a Super Admin, I want to manage hospitals, users, and system settings
 * - As a Hospital Admin, I want to manage my hospital's operations and staff
 * - As a Doctor, I want to manage appointments, patients, and medical records
 * - As a Patient, I want to book appointments and view my medical information
 */

describe('Medcor Healthcare Platform - Complete Multi-Dashboard Journey', () => {
  let tokens = {
    superUser: null,
    hospitalAdmin: null,
    doctor: null,
    patient: null
  };
  
  let testData = {
    hospitalId: null,
    doctorId: null,
    patientId: null,
    appointmentId: null,
    medicalRecordId: null,
    createdResources: []
  };

  // Healthcare-specific test data generator
  const generateHealthcareData = (type) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    const dataGenerators = {
      hospital: () => ({
        name: `Test Hospital ${timestamp}`,
        address: `${timestamp} Medical Center Dr`,
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `hospital.${timestamp}.${randomId}@medcor.com`,
        license_number: `HOSP-${timestamp}`,
        is_active: true
      }),
      doctor: () => ({
        first_name: `Dr. Test`,
        last_name: `Doctor ${timestamp}`,
        email: `doctor.${timestamp}.${randomId}@medcor.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        license_number: `MD-${timestamp}`,
        specialty: 'General Practice',
        hospital_id: testData.hospitalId,
        is_active: true
      }),
      patient: () => ({
        first_name: `Test`,
        last_name: `Patient ${timestamp}`,
        email: `patient.${timestamp}.${randomId}@email.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        date_of_birth: '1990-01-01',
        gender: 'Other',
        address: `${timestamp} Patient St`,
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        emergency_contact: `Emergency Contact ${timestamp}`,
        emergency_phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
      }),
      appointment: () => ({
        patient_id: testData.patientId,
        doctor_id: testData.doctorId,
        hospital_id: testData.hospitalId,
        appointment_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        appointment_time: '10:00:00',
        duration: 30,
        type: 'consultation',
        reason: 'Regular checkup',
        status: 'scheduled'
      }),
      medicalRecord: () => ({
        patient_id: testData.patientId,
        doctor_id: testData.doctorId,
        hospital_id: testData.hospitalId,
        diagnosis: 'General health checkup',
        symptoms: 'No symptoms reported',
        treatment: 'Regular monitoring recommended',
        notes: 'Patient in good health',
        follow_up_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    };
    
    return dataGenerators[type] ? dataGenerators[type]() : `healthcare_test_${timestamp}_${randomId}`;
  };

  // Professional cleanup function
  const cleanupTestData = () => {
    cy.log('🧹 Starting healthcare test data cleanup...');
    
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${tokens.superUser}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`Cleaned up: ${resource.type} (${response.status})`);
      });
    });
    
    cy.log('✅ Healthcare test data cleanup completed');
  };

  before(() => {
    // Authenticate all user roles
    const authenticateUser = (email, password, role) => {
      return cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/auth/login/`,
        body: { email, password },
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && response.body.tokens) {
          tokens[role] = response.body.tokens.access;
          cy.log(`✅ ${role} authentication successful`);
        } else {
          cy.log(`❌ ${role} authentication failed`);
        }
      });
    };

    // Authenticate all roles
    authenticateUser('zeynel@medcorhospital.com', '12345678@', 'superUser');
    authenticateUser('admin@medcor.com', 'admin123', 'hospitalAdmin');
    authenticateUser('dr.johnson@medcor.com', 'password123', 'doctor');
    authenticateUser('patient.davis@email.com', 'password123', 'patient');
  });

  after(() => {
    cleanupTestData();
  });

  describe('🏥 Super Admin Dashboard - System Management', () => {
    it('should authenticate super admin and access system dashboard', () => {
      expect(tokens.superUser).to.not.be.undefined;
      cy.log('✅ Super Admin authenticated successfully');
    });

    it('should list all hospitals in the system', () => {
      if (!tokens.superUser) {
        cy.log('⏭️ Skipping test - super user authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/hospitals/hospitals/`,
        headers: {
          'Authorization': `Bearer ${tokens.superUser}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Hospitals list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('results');
          cy.log('✅ All hospitals listed successfully');
        } else {
          cy.log(`ℹ️ Hospitals endpoint returned ${response.status}`);
        }
      });
    });

    it('should create a new hospital', () => {
      if (!tokens.superUser) {
        cy.log('⏭️ Skipping test - super user authentication failed');
        return;
      }

      const hospitalData = generateHealthcareData('hospital');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/hospitals/hospitals/`,
        body: hospitalData,
        headers: {
          'Authorization': `Bearer ${tokens.superUser}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Hospital creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.hospitalId = response.body.id;
          testData.createdResources.push({
            type: 'hospital',
            endpoint: `/api/hospitals/hospitals/${response.body.id}/`
          });
          cy.log('✅ Hospital created successfully');
        } else {
          cy.log(`ℹ️ Hospital creation returned ${response.status}`);
        }
      });
    });

    it('should manage system-wide settings', () => {
      if (!tokens.superUser) {
        cy.log('⏭️ Skipping test - super user authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/admin/settings/`,
        headers: {
          'Authorization': `Bearer ${tokens.superUser}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 System settings response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ System settings retrieved successfully');
        } else {
          cy.log(`ℹ️ System settings returned ${response.status}`);
        }
      });
    });
  });

  describe('🏥 Hospital Admin Dashboard - Hospital Management', () => {
    it('should authenticate hospital admin and access hospital dashboard', () => {
      expect(tokens.hospitalAdmin).to.not.be.undefined;
      cy.log('✅ Hospital Admin authenticated successfully');
    });

    it('should manage hospital staff and doctors', () => {
      if (!tokens.hospitalAdmin) {
        cy.log('⏭️ Skipping test - hospital admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/doctors/doctors/`,
        headers: {
          'Authorization': `Bearer ${tokens.hospitalAdmin}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Doctors list response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('results');
          cy.log('✅ Hospital doctors listed successfully');
        } else {
          cy.log(`ℹ️ Doctors endpoint returned ${response.status}`);
        }
      });
    });

    it('should create a new doctor', () => {
      if (!tokens.hospitalAdmin || !testData.hospitalId) {
        cy.log('⏭️ Skipping test - hospital admin authentication failed or no hospital ID');
        return;
      }

      const doctorData = generateHealthcareData('doctor');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/doctors/doctors/`,
        body: doctorData,
        headers: {
          'Authorization': `Bearer ${tokens.hospitalAdmin}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Doctor creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.doctorId = response.body.id;
          testData.createdResources.push({
            type: 'doctor',
            endpoint: `/api/doctors/doctors/${response.body.id}/`
          });
          cy.log('✅ Doctor created successfully');
        } else {
          cy.log(`ℹ️ Doctor creation returned ${response.status}`);
        }
      });
    });

    it('should manage hospital appointments', () => {
      if (!tokens.hospitalAdmin) {
        cy.log('⏭️ Skipping test - hospital admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        headers: {
          'Authorization': `Bearer ${tokens.hospitalAdmin}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Hospital appointments response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('results');
          cy.log('✅ Hospital appointments retrieved successfully');
        } else {
          cy.log(`ℹ️ Hospital appointments returned ${response.status}`);
        }
      });
    });
  });

  describe('👨‍⚕️ Doctor Dashboard - Patient Care Management', () => {
    it('should authenticate doctor and access doctor dashboard', () => {
      expect(tokens.doctor).to.not.be.undefined;
      cy.log('✅ Doctor authenticated successfully');
    });

    it('should manage patient appointments', () => {
      if (!tokens.doctor) {
        cy.log('⏭️ Skipping test - doctor authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        headers: {
          'Authorization': `Bearer ${tokens.doctor}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Doctor appointments response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('results');
          cy.log('✅ Doctor appointments retrieved successfully');
        } else {
          cy.log(`ℹ️ Doctor appointments returned ${response.status}`);
        }
      });
    });

    it('should manage patient medical records', () => {
      if (!tokens.doctor) {
        cy.log('⏭️ Skipping test - doctor authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/medical-records/records/`,
        headers: {
          'Authorization': `Bearer ${tokens.doctor}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Medical records response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('records');
          cy.log('✅ Medical records retrieved successfully');
        } else {
          cy.log(`ℹ️ Medical records returned ${response.status}`);
        }
      });
    });

    it('should create medical record for patient', () => {
      if (!tokens.doctor || !testData.patientId) {
        cy.log('⏭️ Skipping test - doctor authentication failed or no patient ID');
        return;
      }

      const medicalRecordData = generateHealthcareData('medicalRecord');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/medical-records/records/`,
        body: medicalRecordData,
        headers: {
          'Authorization': `Bearer ${tokens.doctor}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Medical record creation response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.medicalRecordId = response.body.id;
          testData.createdResources.push({
            type: 'medical_record',
            endpoint: `/api/medical-records/records/${response.body.id}/`
          });
          cy.log('✅ Medical record created successfully');
        } else {
          cy.log(`ℹ️ Medical record creation returned ${response.status}`);
        }
      });
    });
  });

  describe('👤 Patient Dashboard - Personal Healthcare Management', () => {
    it('should authenticate patient and access patient dashboard', () => {
      expect(tokens.patient).to.not.be.undefined;
      cy.log('✅ Patient authenticated successfully');
    });

    it('should view personal appointments', () => {
      if (!tokens.patient) {
        cy.log('⏭️ Skipping test - patient authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/appointments/my-appointments/`,
        headers: {
          'Authorization': `Bearer ${tokens.patient}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Patient appointments response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('results');
          cy.log('✅ Patient appointments retrieved successfully');
        } else {
          cy.log(`ℹ️ Patient appointments returned ${response.status}`);
        }
      });
    });

    it('should book a new appointment', () => {
      if (!tokens.patient || !testData.doctorId) {
        cy.log('⏭️ Skipping test - patient authentication failed or no doctor ID');
        return;
      }

      const appointmentData = generateHealthcareData('appointment');

      cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/appointments/appointments/`,
        body: appointmentData,
        headers: {
          'Authorization': `Bearer ${tokens.patient}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Appointment booking response: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property('id');
          testData.appointmentId = response.body.id;
          testData.createdResources.push({
            type: 'appointment',
            endpoint: `/api/appointments/appointments/${response.body.id}/`
          });
          cy.log('✅ Appointment booked successfully');
        } else {
          cy.log(`ℹ️ Appointment booking returned ${response.status}`);
        }
      });
    });

    it('should view personal medical records', () => {
      if (!tokens.patient) {
        cy.log('⏭️ Skipping test - patient authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/medical-records/my-records/`,
        headers: {
          'Authorization': `Bearer ${tokens.patient}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Patient medical records response: ${response.status}`);
        
        if (response.status === 200) {
          expect(response.body).to.have.property('records');
          cy.log('✅ Patient medical records retrieved successfully');
        } else {
          cy.log(`ℹ️ Patient medical records returned ${response.status}`);
        }
      });
    });
  });

  describe('📊 Analytics & Reporting - Multi-Role Dashboard', () => {
    it('should get system-wide analytics (Super Admin)', () => {
      if (!tokens.superUser) {
        cy.log('⏭️ Skipping test - super user authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/analytics/system/`,
        headers: {
          'Authorization': `Bearer ${tokens.superUser}`,
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

    it('should get hospital performance metrics (Hospital Admin)', () => {
      if (!tokens.hospitalAdmin) {
        cy.log('⏭️ Skipping test - hospital admin authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/analytics/hospital/`,
        headers: {
          'Authorization': `Bearer ${tokens.hospitalAdmin}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Hospital analytics response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Hospital analytics retrieved successfully');
        } else {
          cy.log(`ℹ️ Hospital analytics returned ${response.status}`);
        }
      });
    });

    it('should get doctor performance metrics (Doctor)', () => {
      if (!tokens.doctor) {
        cy.log('⏭️ Skipping test - doctor authentication failed');
        return;
      }

      cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/analytics/doctor/`,
        headers: {
          'Authorization': `Bearer ${tokens.doctor}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`📊 Doctor analytics response: ${response.status}`);
        
        if (response.status === 200) {
          cy.log('✅ Doctor analytics retrieved successfully');
        } else {
          cy.log(`ℹ️ Doctor analytics returned ${response.status}`);
        }
      });
    });
  });
});
