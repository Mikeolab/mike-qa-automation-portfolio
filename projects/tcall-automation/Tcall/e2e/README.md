# Tcall Senior QA Testing Suite

A comprehensive API testing suite for the Tcall platform, designed for senior QA engineers to ensure high-quality, reliable, and scalable testing of all API endpoints.

## 🚀 Features

- **Comprehensive API Coverage**: Tests all major API endpoints from the Tcall Postman collection
- **Workflow-Based Testing**: Organized testing approach with Security, API, Performance, Integration, and Debugging workflows
- **Multi-Environment Support**: Configurable for dev, staging, and production environments
- **Advanced Authentication**: Secure token-based authentication with proper error handling
- **Data Validation**: Comprehensive input validation and response schema validation
- **Performance Testing**: Built-in load testing and response time measurement
- **Error Handling**: Extensive error scenario testing and edge case coverage
- **Test Data Management**: Automated test data generation and cleanup
- **Reporting**: Multiple reporting formats including HTML, JSON, and JUnit XML
- **Parallel Execution**: Support for parallel test execution across multiple browsers
- **CI/CD Integration**: Ready for continuous integration and deployment pipelines

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Cypress >= 13.17.0

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/tcall-senior-qa.git
   cd tcall-senior-qa
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your credentials
   CYPRESS_TEST_EMAIL=your-test-email@tcall.ai
   CYPRESS_TEST_PASSWORD=your-test-password
   CYPRESS_ADMIN_EMAIL=your-admin-email@tcall.ai
   CYPRESS_ADMIN_PASSWORD=your-admin-password
   CYPRESS_BASE_URL=https://api.dev.tcall.ai:8006
   CYPRESS_ENVIRONMENT=dev
   ```

## 🏃‍♂️ Running Tests

### Workflow-Based Testing Commands

```bash
# Run complete workflow testing suite
npm run test:workflow

# Run specific workflow categories
npm run test:security      # Security testing only
npm run test:api           # API functionality testing only
npm run test:performance   # Performance testing only
npm run test:integration   # Integration testing only
npm run test:debug         # Debugging & troubleshooting only

# Run all test suites
npm run test:all
```

### Basic Commands

```bash
# Run all tests
npm test

# Open Cypress Test Runner
npm run test:open

# Run smoke tests only
npm run test:smoke

# Run senior QA tests only
npm run test:senior
```

### Environment-Specific Testing

```bash
# Run tests against development environment
npm run test:dev

# Run tests against staging environment
npm run test:staging

# Run tests against production environment
npm run test:prod
```

### Browser-Specific Testing

```bash
# Run tests in Chrome
npm run test:chrome

# Run tests in Firefox
npm run test:firefox

# Run tests in Edge
npm run test:edge

# Run tests headless
npm run test:headless
```

### Debugging Commands

```bash
# Open Cypress Test Runner for workflow debugging
npm run debug:workflow

# Debug specific workflow categories
npm run debug:security      # Debug security tests
npm run debug:api           # Debug API tests
npm run debug:performance   # Debug performance tests
npm run debug:integration   # Debug integration tests
npm run debug:troubleshooting # Debug troubleshooting tests
```

### Advanced Commands

```bash
# Run tests in parallel (requires Cypress Cloud)
npm run test:parallel

# Generate comprehensive reports
npm run report

# Clean test artifacts
npm run clean

# Lint test files
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Project Structure

```
tcall-senior-qa/
├── cypress/
│   ├── e2e/
│   │   ├── tcall.smoke.cy.js          # Basic smoke tests
│   │   ├── tcall.senior.qa.cy.js      # Comprehensive QA tests
│   │   └── tcall.workflow.cy.js       # Workflow-based tests
│   ├── support/
│   │   ├── e2e.js                     # Cypress support file
│   │   └── tcall-test-utils.js        # Custom test utilities
│   ├── fixtures/                      # Test data fixtures
│   ├── screenshots/                   # Test failure screenshots
│   ├── videos/                        # Test execution videos
│   ├── downloads/                     # Downloaded files
│   └── results/                       # Test results and reports
├── cypress.config.js                  # Default Cypress config
├── cypress.config.senior.qa.js        # Senior QA specific config
├── package.json                       # Dependencies and scripts
└── README.md                          # This file
```

## 🧪 Workflow Testing Categories

### 🔒 Security Testing Workflow
- **Authentication & Authorization Security**
  - Secure authentication flow validation
  - Invalid credentials rejection
  - Missing credentials handling
  - Token-based authorization
  - Unauthorized access rejection

- **Input Validation & Sanitization**
  - User input validation and sanitization
  - SQL injection protection
  - Email format validation
  - XSS attack prevention

- **Rate Limiting & DDoS Protection**
  - Rate limiting implementation
  - Concurrent request handling
  - DDoS protection mechanisms

### 🔧 API Functionality Testing Workflow
- **Core API Endpoints**
  - Agents management workflow
  - Call management workflow
  - Contacts management workflow
  - Phone numbers management workflow
  - Campaigns management workflow

