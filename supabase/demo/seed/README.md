# Demo seed, as SQL (no keys, no terminal)

Paste these into the **SQL Editor of the desert-springs-demo project**, one at a time, in
this order. Each should say "Success. No rows returned" (part 3 shows a counts table).

| Order | File | What it does |
| --- | --- | --- |
| 1 | `1-members.sql` | 120 members |
| 2 | `2-forum.sql` | 48 threads and 247 replies |
| 3 | `3-listings-events-and-counts.sql` | 30 service listings, 6 events, and a final counts table |
| optional | `4-demo-login-optional.sql` | a login for demo@example.com (edit the password line first) |
| optional | `0-reset-optional.sql` | wipes the demo content so you can start over |

Expected counts at the end of part 3: members 120, threads 48, replies 247, listings 30,
events 6, not_example_accounts 0.

## Safety
Every part begins by checking the database and **stops without changing anything** if:
- any account is not `@example.com` (a real database always has some),
- the database already has demo content (so nothing is ever doubled),
- an earlier part has not been run yet.

All names, businesses and addresses are invented; all emails are `@example.com`.

Regenerate with `node scripts/build-demo-seed-sql.mjs` (same content as `scripts/seed-demo.mjs`).
