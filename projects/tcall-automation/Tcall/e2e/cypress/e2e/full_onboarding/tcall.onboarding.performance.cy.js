// cypress/e2e/full_onboarding/tcall.onboarding.performance.cy.js
// Tcall Onboarding Performance Test Suite

const BASE_URL = "https://api.dev.tcall.ai:8006";

function generateUniqueEmail() {
  return `perf.${Date.now()}.${Math.random().toString(36).substr(2, 9)}@tcall.ai`;
}

describe("Tcall Onboarding Performance Tests", () => {
  
  describe("⏱️ Registration Performance", () => {
    
    it("should measure user registration response time", () => {
      cy.log("⏱️ Testing registration performance");
      
      const userData = {
        email: generateUniqueEmail(),
        password: "PerfPass123!",
        firstName: "Performance",
        lastName: "Test",
        companyName: `Perf Company ${Date.now()}`
      };

      const startTime = Date.now();
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/register/`,
        headers: { "Content-Type": "application/json" },
        body: userData,
        failOnStatusCode: false,
      }).then((res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        cy.log(`📝 Registration Performance: ${responseTime}ms`);
        cy.log(`📝 Status: ${res.status}`);
        
        expect(responseTime).to.be.lessThan(5000); // Should complete within 5 seconds
        cy.log("✅ Registration performance acceptable");
      });
    });

    it("should measure login response time", () => {
      cy.log("⏱️ Testing login performance");
      
      const startTime = Date.now();
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        cy.log(`📝 Login Performance: ${responseTime}ms`);
        cy.log(`📝 Status: ${res.status}`);
        
        expect(responseTime).to.be.lessThan(3000); // Should complete within 3 seconds
        cy.log("✅ Login performance acceptable");
      });
    });
  });

  describe("📊 Business Profile Performance", () => {
    
    it("should measure business profile creation performance", () => {
      cy.log("⏱️ Testing business profile creation performance");
      
      // First get auth token
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const businessData = {
            business_type: "technology",
            employee_count: 50,
            annual_revenue: "1000000",
            website: "https://perftest.com"
          };

          const startTime = Date.now();
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/business-details/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: businessData,
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Business Profile Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(4000); // Should complete within 4 seconds
            cy.log("✅ Business profile performance acceptable");
          });
        }
      });
    });

    it("should measure business profile retrieval performance", () => {
      cy.log("⏱️ Testing business profile retrieval performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const startTime = Date.now();
          
          cy.request({
            method: "GET",
            url: `${BASE_URL}/api/business-details/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Business Profile Retrieval: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(2000); // Should complete within 2 seconds
            cy.log("✅ Business profile retrieval performance acceptable");
          });
        }
      });
    });
  });

  describe("👥 Contact Management Performance", () => {
    
    it("should measure contact creation performance", () => {
      cy.log("⏱️ Testing contact creation performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const contactData = {
            name: "Performance Test Contact",
            phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            email: generateUniqueEmail(),
            company: `Perf Company ${Date.now()}`
          };

          const startTime = Date.now();
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/contacts/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: contactData,
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Contact Creation Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(3000); // Should complete within 3 seconds
            cy.log("✅ Contact creation performance acceptable");
          });
        }
      });
    });

    it("should measure contact list retrieval performance", () => {
      cy.log("⏱️ Testing contact list retrieval performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const startTime = Date.now();
          
          cy.request({
            method: "GET",
            url: `${BASE_URL}/api/contacts/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Contact List Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(2000); // Should complete within 2 seconds
            cy.log("✅ Contact list performance acceptable");
          });
        }
      });
    });
  });

  describe("🤖 Agent Setup Performance", () => {
    
    it("should measure agent creation performance", () => {
      cy.log("⏱️ Testing agent creation performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const agentData = {
            call_type: "outbound",
            name: "Performance Test Agent",
            provider: "retell",
            description: "Agent for performance testing",
            voice_id: "perf_voice_123",
            language: "en",
            industry: "technology",
            initial_message: "Hello, this is a performance test agent",
            prompt_content: "You are a helpful assistant for performance testing",
            is_active: true
          };

          const startTime = Date.now();
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/agents/api/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: agentData,
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Agent Creation Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(5000); // Should complete within 5 seconds
            cy.log("✅ Agent creation performance acceptable");
          });
        }
      });
    });

    it("should measure agent list retrieval performance", () => {
      cy.log("⏱️ Testing agent list retrieval performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const startTime = Date.now();
          
          cy.request({
            method: "GET",
            url: `${BASE_URL}/agents/api/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Agent List Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(3000); // Should complete within 3 seconds
            cy.log("✅ Agent list performance acceptable");
          });
        }
      });
    });
  });

  describe("📱 Phone Number Performance", () => {
    
    it("should measure phone number request performance", () => {
      cy.log("⏱️ Testing phone number request performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const phoneRequestData = {
            phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            country_code: "US",
            capabilities: ["voice", "sms"]
          };

          const startTime = Date.now();
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/phone-requests/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: phoneRequestData,
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Phone Request Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(4000); // Should complete within 4 seconds
            cy.log("✅ Phone number request performance acceptable");
          });
        }
      });
    });
  });

  describe("📢 Campaign Performance", () => {
    
    it("should measure campaign creation performance", () => {
      cy.log("⏱️ Testing campaign creation performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const campaignData = {
            name: "Performance Test Campaign",
            description: "Campaign for performance testing",
            agent_id: 1,
            status: "draft"
          };

          const startTime = Date.now();
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/campaigns/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: campaignData,
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Campaign Creation Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(3000); // Should complete within 3 seconds
            cy.log("✅ Campaign creation performance acceptable");
          });
        }
      });
    });
  });

  describe("📞 Call Log Performance", () => {
    
    it("should measure call log creation performance", () => {
      cy.log("⏱️ Testing call log creation performance");
      
      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/login/`,
        headers: { "Content-Type": "application/json" },
        body: { email: "test@tcall.ai", password: "test123" },
        failOnStatusCode: false,
      }).then((loginRes) => {
        if (loginRes.status === 200) {
          const token = loginRes.body.token;
          
          const callLogData = {
            agent_code: "PERF001",
            call_type: "outbound",
            contact_phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            contact_name: "Performance Test Contact",
            status: "completed",
            duration: 120,
            transcript: "Performance test call conversation",
            ai_confidence_score: "85.5",
            lead_score: "75"
          };

          const startTime = Date.now();
          
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/call-logs/`,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: callLogData,
            failOnStatusCode: false,
          }).then((res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            cy.log(`📝 Call Log Performance: ${responseTime}ms`);
            cy.log(`📝 Status: ${res.status}`);
            
            expect(responseTime).to.be.lessThan(3000); // Should complete within 3 seconds
            cy.log("✅ Call log creation performance acceptable");
          });
        }
      });
    });
  });

  describe("📈 Load Testing", () => {
    
    it("should handle concurrent onboarding requests", () => {
      cy.log("🔄 Testing concurrent onboarding performance");
      
      const concurrentRequests = [];
      
      // Create multiple concurrent requests
      for (let i = 0; i < 5; i++) {
        const userData = {
          email: generateUniqueEmail(),
          password: "ConcurrentPass123!",
          firstName: "Concurrent",
          lastName: `User${i}`,
          companyName: `Concurrent Company ${i}`
        };

        concurrentRequests.push(
          cy.request({
            method: "POST",
            url: `${BASE_URL}/api/auth/register/`,
            headers: { "Content-Type": "application/json" },
            body: userData,
            failOnStatusCode: false,
          })
        );
      }

      cy.wrap(concurrentRequests).then(() => {
        cy.log("✅ Concurrent onboarding requests completed");
      });
    });

    it("should measure system health under load", () => {
      cy.log("🏥 Testing system health under load");
      
      const startTime = Date.now();
      
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/health/`,
        failOnStatusCode: false,
      }).then((res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        cy.log(`📝 Health Check Performance: ${responseTime}ms`);
        cy.log(`📝 Status: ${res.status}`);
        
        expect(responseTime).to.be.lessThan(1000); // Should complete within 1 second
        cy.log("✅ System health check performance acceptable");
      });
    });
  });
});
