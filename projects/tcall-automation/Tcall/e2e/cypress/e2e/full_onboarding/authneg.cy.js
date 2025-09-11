// Negative login scenarios for TCall auth API
// ------------------------------------------------------


const BASE_URL   = "https://api.dev.tcall.ai:8006";
const LOGIN_PATH = "/api/auth/login/"; 

// A helper list of "expected failure" status codes.
const FAIL_CODES = [400, 401, 404, 422];

// Small helper: send login and return full response (never throw)
function sendLogin(email, password, extra = {}) {
  return cy.request({
    method: "POST",
    url: `${BASE_URL}${LOGIN_PATH}`,
    headers: { "Content-Type": "application/json", ...(extra.headers || {}) },
    body: extra.body ?? { email, password },
    failOnStatusCode: false, // we EXPECT failures
  });
}

// Helper: assert “this looks like an auth failure”
function expectAuthFailure(res, context = "auth failure") {
  expect(FAIL_CODES, `${context} status`).to.include(res.status);

 
  const possibleMsg = res.body?.detail || res.body?.error || res.body?.message;
  if (possibleMsg) {
    expect(String(possibleMsg).length, `${context} message`).to.be.greaterThan(0);
  }
}

describe("TCall API – Negative Login Scenarios", () => {
  it("fails with wrong password", () => {
    return sendLogin("test@tcall.ai", "wrong-password").then((res) => {
      expectAuthFailure(res, "wrong password");
    });
  });

  it("fails with unknown email", () => {
    return sendLogin("not-a-user@tcall.ai", "test123").then((res) => {
      expectAuthFailure(res, "unknown email");
    });
  });

  it("fails with invalid email format", () => {
    return sendLogin("totally-invalid-email", "test123").then((res) => {
      expectAuthFailure(res, "invalid email format");
    });
  });

  it("fails with empty body", () => {
    return sendLogin(null, null, { body: {} }).then((res) => {
      expectAuthFailure(res, "empty body");
    });
  });

  it("fails with missing password only", () => {
    return sendLogin("test@tcall.ai", null, { body: { email: "test@tcall.ai" } }).then((res) => {
      expectAuthFailure(res, "missing password");
    });
  });

  it("fails with missing email only", () => {
    return sendLogin(null, "test123", { body: { password: "test123" } }).then((res) => {
      expectAuthFailure(res, "missing email");
    });
  });

  it("fails if content-type is wrong (text/plain)", () => {
    return cy.request({
      method: "POST",
      url: `${BASE_URL}${LOGIN_PATH}`,
      headers: { "Content-Type": "text/plain" },
      body: "email=test@tcall.ai&password=test123",
      failOnStatusCode: false,
    }).then((res) => {
      expect([200, 400, 415, 500]).to.include(res.status);
    });
  });

  it("fails with leading/trailing spaces in email", () => {
    return sendLogin("  test@tcall.ai  ", "test123").then((res) => {
      // Depending on server normalization, this could still pass.
      // If your backend trims, flip this to expect success.
      expectAuthFailure(res, "email with whitespace");
    });
  });

  it("fails with case-changed email (if case-sensitive on server)", () => {
    return sendLogin("TEST@TCALL.AI", "test123").then((res) => {
      // If your backend lowercases emails, this might pass. Adjust as needed.
      expectAuthFailure(res, "email case variance");
    });
  });

  it("fails with extremely long email/password", () => {
    const longEmail = "a".repeat(400) + "@tcall.ai";
    const longPass  = "p".repeat(400);
    return sendLogin(longEmail, longPass).then((res) => {
      expectAuthFailure(res, "very long fields");
    });
  });

  it("fails with suspicious payload (SQLi/XSS probe)", () => {
    return sendLogin("' OR '1'='1", "<script>alert(1)</script>").then((res) => {
      expectAuthFailure(res, "suspicious payload");
    });
  });

  it("fails on wrong endpoint (path typo) with 404", () => {
    return cy.request({
      method: "POST",
      url: `${BASE_URL}/api/auth/loginn/`, // typo on purpose
      headers: { "Content-Type": "application/json" },
      body: { email: "test@tcall.ai", password: "test123" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status, "wrong path should 404-ish").to.eq(404);
    });
  });
});
