# QA / UX review, 7 August 2026

## What this covers, and what it does not

Walked the **public** pages on the live site at phone width (375px): home, guides,
resources, members, forums, events, join. Checked layout, console errors, link and
image accessibility, form fields, and tap target sizes.

**Nothing behind the sign-in was tested.** Your profile, the new photo gallery, and
all of messaging need an account, and Claude does not sign into your account. That
means the gallery upload, the message Edit and Delete buttons, and deleting a
conversation have still never been used by a human. You are the first.

---

## Needs your attention

### 1. The October 17th walk is not on the Events calendar

This is the most visible inconsistency on the site right now.

The banner across the top of every page says the club officially starts with a group
walk on **October 17th at 8am**. The callout on the home page repeats it with the
time and a "meeting point to be announced".

Click **Events** and the calendar says *"This calendar is yours to build."* Nothing
for October. The only thing on the page is the August adoption weekend callout.

Both October mentions are hardcoded into the page templates. Neither is a real event
in the database. So a visitor who reads the promise and follows it lands on an empty
calendar, which reads as a club that announced something and then forgot about it.

**Only you can fix this.** The database rule restricts creating events to
psmattreid@gmail.com, so it has to be you, through the "+ Propose an Event" admin
panel on /events. Host: PS Dog Dad. Once it exists, the calendar backs up the banner.

### 2. Tap targets are small for the people using this site

Measured on a phone:

| Element | Height | Recommended |
|---|---|---|
| Footer links (Training, Forums, Members...) | 17px | 44px |
| Nav links in the mobile menu | 17px | 44px |
| Hamburger menu button | 34px | 44px |
| Password show/hide eye on signup | 36px | 44px |

Apple and the accessibility guidelines both put the minimum around 44px. Your members
are largely in our age bracket, often reading outdoors on a phone in bright desert
sun. The footer is the worst of it and the easiest to fix.

Not urgent, nothing is broken, but it is the cheapest usability win on the list.

### 3. Guides was missing from the footer

My omission from today. I added Guides to the top navigation and did not add it to
the footer's Community column, so the footer listed Training, Forums, Members, Events,
Resources and skipped the new page. **Fixed in this same commit.**

---

## Checked and genuinely fine

These were worth verifying, and all passed:

- **No console errors** on any public page.
- **No horizontal scrolling** at 375px on any page. Nothing overflows.
- **Every image has alt text.** No unnamed links or buttons anywhere checked.
- **The signup form is in good shape.** Every field is properly labelled, and
  autocomplete is set correctly on name, city, email and password, so phones will
  offer to fill them.
- **Guides page works on mobile**, cards stack cleanly, nav fits at seven items.

### Old problems that are now actually resolved

Three things from the July QA report and my own notes are fixed, and I confirmed it
rather than assuming:

- **The member directory search and filters work.** They were decorative, with no
  handler attached. They now respond.
- **The forums no longer invent content.** No fabricated thread counts, no made-up
  members. One real thread, and empty categories say so honestly.
- **The footer social icons that pointed nowhere are gone.**

---

## Notes for whoever picks this up next

**The no-dashes rule needs two greps, not one.** Searching for the literal `—` and
`–` characters misses the HTML entity forms `&mdash;` and `&ndash;`. The shelter
weekend times use `&ndash;` and are **deliberate**, since you asked for that dash back
in commit dfb8778, so leave it alone.

**Still open, unchanged from earlier reviews:** the signup form does not scroll to its
validation error the way the profile form does; no modal sets `role="dialog"` or
closes on Escape; HEIC photos will not preview outside Safari.
