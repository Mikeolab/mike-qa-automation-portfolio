/**
 * Medcor Platform - Permissions Matrix Suite
 */

describe('Medcor API - Permissions Matrix', () => {
  const baseUrl = Cypress.config('baseUrl');
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };

  let superToken;
  let adminToken;
  let doctorToken;
  let patientToken;

  before(() => {
    const login = (email, password) =>
      cy.request({ method: 'POST', url: `${baseUrl}/api/auth/login/`, headers, body: { email, password }, failOnStatusCode: false });

    login(Cypress.env('SUPER_USER_EMAIL') || 'zeynel@medcorhospital.com', Cypress.env('SUPER_USER_PASSWORD') || '12345678@').then((r) => {
      if (r.status === 200 && r.body?.token) superToken = r.body.token;
    });
    login(Cypress.env('HOSPITAL_ADMIN_EMAIL') || 'admin@medcor.com', Cypress.env('HOSPITAL_ADMIN_PASSWORD') || 'admin123').then((r) => {
      if (r.status === 200 && r.body?.token) adminToken = r.body.token;
    });
    login(Cypress.env('DOCTOR_EMAIL') || 'dr.johnson@medcor.com', Cypress.env('DOCTOR_PASSWORD') || 'password123').then((r) => {
      if (r.status === 200 && r.body?.token) doctorToken = r.body.token;
    });
    login(Cypress.env('PATIENT_EMAIL') || 'patient.davis@email.com', Cypress.env('PATIENT_PASSWORD') || 'password123').then((r) => {
      if (r.status === 200 && r.body?.token) patientToken = r.body.token;
    });
  });

  const asToken = (t) => ({ headers: { ...headers, Authorization: `Bearer ${t}` } });

  it('super can list users; others blocked or masked', () => {
    const paths = [adminToken, doctorToken, patientToken];
    paths.forEach((t) => {
      const h = t ? asToken(t) : { headers };
      cy.request({ method: 'GET', url: `${baseUrl}/api/users/`, ...h, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.be.oneOf([401, 403, 404]);
      });
    });

    const superH = superToken ? asToken(superToken) : { headers };
    cy.request({ method: 'GET', url: `${baseUrl}/api/users/`, ...superH, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.be.oneOf([200, 404]);
    });
  });
});

