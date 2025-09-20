const fs = require('fs');

// Extract all endpoints from TCall Postman collection
function extractTCallEndpoints() {
  const tcallCollection = JSON.parse(fs.readFileSync('projects/tcall-automation/Tcall/TCall API.postman_collection.json', 'utf8'));
  const endpoints = [];
  
  function extractFromItems(items, basePath = '') {
    items.forEach(item => {
      if (item.request) {
        // This is an endpoint
        const endpoint = {
          name: item.name,
          method: item.request.method,
          url: item.request.url?.raw || '',
          headers: item.request.header || [],
          body: item.request.body || null,
          description: item.request.description || ''
        };
        endpoints.push(endpoint);
      }
      
      if (item.item) {
        // This is a folder, recurse
        extractFromItems(item.item, basePath + '/' + item.name);
      }
    });
  }
  
  extractFromItems(tcallCollection.item);
  return endpoints;
}

// Extract all endpoints from Medcor Postman collection
function extractMedcorEndpoints() {
  const medcorCollection = JSON.parse(fs.readFileSync('projects/medcor-healthcare/MedCor Healthcare Platform API.postman_collection.json', 'utf8'));
  const endpoints = [];
  
  function extractFromItems(items, basePath = '') {
    items.forEach(item => {
      if (item.request) {
        // This is an endpoint
        const endpoint = {
          name: item.name,
          method: item.request.method,
          url: item.request.url?.raw || '',
          headers: item.request.header || [],
          body: item.request.body || null,
          description: item.request.description || ''
        };
        endpoints.push(endpoint);
      }
      
      if (item.item) {
        // This is a folder, recurse
        extractFromItems(item.item, basePath + '/' + item.name);
      }
    });
  }
  
  extractFromItems(medcorCollection.item);
  return endpoints;
}

// Extract and save endpoints
console.log('🔍 Extracting TCall endpoints...');
const tcallEndpoints = extractTCallEndpoints();
console.log(`✅ Found ${tcallEndpoints.length} TCall endpoints`);

console.log('🔍 Extracting Medcor endpoints...');
const medcorEndpoints = extractMedcorEndpoints();
console.log(`✅ Found ${medcorEndpoints.length} Medcor endpoints`);

// Save to files
fs.writeFileSync('tcall-endpoints.json', JSON.stringify(tcallEndpoints, null, 2));
fs.writeFileSync('medcor-endpoints.json', JSON.stringify(medcorEndpoints, null, 2));

console.log('📁 Endpoints saved to tcall-endpoints.json and medcor-endpoints.json');
console.log(`📊 Total endpoints: ${tcallEndpoints.length + medcorEndpoints.length}`);
