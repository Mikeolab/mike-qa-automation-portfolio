/*
 Cleanup utilities: delete contact or agent by id in dev|prod
 Usage:
  - node tools/cleanup.js delete-contact dev <id>
  - node tools/cleanup.js delete-agent dev <id>
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

async function del(baseUrl, token, path) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`DELETE ${path} -> ${res.status}`);
}

(async () => {
  const [action, env, idArg] = process.argv.slice(2);
  if (!action || !env || !idArg) {
    console.log('Usage:\n node tools/cleanup.js delete-contact <dev|prod> <id>\n node tools/cleanup.js delete-agent <dev|prod> <id>');
    process.exit(1);
  }
  const base = env === 'prod' ? PROD_BASE : DEV_BASE;
  const token = await login(base);
  const id = Number(idArg);
  if (action === 'delete-contact') {
    await del(base, token, `/api/contacts/${id}/`);
  } else if (action === 'delete-agent') {
    await del(base, token, `/agents/api/${id}/`);
  } else {
    console.log('Unknown action');
  }
})();


