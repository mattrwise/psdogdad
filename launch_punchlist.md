# PS Dog Dad launch punch list

Audit run 2026-08-01 against live www.psdogdad.com and `main` at the current commit.
Findings are grouped by how much they matter before launch.

Answers to the five things you asked about are marked **[Q1]** to **[Q5]**.

---

## Where this stands, re-audited 2026-08-27

Every item below was re-checked against the code as it is now. Most of them had
already been fixed in the work since the audit and the list had simply gone
stale. **Every remaining code fix is now done.**

Items 9 and 12 were closed on this branch: the signup form now scrolls to and
focuses the first bad field, and all three modals sit on a shared
`components/Modal.tsx` that gives them `role="dialog"`, an accessible name,
Escape to close, a focus trap and focus restored to whatever opened them.
Verified in a real browser, 13 checks, all passing.

**Nothing in the code is holding the site shut.** What is left is five things
only you can do, because they are account, data and hosting jobs rather than
code:

| # | What | Where |
|---|---|---|
| 3 | Test messaging end to end, photo attachments especially | Two signed-in accounts |
| 4 | Delete the Dan Tanner test account | Supabase, after item 3 |
| 6 | Gmail flags the password reset email | Supabase custom domain, ~$10/mo |
| 7 | Message notification emails are off | Two env vars in Vercel, then redeploy |
| 8 | The events calendar is empty | Run `supabase/kickoff-event.sql` |

Item 8 has moved on since the audit: the August 15 Clear the Shelters weekend
has passed, so the row that matters now is the **17 October kickoff**, and the
homepage callout renders nothing at all until that SQL is run.

Items 14, 15 and 16 are housekeeping and block nothing. Item 17 is still an open
decision, not a defect.

The order that unblocks the most: **7, then 3, then 4.** Notifications on means a
real message reaches somebody; that makes testing messaging worth doing; and
once messaging is proven the test account can go and the directory is honest on
day one.

---

## Blocker

### 1. The forums show invented activity, live, right now **[Q5]**

**DONE.** The index reads its counts from `forum_posts` and a category with nothing
in it says so. Category pages render real posts through `ForumPostList`; where a
category is empty it shows starter prompts that carry no author, timestamp or
reply count, so nothing can be mistaken for a real thread. Verified live: no
invented threads or authors are served.

`app/forums/page.tsx`, `app/forums/[category]/page.tsx`

The forums index advertises **87 threads and 412 posts** in one category, 134 and 891
in another. There are **zero** real forum posts in the database. Category pages render
**24 hardcoded threads** with invented authors: Marco & Biscuit, Tyler & Mango,
Derek & Zeus, James & Pretzel, Chris & Noodle.

Verified visible on the live site: `curl https://www.psdogdad.com/forums` returns
"87" and "Marco &amp; Biscuit", and `/forums/health-wellness` returns the thread
"Best vets in PS for senior dogs".

This is the same class of thing that was cleared off the events page and the homepage
before launch, and it is the largest remaining contradiction of the no invented content
rule. A visitor who clicks a thread finds it is not real.

### 2. Six resource entries look like mockup leftovers **[Q3]** — FIXED
`app/resources/page.tsx`

The page carries **48 entries with phone numbers** and most look genuinely researched:
verified Palm Springs and Coachella Valley addresses, real numbers. So the page as a
whole is real, not placeholder.

But six entries have **no address and no phone**, which is the signature of invented
filler rather than a researched listing:

- Desert Veterinary Clinic
- The Pampered Pup PS
- Desert Doggy Spa
- Fetch Pet Resort
- Palm Springs Feed Company
- The Dog Bar

These were flagged as suspicious in a previous session and are still present. Sending a
member to a groomer that does not exist is worse than a shorter list.

All six have now been removed, with a comment at the top of `resourceSections`
recording which ones and why. The emergency listings were also corrected: VEG is
the confirmed 24-hour option, Rancho Mirage Animal and Emergency is a second ER,
and Veterinary Urgent Care of the Desert is now labelled as closing overnight
rather than reading like a third emergency room.

