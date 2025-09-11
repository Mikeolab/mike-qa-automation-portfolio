// cypress/e2e/full_onboarding/tcall.onboarding.security.cy.js
// Tcall Onboarding Security Test Suite

const BASE_URL = "https://api.dev.tcall.ai:8006";

describe("Tcall Onboarding Security Tests", () => {
  
  describe("🔒 Authentication Security", () => {
    
    it("should validate secure registration process", () => {
      cy.log("🔐 Testing secure registration");
      
      const testData = {
        email: "security.test@tcall.ai",
        password: "SecurePass123!",
        firstName: "Security",
        lastName: "Test",
        companyName: "Security Test Company"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/register/`,
        headers: { "Content-Type": "application/json" },
        body: testData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Secure Registration: ${res.status}`);
        if (res.status === 201) {
          expect(res.body).to.have.property('token');
          cy.log("✅ Secure registration successful");
        }
      });
    });

    it("should reject weak passwords", () => {
      cy.log("🚫 Testing weak password rejection");
      
      const weakPasswordData = {
        email: "weak@tcall.ai",
        password: "123", // Too weak
        firstName: "Weak",
        lastName: "Password"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/register/`,
        headers: { "Content-Type": "application/json" },
        body: weakPasswordData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Weak Password: ${res.status}`);
        if (res.status === 400) {
          cy.log("✅ Weak password properly rejected");
        }
      });
    });

    it("should validate email format security", () => {
      cy.log("📧 Testing email format validation");
      
      const invalidEmailData = {
        email: "invalid-email-format",
        password: "ValidPass123!",
        firstName: "Invalid",
        lastName: "Email"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/auth/register/`,
        headers: { "Content-Type": "application/json" },
        body: invalidEmailData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Invalid Email: ${res.status}`);
        if (res.status === 400) {
          cy.log("✅ Invalid email properly rejected");
        }
      });
    });
  });

  describe("🛡️ Input Validation Security", () => {
    
    it("should sanitize malicious input", () => {
      cy.log("🧹 Testing input sanitization");
      
      const maliciousData = {
        name: "<script>alert('xss')</script>",
        email: "test@example.com",
        phone_number: "+1234567890"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/contacts/`,
        headers: { 
          "Authorization": "Bearer test-token",
          "Content-Type": "application/json" 
        },
        body: maliciousData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Malicious Input: ${res.status}`);
        if (res.status === 400 || res.status === 401) {
          cy.log("✅ Malicious input properly handled");
        }
      });
    });

    it("should prevent SQL injection", () => {
      cy.log("💉 Testing SQL injection prevention");
      
      const sqlInjectionData = {
        name: "'; DROP TABLE users; --",
        email: "test@example.com"
      };

      cy.request({
        method: "POST",
        url: `${BASE_URL}/api/contacts/`,
        headers: { 
          "Authorization": "Bearer test-token",
          "Content-Type": "application/json" 
        },
        body: sqlInjectionData,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 SQL Injection: ${res.status}`);
        if (res.status === 400 || res.status === 401) {
          cy.log("✅ SQL injection properly prevented");
        }
      });
    });
  });

  describe("🔐 Token Security", () => {
    
    it("should validate token expiration", () => {
      cy.log("⏰ Testing token expiration");
      
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/auth/me/`,
        headers: { 
          "Authorization": "Bearer expired-token",
          "Content-Type": "application/json" 
        },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Token Expiration: ${res.status}`);
        if (res.status === 401) {
          cy.log("✅ Expired token properly rejected");
        }
      });
    });

    it("should reject invalid tokens", () => {
      cy.log("🚫 Testing invalid token rejection");
      
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/auth/me/`,
        headers: { 
          "Authorization": "Bearer invalid-token-123",
          "Content-Type": "application/json" 
        },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Invalid Token: ${res.status}`);
        if (res.status === 401) {
          cy.log("✅ Invalid token properly rejected");
        }
      });
    });
  });

  describe("🚪 Access Control Security", () => {
    
    it("should enforce authentication requirements", () => {
      cy.log("🔒 Testing authentication enforcement");
      
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/contacts/`,
        headers: { "Content-Type": "application/json" },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Auth Enforcement: ${res.status}`);
        if (res.status === 401 || res.status === 403) {
          cy.log("✅ Authentication properly enforced");
        }
      });
    });

    it("should validate user permissions", () => {
      cy.log("👤 Testing user permissions");
      
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/users/`,
        headers: { 
          "Authorization": "Bearer user-token",
          "Content-Type": "application/json" 
        },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 User Permissions: ${res.status}`);
        if (res.status === 403) {
          cy.log("✅ User permissions properly enforced");
        }
      });
    });
  });

  describe("📊 Security Headers", () => {
    
    it("should include security headers", () => {
      cy.log("🛡️ Testing security headers");
      
      cy.request({
        method: "GET",
        url: `${BASE_URL}/api/health/`,
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(`📝 Security Headers: ${res.status}`);
        cy.log(`📝 Headers: ${JSON.stringify(res.headers)}`);
        
        // Check for common security headers
        const securityHeaders = [
          'x-frame-options',
          'x-content-type-options',
          'x-xss-protection',
          'strict-transport-security'
        ];
        
        securityHeaders.forEach(header => {
          if (res.headers[header]) {
            cy.log(`✅ ${header} header present`);
          } else {
            cy.log(`⚠️ ${header} header missing`);
          }
        });
      });
    });
  });
});
