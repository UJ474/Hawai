# Fix: Signup endpoint returns 500 Internal Server Error

**Repo:** https://github.com/UJ474/Hawai
**Deployment:** Vercel (backend at `hawai-6rk9-...vercel.app`)
**Symptom:** `POST /api/auth/signup` returns `500 Internal Server Error` in production. Local dev (`npm run dev`) may work fine — this points to an environment/deployment config issue, not a logic bug in the route code.

---

## 1. What the code does (confirmed working logic)

`backend/src/routes/auth.ts` → `/signup`:
1. Validates body with Zod (`name`, `email`, `password`)
2. Calls `passengerService.findByEmail(email)` — a Prisma query
3. Calls `passengerService.create(name, email, password)` — hashes password with `bcrypt`, then `prisma.passenger.create(...)`

`backend/src/middleware/errorHandler.ts` catches errors:
- Known Prisma request errors (duplicate email, FK issues, not found) → return 409/400/404 with a specific message
- **Everything else falls through to a generic 500** with whatever `err.message` is

Since the client is seeing a bare 500 (not a 409 "email already in use"), the failure is happening **before or during the Prisma call itself** — i.e. the database connection/config layer, not the business logic.

---

## 2. Most likely root causes (ranked)

### Cause #1 (most likely): `DATABASE_URL` not set correctly for the Vercel production environment

`backend/prisma/schema.prisma` is hardcoded to:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
But the README's local setup instructions use SQLite (`file:./dev.db`). This mismatch means:
- If `DATABASE_URL` is missing in Vercel's environment variables → Prisma throws `Environment variable not found: DATABASE_URL` on every DB call.
- If `DATABASE_URL` is set to a SQLite path instead of a real Postgres connection string → Prisma throws a schema/provider mismatch error.
- If `DATABASE_URL` points to a Postgres instance but migrations were never run against it → `prisma.passenger.create` / `findByEmail` fails because the `Passenger` table doesn't exist.

**Fix:**
1. Go to Vercel dashboard → the `Hawai` backend project → **Settings → Environment Variables**.
2. Confirm `DATABASE_URL` exists for the **Production** environment and is a valid, reachable PostgreSQL connection string (e.g. from Neon, Supabase, Railway, or Vercel Postgres). It must NOT be a `file:...` SQLite path.
3. If using a serverless-friendly Postgres provider (Neon, Supabase), make sure you're using their **pooled** connection string (often has `-pooler` in the hostname or a `pgbouncer=true` param) — this matters for serverless functions which open many short-lived connections.
4. Once `DATABASE_URL` is confirmed, run migrations against that **production** database from your local machine:
   ```bash
   cd backend
   DATABASE_URL="<your production postgres url>" npx prisma migrate deploy
   ```
   This applies the existing migration history (in `backend/prisma/migrations/`) to the production DB so the `Passenger`, `Flight`, `Booking`, etc. tables actually exist there.
5. Redeploy on Vercel after confirming the env var (Vercel needs a redeploy to pick up new/changed env vars).

### Cause #2 (less likely but worth ruling out): `bcrypt` native binary issue on serverless

`backend/package.json` uses `bcrypt` (a native/compiled module), not `bcryptjs` (pure JS). Native bindings can occasionally fail to load correctly in Vercel's serverless build/runtime, throwing inside `passengerService.create()` at the `bcrypt.hash(...)` call.

**Fix (only if Cause #1 doesn't resolve it):**
```bash
cd backend
npm uninstall bcrypt @types/bcrypt
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```
Then update every `bcrypt` import to `bcryptjs` (API is identical — `bcrypt.hash`, `bcrypt.compare`):
- `backend/src/services/PassengerService.ts`
- `backend/src/routes/auth.ts`

```ts
// before
import bcrypt from "bcrypt";
// after
import bcrypt from "bcryptjs";
```

---

## 3. How to confirm which cause it actually is (do this first)

The error handler already logs the full error before responding:
```ts
console.error("Error caught by middleware:", err);
```
This means the real error message/stack trace is sitting in the Vercel logs right now.

**Steps:**
1. Open the Vercel dashboard → the backend project → **Deployments** → click the active/latest deployment.
2. Go to the **Logs** (or **Functions**) tab.
3. Trigger a signup attempt again from the frontend (or via curl/Postman) to generate a fresh log entry.
4. Read the logged error message. It will say one of:
   - `Environment variable not found: DATABASE_URL` → confirms Cause #1, step 2
   - `Can't reach database server at ...` → confirms Cause #1, step 2/3 (wrong URL or DB unreachable/sleeping)
   - `The table 'public.Passenger' does not exist` → confirms Cause #1, step 4 (migrations not applied)
   - Something mentioning `bcrypt`, `.node` binding, or `invalid ELF header` → confirms Cause #2

**If you have Vercel CLI access, you can also pull logs directly:**
```bash
npx vercel logs <deployment-url>
```

---

## 4. Action checklist for whoever applies this fix

- [ ] Pull the real error from Vercel logs (Section 3) to confirm root cause before changing code
- [ ] Verify `DATABASE_URL` is set in Vercel → Production env vars, pointing to a real reachable Postgres DB (not SQLite)
- [ ] Run `npx prisma migrate deploy` against that production `DATABASE_URL` to create tables
- [ ] Redeploy the project on Vercel after any env var change
- [ ] Test `/api/health` and `/api/auth/signup` again
- [ ] Only if the logs point to bcrypt: switch `bcrypt` → `bcryptjs` per Section 2, Cause #2