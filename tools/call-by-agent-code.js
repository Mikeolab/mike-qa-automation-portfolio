/*
 Initiate outbound call by agent_code, auto-picking assigned phone_number_id.
 Usage: node tools/call-by-agent-code.js <env:dev|prod> <agent_code> <to_number> [country_code]
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const EMAIL = process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai';
const PASSWORD = process.env.CYPRESS_TEST_PASSWORD || 'test123';

async function toJson(res) { try { return await res.json(); } catch { return {}; } }

async function login(baseUrl) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  const body = await toJson(res);
  if (!res.ok || !body.token) throw new Error(`auth failed ${res.status}`);
  return body.token;
}

async function getAgents(baseUrl, token) {
  const res = await fetch(`${baseUrl}/agents/api/`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
  const body = await toJson(res);
  return Array.isArray(body?.results) ? body.results : Array.isArray(body) ? body : [];
}

async function getPhoneNumbers(baseUrl, token) {
  const res = await fetch(`${baseUrl}/api/phone-numbers/`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
  const body = await toJson(res);
  return Array.isArray(body?.results) ? body.results : Array.isArray(body) ? body : [];
}

async function initiate(baseUrl, token, payload) {
  const res = await fetch(`${baseUrl}/api/calls/initiate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const body = await toJson(res);
  console.log('payload:', payload);
  console.log(`POST /api/calls/initiate/ -> ${res.status}`);
  console.log(typeof body === 'object' ? JSON.stringify(body, null, 2) : body);
}

(async () => {
  const [env, agentCode, toNumber, countryCodeArg] = process.argv.slice(2);
  if (!env || !agentCode || !toNumber) {
    console.log('Usage: node tools/call-by-agent-code.js <env:dev|prod> <agent_code> <to_number> [country_code]');
    process.exit(1);
  }
  const base = env === 'prod' ? PROD_BASE : DEV_BASE;
  const countryCode = countryCodeArg || '+1';
  const token = await login(base);
  const agents = await getAgents(base, token);
  const agent = agents.find(a => a.agent_code === agentCode || a.name?.toLowerCase().includes(agentCode.toLowerCase()));
  if (!agent) {
    console.log('agent not found for code:', agentCode);
    process.exit(1);
  }
  const numbers = await getPhoneNumbers(base, token);
  const assigned = numbers.find(n => Number(n.agent_id) === Number(agent.id) || Number(n.elevenlabs_agent_id) === Number(agent.id));
  const payload = {
    agent_id: agent.id,
    to_number: toNumber,
    country_code: countryCode,
    ...(assigned ? { phone_number_id: assigned.id } : {})
  };
  await initiate(base, token, payload);
})();


