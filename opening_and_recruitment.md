# Opening PS Dog Dad, and getting members

Two questions, answered against `main` on 23 August 2026: what is left before the
site is open, and how the first members actually arrive.

The live site could not be reached from the session this was written in, the
network policy blocks www.psdogdad.com, so everything below is read off the code
and the two audits rather than off the running site. The last live check is the
7 August QA report.

---

## Where it stands

The code is in better shape than `launch_punchlist.md` reads, because most of it
has been fixed since. Confirmed in the tree today:

- The forums no longer invent activity. No 87 threads, no 412 posts, no Marco & Biscuit.
- The member directory search box and both filters are wired to state. They work.
- The dead footer social icons are gone.
- Fonts are self hosted at build time and loaded once.
- The six invented businesses are off `/resources`, and the emergency section
  names VEG as the confirmed 24 hour option.
- HEIC has a real fallback in `lib/images.ts` rather than a broken preview.
- The August 15 and 16 shelter callout retires itself, and that weekend has now
  passed, so it is already gone from the homepage.

What is left is mostly not code. It is five things only you can do, because they
need the Supabase project, the Vercel dashboard, or an account with your email
on it.

---

## Part one: opening

### Before anyone is invited

**1. Test messaging end to end, with both accounts.** It is built, deployed,
typechecked and reachable, and it has never been exercised by a real send. The
riskiest part is photo attachments: they go to a private bucket and display
through short lived signed links, and neither has ever run with real traffic.
Send a message with a photo in both directions between your account and the test
one. Watch for the unread badge appearing and clearing, the photo rendering
rather than sitting on "Loading photo..." forever, edit, delete, block and
unblock. Half an hour, and it clears the last unverified feature on the site.

**2. Then delete the test account.** In that order, it is needed for step 1. As
of the 1 August audit the directory showed two members, you and Dan Tanner, and
Dan Tanner is your own second account. `/members` is public, and it should be
honest the first time a stranger looks at it.

**3. Run `supabase/kickoff-event.sql` in the Supabase SQL editor.** This is the
loudest contradiction on the site right now. Every page carries a banner
promising a group walk on October 17, and `/events` says "This calendar is yours
to build." The file is safe to re-run, it matches on the title and updates in
place, so it never duplicates the event or orphans an RSVP. It needs
`events-setup.sql` and `events-add-host.sql` to have been run first, and it looks
your account up by email, so you have to have signed in at least once. Only you
can do this: the insert policy on `events` restricts event creation to
psmattreid@gmail.com.

**4. Switch on message notification emails.** Put `RESEND_API_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` into Vercel and redeploy, the route reads them at
module load so a redeploy is required. Until then `/api/notify-message` returns
`not-configured` and sends nothing. This was low value while both accounts were
yours. It matters on day one: the first member who messages you and hears nothing
for three days concludes the place is dead.

**5. Decide what the homepage banner says.** It currently reads "This site is
currently under development but open for early membership". You cannot hand
somebody a card in a parking lot and have them land on a construction notice. The
August 15 launch date has passed. Either drop that line and let the October 17
banner carry the page on its own, or cut it back to the date.

### Before the October push, but not before the first invite

**6. The Gmail warning: answered, and it is not an authentication problem.**
Read off the headers of the 30 July reset email. Authentication passes on every
count:

    dkim=pass   header.i=@psdogdad.com  header.s=resend
    dkim=pass   header.i=@amazonses.com
    spf=pass    smtp.mailfrom=...@send.psdogdad.com
    dmarc=pass  (p=NONE sp=NONE) header.from=psdogdad.com

So the punch list's guess was right. Nothing is wrong with the sending. The
button in that email goes to
`spjeepflyxdnztxposoi.supabase.co/auth/v1/verify?token=...`, and an email from
your domain whose one link points at an unrelated domain with a long random
token is the exact shape of a phishing message, which is what Gmail is reacting
to. The fix really is the Supabase custom domain, about ten dollars a month, so
that link sits on a psdogdad.com subdomain.

