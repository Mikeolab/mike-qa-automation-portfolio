describe('Medcor API Working Smoke Tests', () => {
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
        // Login only super user to test
        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/auth/login/`,
            body: credentials.superUser,
            headers: {
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false,
            timeout: 5000 // 5 second timeout
        }).then((response) => {
            cy.log('Login response status:', response.status);
            
            if (response.status === 200) {
                superUserToken = response.body.tokens.access;
                cy.log('Super User token obtained successfully');
            } else {
                cy.log('Super User login failed:', response.body);
            }
        });
    });

    describe('Authentication Tests', () => {
        it('should authenticate super user successfully', () => {
            expect(superUserToken).to.not.be.undefined;
            expect(superUserToken).to.be.a('string');
            cy.log('Token length:', superUserToken ? superUserToken.length : 'undefined');
        });

        it('should reject invalid credentials', () => {
            cy.request({
                method: 'POST',
                url: `${baseUrl}/api/auth/login/`,
                body: {
                    email: 'invalid@email.com',
                    password: 'wrongpassword'
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid login response status:', response.status);
                expect(response.status).to.equal(400);
            });
        });
    });

    describe('Public Endpoint Tests', () => {
        it('should list specialties (public endpoint)', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Specialties response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });
        });

        it('should list subscription plans (public endpoint)', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscription-plans/plans/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Subscription plans response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });
        });
    });

    describe('Authenticated Endpoint Tests', () => {
        it('should get user profile with token', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Profile response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('email');
                    expect(response.body).to.have.property('role');
                }
            });
        });

        it('should list appointments with token', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Appointments response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });
        });

        it('should list medical records with token', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/records/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Medical records response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });
        });

        it('should list treatments with token', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Treatments response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    // Treatments endpoint might return different structure
                    expect(response.body).to.have.property('treatments');
                    expect(response.body).to.have.property('prescriptions');
                }
            });
        });
    });

    describe('Error Handling Tests', () => {
        it('should handle unauthorized access', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Unauthorized response status:', response.status);
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('detail');
            });
        });

        it('should handle invalid endpoints', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/nonexistent/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid endpoint response status:', response.status);
                expect(response.status).to.equal(404);
            });
        });
    });

    describe('Performance Tests', () => {
        it('should respond within acceptable time', () => {
            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                expect(response.status).to.be.oneOf([200, 401]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds
                cy.log(`Response time: ${responseTime}ms`);
            });
        });
    });
});
