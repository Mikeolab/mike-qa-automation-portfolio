/*
 Login as user and initiate a call with provided agent_id and contact_id for a given environment.
 Usage: node tools/call-with-ids.js <env:dev|prod> <agent_id> <contact_id>
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const ENVV = {
  USER_EMAIL: process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai',
  USER_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || 'test123',
};

async function j(res) { try { return await res.json(); } catch { return {}; } }

async function login(baseUrl) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ENVV.USER_EMAIL, password: ENVV.USER_PASSWORD })
  });
  const body = await j(res);
  return res.ok && body.token ? body.token : null;
}

async function call(baseUrl, token, agentId, contactId) {
  const res = await fetch(`${baseUrl}/calls/api/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agent_id: Number(agentId), contact_id: Number(contactId), call_type: 'outbound', priority: 'normal' })
  });
  const body = await j(res);
  console.log(`call -> ${res.status}`, typeof body === 'object' ? JSON.stringify(body).slice(0, 800) : body);
}

(async () => {
  const env = (process.argv[2] || '').toLowerCase();
  const agentId = process.argv[3];
  const contactId = process.argv[4];
  if (!env || !agentId || !contactId) {
    console.log('Usage: node tools/call-with-ids.js <env:dev|prod> <agent_id> <contact_id>');
    process.exit(1);
  }
  const base = env === 'prod' ? PROD_BASE : DEV_BASE;
  const token = await login(base);
  if (!token) { console.log('auth failed'); process.exit(1); }
  await call(base, token, agentId, contactId);
})();


