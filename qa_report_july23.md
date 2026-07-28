# PS Dog Dad — Pre-Launch QA Report
**Date:** 2026-07-23
**Scope:** `origin/dev` (the branch holding the real, full site — see Branch Note below). No code was changed as part of this pass.

## Branch note (context, not a finding)
`origin/main` — what `psdogdad.com` currently serves — is intentionally an "under construction" holding page as of commit `13ce344` (confirmed with you; not listed below). The actual product lives on `origin/dev`. This report audits `dev`. Whatever plan gets `dev` promoted to `main` for the Aug 1 launch should include re-adding `Nav`/`Footer`/`PendingPhotoSync` to `app/layout.tsx` and removing (or replacing) `middleware.ts` — both already true on `dev`, just flagging that the merge needs to actually carry them over.

## Stripe — nothing to check
There is no Stripe integration anywhere in the codebase (verified by grepping for `stripe`, `payment`, `checkout`, `billing`, `donate` across the repo — the only "stripe" hit is an unrelated `HAZARD_STRIPES` CSS constant in the heat banner). The one place a paid tier is referenced — Training guides marked "★ Premium" — explicitly shows a "Premium isn't open yet, join free and we'll email you" message instead of a paywall ([components/training/GuideBody.tsx](components/training/GuideBody.tsx)). That looks like a deliberate placeholder, not a bug, so it's not listed below. Flagging only so you know this was checked, not skipped.

---

## Blocker

### 1. "Propose an Event" silently discards everything the member typed
[components/events/ProposeEventModal.tsx](components/events/ProposeEventModal.tsx)
Every text field — Event Name, Date, Start/End Time, Max Attendees, Location, Description — has no `value`/`onChange` at all, so nothing typed into them is ever read into state. On submit, `handleSubmit` does nothing but flip local state to show "🎉 Proposal Submitted! Our team will review it and reach out to you shortly." There is no Supabase insert, no email, no API call — the data is thrown away and you have no record the proposal ever happened. Compare with `AdminEventForm` in the same file and `SuggestResourceModal`, both of which correctly `supabase.from(...).insert(...)`. Members will believe they've proposed an event and expect to hear back; you'll never see it.

