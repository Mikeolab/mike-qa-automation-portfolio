/*
 Create a contact (+234 9158412345) and create agents (ElevenLabs and Retell) in DEV and PROD via user route.
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const ENV = {
  USER_EMAIL: process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai',
  USER_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || 'test123',
};

async function j(res) { try { return await res.json(); } catch { return {}; } }

async function login(baseUrl) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ENV.USER_EMAIL, password: ENV.USER_PASSWORD })
  });
  const body = await j(res);
  return res.ok && body.token ? body.token : null;
}

async function listAgents(baseUrl, token) {
  const res = await fetch(`${baseUrl}/agents/api/`, { headers: { Authorization: `Bearer ${token}` } });
  const body = await j(res);
  if (res.status !== 200) return [];
  return Array.isArray(body) ? body : (body.results || []);
}

async function ensureContact(baseUrl, token) {
  const phone = '+2349158412345';
  // Try create first
  let res = await fetch(`${baseUrl}/contacts/api/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'QA Contact NG',
      phone,
      email: 'qa.ng.9158412345@example.com',
      company: 'QA Automation',
    })
  });
  let body = await j(res);
  if ((res.status === 200 || res.status === 201) && body.id) return body.id;
  // Fallback: find existing by listing
  res = await fetch(`${baseUrl}/contacts/api/`, { headers: { Authorization: `Bearer ${token}` } });
  body = await j(res);
  const list = Array.isArray(body) ? body : (body.results || []);
  const found = list.find(c => c.phone === phone) || list[0];
  return found ? found.id : null;
}

function buildAgentPayloadFromTemplate(template, provider) {
  const ts = Date.now();
  const payload = {
    call_type: template?.call_type || 'outbound',
    name: (template?.name || `${provider.toUpperCase()} Agent`) + ` QA ${ts}`,
    provider,
    description: template?.description || `QA created ${provider} agent`,
    voice_id: template?.voice_id || (provider === 'elevenlabs' ? '2EiwWnXFnvU5JabPnv8n' : '11labs-Anthony'),
    language: template?.language || (provider === 'elevenlabs' ? 'en' : 'en-US'),
    industry: template?.industry || 'technology',
    initial_message: template?.initial_message || 'Hello from QA.',
    prompt_content: template?.prompt_content || 'You are a helpful QA test agent.',
    is_active: true,
  };
  return payload;
}

async function createAgent(baseUrl, token, provider) {
  const agents = await listAgents(baseUrl, token);
  const tmpl = agents.find(a => (a.provider || '').toLowerCase() === provider) || null;
  const payload = buildAgentPayloadFromTemplate(tmpl, provider);
  const res = await fetch(`${baseUrl}/agents/api/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const body = await j(res);
  return { status: res.status, body, payload };
}

async function runEnv(name, baseUrl) {
  console.log(`\n=== ${name.toUpperCase()} CREATE CONTACT & AGENTS (${baseUrl}) ===`);
  const token = await login(baseUrl);
  if (!token) { console.log('auth failed for user'); return; }
  const contactId = await ensureContact(baseUrl, token);
  console.log('contactId:', contactId || null);
  const r1 = await createAgent(baseUrl, token, 'elevenlabs');
  console.log('create elevenlabs ->', r1.status, typeof r1.body === 'object' ? JSON.stringify(r1.body).slice(0, 500) : r1.body);
  const r2 = await createAgent(baseUrl, token, 'retell');
  console.log('create retell ->', r2.status, typeof r2.body === 'object' ? JSON.stringify(r2.body).slice(0, 500) : r2.body);
}

(async () => {
  await runEnv('dev', DEV_BASE);
  await runEnv('prod', PROD_BASE);
})();


