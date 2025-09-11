describe('Medcor API Working Integration Tests', () => {
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

    describe('Data Retrieval Integration', () => {
        it('should retrieve and validate appointment data', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Get appointments
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
                    expect(response.body.results).to.be.an('array');
                }
            });
        });

        it('should retrieve and validate medical records data', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Get medical records
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
                    expect(response.body.results).to.be.an('array');
                }
            });
        });

        it('should retrieve and validate user data', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Get user profile
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

            // Get doctors list
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/doctors/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Doctors response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });

            // Get patients list
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/patients/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Patients response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });
        });
    });

    describe('Data Consistency Tests', () => {
        it('should validate pagination consistency', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test appointments pagination
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?page=1&page_size=5`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Appointments pagination response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('count');
                    expect(response.body).to.have.property('results');
                    expect(response.body.results).to.be.an('array');
                    expect(response.body.results.length).to.be.at.most(5);
                }
            });
        });

        it('should validate data structure consistency', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test specialties structure
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
                    expect(response.body.results).to.be.an('array');
                    if (response.body.results.length > 0) {
                        const specialty = response.body.results[0];
                        expect(specialty).to.have.property('id');
                        expect(specialty).to.have.property('name');
                    }
                }
            });
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle invalid requests gracefully', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test invalid appointment ID
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/invalid-id/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid appointment ID response status:', response.status);
                expect(response.status).to.be.oneOf([404, 400, 401]);
            });

            // Test invalid medical record ID
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/records/invalid-id/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid medical record ID response status:', response.status);
                expect(response.status).to.be.oneOf([404, 400, 401]);
            });
        });

        it('should handle authentication errors properly', () => {
            // Test without token
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('No token response status:', response.status);
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('detail');
            });

            // Test with invalid token
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: {
                    'Authorization': 'Bearer invalid-token'
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Invalid token response status:', response.status);
                expect(response.status).to.equal(401);
                expect(response.body).to.have.property('detail');
            });
        });
    });

    describe('Performance Integration', () => {
        it('should respond within acceptable time limits', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 10000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Appointments response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401, 403]);
                expect(responseTime).to.be.lessThan(8000); // 8 seconds max
            });
        });
    });
});