### 2. "Forgot password" points at a page that doesn't exist
[app/members/login/page.tsx:57-59](app/members/login/page.tsx#L57)
`resetPasswordForEmail` sends members to `${origin}/members/reset-password`, but there is no `app/members/reset-password/` route anywhere in the repo. Anyone who requests a reset and clicks the email link lands on a Next.js 404 with no way to set a new password. This is the only self-service account-recovery path in the app, and it's completely broken today, independent of the Resend/email-deliverability work already on your list.

### 3. RSVPing to the sample/placeholder events looks real but isn't saved anywhere
[app/events/page.tsx](app/events/page.tsx)
The five hardcoded "sample" events (Yappy Hour, Morning Dog Walk, Pool Party, etc.) sit above/alongside real Supabase-backed events on the same page, styled identically, with realistic hosts and attendee counts. Clicking RSVP on one of these flips the button to "✓ Going!" and bumps the count — purely in React state. Refresh the page and it's gone; the "host" (e.g. "Marco & Biscuit") never finds out anyone RSVP'd. A member has no way to tell these apart from the real, persisted events (which behave correctly — see `handleRealRsvp`). Someone could reasonably believe they're on a list for an actual gathering when they aren't.

---

## Should Fix

### 4. Client-side validation errors are easy to miss on the signup and profile-edit forms
[app/members/join/page.tsx](app/members/join/page.tsx), [app/members/profile/page.tsx](app/members/profile/page.tsx)
When `validate()`/`validateDogs()` fail, errors are set but nothing scrolls to or focuses the first invalid field, and there's no `aria-live` region announcing that submission failed. On a long form (About You → per-dog photo uploads → Account), a member who fixes the visible field but still has an error higher/lower on the page will click Submit and see... nothing happen. Also, inputs never get `aria-invalid`/`aria-describedby`, so screen reader users aren't told a given field is in an error state or what the error text says (the error text is visually adjacent but not programmatically linked to the input).

### 5. Photo upload validation uses browser `alert()`, not the app's own error UI
[app/members/join/page.tsx](app/members/join/page.tsx) (`PhotoUpload`, lines ~33-39), same pattern in [app/members/profile/page.tsx](app/members/profile/page.tsx)
Wrong file type or a file over 8MB triggers a native `alert()` instead of the inline red-bordered error style used everywhere else in the same form. It's jarring, blocks the tab, and looks inconsistent with the rest of the product's polish.

### 6. HEIC photos likely won't preview outside Safari
Both `PhotoUpload` components accept `image/heic`/`image/heif` and preview the selection via `URL.createObjectURL()` in a plain `<img>`. Chrome and Firefox on both desktop and Android cannot render HEIC in an `<img>` tag — the preview will show a broken-image icon even though the upload itself will likely succeed (Supabase Storage doesn't care about the format). Given the target audience is uploading photos straight from iPhones, HEIC is the default format for a meaningful slice of users, and non-Safari members are the ones who'll hit this.

### 7. Member directory search and filters are decorative
[app/members/page.tsx](app/members/page.tsx) (lines ~123-142)
The "Search members or dog names..." input and the Neighborhood/Breed `<select>` dropdowns have no `onChange`, no state, and touch nothing in the rendered list. Now that real member profiles are live on this page (not just samples), a visitor typing a search and getting no response reads as broken, not as "coming soon."

### 8. Events page category filter buttons don't filter anything
[app/events/page.tsx](app/events/page.tsx) (lines ~440-455)
`FILTERS` (All Events / Walks / Social / Pool-Water / Hikes / Members Only) sets `activeFilter` on click and highlights the active pill, but that state is never applied to either the real or sample event lists below it — clicking "Walks" changes nothing on screen. (For contrast: the equivalent city/specialty filters on the Health & Wellness vet finder *are* correctly wired, so this isn't a repo-wide pattern — just this one spot.)

### 9. "View all past events →" is a dead button
[app/events/page.tsx:605](app/events/page.tsx#L605) — no `onClick`, no `href`, does nothing on click.

### 10. Sample forum threads look clickable but aren't
[app/forums/[category]/page.tsx](app/forums/%5Bcategory%5D/page.tsx) (lines ~168-190)
The hardcoded sample threads under each category use `cursor-pointer` and `hover:text-brand-teal` on the title, matching the visual language of a link — but there's no `onClick` or `href`. Real posts loaded via `ForumPostList` correctly don't have this hover treatment, so the inconsistency will read as broken to anyone who clicks a sample thread expecting it to open.

### 11. No focus management or keyboard support on any modal
Applies to `DetailsModal`/`SignInPrompt` in [app/events/page.tsx](app/events/page.tsx), [components/events/ProposeEventModal.tsx](components/events/ProposeEventModal.tsx), [components/resources/SuggestResourceModal.tsx](components/resources/SuggestResourceModal.tsx), and [components/forums/NewPostModal.tsx](components/forums/NewPostModal.tsx). None of them set `role="dialog"`/`aria-modal="true"`, trap focus inside the modal while open, close on <kbd>Escape</kbd>, or return focus to the button that opened them once closed. This is systemic rather than one modal's bug, so worth fixing once at the pattern level (e.g. a shared `<Modal>` wrapper) rather than five times individually.

### 12. Footer social icons are dead links with no accessible label
[components/Footer.tsx:20-26](components/Footer.tsx#L20)
The 📘/📸/🐦 icons all point to `href="#"` and have no `aria-label`, so a screen reader announces them as bare, unlabeled links (and clicking one just jumps to the top of the page). Either wire them to real profiles or remove them until you have some — right now they're both a broken-link finding and an accessibility gap.

### 13. Google Fonts are loaded twice
[app/layout.tsx](app/layout.tsx) has `<link rel="stylesheet" href="...fonts.googleapis.com...">` in `<head>`, and [app/globals.css:5](app/globals.css#L5) also has `@import url(...fonts.googleapis.com...)` for the same family. That's two render-blocking requests for the same font instead of one — worth trimming to whichever one you intend to keep, especially since it affects mobile load time on cellular.

---

## Nice to Have

### 14. "This community is for men 18+" is a text line, not an actual gate
[app/members/join/page.tsx:317](app/members/join/page.tsx#L317) — no date-of-birth field or checkbox, just a sentence next to the Conduct/Privacy links. Not saying you need a hard age gate, just noting it's unenforced as written, in case that matters for how you've represented the community elsewhere.

### 15. Static "social proof" numbers will look stale once real activity exists
The homepage stat "340+ Members," and every forum category's thread/post counts and "latest" post preview ([app/forums/page.tsx](app/forums/page.tsx), [app/forums/[category]/page.tsx](app/forums/%5Bcategory%5D/page.tsx)) are hardcoded. This is consistent with the placeholder pattern you've used elsewhere pre-launch (sample members, sample events) so it's not flagged as broken — just a reminder these numbers won't move on their own once the real community starts posting, and will start looking dishonest if they sit static for months.

### 16. Members directory has no loading state
[app/members/page.tsx](app/members/page.tsx) — while the initial Supabase fetch is in flight, `members` is `null` and the grid renders empty (just header + filter bar) with no spinner, so on a slow connection the page looks broken for a beat before cards pop in.

### 17. A few internal links open in a new tab for no obvious reason
`target="_blank"` is used for the same-site `/conduct` link in both [components/forums/NewPostModal.tsx:111](components/forums/NewPostModal.tsx#L111) and [components/events/ProposeEventModal.tsx:210](components/events/ProposeEventModal.tsx#L210). Not broken (no `rel` needed since it's same-origin), just an inconsistent pattern worth normalizing.

---

## Not checked / worth a follow-up
- **Mobile breakpoints** above were reviewed at the code level (Tailwind classes, `min-h-[44px]` touch targets, responsive grid utilities, `scroll-mt-24` offsets for the Resources jump links) rather than on an actual rendered device or browser viewport — I didn't want to spin up the dev server against your live Supabase project and risk creating more test data to clean up later. Nothing in the markup suggests a broken layout, but a real visual pass (phone-width screenshots of Join, Events, Member Directory, and the forum category pages) would be worth doing before launch if you want it — say the word and I'll run it against a disposable local build.
- **Your local working directory** (not `dev`, not part of this audit) currently has uncommitted changes to `app/members/[id]/page.tsx` that hardcode fake bio text ("Freelance photographer," "Loves early morning trail walks") and three fake discussion threads onto *every* member's profile page, plus a stray `app/preview-profile-test/` route with mock data. Neither is on `dev` or `main`, so nothing to fix here — just flagging so it doesn't get committed/pushed by accident later.
