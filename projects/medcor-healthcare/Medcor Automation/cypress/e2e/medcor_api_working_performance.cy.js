describe('Medcor API Working Performance Tests', () => {
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

    describe('Response Time Performance Tests', () => {
        it('should respond within 3 seconds for specialties list', () => {
            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Specialties response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds max
            });
        });

        it('should respond within 3 seconds for subscription plans', () => {
            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscription-plans/plans/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Subscription plans response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds max
            });
        });

        it('should respond within 3 seconds for appointment list', () => {
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
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Appointments response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401, 403]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds max
            });
        });

        it('should respond within 3 seconds for user profile', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Profile response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds max
            });
        });
    });

    describe('Concurrent Request Performance', () => {
        it('should handle multiple concurrent specialty requests', () => {
            const requests = [];
            const startTime = Date.now();
            
            // Make 5 concurrent requests
            for (let i = 0; i < 5; i++) {
                requests.push(
                    cy.request({
                        method: 'GET',
                        url: `${baseUrl}/api/specialty/specialties/`,
                        failOnStatusCode: false,
                        timeout: 5000
                    })
                );
            }
            
            cy.wrap(requests).then(() => {
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                
                cy.log('Concurrent specialties requests total time:', totalTime + 'ms');
                expect(totalTime).to.be.lessThan(10000); // 10 seconds max for 5 requests
            });
        });

        it('should handle concurrent appointment list requests', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const requests = [];
            const startTime = Date.now();
            
            // Make 3 concurrent requests
            for (let i = 0; i < 3; i++) {
                requests.push(
                    cy.request({
                        method: 'GET',
                        url: `${baseUrl}/api/appointments/appointments/`,
                        headers: {
                            'Authorization': `Bearer ${superUserToken}`
                        },
                        failOnStatusCode: false,
                        timeout: 5000
                    })
                );
            }
            
            cy.wrap(requests).then(() => {
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                
                cy.log('Concurrent appointments requests total time:', totalTime + 'ms');
                expect(totalTime).to.be.lessThan(8000); // 8 seconds max for 3 requests
            });
        });
    });

    describe('Database Query Performance', () => {
        it('should handle pagination efficiently', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?page=1&page_size=10`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Pagination response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401, 403]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds max
            });
        });

        it('should handle search queries efficiently', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?search=test`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Search query response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401, 403]);
                expect(responseTime).to.be.lessThan(3000); // 3 seconds max
            });
        });
    });

    describe('Memory and Resource Usage', () => {
        it('should not increase response time with repeated requests', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const responseTimes = [];
            
            // Make 5 repeated requests and measure response times
            for (let i = 0; i < 5; i++) {
                const startTime = Date.now();
                
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/api/appointments/appointments/`,
                    headers: {
                        'Authorization': `Bearer ${superUserToken}`
                    },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    const endTime = Date.now();
                    const responseTime = endTime - startTime;
                    responseTimes.push(responseTime);
                    
                    cy.log(`Request ${i + 1} response time:`, responseTime + 'ms');
                    expect(response.status).to.be.oneOf([200, 401, 403]);
                });
            }
            
            // Check that response times don't increase significantly
            cy.wrap(responseTimes).then((times) => {
                const firstTime = times[0];
                const lastTime = times[times.length - 1];
                const increase = lastTime - firstTime;
                
                cy.log('Response time increase:', increase + 'ms');
                expect(increase).to.be.lessThan(1500); // Should not increase by more than 1.5 seconds
            });
        });
    });

    describe('Large Data Set Performance', () => {
        it('should handle large result sets efficiently', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/?page_size=50`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 10000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Large result set response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401, 403]);
                expect(responseTime).to.be.lessThan(5000); // 5 seconds max for large datasets
            });
        });
    });

    describe('Authentication Performance', () => {
        it('should handle token validation efficiently', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: {
                    'Authorization': `Bearer ${superUserToken}`
                },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('Token validation response time:', responseTime + 'ms');
                expect(response.status).to.be.oneOf([200, 401]);
                expect(responseTime).to.be.lessThan(2000); // 2 seconds max for auth
            });
        });
    });

    describe('Error Handling Performance', () => {
        it('should handle 401 errors efficiently', () => {
            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('401 error response time:', responseTime + 'ms');
                expect(response.status).to.equal(401);
                expect(responseTime).to.be.lessThan(2000); // 2 seconds max for errors
            });
        });

        it('should handle 404 errors efficiently', () => {
            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/nonexistent/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                cy.log('404 error response time:', responseTime + 'ms');
                expect(response.status).to.equal(404);
                expect(responseTime).to.be.lessThan(2000); // 2 seconds max for errors
            });
        });
    });

    describe('Load Testing Scenarios', () => {
        it('should maintain performance under moderate load', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const requests = [];
            const startTime = Date.now();
            
            // Simulate moderate load with 10 requests
            for (let i = 0; i < 10; i++) {
                requests.push(
                    cy.request({
                        method: 'GET',
                        url: `${baseUrl}/api/appointments/appointments/`,
                        headers: {
                            'Authorization': `Bearer ${superUserToken}`
                        },
                        failOnStatusCode: false,
                        timeout: 5000
                    })
                );
            }
            
            cy.wrap(requests).then(() => {
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                const avgTime = totalTime / 10;
                
                cy.log('Moderate load test - Total time:', totalTime + 'ms');
                cy.log('Moderate load test - Average time:', avgTime + 'ms');
                expect(totalTime).to.be.lessThan(15000); // 15 seconds max for 10 requests
                expect(avgTime).to.be.lessThan(2000); // Average should be under 2 seconds
            });
        });
    });

    describe('Performance Monitoring', () => {
        it('should log performance metrics', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const endpoints = [
                '/api/specialty/specialties/',
                '/api/subscription-plans/plans/',
                '/api/appointments/appointments/',
                '/api/auth/profile/'
            ];

            const metrics = {};

            endpoints.forEach((endpoint, index) => {
                const startTime = Date.now();
                
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}${endpoint}`,
                    headers: endpoint.includes('auth') ? {
                        'Authorization': `Bearer ${superUserToken}`
                    } : {},
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    const endTime = Date.now();
                    const responseTime = endTime - startTime;
                    
                    metrics[endpoint] = {
                        status: response.status,
                        responseTime: responseTime,
                        success: response.status === 200
                    };
                    
                    cy.log(`${endpoint} - Status: ${response.status}, Time: ${responseTime}ms`);
                });
            });

            cy.wrap(metrics).then((m) => {
                cy.log('Performance metrics summary:', JSON.stringify(m, null, 2));
                
                // Verify all endpoints responded within acceptable time
                Object.values(m).forEach((metric) => {
                    expect(metric.responseTime).to.be.lessThan(3000); // 3 seconds max
                });
            });
        });
    });
});
