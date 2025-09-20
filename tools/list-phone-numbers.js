/*
 List phone numbers for env dev|prod with agent associations
 Usage: node tools/list-phone-numbers.js <env:dev|prod>
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const EMAIL = process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai';
const PASSWORD = process.env.CYPRESS_TEST_PASSWORD || 'test123';

async function j(res) { try { return await res.json(); } catch { return {}; } }

async function login(baseUrl) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  const body = await j(res);
  if (!res.ok || !body.token) throw new Error(`auth failed ${res.status}`);
  return body.token;
}

async function list(baseUrl, token) {
  const res = await fetch(`${baseUrl}/api/phone-numbers/`, {
    headers: { 'Accept': 'application/json', Authorization: `Bearer ${token}` }
  });
  const body = await j(res);
  const rows = Array.isArray(body?.results) ? body.results : Array.isArray(body) ? body : [];
  for (const n of rows) {
    console.log({ id: n.id, number: n.phone_number || n.number, country_code: n.country_code, agent_id: n.agent_id, elevenlabs_agent_id: n.elevenlabs_agent_id, provider: n.voice_service });
  }
}

(async () => {
  const env = (process.argv[2] || '').toLowerCase();
  const base = env === 'prod' ? PROD_BASE : DEV_BASE;
  const token = await login(base);
  await list(base, token);
})();


