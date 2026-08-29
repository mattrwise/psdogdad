# PS Dog Dad launch punch list

Re-verified **29 August 2026** against the live site, the database and `main` at
the current commit. The original audit was 1 August; everything below has been
checked again rather than carried over, so this file says what is true now.

The August 15 launch date has passed and the site is up. The milestone that
matters now is the **October 17 meetup** — see `october_kickoff.md`. Promotion
starts **3 October**.

---

## Cleared

Verified fixed, no action left.

| # | Was | Now |
|---|---|---|
| 1 | Forums advertised 87 invented threads with invented authors | Counts read from `forum_posts`. One real post. |
| 2 | Six mockup resource entries with no address or phone | Removed, with a comment recording which and why |
| 5 | Member search box and both filters had no `onChange` | Wired to state in `app/members/page.tsx` |
| 8 | `events` table empty under a homepage that promoted a date | Kickoff row exists and matches `lib/kickoff.ts` |
| 9 | Signup form did not take you to the validation error | Fixed 29 Aug, see below |
| 10 | Footer social icons were `href="#"` | Gone |
| 11 | Google Fonts fetched twice | Self-hosted at build time |

**Item 9, how it was fixed.** `app/members/join/page.tsx` now sets a `focusField`
state on a failed submit, and an effect scrolls to that field and focuses it.
The order walks down the page: name, city, then the first bad dog row, then
email, password, confirm. Verified in the browser across all five cases.

It uses an effect rather than the `requestAnimationFrame` the profile form uses,
because rAF never fires while a page is hidden, so that version silently does
nothing. Worth porting the same change to `app/members/profile/page.tsx:341`.

---

## Open, and worth doing before you promote

### 3. Messaging has never been tested end to end
`app/members/messages/`, `lib/messages.ts`

Built, deployed, typechecks, reachable. Never exercised by a real send. The
riskiest part is photo attachments: a private bucket plus short-lived signed
links, neither ever run with real traffic. If signing fails, photos sit on
"Loading photo..." forever. Send, receive, unread badges, block and unblock are
all unverified too.

### 4. The directory shows three profiles; two of them are you

Confirmed with Matt on 29 Aug: **Grant is a real member**, a friend who was asked
to join. An earlier reading of this file guessed all three accounts were test
ones because all three dogs are called Lucy. That was wrong.

| Profile | Dog | Avatar | Created | What it is |
|---|---|---|---|---|
| `5c8e1a60` Matt | Lucy | none | 14 Jul | **The admin account, psmattreid@gmail.com** |
| `c2208edf` Grant | Lucy | yes | 4 Aug | Real member |
| `0f8c9c05` Matt | Lucy | yes | 7 Aug | The profile Matt thinks of as his |

So the directory should show two, and one Matt has to go.

**Do not delete `5c8e1a60`.** It is the admin account. The proof is the October
event: `supabase/kickoff-event.sql:16` looks the owner up by
`email = 'psmattreid@gmail.com'`, and the event's `created_by` is `5c8e1a60`.
Event creation is gated on that same address in `supabase/events-setup.sql:24`,
so deleting the account permanently removes the ability to add events — including
the one that has to exist the morning after 17 October. `kickoff-event.sql` would
also raise its own exception on any re-run.

The event itself would survive: `events.created_by` is `on delete set null`.
The admin rights would not.

**Recommended instead: consolidate onto the admin account.** Sign in as
psmattreid@gmail.com, put Lucy's photo and the right details on that profile, and
let it be the public one. `0f8c9c05` then becomes the redundant account and can
go, leaving the admin account and Grant.

One unknown before deleting `0f8c9c05`: it wrote the site's only real forum post,
"Welcome pups n dogdads!!". Whether that post survives depends on the
`forum_posts.user_id` foreign key, and that table has **no migration file in this
repo** (see item 18), so its `on delete` behaviour has not been read. Check it in
the dashboard first, or re-post from the admin account afterwards.

Hiding `5c8e1a60` instead by setting `confirmed = false` does work against the
directory policy (`using (confirmed)`), but it is not durable: the
`on_auth_user_updated` trigger in `supabase/setup.sql` resets `confirmed` from
`email_confirmed_at` on any update to the auth row, and signing in is such an
update. It would come back.

### 6. Password reset emails are flagged by Gmail as suspicious
Unchanged. Authentication is fine — DKIM, SPF and DMARC all verified. The likely
cause is that the reset link points at `spjeepflyxdnztxposoi.supabase.co` rather
than psdogdad.com, which is the shape of a phishing message.

Still not proven; the decisive evidence is the `Authentication-Results` header on
the email itself, still unread. If confirmed, the fix is a Supabase custom domain,
roughly ten dollars a month.

**This is the one open item that costs signups**, because it fires at the exact
moment somebody joins.

### 7. Message notification emails are not switched on
`app/api/notify-message/route.ts`

The route is deployed and does nothing, because `RESEND_API_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` are not set in Vercel. Needs a redeploy after adding
them. Matters as soon as real members arrive: a message nobody is told about
makes the site feel dead.

---

## Open, smaller

### 12. No modal is accessible
Still zero `role="dialog"` anywhere. Nothing traps focus or closes on Escape.
Affects Propose an Event, Suggest a Resource, New Post and the sign-in prompts.

### 13. HEIC photos will not preview outside Safari
`lib/images.ts:30` and `app/members/messages/[id]/page.tsx:22` accept
`image/heic`, previewed through a plain `img`. Chrome and Firefox cannot render
it. HEIC is the iPhone default, so this hits a real slice of members.

### 14. Test artefacts left in storage
Two files, confirmed still present in `member-photos`:

- `_pending/diag-0731/probe.txt` — 5 bytes, 31 Jul
- `_pending/diag-test-token/avatar.jpg` — 23 bytes, 12 Jul

Invisible to members. Delete from the Supabase Storage browser.

### 18. `forum_posts` has no migration file
Every other live table has SQL in `supabase/`. `forum_posts` does not — it was
created in the dashboard and exists only there. So its columns, policies and
foreign keys cannot be read from the repo, which is what blocked item 4 above.

Worth writing out as `supabase/07-forum-posts.sql` to match the rest, so the
schema is recoverable and reviewable.

### 17. /welcome still has the old gradient hero
`app/welcome/page.tsx:63`. Six pages were converted to the standard header;
`/welcome` was deliberately left as the one-off celebration after signup. It is
now the only page that looks like that. A decision either way, not a bug.

---

## Done on 29 August

- **Item 9**, signup scroll-to-error, above.
- **Item 15**, the dead `profiles.notify_on_message` column. Confirmed unread by
  any code path — the preference lives in auth metadata. `supabase/06-drop-dead-notify-column.sql`
  drops it. **Still needs running** in the Supabase SQL editor.
- **Item 16**, stale branches. The merged local branches are deleted. Two merged
  remote branches are still there and need one command:
  `git push origin --delete launch-prep messaging-wip`

Left alone deliberately: `origin/dev` has two unmerged commits from 22 July, and
the local `nav-six-links` has one. Neither is in `main`, so neither was deleted.

---

## The actual state of things

The build is not what is holding this up.

- Members: 3 profiles, but two are yours — one real member besides you (Grant)
- Forum posts: 1, from 7 August
- RSVPs to the October walk: 0
- Pro listings: 0, directory correctly hidden by `DIRECTORY_IS_PUBLIC` in `lib/pros.ts:37`

All public routes return 200. Everything between now and 3 October is audience,
not code.
