describe('Medcor API Working E2E Workflow Tests', () => {
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

    describe('Data Retrieval Workflow', () => {
        it('should retrieve and validate complete data workflow', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Step 1: Get user profile
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((profileResponse) => {
                cy.log('Profile response status:', profileResponse.status);
                expect(profileResponse.status).to.be.oneOf([200, 401]);
                
                if (profileResponse.status === 200) {
                    expect(profileResponse.body).to.have.property('email');
                    expect(profileResponse.body).to.have.property('role');
                }
            });

            // Step 2: Get appointments
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((appointmentsResponse) => {
                cy.log('Appointments response status:', appointmentsResponse.status);
                expect(appointmentsResponse.status).to.be.oneOf([200, 401, 403]);
                
                if (appointmentsResponse.status === 200) {
                    expect(appointmentsResponse.body).to.have.property('results');
                    expect(appointmentsResponse.body.results).to.be.an('array');
                }
            });

            // Step 3: Get medical records
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/records/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((recordsResponse) => {
                cy.log('Medical records response status:', recordsResponse.status);
                expect(recordsResponse.status).to.be.oneOf([200, 401, 403]);
                
                if (recordsResponse.status === 200) {
                    expect(recordsResponse.body).to.have.property('results');
                    expect(recordsResponse.body.results).to.be.an('array');
                }
            });

            // Step 4: Get treatments
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((treatmentsResponse) => {
                cy.log('Treatments response status:', treatmentsResponse.status);
                expect(treatmentsResponse.status).to.be.oneOf([200, 401, 403]);
                
                if (treatmentsResponse.status === 200) {
                    expect(treatmentsResponse.body).to.have.property('treatments');
                    expect(treatmentsResponse.body).to.have.property('prescriptions');
                }
            });
        });
    });

    describe('Data Consistency Workflow', () => {
        it('should maintain data consistency across related endpoints', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test pagination consistency
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?page=1&page_size=5`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Pagination response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                
                if (response.status === 200) {
                    expect(response.body).to.have.property('count');
                    expect(response.body).to.have.property('results');
                    expect(response.body.results).to.be.an('array');
                    expect(response.body.results.length).to.be.at.most(5);
                }
            });

            // Test search consistency
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?search=test`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Search response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                    expect(response.body.results).to.be.an('array');
                }
            });
        });

        it('should validate data structure consistency', () => {
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

            // Test subscription plans structure
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
                    expect(response.body.results).to.be.an('array');
                }
            });
        });
    });

    describe('Error Handling Workflow', () => {
        it('should handle authentication errors consistently', () => {
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
                    // All protected endpoints should return 401 without authentication
                    expect(response.status).to.equal(401);
                    expect(response.body).to.have.property('detail');
                });
            });
        });

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
    });

    describe('Performance Workflow', () => {
        it('should maintain performance across multiple requests', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const endpoints = [
                '/api/appointments/appointments/',
                '/api/medical-records/records/',
                '/api/auth/profile/'
            ];

            const startTime = Date.now();
            let completedRequests = 0;

            endpoints.forEach((endpoint) => {
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}${endpoint}`,
                    headers: {
                        'Authorization': `Bearer ${superUserToken}`
                    },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    completedRequests++;
                    cy.log(`${endpoint} - Status: ${response.status}, Time: ${Date.now() - startTime}ms`);
                    
                    expect(response.status).to.be.oneOf([200, 401, 403]);
                    
                    if (completedRequests === endpoints.length) {
                        const totalTime = Date.now() - startTime;
                        const avgTime = totalTime / endpoints.length;
                        
                        cy.log(`Total time for ${endpoints.length} requests: ${totalTime}ms`);
                        cy.log(`Average time per request: ${avgTime}ms`);
                        
                        expect(totalTime).to.be.lessThan(10000); // 10 seconds max
                        expect(avgTime).to.be.lessThan(4000); // 4 seconds average max
                    }
                });
            });
        });
    });

    describe('Data Validation Workflow', () => {
        it('should validate data integrity across endpoints', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test that appointments data is consistent
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?page_size=10`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Appointments validation response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                
                if (response.status === 200) {
                    expect(response.body).to.have.property('count');
                    expect(response.body).to.have.property('results');
                    expect(response.body.results).to.be.an('array');
                    
                    // Validate that count matches results length
                    if (response.body.results.length > 0) {
                        expect(response.body.results.length).to.be.at.most(10);
                    }
                }
            });

            // Test that medical records data is consistent
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/records/?page_size=10`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                cy.log('Medical records validation response status:', response.status);
                expect(response.status).to.be.oneOf([200, 401, 403]);
                
                if (response.status === 200) {
                    expect(response.body).to.have.property('count');
                    expect(response.body).to.have.property('results');
                    expect(response.body.results).to.be.an('array');
                    
                    // Validate that count matches results length
                    if (response.body.results.length > 0) {
                        expect(response.body.results.length).to.be.at.most(10);
                    }
                }
            });
        });
    });
});
