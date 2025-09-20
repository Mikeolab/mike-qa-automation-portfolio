// cypress/e2e/tcall.smoke.cy.js

// ===== constants you can edit later =====
const BASE_URL      = "https://api.dev.tcall.ai:8006";
const LOGIN_PATH    = "/api/auth/login/";     // <- FIXED (was /app/auth/login/)
const CALL_INIT     = "/api/calls/initiate/"; // unchanged

const EMAIL         = "test@tcall.ai";
const PASSWORD      = "test123";

// optional placeholders you’ll use later
const AGENT_ID      = 152;
const TO_NUMBER     = "2349158412345";
const PHONE_NUMBER_ID = 9572;

// ===== helper: authenticate and return token =====
function apiLogin() {
  return cy.request({
    method: "POST",
    url: `${BASE_URL}${LOGIN_PATH}`,
    headers: { "Content-Type": "application/json" },
    body: { email: EMAIL, password: PASSWORD },
    // set to true because we expect 200 here; change to false if you want to
    // assert the status yourself during debugging
    failOnStatusCode: true,
  }).then((res) => {
    expect(res.status, "login status").to.eq(200);
    const token = res.body?.token || res.body?.access;
    expect(token, "auth token").to.exist;
    return token;
  });
}

describe("TCall API smoke test (safe / no real call)", () => {
  it("logs in via API but does NOT trigger a real call", () => {
    apiLogin().then((token) => {
      // Intentionally send an empty body so the backend rejects the call
      cy.request({
        method: "POST",
        url: `${BASE_URL}${CALL_INIT}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {},                 // <- no agent_id, no number (SAFE)
        failOnStatusCode: false,  // we EXPECT a non-2xx response
      }).then((r) => {
        // Should NOT be a success; common errors are 400/422/403
        expect(r.status, "call should be rejected").to.not.eq(200);
        expect([400, 422, 403]).to.include(r.status);
        cy.log(`Safe check passed with status ${r.status}`);
      });
    });
  });
});
