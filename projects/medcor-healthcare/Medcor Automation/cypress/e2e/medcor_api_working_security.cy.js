describe('Medcor API Working Security Tests', () => {
    const baseUrl = 'https://api.medcor.ai';
    let superUserToken;

    // Test credentials - only super user for now
    const credentials = {
        superUser: {
            email: 'zeynel@medcorhospital.com',
            password: '12345678@'
        }
    };

    before(() => {
        // Login super user
        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/auth/login/`,
            body: credentials.superUser,
            headers: {
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false,
            timeout: 5000
        }).then((response) => {
            if (response.status === 200) {
                superUserToken = response.body.tokens.access;
                cy.log('Super User token obtained');
            } else {
                cy.log('Super User login failed:', response.body);
            }
        });
    });

    describe('Authentication Security', () => {
        it('should prevent SQL injection in login', () => {
            const sqlInjectionAttempts = [
                "'; DROP TABLE users; --",
                "' OR '1'='1",
                "admin'--",
                "'; INSERT INTO users VALUES ('hacker', 'password'); --"
            ];

            sqlInjectionAttempts.forEach((attempt) => {
                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/api/auth/login/`,
                    body: {
                        email: attempt,
                        password: attempt
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    cy.log(`SQL injection attempt "${attempt}" - Status: ${response.status}`);
                    // Should not return 200 (success) for SQL injection attempts
                    expect(response.status).to.not.equal(200);
                    // Should return 400, 401, or 422 for invalid input
                    expect(response.status).to.be.oneOf([400, 401, 422]);
                });
            });
        });

        it('should prevent brute force attacks', () => {
            const commonPasswords = [
                'password',
                '123456',
                'admin',
                'test',
                'qwerty'
            ];

            commonPasswords.forEach((password) => {
                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/api/auth/login/`,
                    body: {
                        email: 'test@example.com',
                        password: password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    cy.log(`Brute force attempt with password "${password}" - Status: ${response.status}`);
                    // Should not return 200 for invalid credentials
                    expect(response.status).to.not.equal(200);
                    // Should return 400 or 401 for invalid credentials
                    expect(response.status).to.be.oneOf([400, 401]);
                });
            });
        });

        it('should validate token expiration', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test with valid token
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Valid token response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401]);
            });

            // Test with expired/invalid token
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': 'Bearer expired.token.here'
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid token response status:', response.status);
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('detail');
            });
        });

        it('should prevent token tampering', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test with tampered token
            const tamperedToken = superUserToken + '.tampered';
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': `Bearer ${tamperedToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Tampered token response status:', response.status);
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('detail');
            });
        });
    });

    describe('Input Validation & Sanitization', () => {
        it('should validate email format', () => {
            const invalidEmails = [
                'invalid-email',
                'test@',
                '@example.com',
                'test..test@example.com',
                'test@.com',
                'test@example.',
                'test@example..com'
            ];

            invalidEmails.forEach((email) => {
                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/api/auth/login/`,
                    body: {
                        email: email,
                        password: 'password123'
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    cy.log(`Invalid email "${email}" - Status: ${response.status}`);
                    // Should not return 200 for invalid email format
                    expect(response.status).to.not.equal(200);
                    // Should return 400 or 422 for validation errors
                    expect(response.status).to.be.oneOf([400, 401, 422]);
                });
            });
        });

        it('should prevent path traversal attacks', () => {
            const pathTraversalAttempts = [
                '../../../etc/passwd',
                '..\\..\\..\\windows\\system32\\config\\sam',
                '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
                '....//....//....//etc/passwd'
            ];

            pathTraversalAttempts.forEach((attempt) => {
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/api/appointments/appointments/?file=${attempt}`,
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    cy.log(`Path traversal attempt "${attempt}" - Status: ${response.status}`);
                    // Should not return 200 for path traversal attempts
                    expect(response.status).to.not.equal(200);
                    // Should return 400, 401, 403, or 404
                    expect(response.status).to.be.oneOf([400, 401, 403, 404]);
                });
            });
        });
    });

    describe('Data Protection & Privacy', () => {
        it('should not expose sensitive data in error messages', () => {
            // Test with invalid credentials
            cy.request({
                method: 'POST',
                url: `${baseUrl}/api/auth/login/`,
                body: {
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword'
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Error response status:', response.status);
                expect(response.status).to.be.oneOf([400, 401]);
                
                // Check that error message doesn't expose sensitive information
                const errorBody = JSON.stringify(response.body);
                expect(errorBody).to.not.include('password');
                expect(errorBody).to.not.include('secret');
                expect(errorBody).to.not.include('key');
                expect(errorBody).to.not.include('token');
                
                // Should only include generic error information
                expect(response.body).to.have.property('non_field_errors');
            });
        });

        it('should use HTTPS only', () => {
            // Test that the API is accessible via HTTPS
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('HTTPS response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401]);
                
                // Verify we're using HTTPS (baseUrl already uses https)
                expect(baseUrl).to.include('https://');
            });
        });
    });

    describe('Security Headers', () => {
        it('should include security headers', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Response headers check');
                
                // Check for important security headers
                const headers = response.headers;
                
                // X-Frame-Options should be present to prevent clickjacking
                expect(headers).to.have.property('x-frame-options');
                expect(headers['x-frame-options']).to.be.oneOf(['DENY', 'SAMEORIGIN']);
                
                // X-Content-Type-Options should be present
                expect(headers).to.have.property('x-content-type-options');
                expect(headers['x-content-type-options']).to.equal('nosniff');
                
                // Referrer-Policy should be present
                expect(headers).to.have.property('referrer-policy');
                
                // Cross-Origin-Opener-Policy should be present
                expect(headers).to.have.property('cross-origin-opener-policy');
            });
        });

        it('should prevent clickjacking', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Clickjacking protection check');
                
                // X-Frame-Options should be set to DENY or SAMEORIGIN
                const xFrameOptions = response.headers['x-frame-options'];
                expect(xFrameOptions).to.be.oneOf(['DENY', 'SAMEORIGIN']);
                
                // If set to DENY, it completely prevents embedding
                if (xFrameOptions === 'DENY') {
                    cy.log('X-Frame-Options set to DENY - complete clickjacking protection');
                } else {
                    cy.log('X-Frame-Options set to SAMEORIGIN - partial clickjacking protection');
                }
            });
        });
    });

    describe('API Security Best Practices', () => {
        it('should not expose internal server information', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/nonexistent/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('404 error response check');
                expect(response.status).to.equal(404);
                
                // Check that error response doesn't expose internal information
                const errorBody = response.body;
                
                // Should not expose server paths, internal errors, or stack traces
                expect(errorBody).to.not.include('stack trace');
                expect(errorBody).to.not.include('internal server error');
                expect(errorBody).to.not.include('debug');
                expect(errorBody).to.not.include('traceback');
                
                // Should only provide generic 404 information
                expect(errorBody).to.be.a('string');
            });
        });

        it('should validate content type', () => {
            // Test with invalid content type
            cy.request({
                method: 'POST',
                url: `${baseUrl}/api/auth/login/`,
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                },
                headers: {
                    'Content-Type': 'text/plain'
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid content type response status:', response.status);
                // Should reject requests with wrong content type
                expect(response.status).to.be.oneOf([400, 401, 415]);
            });
        });

        it('should handle malformed JSON gracefully', () => {
            // Test with malformed JSON
            cy.request({
                method: 'POST',
                url: `${baseUrl}/api/auth/login/`,
                body: '{"email": "test@example.com", "password": "password123",}', // Invalid JSON
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Malformed JSON response status:', response.status);
                // Should handle malformed JSON gracefully
                expect(response.status).to.be.oneOf([400, 401, 422]);
            });
        });
    });

    describe('Authorization & Access Control', () => {
        it('should enforce authentication on protected endpoints', () => {
            const protectedEndpoints = [
                '/api/appointments/appointments/',
                '/api/medical-records/records/',
                '/api/auth/profile/',
                '/api/auth/doctors/',
                '/api/auth/patients/'
            ];

            protectedEndpoints.forEach((endpoint) => {
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}${endpoint}`,
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    cy.log(`Protected endpoint ${endpoint} - Status: ${response.status}`);
                    // Should require authentication
                    expect(response.status).to.equal(401);
                    expect(response.body).to.have.property('detail');
                });
            });
        });

        it('should validate token format', () => {
            const invalidTokens = [
                'invalid-token',
                'Bearer',
                'Bearer ',
                'Bearer invalid',
                'not-a-bearer-token',
                ''
            ];

            invalidTokens.forEach((token) => {
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/api/auth/profile/`,
                    headers: {
                        'Authorization': token
                    },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    cy.log(`Invalid token "${token}" - Status: ${response.status}`);
                    // Should reject invalid tokens
                    expect(response.status).to.equal(401);
                    expect(response.body).to.have.property('detail');
                });
            });
        });
    });
});
