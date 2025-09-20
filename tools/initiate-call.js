/*
 Initiate an outbound call via /api/calls/initiate/
 Usage: node tools/initiate-call.js <env:dev|prod> <agent_id> <to_number> <country_code>
 - Automatically attaches the first available phone_number_id if present for the user
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const EMAIL = process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai';
const PASSWORD = process.env.CYPRESS_TEST_PASSWORD || 'test123';

async function toJson(res) { try { return await res.json(); } catch { return {}; } }

async function login(baseUrl) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  const body = await toJson(res);
  if (!res.ok || !body.token) throw new Error(`auth failed ${res.status}`);
  return body.token;
}

async function findFirstPhoneNumberId(baseUrl, token) {
  const res = await fetch(`${baseUrl}/api/phone-numbers/`, {
    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const body = await toJson(res);
  if (Array.isArray(body?.results) && body.results.length > 0) {
    return body.results[0].id || null;
  }
  if (Array.isArray(body) && body.length > 0) {
    return body[0].id || null;
  }
  return null;
}

async function initiate(baseUrl, token, payload) {
  const res = await fetch(`${baseUrl}/api/calls/initiate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const body = await toJson(res);
  console.log(`POST /api/calls/initiate/ -> ${res.status}`);
  console.log(typeof body === 'object' ? JSON.stringify(body, null, 2) : body);
}

(async () => {
  const [env, agentIdArg, toNumber, countryCodeArg] = process.argv.slice(2);
  if (!env || !agentIdArg || !toNumber) {
    console.log('Usage: node tools/initiate-call.js <env:dev|prod> <agent_id> <to_number> [country_code]');
    process.exit(1);
  }
  const agentId = Number(agentIdArg);
  const countryCode = countryCodeArg || '+1';
  const base = env === 'prod' ? PROD_BASE : DEV_BASE;
  const token = await login(base);
  const phoneNumberId = await findFirstPhoneNumberId(base, token);
  const payload = {
    agent_id: agentId,
    to_number: toNumber,
    country_code: countryCode,
    ...(phoneNumberId ? { phone_number_id: phoneNumberId } : {})
  };
  console.log('payload:', payload);
  await initiate(base, token, payload);
})();


