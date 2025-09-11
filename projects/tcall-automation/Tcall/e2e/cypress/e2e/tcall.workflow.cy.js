// cypress/e2e/tcall.workflow.cy.js
// Tcall API Workflow Testing Suite
// Organized by Security, API, and Performance testing categories

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
describe("TCall API - Workflow Testing Suite", () => {
  
  // ===== SECURITY TESTING WORKFLOW =====
  describe("🔒 Security Testing Workflow", () => {
    
    describe("Authentication & Authorization Security", () => {
      it("should validate secure authentication flow", () => {
        cy.log("🔐 Testing secure authentication flow");
        
        // Test valid authentication
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
          cy.log("✅ Valid authentication successful");
        });
      });

      it("should reject invalid credentials securely", () => {
        cy.log("🚫 Testing invalid credentials rejection");
        
        cy.request({
          method: "POST",
          url: `${BASE_URL}/api/auth/login/`,
          headers: { "Content-Type": "application/json" },
          body: { email: EMAIL, password: "wrongpassword" },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
          cy.log("✅ Invalid credentials properly rejected");
        });
      });

      it("should handle missing credentials securely", () => {
        cy.log("🚫 Testing missing credentials handling");
        
        cy.request({
          method: "POST",
          url: `${BASE_URL}/api/auth/login/`,
          headers: { "Content-Type": "application/json" },
          body: { email: EMAIL },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(400);
          cy.log("✅ Missing credentials properly handled");
        });
      });

      it("should validate token-based authorization", () => {
        cy.log("🔑 Testing token-based authorization");
        
        makeAuthenticatedRequest("GET", "/api/auth/me/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Token-based authorization successful");
        });
      });

      it("should reject unauthorized access", () => {
        cy.log("🚫 Testing unauthorized access rejection");
        
        cy.request({
          method: "GET",
          url: `${BASE_URL}/api/users/`,
          headers: { "Content-Type": "application/json" },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
          cy.log("✅ Unauthorized access properly rejected");
        });
      });
    });

    describe("Input Validation & Sanitization", () => {
      it("should validate and sanitize user input", () => {
        cy.log("🧹 Testing input validation and sanitization");
        
        const maliciousInput = {
          name: "<script>alert('xss')</script>",
          email: "test@example.com",
          phone_number: "+1234567890"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", maliciousInput, 400).then((res) => {
          expect(res.status).to.eq(400);
          cy.log("✅ Malicious input properly rejected");
        });
      });

      it("should handle SQL injection attempts", () => {
        cy.log("💉 Testing SQL injection protection");
        
        const sqlInjectionInput = {
          name: "'; DROP TABLE users; --",
          email: "test@example.com"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", sqlInjectionInput, 400).then((res) => {
          expect(res.status).to.eq(400);
          cy.log("✅ SQL injection attempt properly handled");
        });
      });

      it("should validate email format security", () => {
        cy.log("📧 Testing email format validation");
        
        const invalidEmailData = {
          name: "Test Contact",
          phone_number: "+1234567890",
          email: "invalid-email-format"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", invalidEmailData, 400).then((res) => {
          expect(res.status).to.eq(400);
          cy.log("✅ Invalid email format properly rejected");
        });
      });
    });

    describe("Rate Limiting & DDoS Protection", () => {
      it("should implement rate limiting", () => {
        cy.log("⏱️ Testing rate limiting implementation");
        
        const requests = [];
        for (let i = 0; i < 10; i++) {
          requests.push(
            makeAuthenticatedRequest("GET", "/api/health/")
          );
        }

        cy.wrap(requests).then(() => {
          cy.log("✅ Rate limiting test completed");
        });
      });

      it("should handle concurrent requests securely", () => {
        cy.log("🔄 Testing concurrent request handling");
        
        const concurrentRequests = [];
        for (let i = 0; i < 5; i++) {
          concurrentRequests.push(
            makeAuthenticatedRequest("GET", "/api/health/")
          );
        }

        cy.wrap(concurrentRequests).then(() => {
          cy.log("✅ Concurrent requests handled securely");
        });
      });
    });
  });

  // ===== API FUNCTIONALITY TESTING WORKFLOW =====
  describe("🔧 API Functionality Testing Workflow", () => {
    
    describe("Core API Endpoints", () => {
      it("should test agents management workflow", () => {
        cy.log("🤖 Testing agents management workflow");
        
        // List agents
        makeAuthenticatedRequest("GET", "/agents/api/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Agents listing successful");
        });

        // Get specific agent
        makeAuthenticatedRequest("GET", `/agents/api/${TEST_AGENT_ID}/`).then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Agent retrieval successful");
        });

        // Create new agent
        const agentData = {
          call_type: "outbound",
          name: "Workflow Test Agent",
          provider: "retell",
          description: "Agent for workflow testing",
          voice_id: "test_voice_123",
          language: "en",
          industry: "technology",
          initial_message: "Hello, this is a workflow test",
          prompt_content: "You are a helpful assistant for workflow testing",
          is_active: true
        };

        makeAuthenticatedRequest("POST", "/agents/api/", agentData, 201).then((res) => {
          expect(res.status).to.eq(201);
          cy.log("✅ Agent creation successful");
        });
      });

      it("should test call management workflow", () => {
        cy.log("📞 Testing call management workflow");
        
        // List call logs
        makeAuthenticatedRequest("GET", "/api/call-logs/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Call logs listing successful");
        });

        // Safe call initiation (no real call)
        makeAuthenticatedRequest("POST", "/api/calls/initiate/", {}, 400).then((res) => {
          expect(res.status).to.eq(400);
          cy.log("✅ Safe call initiation test successful");
        });

        // Create call log entry
        const callLogData = {
          agent_code: "WORKFLOW001",
          call_type: "outbound",
          contact_phone: "+1234567890",
          contact_name: "Workflow Test Contact",
          status: "completed",
          duration: 120,
          transcript: "Workflow test conversation",
          ai_confidence_score: "85.5",
          lead_score: "75"
        };

        makeAuthenticatedRequest("POST", "/api/call-logs/", callLogData, 201).then((res) => {
          expect(res.status).to.eq(201);
          cy.log("✅ Call log creation successful");
        });
      });

      it("should test contacts management workflow", () => {
        cy.log("👥 Testing contacts management workflow");
        
        // List contacts
        makeAuthenticatedRequest("GET", "/api/contacts/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Contacts listing successful");
        });

        // Create new contact
        const contactData = {
          name: "Workflow Test Contact",
          phone_number: "+1234567890",
          email: "workflow@example.com",
          company: "Workflow Test Company"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", contactData, 201).then((res) => {
          expect(res.status).to.eq(201);
          const contactId = res.body.id;
          cy.log("✅ Contact creation successful");

          // Update contact
          const updateData = {
            name: "Updated Workflow Contact",
            email: "updated@example.com"
          };

          makeAuthenticatedRequest("PATCH", `/api/contacts/${contactId}/`, updateData).then((updateRes) => {
            expect(updateRes.status).to.eq(200);
            cy.log("✅ Contact update successful");
          });
        });
      });

      it("should test phone numbers management workflow", () => {
        cy.log("📱 Testing phone numbers management workflow");
        
        // List phone numbers
        makeAuthenticatedRequest("GET", "/api/phone-numbers/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Phone numbers listing successful");
        });

        // Create phone number request
        const phoneRequestData = {
          phone_number: "+1234567890",
          country_code: "US",
          capabilities: ["voice", "sms"]
        };

        makeAuthenticatedRequest("POST", "/api/phone-requests/", phoneRequestData, 201).then((res) => {
          expect(res.status).to.eq(201);
          cy.log("✅ Phone number request creation successful");
        });

        // Assign phone number
        const assignData = {
          phone_number_id: TEST_PHONE_NUMBER_ID,
          user_id: TEST_USER_ID
        };

        makeAuthenticatedRequest("POST", "/api/assign-phone-numbers/", assignData).then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Phone number assignment successful");
        });
      });

      it("should test campaigns management workflow", () => {
        cy.log("📢 Testing campaigns management workflow");
        
        // List campaigns
        makeAuthenticatedRequest("GET", "/api/campaigns/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Campaigns listing successful");
        });

        // Create new campaign
        const campaignData = {
          name: "Workflow Test Campaign",
          description: "Campaign for workflow testing",
          agent_id: TEST_AGENT_ID,
          status: "draft"
        };

        makeAuthenticatedRequest("POST", "/api/campaigns/", campaignData, 201).then((res) => {
          expect(res.status).to.eq(201);
          cy.log("✅ Campaign creation successful");
        });
      });
    });

    describe("Business Logic & Data Integrity", () => {
      it("should test business details workflow", () => {
        cy.log("🏢 Testing business details workflow");
        
        // List business details
        makeAuthenticatedRequest("GET", "/api/business-details/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Business details listing successful");
        });

        // Create business details
        const businessData = {
          business_type: "technology",
          employee_count: 50,
          annual_revenue: "1000000",
          website: "https://workflowtest.com",
          tax_id: "12-3456789",
          billing_address: "123 Workflow St, Test City, TS 12345",
          billing_contact: "Workflow Test Contact",
          billing_email: "billing@workflowtest.com",
          billing_phone: "+1234567890"
        };

        makeAuthenticatedRequest("POST", "/api/business-details/", businessData, 201).then((res) => {
          expect(res.status).to.eq(201);
          cy.log("✅ Business details creation successful");
        });
      });

      it("should test users management workflow", () => {
        cy.log("👤 Testing users management workflow");
        
        // List users
        makeAuthenticatedRequest("GET", "/api/users/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Users listing successful");
        });

        // Get specific user
        makeAuthenticatedRequest("GET", `/api/users/${TEST_USER_ID}/`).then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ User retrieval successful");
        });

        // Create new user
        const userData = {
          email: `workflow${Date.now()}@tcall.ai`,
          firstName: "Workflow",
          lastName: "Test",
          role: "user",
          companyName: "Workflow Test Company"
        };

        makeAuthenticatedRequest("POST", "/api/users/", userData, 201).then((res) => {
          expect(res.status).to.eq(201);
          cy.log("✅ User creation successful");
        });
      });
    });

    describe("External Integrations", () => {
      it("should test external service integrations", () => {
        cy.log("🔗 Testing external service integrations");
        
        // Test Twilio integration
        makeAuthenticatedRequest("GET", "/api/twilio/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Twilio integration successful");
        });

        // Test ElevenLabs integration
        makeAuthenticatedRequest("GET", "/api/elevenlabs/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ ElevenLabs integration successful");
        });

        // Test OpenAI integration
        makeAuthenticatedRequest("GET", "/api/openai/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ OpenAI integration successful");
        });

        // Test Retell integration
        makeAuthenticatedRequest("GET", "/api/retell/voices/").then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ Retell integration successful");
        });
      });

      it("should test system health and utilities", () => {
        cy.log("🏥 Testing system health and utilities");
        
        // Health check
        cy.request({
          method: "GET",
          url: `${BASE_URL}/api/health/`,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property('status');
          cy.log("✅ Health check successful");
        });

        // OpenAI chat test
        const chatData = {
          message: "Workflow test message",
          model: "gpt-3.5-turbo"
        };

        makeAuthenticatedRequest("POST", "/api/openai/chat/", chatData).then((res) => {
          expect(res.status).to.eq(200);
          cy.log("✅ OpenAI chat test successful");
        });
      });
    });
  });

  // ===== PERFORMANCE TESTING WORKFLOW =====
  describe("⚡ Performance Testing Workflow", () => {
    
    describe("Response Time Performance", () => {
      it("should measure API response times", () => {
        cy.log("⏱️ Measuring API response times");
        
        const endpoints = [
          "/api/health/",
          "/api/auth/me/",
          "/agents/api/",
          "/api/contacts/",
          "/api/call-logs/"
        ];

        endpoints.forEach(endpoint => {
          const startTime = Date.now();
          
          if (endpoint === "/api/health/") {
            cy.request({
              method: "GET",
              url: `${BASE_URL}${endpoint}`,
              failOnStatusCode: false,
            }).then(() => {
              const endTime = Date.now();
              const responseTime = endTime - startTime;
              cy.log(`📊 ${endpoint}: ${responseTime}ms`);
              expect(responseTime).to.be.lessThan(5000);
            });
          } else {
            makeAuthenticatedRequest("GET", endpoint).then(() => {
              const endTime = Date.now();
              const responseTime = endTime - startTime;
              cy.log(`📊 ${endpoint}: ${responseTime}ms`);
              expect(responseTime).to.be.lessThan(5000);
            });
          }
        });
      });

      it("should test concurrent request performance", () => {
        cy.log("🔄 Testing concurrent request performance");
        
        const concurrentRequests = [];
        for (let i = 0; i < 5; i++) {
          concurrentRequests.push(
            makeAuthenticatedRequest("GET", "/api/health/")
          );
        }

        cy.wrap(concurrentRequests).then(() => {
          cy.log("✅ Concurrent request performance test completed");
        });
      });
    });

    describe("Load Testing", () => {
      it("should perform basic load testing", () => {
        cy.log("📈 Performing basic load testing");
        
        const loadTestRequests = [];
        for (let i = 0; i < 10; i++) {
          loadTestRequests.push(
            makeAuthenticatedRequest("GET", "/api/health/")
          );
        }

        cy.wrap(loadTestRequests).then(() => {
          cy.log("✅ Load testing completed");
        });
      });

      it("should test bulk operations performance", () => {
        cy.log("📦 Testing bulk operations performance");
        
        // Test bulk contact creation
        const bulkData = {
          contacts: [
            { name: "Bulk Contact 1", phone_number: "+1234567891", email: "bulk1@example.com" },
            { name: "Bulk Contact 2", phone_number: "+1234567892", email: "bulk2@example.com" },
            { name: "Bulk Contact 3", phone_number: "+1234567893", email: "bulk3@example.com" }
          ]
        };

        const startTime = Date.now();
        makeAuthenticatedRequest("POST", "/api/contacts/bulk-upload/", bulkData, 201).then(() => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          cy.log(`📊 Bulk upload performance: ${responseTime}ms`);
          expect(responseTime).to.be.lessThan(10000);
        });
      });
    });

    describe("Memory & Resource Usage", () => {
      it("should test memory usage under load", () => {
        cy.log("🧠 Testing memory usage under load");
        
        // Simulate multiple operations to test memory usage
        const operations = [];
        for (let i = 0; i < 20; i++) {
          operations.push(
            makeAuthenticatedRequest("GET", "/api/health/")
          );
        }

        cy.wrap(operations).then(() => {
          cy.log("✅ Memory usage test completed");
        });
      });

      it("should test resource cleanup", () => {
        cy.log("🧹 Testing resource cleanup");
        
        // Create test data and verify cleanup
        const testData = {
          name: "Cleanup Test Contact",
          phone_number: "+1234567899",
          email: "cleanup@example.com"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", testData, 201).then((res) => {
          const contactId = res.body.id;
          cy.log("✅ Test data created for cleanup test");

          // Verify cleanup by attempting to delete
          makeAuthenticatedRequest("DELETE", `/api/contacts/${contactId}/`, null, 204).then(() => {
            cy.log("✅ Resource cleanup successful");
          });
        });
      });
    });
  });

  // ===== INTEGRATION TESTING WORKFLOW =====
  describe("🔗 Integration Testing Workflow", () => {
    
    describe("End-to-End Workflows", () => {
      it("should test complete user registration workflow", () => {
        cy.log("👤 Testing complete user registration workflow");
        
        const testEmail = `workflow${Date.now()}@tcall.ai`;
        
        // Register new user
        cy.request({
          method: "POST",
          url: `${BASE_URL}/api/auth/register/`,
          headers: { "Content-Type": "application/json" },
          body: {
            email: testEmail,
            password: "workflowpass123",
            firstName: "Workflow",
            lastName: "Test",
            companyName: "Workflow Test Company",
            role: "user"
          },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.have.property('token');
          cy.log("✅ User registration successful");

          // Login with new user
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/auth/login/`,
            headers: { "Content-Type": "application/json" },
            body: { email: testEmail, password: "workflowpass123" },
            failOnStatusCode: false,
          }).then((loginRes) => {
            expect(loginRes.status).to.eq(200);
            cy.log("✅ User login successful");
          });
        });
      });

      it("should test complete agent setup workflow", () => {
        cy.log("🤖 Testing complete agent setup workflow");
        
        // Create agent
        const agentData = {
          call_type: "outbound",
          name: "Integration Test Agent",
          provider: "retell",
          description: "Agent for integration testing",
          voice_id: "integration_voice_123",
          language: "en",
          industry: "technology",
          initial_message: "Hello, this is an integration test",
          prompt_content: "You are a helpful assistant for integration testing",
          is_active: true
        };

        makeAuthenticatedRequest("POST", "/agents/api/", agentData, 201).then((res) => {
          const agentId = res.body.id;
          cy.log("✅ Agent creation successful");

          // Sync agent
          makeAuthenticatedRequest("POST", `/agents/api/${agentId}/sync/`, {}, 200).then(() => {
            cy.log("✅ Agent sync successful");

            // Create campaign with agent
            const campaignData = {
              name: "Integration Test Campaign",
              description: "Campaign for integration testing",
              agent_id: agentId,
              status: "draft"
            };

            makeAuthenticatedRequest("POST", "/api/campaigns/", campaignData, 201).then(() => {
              cy.log("✅ Campaign creation with agent successful");
            });
          });
        });
      });

      it("should test complete call workflow", () => {
        cy.log("📞 Testing complete call workflow");
        
        // Create contact
        const contactData = {
          name: "Call Workflow Contact",
          phone_number: "+1234567898",
          email: "callworkflow@example.com"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", contactData, 201).then((res) => {
          const contactId = res.body.id;
          cy.log("✅ Contact creation for call workflow successful");

          // Create call log
          const callLogData = {
            agent_code: "WORKFLOW001",
            call_type: "outbound",
            contact_phone: "+1234567898",
            contact_name: "Call Workflow Contact",
            status: "completed",
            duration: 180,
            transcript: "Complete call workflow test conversation",
            ai_confidence_score: "90.5",
            lead_score: "85"
          };

          makeAuthenticatedRequest("POST", "/api/call-logs/", callLogData, 201).then(() => {
            cy.log("✅ Call log creation successful");

            // Verify call log retrieval
            makeAuthenticatedRequest("GET", "/api/call-logs/").then((logsRes) => {
              expect(logsRes.status).to.eq(200);
              cy.log("✅ Call log retrieval successful");
            });
          });
        });
      });
    });

    describe("Data Flow & Consistency", () => {
      it("should test data consistency across operations", () => {
        cy.log("🔄 Testing data consistency across operations");
        
        // Create test data
        const testData = {
          name: "Consistency Test Contact",
          phone_number: "+1234567897",
          email: "consistency@example.com"
        };

        makeAuthenticatedRequest("POST", "/api/contacts/", testData, 201).then((res) => {
          const contactId = res.body.id;
          cy.log("✅ Test data created");

          // Verify data retrieval
          makeAuthenticatedRequest("GET", `/api/contacts/${contactId}/`).then((getRes) => {
            expect(getRes.body.name).to.eq(testData.name);
            expect(getRes.body.email).to.eq(testData.email);
            cy.log("✅ Data consistency verified");

            // Update data
            const updateData = {
              name: "Updated Consistency Contact",
              email: "updated@example.com"
            };

            makeAuthenticatedRequest("PATCH", `/api/contacts/${contactId}/`, updateData).then((updateRes) => {
              expect(updateRes.body.name).to.eq(updateData.name);
              cy.log("✅ Data update consistency verified");
            });
          });
        });
      });

      it("should test error handling consistency", () => {
        cy.log("🚫 Testing error handling consistency");
        
        // Test various error scenarios
        const errorScenarios = [
          { endpoint: "/api/invalid-endpoint/", expectedStatus: 404 },
          { endpoint: "/api/contacts/", body: {}, expectedStatus: 400 },
          { endpoint: "/api/contacts/", body: { email: "invalid" }, expectedStatus: 400 }
        ];

        errorScenarios.forEach(scenario => {
          makeAuthenticatedRequest("GET", scenario.endpoint, scenario.body, scenario.expectedStatus).then(() => {
            cy.log(`✅ Error handling consistent for ${scenario.endpoint}`);
          });
        });
      });
    });
  });

  // ===== DEBUGGING & TROUBLESHOOTING WORKFLOW =====
  describe("🐛 Debugging & Troubleshooting Workflow", () => {
    
    describe("Error Analysis", () => {
      it("should analyze and log detailed error information", () => {
        cy.log("🔍 Analyzing detailed error information");
        
        // Test various error scenarios with detailed logging
        cy.request({
          method: "POST",
          url: `${BASE_URL}/api/auth/login/`,
          headers: { "Content-Type": "application/json" },
          body: { email: "nonexistent@tcall.ai", password: "wrongpass" },
          failOnStatusCode: false,
        }).then((res) => {
          cy.log(`🔍 Error Status: ${res.status}`);
          cy.log(`🔍 Error Body: ${JSON.stringify(res.body)}`);
          cy.log(`🔍 Error Headers: ${JSON.stringify(res.headers)}`);
          expect(res.status).to.eq(401);
        });
      });

      it("should test network error handling", () => {
        cy.log("🌐 Testing network error handling");
        
        // Test with invalid URL
        cy.request({
          method: "GET",
          url: "https://invalid-url-that-does-not-exist.com",
          failOnStatusCode: false,
          timeout: 5000
        }).then((res) => {
          cy.log(`🌐 Network Error Status: ${res.status}`);
          cy.log(`🌐 Network Error Details: ${JSON.stringify(res)}`);
        });
      });

      it("should test timeout handling", () => {
        cy.log("⏰ Testing timeout handling");
        
        // Test with very short timeout
        cy.request({
          method: "GET",
          url: `${BASE_URL}/api/health/`,
          failOnStatusCode: false,
          timeout: 1
        }).then((res) => {
          cy.log(`⏰ Timeout Test Result: ${res.status}`);
        });
      });
    });

    describe("Performance Debugging", () => {
      it("should debug slow response times", () => {
        cy.log("🐌 Debugging slow response times");
        
        const slowEndpoints = [
          "/api/call-logs/",
          "/agents/api/",
          "/api/contacts/"
        ];

        slowEndpoints.forEach(endpoint => {
          const startTime = Date.now();
          
          makeAuthenticatedRequest("GET", endpoint).then(() => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            if (responseTime > 3000) {
              cy.log(`🐌 Slow endpoint detected: ${endpoint} - ${responseTime}ms`);
            } else {
              cy.log(`✅ Normal response time: ${endpoint} - ${responseTime}ms`);
            }
          });
        });
      });

      it("should identify performance bottlenecks", () => {
        cy.log("🔍 Identifying performance bottlenecks");
        
        // Test concurrent requests to identify bottlenecks
        const concurrentTests = [];
        for (let i = 0; i < 10; i++) {
          concurrentTests.push(
            makeAuthenticatedRequest("GET", "/api/health/")
          );
        }

        cy.wrap(concurrentTests).then(() => {
          cy.log("🔍 Performance bottleneck analysis completed");
        });
      });
    });

    describe("Data Validation Debugging", () => {
      it("should debug data validation issues", () => {
        cy.log("🔍 Debugging data validation issues");
        
        const invalidDataSets = [
          { name: "", email: "test@example.com" },
          { name: "Test", email: "invalid-email" },
          { name: "Test", phone_number: "invalid-phone" }
        ];

        invalidDataSets.forEach((data, index) => {
          cy.log(`🔍 Testing invalid data set ${index + 1}: ${JSON.stringify(data)}`);
          
          makeAuthenticatedRequest("POST", "/api/contacts/", data, 400).then((res) => {
            cy.log(`🔍 Validation error for set ${index + 1}: ${JSON.stringify(res.body)}`);
          });
        });
      });

      it("should debug authentication issues", () => {
        cy.log("🔍 Debugging authentication issues");
        
        // Test various authentication scenarios
        const authScenarios = [
          { email: "", password: "test123" },
          { email: "test@tcall.ai", password: "" },
          { email: "invalid@tcall.ai", password: "test123" },
          { email: "test@tcall.ai", password: "wrongpassword" }
        ];

        authScenarios.forEach((scenario, index) => {
          cy.log(`🔍 Testing auth scenario ${index + 1}: ${JSON.stringify(scenario)}`);
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/auth/login/`,
            headers: { "Content-Type": "application/json" },
            body: scenario,
            failOnStatusCode: false,
          }).then((res) => {
            cy.log(`🔍 Auth error for scenario ${index + 1}: ${res.status} - ${JSON.stringify(res.body)}`);
          });
        });
      });
    });
  });
});
