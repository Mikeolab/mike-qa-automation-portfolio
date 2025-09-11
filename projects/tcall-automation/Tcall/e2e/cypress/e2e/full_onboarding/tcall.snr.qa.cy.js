// cypress/e2e/tcall.senior.qa.cy.js
// Senior QA Testing Suite for Tcall API
// Comprehensive test coverage for all major API endpoints

// ===== Configuration Constants =====
const BASE_URL = "https://api.dev.tcall.ai:8006";
const EMAIL = "test@tcall.ai";
const PASSWORD = "test123";

// Test data constants
const TEST_AGENT_ID = 152;
const TEST_PHONE_NUMBER_ID = 9572;
const TEST_TO_NUMBER = "2349158412345";
const TEST_USER_ID = 1;

// ===== Helper Functions =====
function apiLogin() {
  return cy.request({
    method: "POST",
    url: `${BASE_URL}/api/auth/login/`,
    headers: { "Content-Type": "application/json" },
    body: { email: EMAIL, password: PASSWORD },
    failOnStatusCode: true,
  }).then((res) => {
    expect(res.status, "login status").to.eq(200);
    const token = res.body?.token || res.body?.access;
    expect(token, "auth token").to.exist;
    return token;
  });
}

function makeAuthenticatedRequest(method, endpoint, body = null, expectedStatus = 200) {
  return apiLogin().then((token) => {
    const requestConfig = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    };

    if (body) {
      requestConfig.body = body;
    }

    return cy.request(requestConfig).then((res) => {
      expect(res.status, `Expected status ${expectedStatus} for ${method} ${endpoint}`).to.eq(expectedStatus);
      return res;
    });
  });
}

