# Desert Springs Dog Dad: demo setup

A fictional-city copy of the site for showing to template buyers. Same code as the
live site, switched into demo mode by one environment variable. Live site code paths
are unchanged when that variable is not set.

## What demo mode does
- Rebrands to **Desert Springs Dog Dad** (general dog-owner audience, teal and sand colors).
- Shows a "Demo site with sample content." bar on every page.
- Blocks search engines: `robots.txt` disallows everything, empty sitemap,
  `noindex` meta tag, and an `X-Robots-Tag` header.
- Swaps the real local businesses, vets, emergency numbers and paid kits for invented
  ones. Turns the Dog Pros directory on and adds a Veterinary category.
- Uses `example.com` addresses and `555-01xx` phone numbers throughout.

## Setting up a different city later
Open `lib/brand.ts`, copy a block inside `CITIES`, change the name, city, towns,
audience wording, email, logo paths and colors, then set `NEXT_PUBLIC_CITY=<your key>`.
That one file controls all of it.

## One-time setup (do these in order)

### 1. Create the demo database (Supabase)
1. supabase.com -> **New project**. Name it `desert-springs-demo`. **Not** the live one.
2. Copy its **Project URL**, **anon key** and **service_role key** somewhere private.
3. Open `supabase/demo/demo-setup.sql` on GitHub, click the copy button, and paste it into the demo
   project's **SQL Editor -> New query -> Run**. (It is already built. If a file in `/supabase` ever changes, rebuild it with `./scripts/build-demo-sql.sh`, which writes `demo-setup.sql` at the repo root.) If it shows an error, send me the
   message. (I could not run this against a real database from here.)
5. Authentication -> Providers -> Email: turn **Confirm email** off, and consider
   turning **Allow new users to sign up** off, so strangers cannot add accounts to the demo.

### 2. Fill it with sample content
```
npm install
DEMO_SUPABASE_URL=https://YOUR-DEMO-REF.supabase.co \
DEMO_SUPABASE_SERVICE_ROLE_KEY=YOUR-DEMO-SERVICE-KEY \
CONFIRM_DEMO=yes \
node scripts/seed-demo.mjs
```
It prints a demo login (`demo@example.com` and a password) for sales calls.
To wipe and rebuild: add `--reset`.

The script refuses to run against the live project, and refuses if the database holds
any account that is not `@example.com`.

### 3. Deploy (Vercel)
1. vercel.com -> **Add New -> Project** -> pick this repo. Name it `desert-springs-demo`.
   Make it a **new** project, separate from the live one.
2. **Branch**: set Production Branch to the branch these changes live on (or merge the PR
   and use `main`, whichever you prefer).
3. Add the variables from `.env.demo.example` under Settings -> Environment Variables.
   Only the three public ones plus `NEXT_PUBLIC_DEMO=true`. Do **not** add the service
   role key or the Resend key.
4. Deploy. Visit the URL and check the banner shows.

### 4. Optional: keep the free database awake
In the GitHub repo -> Settings -> Secrets -> Actions, add `DEMO_SUPABASE_URL` and
`DEMO_SUPABASE_ANON_KEY`. The existing daily job will ping the demo too.

## Notes
- Every name, business and address is invented. A name or business may still happen to
  match something real by coincidence, so skim before showing it widely.
- The live site's own ping job (`keepalive.yml`) is untouched.
