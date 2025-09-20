/*
 Initiate an outbound call using phone number (no contact required).
 Usage: node tools/call-with-phone.js <env:dev|prod> <agent_id> <country_code> <phone_number> <voice_service> <voice_id>
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

async function placeCall(baseUrl, token, payload) {
  const res = await fetch(`${baseUrl}/calls/api/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const body = await toJson(res);
  console.log(`POST /calls/api/ -> ${res.status}`);
  console.log(typeof body === 'object' ? JSON.stringify(body, null, 2) : body);
}

(async () => {
  const [env, agentId, countryCode, phoneNumber, voiceService, voiceId] = process.argv.slice(2);
  if (!env || !agentId || !countryCode || !phoneNumber) {
    console.log('Usage: node tools/call-with-phone.js <env:dev|prod> <agent_id> <country_code> <phone_number> [voice_service] [voice_id]');
    process.exit(1);
  }
  const base = env === 'prod' ? PROD_BASE : DEV_BASE;
  const token = await login(base);
  const payload = {
    agent_id: Number(agentId),
    type: 'outbound',
    country_code: countryCode,
    phone_number: phoneNumber,
    language: 'en',
    voice_service: voiceService || undefined,
    voice_id: voiceId || undefined,
    is_active: true,
    user_email: EMAIL,
  };
  await placeCall(base, token, payload);
})();