Six other address-less entries are legitimate and should stay: two national poison
helplines, three trails, and a generic "Various Airbnb / VRBO" entry.

### 3. Messaging has never been tested end to end

**STILL OPEN, and yours.** Needs two signed-in accounts; no code change can close it.

`app/members/messages/`, `lib/messages.ts`

Built, deployed, typechecked, and reachable. Never once exercised by a real send,
because testing needs two signed-in accounts.

The riskiest part is **photo attachments**. They upload to a private storage bucket
and display through short-lived signed links, and neither has ever run with real
traffic. If signing fails, photos will sit on "Loading photo..." forever.

Everything else in the flow is unverified too: send, receive, unread badge clearing,
block and unblock.

### 4. A test account is in the public member directory

**STILL OPEN, and yours.** Data, not code. Delete it once item 3 is done.

The directory shows two members: Matt, and **Dan Tanner**, which is your own second
account created for testing. It is publicly visible at /members.

Useful to keep while messaging is being tested, since messaging needs two accounts.
Should be deleted before anyone real is invited, so the directory is honest on day one.

---

## Should Fix

### 5. Member directory search and filters do nothing **[Q5]**

**DONE.** Search, neighbourhood and breed all filter. Both dropdowns are built from
the members actually present rather than a fixed list, there is a match count and
a Clear filters control, and "nothing matched" is worded differently from
"nobody has joined yet".

`app/members/page.tsx`

The "Search members or dog names" box and both dropdowns (Neighbourhood, Breed) have
no `onChange` and touch no state. Typing produces no response at all.

This is the item most likely to read as *broken* rather than unfinished, and with real
members arriving somebody will try it within minutes.

### 6. Password reset emails are flagged by Gmail as suspicious

**STILL OPEN, and yours.** Hosting, not code. The `Authentication-Results` header on
the email is still the thing to read before spending anything.

Confirmed by you: the email arrives inside a large red warning block with "report spam"
highlighted.

Authentication is not the problem. DKIM, SPF and DMARC are all correctly published and
verified. The likely cause is that the reset link points at
`spjeepflyxdnztxposoi.supabase.co`, not psdogdad.com. An email claiming to be from your
domain, whose button goes to an unrelated domain with a long random token, matches the
shape of a phishing message.

Not yet proven. The decisive evidence is the `Authentication-Results` header on the
email itself, which has not been read.

If confirmed, the real fix is a Supabase custom domain, roughly ten dollars a month, so
auth links live on a psdogdad.com subdomain. This is a warning shown to members at
signup and password recovery, which is the worst possible moment to look untrustworthy.

### 7. Message notification emails are not switched on

**STILL OPEN, and yours.** Two env vars in Vercel and a redeploy. The route is written
and deployed.

`app/api/notify-message/route.ts`

The route exists and is deployed. It does nothing because `RESEND_API_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` are not set in Vercel, and a redeploy is needed after adding
them.

Low value while both accounts are yours. Matters as soon as real members join, because
a message nobody is told about makes the site feel dead.

### 8. The events calendar is empty on the weekend the homepage promotes

**STILL OPEN, and yours.** The August 15 weekend has passed. The row that matters now
is the 17 October kickoff: run `supabase/kickoff-event.sql` once. Until then the
kickoff callout renders nothing rather than advertising an event nobody can RSVP
to, which is correct but means the calendar stays empty.

The homepage carries a Clear the Shelters callout for August 15 and 16, and the launch
banner names August 15. The `events` table has **zero rows**, so the events page and the
homepage events section both show the empty state.

The shelter event still needs creating through the admin panel on /events. Only you can
do it: the insert policy restricts event creation to your email address.

### 9. Signup form does not take you to the error **[Q4]**

**DONE.** Submit now scrolls the first bad field into view and focuses it, checked in
the order the fields appear on the page. Same handling the profile form got.

`app/members/join/page.tsx`

Validation errors **do render**, in red, beneath each field. Twelve error elements,
eleven references to the errors object. So the answer to your question is yes, they show.

