/*
 List TCall contacts for dev and prod using user creds (fallback to admin).
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

async function listContacts(baseUrl, token) {
  const res = await fetch(`${baseUrl}/contacts/api/`, { headers: { Authorization: `Bearer ${token}` } });
  const body = await j(res);
  if (res.status !== 200) return [];
  return Array.isArray(body) ? body : (body.results || []);
}

async function runEnv(name, baseUrl) {
  console.log(`\n=== ${name.toUpperCase()} CONTACTS (${baseUrl}) ===`);
  const { token, actor } = await auth(baseUrl);
  if (!token) { console.log('auth failed'); return; }
  console.log(`auth: ${actor}`);
  const contacts = await listContacts(baseUrl, token);
  console.log(`count: ${contacts.length}`);
  if (contacts.length) {
    console.table(contacts.map(c => ({ id: c.id, name: c.name, phone: c.phone, email: c.email })).slice(0, 50));
  } else {
    console.log('No contacts found for this account. Create one via UI or POST /contacts/api/.');
  }
}

(async () => {
  await runEnv('dev', DEV_BASE);
  await runEnv('prod', PROD_BASE);
})();


