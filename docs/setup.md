# UNAVULINK SETUP & DEPLOYMENT GUIDE

## 1. Local Development Quick Start

```bash
# Navigate to the project root
cd unavulink

# Install dependencies
npm install

# Start local development server
npm run dev
```

The web application will open at `http://localhost:5173`.
By default, UnavuLink runs with **autonomous Tamil Nadu seed data** with full in-memory/localStorage reactivity. You can immediately log into or switch between all 5 roles:
- **Admin**: `admin@unavulink.org`
- **Donor**: `senthil@annapoorna.demo`
- **NGO**: `sister.mary@anbalayam.demo`
- **Acceptor**: `selvi.acceptor@unavulink.demo`
- **Common People / Volunteer**: `karthik.volunteer@unavulink.demo`

---

## 2. Supabase Cloud Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab.
3. Paste and run `supabase/migrations/001_initial_schema.sql`.
4. (Optional) Paste and run `supabase/seed.sql` to populate realistic Tamil Nadu records.
5. In Supabase Project Settings -> API, copy your `Project URL` and `anon public key`.
6. Add them to your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

---

## 3. Google Gemini Vision API Configuration

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com).
2. Add it to your `.env` file:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...
   ```
3. If no key is set, the application uses its built-in realistic vision boundary emulator so all AI features remain fully demonstrable during hackathons.

---

## 4. Production Deployment to Vercel

```bash
# Production build check
npm run build

# Deploy to Vercel via CLI
npx vercel --prod
```

Configure the environment variables in Vercel Project Settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_APP_ENV=production`
