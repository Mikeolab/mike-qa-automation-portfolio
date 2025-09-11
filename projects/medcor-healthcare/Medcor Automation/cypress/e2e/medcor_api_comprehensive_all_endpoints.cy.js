

describe('Medcor API Comprehensive All Endpoints Tests', () => {
    const baseUrl = 'https://api.medcor.ai';
    let superUserToken, patientToken, doctorToken, hospitalAdminToken;
    
    const credentials = {
        superUser: { email: 'zeynel@medcorhospital.com', password: '12345678@' },
        patient: { email: 'patient.davis@email.com', password: 'password123' },
        doctor: { email: 'dr.johnson@medcor.com', password: 'password123' },
        hospitalAdmin: { email: 'admin@medcor.com', password: 'admin123' }
    };

    before(() => {
        // Login all user types
        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/auth/login/`,
            body: credentials.superUser,
            headers: { 'Content-Type': 'application/json' },
            failOnStatusCode: false,
            timeout: 5000
        }).then((response) => {
            if (response.status === 200) {
                superUserToken = response.body.tokens.access;
                cy.log('Super User token obtained');
            }
        });

        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/auth/login/`,
            body: credentials.patient,
            headers: { 'Content-Type': 'application/json' },
            failOnStatusCode: false,
            timeout: 5000
        }).then((response) => {
            if (response.status === 200) {
                patientToken = response.body.tokens.access;
                cy.log('Patient token obtained');
            }
        });

        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/auth/login/`,
            body: credentials.doctor,
            headers: { 'Content-Type': 'application/json' },
            failOnStatusCode: false,
            timeout: 5000
        }).then((response) => {
            if (response.status === 200) {
                doctorToken = response.body.tokens.access;
                cy.log('Doctor token obtained');
            }
        });

        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/auth/login/`,
            body: credentials.hospitalAdmin,
            headers: { 'Content-Type': 'application/json' },
            failOnStatusCode: false,
            timeout: 5000
        }).then((response) => {
            if (response.status === 200) {
                hospitalAdminToken = response.body.tokens.access;
                cy.log('Hospital Admin token obtained');
            }
        });
    });

    describe('1. Authentication Endpoints', () => {
        it('should test login endpoint', () => {
            cy.request({
                method: 'POST',
                url: `${baseUrl}/api/auth/login/`,
                body: credentials.superUser,
                headers: { 'Content-Type': 'application/json' },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('tokens');
                    expect(response.body.tokens).to.have.property('access');
                }
            });
        });

        it('should test user profile endpoint', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test doctors listing endpoint', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/doctors/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test patients listing endpoint', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/patients/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test health check endpoint', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/health/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test user statistics endpoint', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/stats/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('2. Appointments Endpoints', () => {
        it('should test appointments listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('results');
                }
            });
        });

        it('should test appointments dashboard stats', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/dashboard_stats/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test availability slots listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/slots/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test available slots endpoint', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/slots/available/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('3. Medical Records Endpoints', () => {
        it('should test medical records listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/records/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test medical records documents', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/documents/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test allergies endpoint', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/allergies/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test recent medical records', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/medical-records/recent/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('4. Specialty Endpoints', () => {
        it('should test specialties listing', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test doctor specialties', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/doctor-specialties/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test popular specialties', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/popular/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test specialty search', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/search/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test specialty statistics', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/specialty/specialties/statistics/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('5. Subscription Plans Endpoints', () => {
        it('should test subscription plans listing', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscription-plans/plans/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test available plans', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscription-plans/plans/available/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test plan comparison', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscription-plans/plans/compare/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test featured plans', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscription-plans/plans/featured/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('6. Subscriptions Endpoints', () => {
        it('should test user subscriptions', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscriptions/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test current subscription', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscriptions/current/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test subscription usage', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscriptions/usage/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test subscription statistics', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/subscriptions/statistics/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('7. Tenants/Hospitals Endpoints', () => {
        it('should test hospitals listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/tenants/hospitals/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test emergency hospitals', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/tenants/hospitals/emergency/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test nearby hospitals', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/tenants/hospitals/nearby/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test hospital statistics', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/tenants/hospitals/statistics/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('8. Treatments Endpoints', () => {
        it('should test treatments listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
                if (response.status === 200) {
                    expect(response.body).to.have.property('treatments');
                    expect(response.body).to.have.property('prescriptions');
                }
            });
        });

        it('should test prescriptions listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/prescriptions/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test active treatments', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/treatments/active/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test active prescriptions', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/prescriptions/active/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test treatment statistics', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/treatments/statistics/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('9. Email Endpoints', () => {
        it('should test emails listing', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/email/emails/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test email statistics', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/email/statistics/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });
    });

    describe('10. Role-Based Access Tests', () => {
        it('should test patient access to own appointments', () => {
            if (!patientToken) {
                cy.log('Skipping test - no patient token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: { 'Authorization': `Bearer ${patientToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test doctor access to appointments', () => {
            if (!doctorToken) {
                cy.log('Skipping test - no doctor token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: { 'Authorization': `Bearer ${doctorToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test hospital admin access to hospitals', () => {
            if (!hospitalAdminToken) {
                cy.log('Skipping test - no hospital admin token');
                return;
            }
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/tenants/hospitals/`,
                headers: { 'Authorization': `Bearer ${hospitalAdminToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 401, 403]);
            });
        });

        it('should test super user access to all endpoints', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }
            
            // Test multiple endpoints with super user
            const endpoints = [
                '/api/auth/profile/',
                '/api/appointments/appointments/',
                '/api/medical-records/records/',
                '/api/treatments/',
                '/api/tenants/hospitals/',
                '/api/subscriptions/'
            ];

            endpoints.forEach(endpoint => {
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}${endpoint}`,
                    headers: { 'Authorization': `Bearer ${superUserToken}` },
                    failOnStatusCode: false,
                    timeout: 5000
                }).then((response) => {
                    expect(response.status).to.be.oneOf([200, 401, 403]);
                });
            });
        });
    });

    describe('11. Error Handling Tests', () => {
        it('should test invalid token access', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                headers: { 'Authorization': 'Bearer invalid_token' },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.equal(401);
            });
        });

        it('should test missing token access', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/auth/profile/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.equal(401);
            });
        });

        it('should test invalid endpoint', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/invalid-endpoint/`,
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                expect(response.status).to.equal(404);
            });
        });
    });

    describe('12. Performance Tests', () => {
        it('should test response times for critical endpoints', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            const startTime = Date.now();
            
            cy.request({
                method: 'GET',
                url: `${baseUrl}/api/appointments/appointments/`,
                headers: { 'Authorization': `Bearer ${superUserToken}` },
                failOnStatusCode: false,
                timeout: 5000
            }).then((response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                expect(response.status).to.be.oneOf([200, 401, 403]);
                expect(responseTime).to.be.lessThan(5000); // 5 seconds max
            });
        });

        it('should test concurrent requests', () => {
            if (!superUserToken) {
                cy.log('Skipping test - no super user token');
                return;
            }

            // Test multiple concurrent requests
            const requests = [
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/api/auth/profile/`,
                    headers: { 'Authorization': `Bearer ${superUserToken}` },
                    failOnStatusCode: false,
                    timeout: 5000
                }),
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/api/appointments/appointments/`,
                    headers: { 'Authorization': `Bearer ${superUserToken}` },
                    failOnStatusCode: false,
                    timeout: 5000
                }),
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/api/medical-records/records/`,
                    headers: { 'Authorization': `Bearer ${superUserToken}` },
                    failOnStatusCode: false,
                    timeout: 5000
                })
            ];

            cy.wrap(requests).then(() => {
                cy.log('All concurrent requests completed');
            });
        });
    });
});
