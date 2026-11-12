# Compatibility repair notes

## Applied in this archive

- The application root now opens the role selector instead of the marketing landing page.
- Four dedicated sign-in routes are available: donor, acceptor, volunteer and admin.
- Legacy `/login/ngo` routes to the acceptor sign-in page.
- Legacy NGO accounts are accepted through the Acceptor portal and use the simplified Acceptor navigation.
- The login forms no longer pre-fill passwords or expose demo passwords in the UI.
- The app no longer auto-signs in the first seeded Admin profile.
- Live login now authenticates with Supabase Auth first and loads the matching `profiles` row by Auth user ID.
- Local demo authentication is restricted to development builds and the four seeded demo personas.
- Public registration cannot assign the Admin role.
- New Supabase Auth identities receive a matching base profile through migration 003.
- Role-specific registration details are staged until the user verifies their email and signs in, then synced to the appropriate profile table.
- Email verification resend and password recovery now use Supabase Auth rather than client-generated tokens in live mode.
- Profile edits now update Supabase in live mode.
- Privileged profile fields are protected by an additive database trigger and the broad public profile-read policy is removed.
- The email delivery service no longer exposes a Resend API key in browser code. A server-side `send-email` Edge Function is included.
- The food donation form no longer invokes fake image analysis or fills made-up AI results.
- Food listing cards and food detail dialogs no longer use decorative food photographs.
- Navigation has been reduced to role-relevant actions, with a compact mobile navigation.

## Required setup

1. Copy `.env.example` to `.env`.
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run migrations 001, 002 and 003 in order.
4. Configure Supabase Auth email confirmation and redirect URLs.
5. Deploy the `send-email` Edge Function and set its server-side secrets if transactional email is required.
6. Create the Admin identity privately and assign its role through a trusted admin process.

See `docs/setup.md` for exact steps.

## Known limitations that must not be mistaken for completed integrations

- The existing donation/request/mission store still contains local/demo-backed logic. The entire food operations data layer has not yet been migrated to Supabase. Do not use this archive to coordinate real donations or store real beneficiary data until that migration and its RLS policies are completed and tested.
- The pending role-profile draft is temporarily stored in the same browser until the new user verifies their email and signs in. It is not a cross-device onboarding flow.
- The `send-email` Edge Function is restricted to sending to the currently authenticated user's own email address. It is not a general notification fan-out service.
- WhatsApp, maps/routing, analytics and AI services still require their own provider setup and end-to-end validation. A UI page or configured key alone does not prove a working integration.
- No claim is made that the Supabase migrations have been applied to your hosted database.

## Validation performed for this handoff

- TypeScript/TSX source syntax transpilation: 63 files checked, zero syntax diagnostics.
- Full `npm run build`: not completed. Dependency installation timed out in this environment and the project currently lacks installed `vite/client` and `@types/node` packages. Run `npm ci` and then `npm run build` on your machine.
- Supabase SQL migrations: inspected and authored, but not executed against your Supabase project.
