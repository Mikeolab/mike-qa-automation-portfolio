const fs = require('fs');
const path = require('path');

function extractAllEndpoints(collectionPath, collectionName) {
    console.log(`\n🔍 Analyzing ${collectionName} Postman Collection...`);
    
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
    const endpoints = [];
    const endpointCategories = {};
    
    function traverseItems(items, basePath = '') {
        items.forEach(item => {
            if (item.request) {
                // Extract endpoint details
                const endpoint = {
                    name: item.name,
                    method: item.request.method,
                    url: item.request.url.raw,
                    path: item.request.url.path,
                    headers: item.request.header || [],
                    body: item.request.body ? (item.request.body.raw ? JSON.parse(item.request.body.raw) : item.request.body) : null,
                    description: item.request.description || '',
                    auth: item.request.auth || null
                };
                
                endpoints.push(endpoint);
                
                // Categorize by URL pattern
                const urlPath = endpoint.url.replace('{{baseUrl}}', '').toLowerCase();
                let category = 'other';
                
                if (urlPath.includes('/auth/')) category = 'authentication';
                else if (urlPath.includes('/agents/')) category = 'agents';
                else if (urlPath.includes('/contacts/')) category = 'contacts';
                else if (urlPath.includes('/calls/')) category = 'calls';
                else if (urlPath.includes('/campaigns/')) category = 'campaigns';
                else if (urlPath.includes('/business/')) category = 'business';
                else if (urlPath.includes('/clients/')) category = 'clients';
                else if (urlPath.includes('/users/')) category = 'users';
                else if (urlPath.includes('/analytics/')) category = 'analytics';
                else if (urlPath.includes('/phone')) category = 'phone';
                else if (urlPath.includes('/settings/')) category = 'settings';
                else if (urlPath.includes('/admin/')) category = 'admin';
                else if (urlPath.includes('/hospitals/')) category = 'hospitals';
                else if (urlPath.includes('/appointments/')) category = 'appointments';
                else if (urlPath.includes('/medical-records/')) category = 'medical-records';
                else if (urlPath.includes('/specialty/')) category = 'specialty';
                else if (urlPath.includes('/treatments/')) category = 'treatments';
                else if (urlPath.includes('/prescriptions/')) category = 'prescriptions';
                else if (urlPath.includes('/availability/')) category = 'availability';
                else if (urlPath.includes('/emails/')) category = 'emails';
                
                if (!endpointCategories[category]) {
                    endpointCategories[category] = [];
                }
                endpointCategories[category].push(endpoint);
            }
            
            if (item.item) {
                traverseItems(item.item, basePath + '/' + item.name);
            }
        });
    }
    
    traverseItems(collection.item);
    
    // Generate summary
    console.log(`\n📊 ${collectionName} Endpoint Analysis:`);
    console.log(`  Total Endpoints: ${endpoints.length}`);
    console.log(`  Total HTTP Methods: ${endpoints.reduce((sum, ep) => sum + 1, 0)}`);
    
    console.log(`\n📋 Endpoint Categories:`);
    Object.entries(endpointCategories).forEach(([category, eps]) => {
        const methods = [...new Set(eps.map(ep => ep.method))];
        console.log(`  ${category}: ${eps.length} endpoints (${methods.join(', ')})`);
    });
    
    // Save detailed results
    const outputFile = `${collectionName.toLowerCase().replace(/\s+/g, '-')}-complete-endpoints.json`;
    fs.writeFileSync(outputFile, JSON.stringify({
        summary: {
            totalEndpoints: endpoints.length,
            categories: Object.keys(endpointCategories).length,
            collectionName: collectionName
        },
        categories: endpointCategories,
        allEndpoints: endpoints
    }, null, 2));
    
    console.log(`\n💾 Detailed results saved to: ${outputFile}`);
    
    return {
        totalEndpoints: endpoints.length,
        categories: endpointCategories,
        allEndpoints: endpoints
    };
}

// Analyze TCall collection
const tcallCollectionPath = path.join(__dirname, 'projects', 'tcall-automation', 'Tcall', 'TCall API.postman_collection.json');
const tcallResults = extractAllEndpoints(tcallCollectionPath, 'TCall');

// Analyze Medcor collection
const medcorCollectionPath = path.join(__dirname, 'projects', 'medcor-healthcare', 'MedCor Healthcare Platform API.postman_collection.json');
const medcorResults = extractAllEndpoints(medcorCollectionPath, 'Medcor');

// Overall summary
console.log(`\n🎯 COMPREHENSIVE ENDPOINT ANALYSIS SUMMARY:`);
console.log(`  TCall Total Endpoints: ${tcallResults.totalEndpoints}`);
console.log(`  Medcor Total Endpoints: ${medcorResults.totalEndpoints}`);
console.log(`  Combined Total: ${tcallResults.totalEndpoints + medcorResults.totalEndpoints}`);
console.log(`\n⚠️  GAP ANALYSIS:`);
console.log(`  Expected: 300+ endpoints`);
console.log(`  Found: ${tcallResults.totalEndpoints + medcorResults.totalEndpoints} endpoints`);
console.log(`  Gap: ${300 - (tcallResults.totalEndpoints + medcorResults.totalEndpoints)} endpoints`);

// Method distribution
const allMethods = [...tcallResults.allEndpoints, ...medcorResults.allEndpoints].map(ep => ep.method);
const methodCounts = allMethods.reduce((acc, method) => {
    acc[method] = (acc[method] || 0) + 1;
    return acc;
}, {});

console.log(`\n📈 HTTP Method Distribution:`);
Object.entries(methodCounts).forEach(([method, count]) => {
    console.log(`  ${method}: ${count} endpoints`);
});

console.log(`\n✅ Analysis complete! Check the generated JSON files for detailed endpoint mappings.`);
