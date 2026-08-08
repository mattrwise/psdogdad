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
safe to run more than once, it matches on the title and updates in place, so a
re-run never duplicates the event or orphans existing RSVPs.

Until it runs, the callout renders nothing at all rather than advertising a
meetup nobody can RSVP to. The banner still shows, because the date is true
regardless.

## Promotion: not before 3 October

**Nobody RSVPs in August for October.** Posting early spends the announcement on
an audience that will have forgotten by the time it matters.

Two weeks out, which is **Saturday 3 October**, post to:

- [ ] Palm Springs Animal Shelter, ask if they will share it
- [ ] Other valley shelters and rescues
- [ ] Local Facebook groups (Palm Springs community groups, Coachella Valley dog
      groups, neighborhood groups)
- [ ] Nextdoor
- [ ] The dog-friendly businesses already on the Resources page, the ones with a
      counter and a noticeboard

Link to the homepage. The banner carries the date and the callout below it has
the RSVP button.

## Summer content

Eight posts were written for an August-to-September run (pavement test, heat
stroke, emergency vets, hydration, indoor enrichment, indoor spots, Clear the
Shelters, and a late-September countdown), living at `/blog` with a schedule
that published them one a week.

**Removed on 8 August.** The site already had Training, Guides and Resources,
and a fourth reading section made the place confusing to land on. The writing is
not lost, it is in git history on the `claude/october-kickoff-planning-gjg7el`
branch if it is ever wanted.

What survived the removal, because it was the point of the exercise: the
Resources page emergency section is correct, and the pet supply listings are
real ones rather than invented ones.

## After 17 October

Both date-sensitive components retire themselves in Pacific time, and the
homepage revalidates hourly, so nothing has to be remembered on the day. What
does need a decision:

- [ ] Create the next event, so the calendar is not empty the morning after
- [ ] Decide whether the banner comes back with the next date or goes away
