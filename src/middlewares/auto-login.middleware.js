// TEST DEPLOYMENTS ONLY. With AUTO_LOGIN=true, every visitor without a valid
// login is logged in as one shared test superadmin (beta access on), so the
// site needs no email codes or Hack Club Auth. Never set it in production.
import pg from '../utils/db.js';
import { createSession, findSessionUser, setSessionCookie } from '../utils/sessions.js';

const TEST_EMAIL = 'tester@spaces-test.local';
let testUserPromise = null;

const testUser = () => {
  testUserPromise ??= (async () => {
    const existing = await pg('users').where('email', TEST_EMAIL).first();
    if (existing) return existing;
    const [user] = await pg('users')
      .insert({
        email: TEST_EMAIL,
        username: 'tester',
        is_admin: true,
        is_superadmin: true,
        beta_access: true,
        max_spaces: 6,
        max_running: 1,
        hackclub_verification_status: 'verified_eligible'
      })
      .returning('*');
    return user;
  })().catch((err) => {
    testUserPromise = null;
    throw err;
  });
  return testUserPromise;
};

export const autoLogin = async (req, res, next) => {
  if (process.env.AUTO_LOGIN !== 'true') return next();

  try {
    const token = req.headers.authorization || req.cookies?.auth_token;
    if (token && await findSessionUser(token)) return next();

    const user = await testUser();
    const fresh = await createSession(user.id, 'auto');
    setSessionCookie(res, fresh, { sameSite: 'lax' });
    req.cookies = { ...req.cookies, auth_token: fresh };
    delete req.headers.authorization;
    next();
  } catch (err) {
    next(err);
  }
};
