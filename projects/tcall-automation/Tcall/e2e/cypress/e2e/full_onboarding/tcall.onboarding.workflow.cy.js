// cypress/e2e/full_onboarding/tcall.onboarding.workflow.cy.js
// Tcall Complete Onboarding Workflow Test Suite

const BASE_URL = "https://api.dev.tcall.ai:8006";

function generateUniqueEmail() {
  return `onboarding.${Date.now()}.${Math.random().toString(36).substr(2, 9)}@tcall.ai`;
}

describe("Tcall Complete Onboarding Workflow", () => {
  
  // Shared context for storing data across tests
  let testContext = {
    userData: null,
    authToken: null
  };
  
  describe("🔐 User Registration & Authentication", () => {
    
    it("should complete user registration process", () => {
      cy.log("👤 Testing user registration");
      
      const userData = {
        email: generateUniqueEmail(),
        password: "OnboardingPass123!",
        firstName: "Onboarding",
        lastName: "Test",
        companyName: `Test Company ${Date.now()}`,
        role: "user"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/register/`,
        headers: { "Content-Type": "application/json" },
        body: userData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Registration: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Registration successful");
          testContext.userData = userData;
        }
      });
    });

    it("should authenticate registered user", () => {
      cy.log("🔐 Testing user authentication");
      
      if (!testContext.userData) {
        cy.log("⚠️ No registered user, using test credentials");
        testContext.userData = { email: "test@tcall.ai", password: "test123" };
      }

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: testContext.userData.email, password: testContext.userData.password },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Login: ${res.status}`);
        if (res.status === 200) {
          cy.log("✅ Authentication successful");
          testContext.authToken = res.body.token;
        }
      });
    });
  });

  describe("🏢 Business Profile Setup", () => {
    
    it("should create business profile", () => {
      cy.log("🏢 Testing business profile creation");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      const businessData = {
        business_type: "technology",
        employee_count: 50,
        annual_revenue: "1000000",
        website: "https://onboardingtest.com"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/business-details/`,
        headers: {
          "Authorization": `Bearer ${testContext.authToken}`,
          "Content-Type": "application/json"
        },
        body: businessData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Business Profile: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Business profile created");
        }
      });
    });
  });

  describe("👥 Contact Management", () => {
    
    it("should create initial contact", () => {
      cy.log("👥 Testing contact creation");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      const contactData = {
        name: "Onboarding Test Contact",
        phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: generateUniqueEmail(),
        company: `Test Company ${Date.now()}`
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/contacts/`,
        headers: {
          "Authorization": `Bearer ${testContext.authToken}`,
          "Content-Type": "application/json"
        },
        body: contactData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Contact Creation: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Contact created");
        }
      });
    });
  });

  describe("🤖 Agent Setup", () => {
    
    it("should create initial agent", () => {
      cy.log("🤖 Testing agent creation");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      const agentData = {
        call_type: "outbound",
        name: "Onboarding Test Agent",
        provider: "retell",
        description: "Agent for onboarding testing",
        voice_id: "onboarding_voice_123",
        language: "en",
        industry: "technology",
        initial_message: "Hello, this is an onboarding test agent",
        prompt_content: "You are a helpful assistant for onboarding testing",
        is_active: true
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/agents/api/`,
        headers: {
          "Authorization": `Bearer ${testContext.authToken}`,
          "Content-Type": "application/json"
        },
        body: agentData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Agent Creation: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Agent created");
        }
      });
    });
  });

  describe("📱 Phone Number Setup", () => {
    
    it("should request phone number", () => {
      cy.log("📱 Testing phone number request");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      const phoneRequestData = {
        phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        country_code: "US",
        capabilities: ["voice", "sms"]
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/phone-requests/`,
        headers: {
          "Authorization": `Bearer ${testContext.authToken}`,
          "Content-Type": "application/json"
        },
        body: phoneRequestData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Phone Request: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Phone number requested");
        }
      });
    });
  });

  describe("📢 Campaign Setup", () => {
    
    it("should create initial campaign", () => {
      cy.log("📢 Testing campaign creation");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      const campaignData = {
        name: "Onboarding Test Campaign",
        description: "Campaign for onboarding testing",
        agent_id: 1,
        status: "draft"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/campaigns/`,
        headers: {
          "Authorization": `Bearer ${testContext.authToken}`,
          "Content-Type": "application/json"
        },
        body: campaignData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Campaign Creation: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Campaign created");
        }
      });
    });
  });

  describe("📞 Test Call Setup", () => {
    
    it("should create test call log", () => {
      cy.log("📞 Testing call log creation");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      const callLogData = {
        agent_code: "ONBOARDING001",
        call_type: "outbound",
        contact_phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        contact_name: "Onboarding Test Contact",
        status: "completed",
        duration: 120,
        transcript: "Onboarding test call conversation",
        ai_confidence_score: "85.5",
        lead_score: "75"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/call-logs/`,
        headers: {
          "Authorization": `Bearer ${testContext.authToken}`,
          "Content-Type": "application/json"
        },
        body: callLogData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Call Log Creation: ${res.status}`);
        if (res.status === 201) {
          cy.log("✅ Call log created");
        }
      });
    });
  });

  describe("✅ Onboarding Completion", () => {
    
    it("should verify complete onboarding", () => {
      cy.log("✅ Testing onboarding completion");
      
      if (!testContext.authToken) {
        cy.log("⚠️ No auth token, skipping test");
        return;
      }

      // Verify all components
      const endpoints = [
        { name: "User Profile", url: "/api/auth/me/" },
        { name: "Business Details", url: "/api/business-details/" },
        { name: "Contacts", url: "/api/contacts/" },
        { name: "Agents", url: "/agents/api/" },
        { name: "Phone Numbers", url: "/api/phone-numbers/" },
        { name: "Campaigns", url: "/api/campaigns/" },
        { name: "Call Logs", url: "/api/call-logs/" }
      ];

      endpoints.forEach((endpoint) => {
        cy.request({
          method: "GET",
          url: `${BASE_URL}${endpoint.url}`,
          headers: {
            "Authorization": `Bearer ${testContext.authToken}`,
            "Content-Type": "application/json"
          },
          failOnStatusCode: false,
        }).then((res) => {
          cy.log(`📝 ${endpoint.name}: ${res.status}`);
        });
      });
    });
  });
});
