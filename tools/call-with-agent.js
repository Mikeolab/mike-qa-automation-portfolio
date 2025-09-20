/*
 Initiate calls with ElevenLabs (prefer name contains 'migros') and Retell agents in DEV and PROD.
 Uses user creds; falls back to admin if user fails. Creates a contact if needed.
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const ENV = {
  USER_EMAIL: process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai',
  USER_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || 'test123',
  ADMIN_EMAIL: process.env.CYPRESS_ADMIN_EMAIL || 'admin@tcall.ai',
  ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD || 'admin123',
};

async function j(res) { try { return await res.json(); } catch { return {}; } }

async function login(baseUrl, email, password) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const body = await j(res);
  return res.ok && body.token ? body.token : null;
}

async function auth(baseUrl) {
  let token = await login(baseUrl, ENV.USER_EMAIL, ENV.USER_PASSWORD);
  let actor = 'user';
  if (!token) { token = await login(baseUrl, ENV.ADMIN_EMAIL, ENV.ADMIN_PASSWORD); actor = token ? 'admin' : 'none'; }
  return { token, actor };
}

async function listAgents(baseUrl, token) {
  const res = await fetch(`${baseUrl}/agents/api/`, { headers: { Authorization: `Bearer ${token}` } });
  const body = await j(res);
  if (res.status !== 200) return [];
  // Body can be array or paginated object
  return Array.isArray(body) ? body : (body.results || []);
}

async function ensureContact(baseUrl, token) {
  const ts = Date.now();
  let res = await fetch(`${baseUrl}/contacts/api/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: `Call Smoke Contact ${ts}`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `call.smoke.${ts}@example.com`,
      company: 'QA'
    })
  });
  let body = await j(res);
  if ((res.status === 200 || res.status === 201) && body.id) return body.id;
  // fallback: try list contacts and pick one
  res = await fetch(`${baseUrl}/contacts/api/`, { headers: { Authorization: `Bearer ${token}` } });
  body = await j(res);
  const list = Array.isArray(body) ? body : (body.results || []);
  return list.length ? list[0].id : null;
}

async function initiateCall(baseUrl, token, agentId, contactId) {
  const res = await fetch(`${baseUrl}/calls/api/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agent_id: agentId, contact_id: contactId, call_type: 'outbound', priority: 'normal' })
  });
  const body = await j(res);
  return { status: res.status, body };
}

function pickAgent(agents, provider, preferName) {
  const byName = agents.find(a => (a.provider || '').toLowerCase() === provider && (a.name || '').toLowerCase().includes(preferName));
  if (byName) return byName;
  return agents.find(a => (a.provider || '').toLowerCase() === provider) || null;
}

async function run(baseUrl, name) {
  console.log(`\n=== ${name.toUpperCase()} CALL TEST (${baseUrl}) ===`);
  const { token, actor } = await auth(baseUrl);
  if (!token) { console.log('auth failed'); return; }
  console.log(`auth: ${actor}`);
  const agents = await listAgents(baseUrl, token);
  console.log(`agents: ${agents.length}`);
  const eleven = pickAgent(agents, 'elevenlabs', 'migros');
  const retell = pickAgent(agents, 'retell', '');
  console.log('elevenlabs agent:', eleven ? { id: eleven.id, name: eleven.name } : null);
  console.log('retell agent:', retell ? { id: retell.id, name: retell.name } : null);
  const contactId = await ensureContact(baseUrl, token);
  console.log('contactId:', contactId);
  if (!contactId) { console.log('no contact available'); return; }
  if (eleven) {
    const r = await initiateCall(baseUrl, token, eleven.id, contactId);
    console.log(`call elevenlabs -> ${r.status}`, typeof r.body === 'object' ? JSON.stringify(r.body).slice(0, 500) : r.body);
  }
  if (retell) {
    const r = await initiateCall(baseUrl, token, retell.id, contactId);
    console.log(`call retell -> ${r.status}`, typeof r.body === 'object' ? JSON.stringify(r.body).slice(0, 500) : r.body);
  }
}

(async () => {
  await run(DEV_BASE, 'dev');
  await run(PROD_BASE, 'prod');
})();


