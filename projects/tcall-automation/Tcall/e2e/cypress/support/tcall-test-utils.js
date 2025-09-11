// cypress/support/tcall-test-utils.js
// Test utilities and helpers for Tcall API testing

// ===== Test Data Generators =====
export const TestDataGenerator = {
  // Generate unique email for testing
  generateUniqueEmail() {
    return `test.${Date.now()}.${Math.random().toString(36).substr(2, 9)}@tcall.ai`;
  },

  // Generate test phone number
  generatePhoneNumber() {
    return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  },

  // Generate test contact data
  generateContactData() {
    return {
      name: `Test Contact ${Date.now()}`,
      phone_number: this.generatePhoneNumber(),
      email: this.generateUniqueEmail(),
      company: `Test Company ${Date.now()}`
    };
  },

  // Generate test agent data
  generateAgentData() {
    return {
      call_type: "outbound",
      name: `Test Agent ${Date.now()}`,
      provider: "retell",
      description: "Test agent for QA automation",
      voice_id: "test_voice_123",
      language: "en",
      industry: "technology",
      initial_message: "Hello, this is a test call from QA automation",
      prompt_content: "You are a helpful assistant for testing purposes",
      is_active: true
    };
  },

  // Generate test campaign data
  generateCampaignData(agentId) {
    return {
      name: `Test Campaign ${Date.now()}`,
      description: "Test campaign for QA automation",
      agent_id: agentId,
      status: "draft"
    };
  },

  // Generate test business details
  generateBusinessData() {
    return {
      business_type: "technology",
      employee_count: Math.floor(Math.random() * 1000) + 1,
      annual_revenue: (Math.random() * 10000000).toString(),
      website: `https://testcompany${Date.now()}.com`,
      tax_id: `12-${Math.floor(Math.random() * 9000000) + 1000000}`,
      billing_address: `123 Test St ${Date.now()}, Test City, TS 12345`,
      billing_contact: `Test Contact ${Date.now()}`,
      billing_email: this.generateUniqueEmail(),
      billing_phone: this.generatePhoneNumber()
    };
  }
};

// ===== API Response Validators =====
export const ResponseValidator = {
  // Validate authentication response
  validateAuthResponse(response) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('email');
    expect(response.body.user).to.have.property('id');
  },

  // Validate paginated response
  validatePaginatedResponse(response) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('count');
    expect(response.body).to.have.property('results');
    expect(response.body.results).to.be.an('array');
  },

  // Validate created resource response
  validateCreatedResponse(response) {
    expect(response.status).to.eq(201);
    expect(response.body).to.have.property('id');
    expect(response.body.id).to.be.a('number');
  },

  // Validate updated resource response
  validateUpdatedResponse(response) {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('id');
  },

  // Validate error response
  validateErrorResponse(response, expectedStatus = 400) {
    expect(response.status).to.eq(expectedStatus);
    expect(response.body).to.have.property('message');
  }
};

// ===== Test Environment Configuration =====
export const TestConfig = {
  // Base URLs for different environments
  environments: {
    dev: "https://api.dev.tcall.ai:8006",
    staging: "https://api.staging.tcall.ai:8006",
    production: "https://api.tcall.ai:8006"
  },

  // Test credentials
  credentials: {
    testUser: {
      email: "test@tcall.ai",
      password: "test123"
    },
    adminUser: {
      email: "admin@tcall.ai",
      password: "admin123"
    }
  },

  // Test data IDs (should be updated based on actual test environment)
  testIds: {
    agentId: 152,
    phoneNumberId: 9572,
    userId: 1,
    campaignId: 1
  },

  // Timeouts
  timeouts: {
    request: 30000,
    response: 10000,
    pageLoad: 60000
  }
};

// ===== Custom Cypress Commands =====
Cypress.Commands.add('tcallLogin', (email = TestConfig.credentials.testUser.email, password = TestConfig.credentials.testUser.password) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env('BASE_URL') || TestConfig.environments.dev}/api/auth/login/`,
    headers: { "Content-Type": "application/json" },
    body: { email, password },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(200);
    return res.body.token;
  });
});

Cypress.Commands.add('tcallRequest', (method, endpoint, body = null, token = null, expectedStatus = 200) => {
  const requestConfig = {
    method,
    url: `${Cypress.env('BASE_URL') || TestConfig.environments.dev}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
    failOnStatusCode: false,
  };

  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    requestConfig.body = body;
  }

  return cy.request(requestConfig).then((res) => {
    if (expectedStatus !== null) {
      expect(res.status).to.eq(expectedStatus);
    }
    return res;
  });
});

Cypress.Commands.add('tcallAuthenticatedRequest', (method, endpoint, body = null, expectedStatus = 200) => {
  return cy.tcallLogin().then((token) => {
    return cy.tcallRequest(method, endpoint, body, token, expectedStatus);
  });
});

// ===== Test Data Cleanup =====
export const TestCleanup = {
  // Clean up created test data
  async cleanupTestData(token, createdIds) {
    if (!createdIds || createdIds.length === 0) return;

    for (const idData of createdIds) {
      try {
        await cy.tcallRequest('DELETE', `/${idData.endpoint}/${idData.id}/`, null, token, 204);
      } catch (error) {
        cy.log(`Failed to cleanup ${idData.endpoint} with ID ${idData.id}: ${error.message}`);
      }
    }
  },

  // Clean up all test contacts
  async cleanupTestContacts(token) {
    const response = await cy.tcallAuthenticatedRequest('GET', '/api/contacts/');
    const testContacts = response.body.results.filter(contact => 
      contact.email.includes('test.') || contact.name.includes('Test Contact')
    );

    for (const contact of testContacts) {
      try {
        await cy.tcallRequest('DELETE', `/api/contacts/${contact.id}/`, null, token, 204);
      } catch (error) {
        cy.log(`Failed to cleanup contact ${contact.id}: ${error.message}`);
      }
    }
  }
};

// ===== Performance Testing Utilities =====
export const PerformanceUtils = {
  // Measure response time
  measureResponseTime(requestPromise) {
    const startTime = Date.now();
    return requestPromise.then((response) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      cy.log(`Response time: ${responseTime}ms`);
      return { response, responseTime };
    });
  },

  // Run concurrent requests
  runConcurrentRequests(requestFn, count = 5) {
    const requests = [];
    for (let i = 0; i < count; i++) {
      requests.push(requestFn());
    }
    return Promise.all(requests);
  },

  // Load test an endpoint
  loadTest(endpoint, method = 'GET', body = null, concurrentCount = 10) {
    const requests = [];
    for (let i = 0; i < concurrentCount; i++) {
      requests.push(cy.tcallAuthenticatedRequest(method, endpoint, body));
    }
    return cy.wrap(requests);
  }
};

// ===== Data Validation Utilities =====
export const ValidationUtils = {
  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number format
  isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  },

  // Validate required fields
  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    return true;
  },

  // Validate response schema
  validateResponseSchema(response, schema) {
    // Basic schema validation - can be enhanced with JSON Schema validation
    for (const [key, type] of Object.entries(schema)) {
      if (response.body[key] !== undefined) {
        expect(response.body[key]).to.be.a(type);
      }
    }
  }
};
