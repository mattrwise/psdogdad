# psdogdad.com

## About the owner
- Prefers short, step-by-step answers that are easy to follow (ADHD).
- Usage costs matter: keep work lean, avoid unnecessary searches and subagents.
- Stress can run high; if the site looks broken, reassure first, then give one small next step.

## Hosting
- Next.js site deployed on Vercel from the `main` branch (www.psdogdad.com).
- Supabase backs the data; Resend sends email. Env vars live in Vercel (see launch_punchlist.md).
- Claude sessions cannot reach the live site or the Vercel dashboard. If the live site looks stale, ask for a screenshot of Vercel > Deployments (status, commit, domain settings) or the build log.

## Weekly routine
- This Weekend page is filled from content/weekend.json via a PR to main.
