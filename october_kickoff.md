# October kickoff

The first PS Dog Dad meetup, and the summer content run that leads up to it.

## The meetup

**Saturday, 17 October 2026, 8:00 AM. Ruth Hardy Park, 700 E Tamarisk Rd, Palm Springs.**

One park, one time. No options offered anywhere on the site, because a poll about
which of four parks on which of three Saturdays is how a first meetup quietly
never happens.

Why these choices:

- **October** because valley mornings are usually back under 80° by then, and
  because two months of runway is enough to build an audience and not so long
  that the date stops feeling real.
- **Ruth Hardy Park** because it has the fenced off-leash area, it is central, it
  has shade, and it is already the park the training guides send people to.
- **8am** because it is early enough to be comfortable and late enough that
  people will actually get up for it.

### Where the date lives in the code

| Thing | File |
|---|---|
| Date, time, location, retirement logic | `lib/kickoff.ts` |
| The event row itself | `supabase/kickoff-event.sql` |
| Homepage banner | `components/KickoffBanner.tsx` |
| Callout with the RSVP | `components/KickoffCallout.tsx` |

`lib/kickoff.ts` is the source of truth for everything the site renders. The SQL
file is the source of truth for what the RSVP writes against. **If the date
moves, change both.**

### Before this is live

Run `supabase/kickoff-event.sql` once in the Supabase SQL editor. It requires
`events-setup.sql` and `events-add-host.sql` to have been run already, and it is
safe to run more than once — it matches on the title and updates in place, so a
re-run never duplicates the event or orphans existing RSVPs.

Until it runs, the callout renders nothing at all rather than advertising a
meetup nobody can RSVP to. The banner still shows, because the date is true
regardless.

## Promotion: not before 3 October

**Nobody RSVPs in August for October.** Posting early spends the announcement on
an audience that will have forgotten by the time it matters.

Two weeks out, which is **Saturday 3 October**, post to:

- [ ] Palm Springs Animal Shelter — ask if they will share it
- [ ] Other valley shelters and rescues
- [ ] Local Facebook groups (Palm Springs community groups, Coachella Valley dog
      groups, neighbourhood groups)
- [ ] Nextdoor
- [ ] The dog-friendly businesses already on the Resources page, the ones with a
      counter and a noticeboard

The late-September post (`/blog/almost-there`, live 25 September) is the thing to
link to. It carries the date, the reasoning and the RSVP in one place.

## Summer content, August through September

One post a week, eight total, all evergreen so it keeps earning after this
summer. Content lives in `lib/posts.ts`, renders at `/blog`.

| Live | Post | Notes |
|---|---|---|
| Aug 6 | Emergency and after-hours vets in the Coachella Valley | Also the Resources page fix. Live on merge, because Resources links straight at it |
| Aug 15 | Clear the Shelters is this weekend | Links only, no meetup, fixed date |
| Aug 21 | The seven-second pavement test | |
| Aug 28 | Heat stroke: the signs, and the car ride | |
| Sep 4 | Hydration and electrolytes: what actually helps | |
| Sep 11 | Indoor enrichment: snuffle mats, frozen Kongs, scent games | |
| Sep 18 | Dog-friendly indoor spots in Palm Springs | |
| Sep 25 | We are almost there | Carries the October date, use this for promotion |

Posts publish themselves on their date. The index and the sitemap only show what
has reached it, unpublished slugs return 404, and the pages revalidate hourly so
nothing needs a deploy on the morning. Adding a post is one entry in
`lib/posts.ts`.

### The rule these were written under

Same as the rest of the site: no invented businesses, no invented numbers. Every
place named is one already verified on the Resources page, and anything
time-sensitive is written so the reader is told to check rather than trust us.
The indoor-spots post says outright that we are not publishing a boutique list we
have not checked. That makes it a shorter post and a true one.

## After 17 October

Both date-sensitive components retire themselves in Pacific time, and the
homepage revalidates hourly, so nothing has to be remembered on the day. What
does need a decision:

- [ ] Create the next event, so the calendar is not empty the morning after
- [ ] Decide whether the banner comes back with the next date or goes away
- [ ] The eight posts stay up. That was the point of writing them evergreen.