Two things fell out of reading it that are worth having:

- **`p=NONE` is the weakest DMARC policy there is.** It publishes the record and
  then asks nobody to act on it. Alignment is already passing, so moving it to
  `p=quarantine` is a DNS edit that costs nothing and tells Gmail you mean it.
  Do this one first, it may be enough on its own.
- **These emails already go out through Resend**, on a verified psdogdad.com
  signing key, via Amazon SES. So the Resend account and the domain
  verification are done. Item 4 above is copying an existing key into Vercel,
  not setting up a new service.

**7. Decide the auto-confirm stopgap.** `supabase/auto-confirm-stopgap.sql` is
still installed, so every signup is confirmed automatically and nobody has to
prove they own the address they typed. That was right while Supabase email was
unreliable and everybody signing up was you. Once step 4 gives you working email,
drop the trigger and let confirmation do its job. The file documents its own
removal.

**8. Signup form scroll-to-error. Done, 23 August.** It now names the problem at
the top of the card, scrolls to the offending field and focuses it, the same way
the profile form has since 30 July. The order it picks the first problem in is
the order the fields appear on the page, so somebody with two mistakes is taken
to the higher one.

### Can wait, and should

- ~~No modal sets `role="dialog"`, traps focus or closes on Escape.~~ Done,
  23 August. All three (Propose an Event, Suggest a Resource, New Post) share
  `lib/useModal.ts`: Escape closes, Tab stays inside, focus moves in on open and
  returns to the button that opened it on close.
- ~~Footer and mobile nav links are 17px tall against a recommended 44px.~~ Done,
  23 August. Footer rows, mobile menu rows, the hamburger and the password eye on
  all three password forms are now 44px.
- `/welcome` is the last page still wearing the old gradient hero.
- Housekeeping: `diag-0731` and `diag-test-token` in `member-photos/_pending/`,
  the dead `profiles.notify_on_message` column, the merged `launch-prep` and
  `messaging-wip` branches on the remote.
- The pro directory stays dark. `DIRECTORY_IS_PUBLIC` is false and should stay
  false until there are three or four real listings. It is also downstream of
  everything in part two: a trainer pays to be in front of members, so members
  come first.

---

## Part two: getting guys to join

Two things worth saying plainly before the list.

**The website does not recruit, it closes.** Somebody has to hear about this from
a person, a noticeboard, or a group they already read. The site is where they
land to find out whether it is real. So the work below is almost entirely
offline, and the site's only job is to not embarrass you when they arrive. That
is what part one is for.

**Sell the walk, not the club.** "Join a community for dog dads" asks a stranger
to commit to an identity and fill in a form. "Saturday the 17th, 8am, Ruth Hardy
Park, bring your dog" asks him to turn up once. The first is a decision, the
second is a Saturday morning he already had free. Every card, post and
conversation should lead with the walk. Membership is what happens after somebody
has met three people.

### The first ten come from you

Write out every dog owning man you know in the valley. Neighbours, the guys you
already see at the park, people from work, anyone you have ever talked dogs with.
Then text them one at a time. Not a group message, not a link drop. A message
that says you are starting a thing and you want them there on the 17th.

Ten personal asks is an evening's work and gets four to six people. That is a
real first walk. It also fixes the problem no amount of promotion solves: a
directory with one member in it is the single thing most likely to make a visitor
close the tab. Your friends make the site true, and then the site can do its work
on strangers.

Do this part now. It is the only recruitment that does not care that October is
eight weeks away.

### Groundwork now, announcement on 3 October

`october_kickoff.md` is right that nobody RSVPs in August for October, and that
posting early spends the announcement on people who will have forgotten by the
time it matters. But asking permission and making the announcement are not the
same job, and the asking needs lead time. Split them.

**Now through September, relationships and materials:**

- **Palm Springs Animal Shelter**, 4575 E Mesquite Ave. Ask now whether they
  would share it in October. A yes in August is a post in October. The same
  question asked on 3 October is a maybe that expires. Same for Desert Hot
  Springs Animal Care and Control, and the valley rescues.
