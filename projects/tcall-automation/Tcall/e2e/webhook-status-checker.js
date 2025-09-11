// webhook-status-checker.js
// Simple Webhook Status Checker for QA Team

const axios = require('axios');

class WebhookStatusChecker {
  constructor() {
    this.environments = {
      staging: {
        baseUrl: 'https://api.dev.tcall.ai:8006',
        webhookUrl: 'https://api.dev.tcall.ai:8006/api/webhooks/retell/',
        retellUrl: 'https://api.dev.tcall.ai:8006/api/retell/voices/'
      },
      production: {
        baseUrl: 'https://tcall.ai/api',
        webhookUrl: 'https://tcall.ai/api/webhooks/retell/',
        retellUrl: 'https://tcall.ai/api/retell/voices/'
      }
    };
  }

  async checkEnvironment(environment) {
    const env = this.environments[environment];
    if (!env) {
      throw new Error(`Unknown environment: ${environment}`);
    }

    console.log(`\n🔍 Checking ${environment.toUpperCase()} environment...`);
    console.log(`Base URL: ${env.baseUrl}`);
    console.log(`Webhook URL: ${env.webhookUrl}`);
    console.log(`Retell URL: ${env.retellUrl}`);

    const results = {
      environment: environment,
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Check webhook endpoint
    try {
      const webhookResponse = await axios.get(env.webhookUrl, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      
      results.checks.webhook = {
        status: webhookResponse.status,
        accessible: webhookResponse.status < 500,
        message: webhookResponse.status < 500 ? '✅ Accessible' : `❌ Not accessible (${webhookResponse.status})`
      };
      
      console.log(`Webhook Status: ${results.checks.webhook.message}`);
    } catch (error) {
      results.checks.webhook = {
        status: 'error',
        accessible: false,
        message: `❌ Error: ${error.message}`
      };
      console.log(`Webhook Status: ${results.checks.webhook.message}`);
    }

    // Check Retell integration
    try {
      const retellResponse = await axios.get(env.retellUrl, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      
      results.checks.retell = {
        status: retellResponse.status,
        working: retellResponse.status === 200,
        message: retellResponse.status === 200 ? '✅ Working' : `⚠️ Issue (${retellResponse.status})`
      };
      
      console.log(`Retell Integration: ${results.checks.retell.message}`);
    } catch (error) {
      results.checks.retell = {
        status: 'error',
        working: false,
        message: `❌ Error: ${error.message}`
      };
      console.log(`Retell Integration: ${results.checks.retell.message}`);
    }

    // Check health endpoint
    try {
      const healthResponse = await axios.get(`${env.baseUrl}/api/health/`, { 
        timeout: 10000,
        validateStatus: () => true 
      });
      
      results.checks.health = {
        status: healthResponse.status,
        healthy: healthResponse.status < 500,
        message: healthResponse.status < 500 ? '✅ Healthy' : `⚠️ Issues (${healthResponse.status})`
      };
      
      console.log(`Health Check: ${results.checks.health.message}`);
    } catch (error) {
      results.checks.health = {
        status: 'error',
        healthy: false,
        message: `❌ Error: ${error.message}`
      };
      console.log(`Health Check: ${results.checks.health.message}`);
    }

    return results;
  }

  async checkAllEnvironments() {
    console.log('🚀 Starting Webhook Status Check...');
    console.log('=' .repeat(50));

    const results = {
      timestamp: new Date().toISOString(),
      environments: {}
    };

    for (const envName of Object.keys(this.environments)) {
      try {
        results.environments[envName] = await this.checkEnvironment(envName);
      } catch (error) {
        console.error(`❌ Error checking ${envName}: ${error.message}`);
        results.environments[envName] = {
          environment: envName,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Generate summary
    this.generateSummary(results);
    
    return results;
  }

  generateSummary(results) {
    console.log('\n📊 SUMMARY');
    console.log('=' .repeat(50));

    let totalIssues = 0;
    const issues = [];

    for (const [envName, envResults] of Object.entries(results.environments)) {
      if (envResults.error) {
        totalIssues++;
        issues.push(`${envName}: Error - ${envResults.error}`);
        continue;
      }

      const envIssues = [];
      
      if (!envResults.checks.webhook?.accessible) {
        envIssues.push('Webhook not accessible');
      }
      
      if (!envResults.checks.retell?.working) {
        envIssues.push('Retell integration issues');
      }
      
      if (!envResults.checks.health?.healthy) {
        envIssues.push('Health check failed');
      }

      if (envIssues.length > 0) {
        totalIssues += envIssues.length;
        issues.push(`${envName}: ${envIssues.join(', ')}`);
      }
    }

    if (totalIssues === 0) {
      console.log('✅ No issues detected across all environments');
    } else {
      console.log(`🚨 ${totalIssues} issues detected:`);
      issues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
    }

    // Generate recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('=' .repeat(50));
    
    if (totalIssues > 0) {
      console.log('1. Share this report with the backend engineer');
      console.log('2. Implement webhook management solution');
      console.log('3. Add webhook monitoring to CI/CD pipeline');
      console.log('4. Create webhook testing utilities');
    } else {
      console.log('✅ All systems operational - no immediate action required');
    }

    console.log('\n📁 Detailed report saved to: webhook-status-report.json');
  }

  async saveReport(results) {
    const fs = require('fs');
    fs.writeFileSync('webhook-status-report.json', JSON.stringify(results, null, 2));
  }
}

// CLI usage
if (require.main === module) {
  const checker = new WebhookStatusChecker();
  
  const args = process.argv.slice(2);
  const environment = args[0];

  if (environment && ['staging', 'production'].includes(environment)) {
    checker.checkEnvironment(environment)
      .then(results => {
        checker.saveReport({ environments: { [environment]: results } });
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
      });
  } else {
    checker.checkAllEnvironments()
      .then(results => {
        checker.saveReport(results);
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
      });
  }
}

module.exports = WebhookStatusChecker;
