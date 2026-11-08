# Test deployment (revert before merging)

Everything in this commit exists only to try the branch without logins:

- `AUTO_LOGIN=true` (`src/middlewares/auto-login.middleware.js`) logs every
  visitor in as one shared test superadmin with beta access.
- `SANDBOX_TIMEOUT_MINUTES` and `SANDBOX_NO_FAILOVER=true` fit sandboxes
  into Vercel's Hobby plan (45-minute limit, no failover regions).
- `api.Dockerfile` runs the API on Orchard next to its database.
- `client-vercel.json` deploys `client/` alone on Vercel and forwards
  `/api/*` to the Orchard API.