- **The businesses already on your Resources page.** Forty eight researched
  listings with real addresses and phone numbers, which is an outreach list you
  have already built. Work the ones with a counter and a noticeboard: the
  groomers, the vets, the feed store, and the Palm Canyon patios that already let
  dogs sit on them. Ask to leave a small stack of cards. Most will say yes,
  because it costs them nothing and their customers are your members.
- **Print one small card that says one thing.** Saturday October 17, 8am, Ruth
  Hardy Park, psdogdad.com. No feature list, no explanation of what the community
  is. A card that says one thing gets read.
- **Nextdoor, and be a person on it for six weeks before you post the walk.**
  Answer a heat question, recommend a vet, mention your own dog. Neighbourhood
  feeds bury an account that turns up once to advertise, and six weeks of being
  a neighbour first is what buys the October post.

  **No Facebook.** A lot of valley dog talk does happen in Facebook groups, and
  the plan does not use them, because you are not joining Facebook to run a dog
  club and that is a reasonable place to draw a line. What replaces it is the
  shelter's own audience, which is bigger than any of those groups and reaches
  the same people, plus Nextdoor, the noticeboards, and the park. If a member
  turns up later who is already in those groups, they can post it in a way that
  reads better coming from them anyway.

**Saturday 3 October, two weeks out, the push:**

- The shelters and rescues who already said yes.
- Nextdoor.
- Back around the businesses to refresh the cards.

All of it links to the homepage, because that is where the banner and the RSVP
button live.

**The week of:** one reminder post, and a nudge to anyone who has signed up but
not RSVPed.

### The highest yield hour you have

Ruth Hardy Park, the off-leash area, between 7 and 9 on a weekend morning. The
same place at the same hour as the thing you are inviting people to. The men
there own dogs, are awake, are already outside, and are standing around watching
their dog for forty minutes with nothing else to do. Talk to them. Hand them a
card. Tell them what is happening on the 17th.

Demuth Park Dog Run and the David H. Ready dog park behind City Hall are the same
idea on a different morning. Rancho Mirage, Panorama Park in Cathedral City and
Palm Desert are there when you want to reach past Palm Springs, but not for the
first walk: nobody drives thirty minutes to meet strangers.

This costs nothing, needs nobody's permission, and converts better than anything
you can post, because you are a guy with a dog rather than an advertisement.

### What not to do

- **Do not buy anything.** No ads, no boosted posts. There is nothing to advertise
  yet, and a paid click lands on a quiet forum.
- **Do not fake the room.** The invented forum threads came out for a reason, the
  six made up businesses came off `/resources` for the same one, and the pro
  directory stays hidden rather than look busy. The About page says out loud that
  the calendar is empty and the forums are quiet, and that honesty is the reason
  anybody believes the rest of the site.
- **Do not build more site.** When recruitment feels slow the temptation is to add
  a feature. Nobody is failing to join because of a missing feature.

### The morning after the walk is what decides whether this lives

This is already a checkbox at the bottom of `october_kickoff.md` and it deserves
more weight than that. If the calendar is empty on 18 October, everybody who came
on the 17th learns that this was an event rather than a club.

- Create the next one before you go to bed on the 17th. Same park, same time, a
  month later is the right default. Cadence is what makes somebody come a third
  time.
- Ask on the walk, out loud, who wants to host the next thing at their pool. The
  About page promises Yappy Hours and pool parties, and one member hosting the
  second event is worth more than you hosting five.
- Photos from the walk on the site, with permission. That is the moment
  `/members` and `/forums` stop being empty rooms.
- Decide whether the banner comes back with the next date or goes away.

### What success looks like

Six to twelve dogs on 17 October is a real first walk, and four is still a club.
The number to watch afterwards is not signups, it is how many of the people who
came in October come again in November. Ten men who turn up monthly is a
functioning club. Two hundred signups who have never met each other is a mailing
list with a forum attached.
