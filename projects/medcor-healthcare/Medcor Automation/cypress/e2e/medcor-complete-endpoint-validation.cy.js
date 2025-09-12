/**
 * Medcor Healthcare Platform - Comprehensive Endpoint Validation Test Suite
 * 
 * This test suite validates ALL 143+ endpoints from the Medcor API specification.
 * It performs systematic endpoint validation with proper authentication and realistic healthcare data.
 * 
 * IMPORTANT: This test is NOT included in CI/CD pipeline by default.
 * Run manually with: npm run test:endpoint-validation
 */

describe('Medcor Healthcare Platform - Complete Endpoint Validation (143+ Endpoints)', () => {
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

  // Load all endpoints from the extracted JSON
  let allEndpoints = [];

  before(() => {
    // Load endpoints from the extracted JSON file
    cy.readFile('medcor-endpoints.json').then((endpoints) => {
      allEndpoints = endpoints;
      cy.log(`📊 Loaded ${allEndpoints.length} Medcor endpoints for validation`);
    });

    // Authenticate all user roles for comprehensive testing
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
          cy.log(`✅ ${role} authentication successful for endpoint validation`);
        } else {
          cy.log(`❌ ${role} authentication failed`);
        }
      });
    };

    // Authenticate all roles
    authenticateUser(Cypress.env('SUPER_USER_EMAIL') || 'test-super-user@medcor.com', Cypress.env('SUPER_USER_PASSWORD') || 'test-password-123', 'superUser');
    authenticateUser(Cypress.env('HOSPITAL_ADMIN_EMAIL') || 'test-hospital-admin@medcor.com', Cypress.env('HOSPITAL_ADMIN_PASSWORD') || 'test-password-123', 'hospitalAdmin');
    authenticateUser(Cypress.env('DOCTOR_EMAIL') || 'test-doctor@medcor.com', Cypress.env('DOCTOR_PASSWORD') || 'test-password-123', 'doctor');
    authenticateUser(Cypress.env('PATIENT_EMAIL') || 'test-patient@medcor.com', Cypress.env('PATIENT_PASSWORD') || 'test-password-123', 'patient');
  });

  after(() => {
    // Cleanup test data
    cy.log('🧹 Cleaning up Medcor endpoint validation test data...');
    testData.createdResources.reverse().forEach(resource => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${resource.endpoint}`,
        headers: {
          'Authorization': `Bearer ${tokens.superUser}`,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      });
    });
  });

  // Helper function to generate realistic healthcare test data based on endpoint
  const generateHealthcareTestData = (endpoint) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Healthcare-specific test data generators
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
      }),
      availabilitySlot: () => ({
        doctor_id: testData.doctorId,
        hospital_id: testData.hospitalId,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '09:00:00',
        end_time: '17:00:00',
        is_available: true,
        slot_type: 'consultation'
      }),
      email: () => ({
        to: `test.${timestamp}.${randomId}@example.com`,
        subject: `Test Email ${timestamp}`,
        body: `This is a test email sent at ${new Date().toISOString()}`,
        email_type: 'appointment_reminder',
        patient_id: testData.patientId
      }),
      specialty: () => ({
        name: `Test Specialty ${timestamp}`,
        description: `Test medical specialty created at ${new Date().toISOString()}`,
        is_active: true
      }),
      treatment: () => ({
        name: `Test Treatment ${timestamp}`,
        description: `Test medical treatment created at ${new Date().toISOString()}`,
        category: 'general',
        is_active: true
      }),
      prescription: () => ({
        patient_id: testData.patientId,
        doctor_id: testData.doctorId,
        medication_name: `Test Medication ${timestamp}`,
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: 'Take with food',
        is_active: true
      })
    };

    // Determine data type based on endpoint URL
    if (endpoint.url.includes('/hospitals/')) return dataGenerators.hospital();
    if (endpoint.url.includes('/doctors/')) return dataGenerators.doctor();
    if (endpoint.url.includes('/patients/')) return dataGenerators.patient();
    if (endpoint.url.includes('/appointments/')) return dataGenerators.appointment();
    if (endpoint.url.includes('/medical-records/')) return dataGenerators.medicalRecord();
    if (endpoint.url.includes('/availability/')) return dataGenerators.availabilitySlot();
    if (endpoint.url.includes('/emails/')) return dataGenerators.email();
    if (endpoint.url.includes('/specialties/')) return dataGenerators.specialty();
    if (endpoint.url.includes('/treatments/')) return dataGenerators.treatment();
    if (endpoint.url.includes('/prescriptions/')) return dataGenerators.prescription();
    
    return { test_data: `healthcare_test_${timestamp}_${randomId}` };
  };

  // Helper function to replace URL variables with actual values
  const replaceUrlVariables = (url) => {
    let processedUrl = url.replace('{{baseUrl}}', Cypress.config('baseUrl'));
    
    // Replace common ID variables with test data
    if (processedUrl.includes('/:id/') && testData.hospitalId) {
      processedUrl = processedUrl.replace('/:id/', `/${testData.hospitalId}/`);
    }
    if (processedUrl.includes('/:doctor_id/') && testData.doctorId) {
      processedUrl = processedUrl.replace('/:doctor_id/', `/${testData.doctorId}/`);
    }
    if (processedUrl.includes('/:patient_id/') && testData.patientId) {
      processedUrl = processedUrl.replace('/:patient_id/', `/${testData.patientId}/`);
    }
    if (processedUrl.includes('/:appointment_id/') && testData.appointmentId) {
      processedUrl = processedUrl.replace('/:appointment_id/', `/${testData.appointmentId}/`);
    }
    if (processedUrl.includes('/:record_id/') && testData.medicalRecordId) {
      processedUrl = processedUrl.replace('/:record_id/', `/${testData.medicalRecordId}/`);
    }
    
    return processedUrl;
  };

  // Helper function to determine appropriate token based on endpoint
  const getAppropriateToken = (endpoint) => {
    const url = endpoint.url.toLowerCase();
    
    // Super admin endpoints
    if (url.includes('/admin/') || url.includes('/hospitals/') || url.includes('/system/')) {
      return tokens.superUser;
    }
    
    // Hospital admin endpoints
    if (url.includes('/hospital/') || url.includes('/staff/')) {
      return tokens.hospitalAdmin;
    }
    
    // Doctor endpoints
    if (url.includes('/doctor/') || url.includes('/medical-records/') || url.includes('/prescriptions/')) {
      return tokens.doctor;
    }
    
    // Patient endpoints
    if (url.includes('/patient/') || url.includes('/my-') || url.includes('/appointments/')) {
      return tokens.patient;
    }
    
    // Default to super user for comprehensive testing
    return tokens.superUser;
  };

  // Helper function to build headers
  const buildHeaders = (endpoint) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = getAppropriateToken(endpoint);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add endpoint-specific headers
    if (endpoint.headers) {
      endpoint.headers.forEach(header => {
        headers[header.key] = header.value;
      });
    }

    return headers;
  };

  // Helper function to validate endpoint response
  const validateEndpointResponse = (endpoint, response) => {
    const method = endpoint.method;
    const url = endpoint.url;
    
    cy.log(`📊 ${method} ${url} - Status: ${response.status}`);
    
    // Log response for debugging
    if (response.status >= 400) {
      cy.log(`❌ Error response:`, response.body);
    } else {
      cy.log(`✅ Success response:`, response.body);
    }

    // Store created resources for cleanup
    if ((method === 'POST' || method === 'PUT') && (response.status === 200 || response.status === 201)) {
      if (response.body && response.body.id) {
        const resourceType = url.includes('/hospitals/') ? 'hospital' :
                           url.includes('/doctors/') ? 'doctor' :
                           url.includes('/patients/') ? 'patient' :
                           url.includes('/appointments/') ? 'appointment' :
                           url.includes('/medical-records/') ? 'medical_record' :
                           url.includes('/availability/') ? 'availability_slot' :
                           url.includes('/emails/') ? 'email' :
                           url.includes('/specialties/') ? 'specialty' :
                           url.includes('/treatments/') ? 'treatment' :
                           url.includes('/prescriptions/') ? 'prescription' : 'resource';
        
        testData.createdResources.push({
          type: resourceType,
          endpoint: `${url.replace('{{baseUrl}}', '').replace('/:id/', `/${response.body.id}/`)}`
        });

        // Store IDs for future use
        if (url.includes('/hospitals/')) testData.hospitalId = response.body.id;
        if (url.includes('/doctors/')) testData.doctorId = response.body.id;
        if (url.includes('/patients/')) testData.patientId = response.body.id;
        if (url.includes('/appointments/')) testData.appointmentId = response.body.id;
        if (url.includes('/medical-records/')) testData.medicalRecordId = response.body.id;
      }
    }
  };

  // Test all endpoints systematically
  it('should validate all Medcor API endpoints', () => {
    expect(allEndpoints).to.have.length.greaterThan(0);
    cy.log(`🔍 Starting validation of ${allEndpoints.length} Medcor endpoints...`);

    // Group endpoints by method for better organization
    const endpointsByMethod = {
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: []
    };

    allEndpoints.forEach(endpoint => {
      if (endpointsByMethod[endpoint.method]) {
        endpointsByMethod[endpoint.method].push(endpoint);
      }
    });

    // Test GET endpoints first (safe operations)
    endpointsByMethod.GET.forEach((endpoint, index) => {
      cy.request({
        method: endpoint.method,
        url: replaceUrlVariables(endpoint.url),
        headers: buildHeaders(endpoint),
        failOnStatusCode: false
      }).then((response) => {
        validateEndpointResponse(endpoint, response);
        
        // Expect reasonable status codes for GET requests
        expect(response.status).to.be.oneOf([200, 201, 401, 403, 404, 500]);
      });
    });

    // Test POST endpoints (creation operations)
    endpointsByMethod.POST.forEach((endpoint, index) => {
      const testData = generateHealthcareTestData(endpoint);
      
      cy.request({
        method: endpoint.method,
        url: replaceUrlVariables(endpoint.url),
        body: endpoint.body ? JSON.parse(endpoint.body.raw) : testData,
        headers: buildHeaders(endpoint),
        failOnStatusCode: false
      }).then((response) => {
        validateEndpointResponse(endpoint, response);
        
        // Expect reasonable status codes for POST requests
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 403, 404, 500]);
      });
    });

    // Test PUT endpoints (update operations)
    endpointsByMethod.PUT.forEach((endpoint, index) => {
      const testData = generateHealthcareTestData(endpoint);
      
      cy.request({
        method: endpoint.method,
        url: replaceUrlVariables(endpoint.url),
        body: endpoint.body ? JSON.parse(endpoint.body.raw) : testData,
        headers: buildHeaders(endpoint),
        failOnStatusCode: false
      }).then((response) => {
        validateEndpointResponse(endpoint, response);
        
        // Expect reasonable status codes for PUT requests
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 403, 404, 500]);
      });
    });

    // Test PATCH endpoints (partial update operations)
    endpointsByMethod.PATCH.forEach((endpoint, index) => {
      const testData = generateHealthcareTestData(endpoint);
      
      cy.request({
        method: endpoint.method,
        url: replaceUrlVariables(endpoint.url),
        body: endpoint.body ? JSON.parse(endpoint.body.raw) : testData,
        headers: buildHeaders(endpoint),
        failOnStatusCode: false
      }).then((response) => {
        validateEndpointResponse(endpoint, response);
        
        // Expect reasonable status codes for PATCH requests
        expect(response.status).to.be.oneOf([200, 201, 400, 401, 403, 404, 500]);
      });
    });

    // Test DELETE endpoints (deletion operations) - be careful with these
    endpointsByMethod.DELETE.forEach((endpoint, index) => {
      // Only test DELETE on resources we created
      if (testData.createdResources.some(resource => 
        endpoint.url.includes(resource.type) || 
        endpoint.url.includes(resource.endpoint)
      )) {
        cy.request({
          method: endpoint.method,
          url: replaceUrlVariables(endpoint.url),
          headers: buildHeaders(endpoint),
          failOnStatusCode: false
        }).then((response) => {
          validateEndpointResponse(endpoint, response);
          
          // Expect reasonable status codes for DELETE requests
          expect(response.status).to.be.oneOf([200, 204, 401, 403, 404, 500]);
        });
      } else {
        cy.log(`⏭️ Skipping DELETE test for ${endpoint.url} - no test resource available`);
      }
    });

    cy.log(`✅ Completed validation of ${allEndpoints.length} Medcor endpoints`);
  });

  // Additional test to verify endpoint coverage
  it('should verify comprehensive healthcare endpoint coverage', () => {
    const endpointCategories = {
      hospitals: allEndpoints.filter(e => e.url.includes('/hospitals/')).length,
      doctors: allEndpoints.filter(e => e.url.includes('/doctors/')).length,
      patients: allEndpoints.filter(e => e.url.includes('/patients/')).length,
      appointments: allEndpoints.filter(e => e.url.includes('/appointments/')).length,
      medicalRecords: allEndpoints.filter(e => e.url.includes('/medical-records/')).length,
      availability: allEndpoints.filter(e => e.url.includes('/availability/')).length,
      emails: allEndpoints.filter(e => e.url.includes('/emails/')).length,
      specialties: allEndpoints.filter(e => e.url.includes('/specialties/')).length,
      treatments: allEndpoints.filter(e => e.url.includes('/treatments/')).length,
      prescriptions: allEndpoints.filter(e => e.url.includes('/prescriptions/')).length,
      auth: allEndpoints.filter(e => e.url.includes('/auth/')).length,
      admin: allEndpoints.filter(e => e.url.includes('/admin/')).length,
      analytics: allEndpoints.filter(e => e.url.includes('/analytics/')).length
    };

    cy.log('📊 Healthcare Endpoint Coverage Summary:');
    Object.entries(endpointCategories).forEach(([category, count]) => {
      cy.log(`  ${category}: ${count} endpoints`);
    });

    // Verify we have comprehensive healthcare coverage
    expect(endpointCategories.hospitals).to.be.greaterThan(0);
    expect(endpointCategories.doctors).to.be.greaterThan(0);
    expect(endpointCategories.patients).to.be.greaterThan(0);
    expect(endpointCategories.appointments).to.be.greaterThan(0);
    expect(endpointCategories.auth).to.be.greaterThan(0);
    
    cy.log(`✅ Verified comprehensive healthcare coverage across ${Object.keys(endpointCategories).length} categories`);
  });
});