But the signup form has no scroll-to-error and no focus handling. The profile form was
given both on July 30. On a form this long, About You then per dog rows then photos then
account details, an error above or below the fold means Submit looks like a dead button.

Same underlying problem that was fixed on the profile page, still present here.

### 10. Footer social icons go nowhere **[Q5]**

**DONE.** The icons were removed rather than pointed at accounts that do not exist.

`components/Footer.tsx:22`

The three social icons are `href="#"` with no accessible label. Clicking one jumps to
the top of the page. Either point them at real accounts or remove them until they exist.

---

## Nice to Have

### 11. Google Fonts are loaded twice

**DONE.** `next/font` self-hosts Inter at build time; the second request is gone.

`app/layout.tsx` has a stylesheet link and `app/globals.css` has an `@import` for the
same family. Two render blocking requests instead of one. Matters most on mobile data.

### 12. No modal is accessible

**DONE.** All three modals now share `components/Modal.tsx`: `role="dialog"`,
`aria-modal`, an accessible name, Escape to close, a focus trap over Tab and
Shift+Tab, and focus returned to the opener on close. It deliberately does not
close on a backdrop click, because all three hold a form somebody has been
typing into.

No modal anywhere sets `role="dialog"`, traps focus, or closes on Escape. Verified: zero
matches across the whole codebase. Affects Propose an Event, Suggest a Resource, New Post
and the sign-in prompts.

### 13. HEIC photos will not preview outside Safari

**DONE.** `downscaleImage` re-encodes to JPEG on upload and the stored file takes its
extension from the result, so a HEIC never lands under a `.heic` name.

Uploads accept `image/heic` and preview through a plain `img` tag. Chrome and Firefox
cannot render HEIC, so the preview breaks even though the upload succeeds. HEIC is the
iPhone default, so this will affect a real slice of members.

### 14. Test artefacts left in storage

**STILL OPEN, and yours.** Storage, not code. Blocks nothing.

`member-photos/_pending/` contains `diag-0731` and `diag-test-token`, both left behind by
diagnostic checks. Harmless, invisible to members, but worth clearing.

### 15. An unused column on profiles

**STILL OPEN, and yours.** Blocks nothing.

`profiles.notify_on_message` was added, then the preference was stored in auth metadata
instead, because members have no write access to profiles and profiles is publicly
readable. The column is now dead. No harm, just untidy.

### 16. Merged branches still on the remote

**STILL OPEN, and yours.** `launch-prep`, `messaging-wip` and `dev` are all still on the
remote, along with a number of finished `claude/*` branches. Blocks nothing.

`launch-prep` and `messaging-wip` are both fully merged into `main` and can be deleted.
`dev` is long stale and well behind.

### 17. /welcome still has the old gradient hero

**STILL AN OPEN DECISION.** `/welcome` is confirmed as the only page using
`bg-hero-gradient`. Not a defect either way.

Six pages were converted to the standard header. `/welcome` was deliberately left, since
it is the one off celebration right after signup. Worth a decision either way, since it
is now the only page that looks like that.

---

## Verified as working, no action needed

**[Q1] The forgot password route exists and works.** `app/members/reset-password/page.tsx`
is present, returns HTTP 200 live, and the login page points at the matching path. You
ran the whole flow yourself on July 30: request, email arrived, link opened the page,
password changed, landed signed in. The only outstanding issue is the Gmail warning
covered in item 6, which is about deliverability, not the route.

**[Q2] Nothing points at unfinished messaging.** `messaging-wip` was merged into `main`
and has no commits that main lacks. All three messaging links resolve to routes that are
live: /members/messages returns 200, the thread and Message buttons build their paths
from real member ids, and /api/notify-message returns 405 to a GET, which is correct for
a POST only route. There are no orphaned links to a branch.

**[Q4] Both forms do show validation errors.** Profile also scrolls to the first bad field
and names the problem. Signup renders errors but does not scroll, which is item 9.

**[Q5] No dead buttons.** A scan for buttons with no onClick, no submit type and no href
found none. The only dead link on the site is the footer social icons, item 10.

**All 15 public routes return HTTP 200.**
