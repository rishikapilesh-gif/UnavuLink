# UnavuLink — Setup and Authentication Guide

## 1. Install and run locally

```bash
npm ci
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

If Supabase variables are not configured, the app runs in **development demo mode**. Only the pre-seeded demo accounts can sign in; public registration and password recovery are disabled in this mode.

### Local demo accounts

All four use the development-only password `UnavuLink@2026`.

| Login page | Email |
|---|---|
| Donor | `senthil@annapoorna.demo` |
| Acceptor | `selvi.acceptor@unavulink.demo` |
| Volunteer | `karthik.volunteer@unavulink.demo` |
| Admin | `admin@unavulink.org` |

Use these accounts only with `npm run dev` and without Supabase configured. Do not publish these credentials or deploy demo accounts to production.

Legacy NGO demo accounts are accepted through the Acceptor login page.

## 2. Configure Supabase Auth and database

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Set only the browser-safe project URL and anon key:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. In the Supabase SQL Editor, run migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_role_profiles_and_chat.sql`
   - `supabase/migrations/003_auth_profile_trigger_and_role_safety.sql`
5. Enable email confirmation in Supabase Auth.
6. In Supabase Auth URL Configuration, add:
   - Site URL: your deployed application URL
   - Redirect URL: `http://localhost:5173/verify-email`
   - Redirect URL: `http://localhost:5173/reset-password`
   - Your production equivalents.
7. Create the Admin account privately in Supabase Auth, then assign `role = 'Admin'` to its profile using the Supabase SQL Editor or a trusted server-side admin process. Never expose an admin registration option.

New public registrations create their base `profiles` row through the migration trigger. Role-specific registration details are held in the browser until the user verifies their email and signs in for the first time, then synced to the matching role profile table. The same browser must be used for this first login.

## 3. Transactional email

Supabase Auth handles verification and password-reset emails. For additional transactional emails, deploy the server-side Edge Function:

```bash
supabase functions deploy send-email
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
supabase secrets set EMAIL_FROM="UnavuLink <verified-sender@your-domain.com>"
supabase secrets set APP_ORIGIN=https://your-deployed-domain
```

Verify your sender domain with Resend first. The Resend key must remain a Supabase Function secret. Never put service-role, Resend, SMTP or Gemini private keys in a `VITE_*` variable.

The `send-email` function currently restricts recipients to the authenticated user's own email address. It is not a general bulk-notification service.

## 4. Demo and production data modes

- Without Supabase configuration, the local seeded food listings, requests and missions are demo data stored in the browser.
- With Supabase configured, authentication and registration use Supabase Auth and the profile tables.
- The existing food workflow store still contains local/demo-backed operations. Do not treat all donation, request, mission, chat or analytics records as cloud-persisted production data until those modules are migrated and verified against Supabase.
- Do not present simulated metrics, AI outputs or map estimates as verified real-world results.

## 5. Build and deployment

```bash
npm run build
npm run lint
```

Deploy only after the build and role-by-role end-to-end tests pass. Configure the two `VITE_SUPABASE_*` values in your hosting provider. Keep all server secrets in Supabase Function secrets.

## 6. Important application routes

- `/login` — choose a role
- `/login/donor` — donor sign-in
- `/login/acceptor` — acceptor / institution sign-in
- `/login/volunteer` — volunteer / RescueMate sign-in
- `/login/admin` — admin sign-in
- `/register` — donor, acceptor or volunteer registration

Legacy `/login/ngo` redirects to `/login/acceptor`. Existing NGO accounts remain recognised as Acceptor institutions.