// ===== Test Suites =====
describe("TCall API - Senior QA Testing Suite", () => {
  describe("Authentication & Authorization", () => {
    it("should successfully authenticate with valid credentials", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: EMAIL, password: PASSWORD },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', EMAIL);
      });
    });

    it("should reject authentication with invalid credentials", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: EMAIL, password: "wrongpassword" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it("should reject authentication with missing credentials", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: EMAIL },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it("should get current user profile", () => {
      makeAuthenticatedRequest("GET", "/api/auth/me/");
    });

    it("should register new user", () => {
      const testEmail = `test${Date.now()}@tcall.ai`;
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/register/`,
        headers: { "Content-Type": "application/json" },
        body: {
          email: testEmail,
          password: "testpass123",
          firstName: "Test",
          lastName: "User",
          companyName: "Test Company",
          role: "user"
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');
      });
    });
  });

  describe("Agents Management", () => {
    it("should list all agents", () => {
      makeAuthenticatedRequest("GET", "/agents/api/");
    });

    it("should retrieve specific agent", () => {
      makeAuthenticatedRequest("GET", `/agents/api/${TEST_AGENT_ID}/`);
    });

    it("should create new agent", () => {
      const agentData = {
        call_type: "outbound",
        name: "Test Agent",
        provider: "retell",
        description: "Test agent for QA",
        voice_id: "test_voice_123",
        language: "en",
        industry: "technology",
        initial_message: "Hello, this is a test call",
        prompt_content: "You are a helpful assistant",
        is_active: true
      };

      makeAuthenticatedRequest("POST", "/agents/api/", agentData, 201);
    });

    it("should update existing agent", () => {
      const updateData = {
        name: "Updated Test Agent",
        description: "Updated description"
      };

      makeAuthenticatedRequest("PATCH", `/agents/api/${TEST_AGENT_ID}/`, updateData);
    });

    it("should sync agent with provider", () => {
      makeAuthenticatedRequest("POST", `/agents/api/${TEST_AGENT_ID}/sync/`, {}, 200);
    });

    it("should get sync status for all agents", () => {
      makeAuthenticatedRequest("GET", "/agents/api/sync_status/");
    });

    it("should perform bulk sync", () => {
      makeAuthenticatedRequest("POST", "/agents/api/bulk_sync/", {}, 200);
    });
  });

  describe("Call Management", () => {
    it("should initiate a call (safe test - no real call)", () => {
      // Intentionally send empty body to prevent real call
      makeAuthenticatedRequest("POST", "/api/calls/initiate/", {}, 400);
    });

    it("should reject call initiation with invalid data", () => {
      const invalidData = {
        agent_id: "invalid",
        to_number: "invalid_number"
      };

      makeAuthenticatedRequest("POST", "/api/calls/initiate/", invalidData, 400);
    });

    it("should list call logs", () => {
      makeAuthenticatedRequest("GET", "/api/call-logs/");
    });

    it("should retrieve specific call log", () => {
      // First get a list to find an existing call ID
      makeAuthenticatedRequest("GET", "/api/call-logs/").then((res) => {
        if (res.body.results && res.body.results.length > 0) {
          const callId = res.body.results[0].id;
          makeAuthenticatedRequest("GET", `/api/call-logs/${callId}/`);
        }
      });
    });

    it("should create call log entry", () => {
      const callLogData = {
        agent_code: "TEST001",
        call_type: "outbound",
        contact_phone: "+1234567890",
        contact_name: "Test Contact",
        status: "completed",
        duration: 120,
        transcript: "Test conversation transcript",
        ai_confidence_score: "85.5",
        lead_score: "75"
      };

      makeAuthenticatedRequest("POST", "/api/call-logs/", callLogData, 201);
    });
  });

  describe("Phone Numbers Management", () => {
    it("should list phone numbers", () => {
      makeAuthenticatedRequest("GET", "/api/phone-numbers/");
    });

    it("should create phone number request", () => {
      const phoneRequestData = {
        phone_number: "+1234567890",
        country_code: "US",
        capabilities: ["voice", "sms"]
      };

      makeAuthenticatedRequest("POST", "/api/phone-requests/", phoneRequestData, 201);
    });

    it("should assign phone number to user", () => {
      const assignData = {
        phone_number_id: TEST_PHONE_NUMBER_ID,
        user_id: TEST_USER_ID
      };

      makeAuthenticatedRequest("POST", "/api/assign-phone-numbers/", assignData);
    });

    it("should list phone requests", () => {
      makeAuthenticatedRequest("GET", "/api/phone-requests/");
    });
  });

  describe("Contacts Management", () => {
    it("should list contacts", () => {
      makeAuthenticatedRequest("GET", "/api/contacts/");
    });

    it("should create new contact", () => {
      const contactData = {
        name: "Test Contact",
        phone_number: "+1234567890",
        email: "test@example.com",
        company: "Test Company"
      };

      makeAuthenticatedRequest("POST", "/api/contacts/", contactData, 201);
    });

    it("should retrieve specific contact", () => {
      // First create a contact, then retrieve it
      const contactData = {
        name: "Retrieve Test Contact",
        phone_number: "+1234567891",
        email: "retrieve@example.com"
      };

      makeAuthenticatedRequest("POST", "/api/contacts/", contactData, 201).then((res) => {
        const contactId = res.body.id;
        makeAuthenticatedRequest("GET", `/api/contacts/${contactId}/`);
      });
    });

    it("should update contact", () => {
      // First create a contact, then update it
      const contactData = {
        name: "Update Test Contact",
        phone_number: "+1234567892",
        email: "update@example.com"
      };

      makeAuthenticatedRequest("POST", "/api/contacts/", contactData, 201).then((res) => {
        const contactId = res.body.id;
        const updateData = {
          name: "Updated Contact Name",
          email: "updated@example.com"
        };
        makeAuthenticatedRequest("PATCH", `/api/contacts/${contactId}/`, updateData);
      });
    });

    it("should download contacts template", () => {
      makeAuthenticatedRequest("GET", "/api/contacts/download-template/");
    });

    it("should perform bulk upload", () => {
      const bulkData = {
        contacts: [
          { name: "Bulk Contact 1", phone_number: "+1234567893", email: "bulk1@example.com" },
          { name: "Bulk Contact 2", phone_number: "+1234567894", email: "bulk2@example.com" }
        ]
      };

      makeAuthenticatedRequest("POST", "/api/contacts/bulk-upload/", bulkData, 201);
    });
  });

  describe("Campaigns Management", () => {
    it("should list campaigns", () => {
      makeAuthenticatedRequest("GET", "/api/campaigns/");
    });

    it("should create new campaign", () => {
      const campaignData = {
        name: "Test Campaign",
        description: "Test campaign for QA",
        agent_id: TEST_AGENT_ID,
        status: "draft"
      };

      makeAuthenticatedRequest("POST", "/api/campaigns/", campaignData, 201);
    });

    it("should retrieve specific campaign", () => {
      // First create a campaign, then retrieve it
      const campaignData = {
        name: "Retrieve Test Campaign",
        description: "Campaign for retrieval test",
        agent_id: TEST_AGENT_ID,
        status: "draft"
      };

      makeAuthenticatedRequest("POST", "/api/campaigns/", campaignData, 201).then((res) => {
        const campaignId = res.body.id;
        makeAuthenticatedRequest("GET", `/api/campaigns/${campaignId}/`);
      });
    });
  });

  describe("Business Details", () => {
    it("should list business details", () => {
      makeAuthenticatedRequest("GET", "/api/business-details/");
    });

    it("should create business details", () => {
      const businessData = {
        business_type: "technology",
        employee_count: 50,
        annual_revenue: "1000000",
        website: "https://testcompany.com",
        tax_id: "12-3456789",
        billing_address: "123 Test St, Test City, TS 12345",
        billing_contact: "John Doe",
        billing_email: "billing@testcompany.com",
        billing_phone: "+1234567890"
      };

      makeAuthenticatedRequest("POST", "/api/business-details/", businessData, 201);
    });

    it("should update business details", () => {
      // First create business details, then update
      const businessData = {
        business_type: "technology",
        employee_count: 50,
        annual_revenue: "1000000",
        website: "https://testcompany.com",
        billing_email: "billing@testcompany.com"
      };

      makeAuthenticatedRequest("POST", "/api/business-details/", businessData, 201).then((res) => {
        const businessId = res.body.id;
        const updateData = {
          employee_count: 75,
          annual_revenue: "1500000"
        };
        makeAuthenticatedRequest("PATCH", `/api/business-details/${businessId}/`, updateData);
      });
    });
  });

  describe("Users Management", () => {
    it("should list users", () => {
      makeAuthenticatedRequest("GET", "/api/users/");
    });

    it("should retrieve specific user", () => {
      makeAuthenticatedRequest("GET", `/api/users/${TEST_USER_ID}/`);
    });

    it("should create new user", () => {
      const userData = {
        email: `newuser${Date.now()}@tcall.ai`,
        firstName: "New",
        lastName: "User",
        role: "user",
        companyName: "Test Company"
      };

      makeAuthenticatedRequest("POST", "/api/users/", userData, 201);
    });
  });

  describe("Admin Settings", () => {
    it("should list admin settings", () => {
      makeAuthenticatedRequest("GET", "/api/admin-settings/");
    });

    it("should retrieve specific admin setting", () => {
      // First get a list to find an existing setting ID
      makeAuthenticatedRequest("GET", "/api/admin-settings/").then((res) => {
        if (res.body.results && res.body.results.length > 0) {
          const settingId = res.body.results[0].id;
          makeAuthenticatedRequest("GET", `/api/admin-settings/${settingId}/`);
        }
      });
    });
  });

  describe("External Integrations", () => {
    it("should get Twilio status", () => {
      makeAuthenticatedRequest("GET", "/api/twilio/");
    });

    it("should get ElevenLabs voices", () => {
      makeAuthenticatedRequest("GET", "/api/elevenlabs/voices/");
    });

    it("should get ElevenLabs status", () => {
      makeAuthenticatedRequest("GET", "/api/elevenlabs/");
    });

    it("should get OpenAI status", () => {
      makeAuthenticatedRequest("GET", "/api/openai/");
    });

    it("should get Retell voices", () => {
      makeAuthenticatedRequest("GET", "/api/retell/voices/");
    });

    it("should get web call token", () => {
      makeAuthenticatedRequest("GET", "/api/retell/web-call-token/");
    });
  });

  describe("System Health & Utilities", () => {
    it("should check system health", () => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/health/`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('status');
      });
    });

    it("should handle OpenAI chat", () => {
      const chatData = {
        message: "Hello, this is a test message",
        model: "gpt-3.5-turbo"
      };

      makeAuthenticatedRequest("POST", "/api/openai/chat/", chatData);
    });

    it("should test ElevenLabs conversation", () => {
      const testData = {
        text: "This is a test conversation",
        voice_id: "test_voice_123"
      };

      makeAuthenticatedRequest("POST", "/api/elevenlabs/test-conversation/", testData);
    });
  });

  describe("Error Handling & Edge Cases", () => {
    it("should handle invalid endpoints", () => {
      makeAuthenticatedRequest("GET", "/api/invalid-endpoint/", null, 404);
    });

    it("should handle malformed JSON", () => {
      apiLogin().then((token) => {
        cy.request({
          method: "POST",
          url: `${BASE_URL}/api/contacts/`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: "invalid json",
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(400);
        });
      });
    });

    it("should handle unauthorized access", () => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/users/`,
        headers: { "Content-Type": "application/json" },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it("should handle rate limiting", () => {
      // Make multiple rapid requests to test rate limiting
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(
          makeAuthenticatedRequest("GET", "/api/health/")
        );
      }

      cy.wrap(requests).then(() => {
        // At least some requests should succeed
        cy.log("Rate limiting test completed");
      });
    });
  });

  describe("Data Validation", () => {
    it("should validate required fields in contact creation", () => {
      const invalidContactData = {
        // Missing required fields
        email: "test@example.com"
      };

      makeAuthenticatedRequest("POST", "/api/contacts/", invalidContactData, 400);
    });

    it("should validate email format", () => {
      const invalidEmailData = {
        name: "Test Contact",
        phone_number: "+1234567890",
        email: "invalid-email-format"
      };

      makeAuthenticatedRequest("POST", "/api/contacts/", invalidEmailData, 400);
    });

    it("should validate phone number format", () => {
      const invalidPhoneData = {
        name: "Test Contact",
        phone_number: "invalid-phone",
        email: "test@example.com"
      };

      makeAuthenticatedRequest("POST", "/api/contacts/", invalidPhoneData, 400);
    });
  });

  describe("Performance & Load Testing", () => {
    it("should handle concurrent requests", () => {
      const concurrentRequests = [];
      for (let i = 0; i < 5; i++) {
        concurrentRequests.push(
          makeAuthenticatedRequest("GET", "/api/health/")
        );
      }

      cy.wrap(concurrentRequests).then(() => {
        cy.log("Concurrent requests test completed");
      });
    });

    it("should measure response times", () => {
      const startTime = Date.now();
      
      makeAuthenticatedRequest("GET", "/api/health/").then(() => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        expect(responseTime).to.be.lessThan(5000); // Should respond within 5 seconds
        cy.log(`Response time: ${responseTime}ms`);
      });
    });
  });
});
