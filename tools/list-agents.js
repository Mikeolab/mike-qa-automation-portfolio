/*
 List TCall agents in dev and prod using user creds (fallback to admin).
 Requires no deps (uses global fetch in Node >=18).
*/

const DEV_BASE = 'https://api.dev.tcall.ai:8006';
const PROD_BASE = 'https://prod.backend.tcall.ai';

const ENV = {
  USER_EMAIL: process.env.CYPRESS_TEST_EMAIL || 'test@tcall.ai',
  USER_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || 'test123',
  ADMIN_EMAIL: process.env.CYPRESS_ADMIN_EMAIL || 'admin@tcall.ai',
  ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD || 'admin123',
};

async function login(baseUrl, email, password) {
  try {
    const res = await fetch(`${baseUrl}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.token) return body.token;
    return null;
  } catch (e) {
    return null;
  }
}

async function listAgents(baseUrl, token) {
  try {
    const res = await fetch(`${baseUrl}/agents/api/`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    const body = await res.json().catch(() => ({}));
    return { status: res.status, body };
  } catch (e) {
    return { status: 0, body: null };
  }
}

async function runEnv(name, baseUrl) {
  console.log(`\n=== ${name.toUpperCase()} (${baseUrl}) ===`);
  let token = await login(baseUrl, ENV.USER_EMAIL, ENV.USER_PASSWORD);
  let actor = 'user';
  if (!token) {
    token = await login(baseUrl, ENV.ADMIN_EMAIL, ENV.ADMIN_PASSWORD);
    actor = token ? 'admin' : 'none';
  }
  if (!token) {
    console.log('auth: failed for both user and admin');
    return;
  }
  console.log(`auth: ${actor}`);
  const { status, body } = await listAgents(baseUrl, token);
  console.log(`GET /agents/api/ -> ${status}`);
  if (status === 200 && Array.isArray(body)) {
    const rows = body.map(a => ({ id: a.id, name: a.name, provider: a.provider })).slice(0, 50);
    console.table(rows);
  } else {
    console.log('response:', typeof body === 'object' ? JSON.stringify(body).slice(0, 500) : body);
  }
}

(async () => {
  await runEnv('dev', DEV_BASE);
  await runEnv('prod', PROD_BASE);
})();