- **Business Logic & Data Integrity**
  - Business details workflow
  - Users management workflow
  - Data consistency validation

- **External Integrations**
  - Twilio integration testing
  - ElevenLabs integration testing
  - OpenAI integration testing
  - Retell integration testing
  - System health and utilities

### ⚡ Performance Testing Workflow
- **Response Time Performance**
  - API response time measurement
  - Concurrent request performance
  - Endpoint performance benchmarking

- **Load Testing**
  - Basic load testing
  - Bulk operations performance
  - Memory usage under load

- **Memory & Resource Usage**
  - Memory usage testing
  - Resource cleanup validation
  - Performance bottleneck identification

### 🔗 Integration Testing Workflow
- **End-to-End Workflows**
  - Complete user registration workflow
  - Complete agent setup workflow
  - Complete call workflow

- **Data Flow & Consistency**
  - Data consistency across operations
  - Error handling consistency
  - Cross-module integration testing

### 🐛 Debugging & Troubleshooting Workflow
- **Error Analysis**
  - Detailed error information logging
  - Network error handling
  - Timeout handling

- **Performance Debugging**
  - Slow response time debugging
  - Performance bottleneck identification
  - Resource usage analysis

- **Data Validation Debugging**
  - Data validation issues debugging
  - Authentication issues debugging
  - Input validation debugging

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CYPRESS_TEST_EMAIL` | Test user email | `test@tcall.ai` |
| `CYPRESS_TEST_PASSWORD` | Test user password | `test123` |
| `CYPRESS_ADMIN_EMAIL` | Admin user email | `admin@tcall.ai` |
| `CYPRESS_ADMIN_PASSWORD` | Admin user password | `admin123` |
| `CYPRESS_BASE_URL` | API base URL | `https://api.dev.tcall.ai:8006` |
| `CYPRESS_ENVIRONMENT` | Environment name | `dev` |

### Test Configuration

The test suite supports multiple configuration files:

- `cypress.config.js` - Default configuration
- `cypress.config.senior.qa.js` - Senior QA specific configuration

### Custom Test Utilities

The suite includes comprehensive test utilities in `cypress/support/tcall-test-utils.js`:

- **TestDataGenerator**: Generate unique test data
- **ResponseValidator**: Validate API responses
- **TestConfig**: Environment configuration
- **TestCleanup**: Automated test data cleanup
- **PerformanceUtils**: Performance testing utilities
- **ValidationUtils**: Data validation utilities

## 📊 Reporting

The test suite generates multiple types of reports:

### HTML Reports
```bash
npm run report
```
Generates beautiful HTML reports using Mochawesome.

### JUnit XML Reports
Automatically generated for CI/CD integration.

### Console Reports
Real-time console output with detailed test information.

### Custom Reports
Extensible reporting system for custom requirements.

## 🔒 Security Considerations

- **Credentials Management**: Use environment variables for sensitive data
- **Token Security**: Automatic token cleanup after tests
- **Data Isolation**: Test data is isolated and cleaned up automatically
- **Network Security**: HTTPS-only connections
- **Input Validation**: Comprehensive input sanitization

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tcall API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - name: Run Security Tests
        run: npm run test:security
      - name: Run API Tests
        run: npm run test:api
      - name: Run Performance Tests
        run: npm run test:performance
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Run Debug Tests
        run: npm run test:debug
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: cypress/results/
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Security Tests') {
            steps {
                sh 'npm run test:security'
            }
        }
        stage('API Tests') {
            steps {
                sh 'npm run test:api'
            }
        }
        stage('Performance Tests') {
            steps {
                sh 'npm run test:performance'
            }
        }
        stage('Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }
        stage('Debug Tests') {
            steps {
                sh 'npm run test:debug'
            }
        }
        stage('Report') {
            steps {
                sh 'npm run report'
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'cypress/reports',
                    reportFiles: 'index.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify credentials in environment variables
   - Check API endpoint accessibility
   - Ensure proper token handling

2. **Network Timeouts**
   - Increase timeout values in configuration
   - Check network connectivity
   - Verify API server status

3. **Test Data Issues**
   - Run cleanup commands
   - Check test data isolation
   - Verify data generation utilities

### Debug Mode

```bash
# Run tests with debug logging
DEBUG=cypress:* npm run test:workflow
```

### Verbose Output

```bash
# Run tests with verbose output
npm run test:workflow -- --verbose
```

### Specific Workflow Debugging

```bash
# Debug security tests
npm run debug:security

# Debug API tests
npm run debug:api

# Debug performance tests
npm run debug:performance

# Debug integration tests
npm run debug:integration

# Debug troubleshooting tests
npm run debug:troubleshooting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the QA team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with comprehensive API testing
- **v1.1.0** - Added performance testing and load testing
- **v1.2.0** - Enhanced reporting and CI/CD integration
- **v1.3.0** - Added security testing and data validation
- **v2.0.0** - Introduced workflow-based testing approach

---

**Note**: This testing suite is designed for Tcall API testing only. Please ensure you have proper authorization before running tests against any environment.
