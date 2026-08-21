import Link from 'next/link'
import type { Metadata } from 'next'
import PrintButton from '@/components/PrintButton'
import { SITE_URL } from '@/lib/site'
import { PRO_DIRECTORY, SERVICES, hasListingFee, listingFeeLabel } from '@/lib/pros'

export const metadata: Metadata = {
  title: 'Rate Card, PS Dog Dad',
  description:
    'What it costs a dog trainer, walker, sitter or groomer to be listed on PS Dog Dad. One flat fee, you set your own rates.',
}

/**
 * The sheet to hand a provider. It is a page rather than a PDF so there is one
 * copy of the numbers, on the site, that cannot go stale in somebody's email
 * attachments — and the print stylesheet in globals.css already drops the nav,
 * the footer and the shadows, so "Print" gives you the handout.
 */
export default function RateCardPage() {
  const steps = [
    {
      n: '1',
      title: 'Write your listing',
      body: 'Fill in the form at psdogdad.com/pros/list. Ten minutes, no account to make and no password to invent — we email you a link to confirm it is you, and that link is also how you get back in to change anything later.',
    },
    {
      n: '2',
      title: 'We read it',
      body: 'Every listing is read by a person before it goes up. We are checking it is a real working pro and that the listing says what it means, not judging how you train.',
    },
    {
      n: '3',
      title: 'We say yes, then you pay',
      body: 'You get an email telling you that you are in. Sign in to the site and the payment step is waiting on your own listing page. Nothing is charged before you are accepted, and you are never asked to pay anything before that email.',
    },
    {
      n: '4',
      title: 'You go live',
      body: 'Your listing appears in the directory as soon as the first payment lands, usually the same day.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Screen-only navigation back into the site */}
      <div className="flex items-center justify-between gap-4 mb-8 no-print">
        <Link href="/pros" className="text-sm font-semibold text-plum/50 hover:text-plum">
          ← All dog pros
        </Link>
        <PrintButton label="Print This Rate Card" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b-4 border-brand-orange pb-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🐾</span>
          <div>
            <span className="font-extrabold text-plum text-xl">PS</span>
            <span className="font-extrabold text-brand-teal text-xl"> DOG </span>
            <span className="font-extrabold text-brand-orange text-xl">DAD</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-plum leading-tight">
          Rates for dog professionals
        </h1>
        <p className="text-plum/60 mt-2 leading-relaxed">
          Trainers, walkers, sitters, mobile groomers and anyone else across the Coachella Valley
          who works with dogs and works for themselves.
        </p>
      </header>

      {/* ── The price ───────────────────────────────────────────────────── */}
      <section className="bg-plum rounded-3xl p-6 sm:p-8 text-white mb-8">
        <div className="text-sm font-bold uppercase tracking-wider text-brand-golden mb-2">
          One listing, one flat fee
        </div>
        <div className="text-4xl sm:text-5xl font-extrabold leading-none">
          {listingFeeLabel()}
        </div>
        {!hasListingFee() && (
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            The price is still being settled. Ask us and we will tell you what it is before you
            write a word of your listing.
          </p>
        )}
        <p className="text-white/80 text-sm mt-4 leading-relaxed">
          The same for everybody. There are no tiers, no commission on your work, and nothing
          you can buy that moves you up the page — the directory is in plain alphabetical order
          and stays that way.
        </p>
      </section>

      {/* ── You set your own rates ──────────────────────────────────────── */}
      <section className="bg-brand-golden/10 border border-brand-golden/30 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-plum text-lg mb-1">You price your own work</h2>
        <p className="text-plum/70 text-sm leading-relaxed">
          Your rates are yours. You publish them on your listing, you quote them, and you keep
          every dollar of them — we never take a cut of a booking, and we are not in the middle of
          the payment. The flat fee above is the only money that comes to us.
        </p>
      </section>

      {/* ── What the fee buys ───────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-4">What it gets you</h2>
        <ul className="space-y-2.5">
          {PRO_DIRECTORY.includes.map(line => (
            <li key={line} className="flex gap-3 items-start">
              <span className="text-brand-teal font-bold flex-shrink-0 mt-0.5">✓</span>
              <span className="text-plum/70 text-sm leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-1">What you can list under</h2>
        <p className="text-plum/50 text-sm mb-4">
          Pick as many as apply. Members filter the directory by these and by town.
        </p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map(({ id, icon, label }) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 bg-white border border-plum/15 rounded-full px-3 py-1.5 text-sm font-semibold text-plum"
            >
              {icon} {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── How to get listed ───────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-4">How it works</h2>
        <div className="space-y-3">
          {steps.map(({ n, title, body }) => (
            <div key={n} className="card p-5 flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full bg-brand-orange text-white font-extrabold flex items-center justify-center flex-shrink-0">
                {n}
              </div>
              <div>
                <h3 className="font-extrabold text-plum text-sm">{title}</h3>
                <p className="text-plum/60 text-sm mt-1 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What we ask ─────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-1">What we ask of you</h2>
        <p className="text-plum/50 text-sm mb-4">
          All of it enforceable the only way we can: by taking the listing down.
        </p>
        <ul className="space-y-2.5">
          {PRO_DIRECTORY.expectations.map(line => (
            <li key={line} className="flex gap-3 items-start">
              <span className="text-brand-orange font-bold flex-shrink-0 mt-0.5">·</span>
              <span className="text-plum/70 text-sm leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Straight answers ────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-4">Before you ask</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How many people will see it?',
              // Never invent a number here. The site is new and says so on
              // every other page; a rate card that quotes a reach it cannot
              // evidence is the one thing that would make the rest of it
              // worthless.
              a: 'We will tell you honestly where the community is at when you ask, rather than print a number on a sheet that goes out of date. PS Dog Dad is young and local. If you need a big audience today, this is not that yet.',
            },
            {
              q: 'Do you take a cut of my bookings?',
              a: 'No. Members contact you directly by phone, email or your own website. We never see the job or the money.',
            },
            {
              q: 'Do you vouch for me to members?',
              a: 'No, and the directory says so plainly. We read your listing before it goes up, but we do not check references or verify insurance, and we tell members to ask you for both.',
            },
            {
              q: 'Can I pay to be at the top?',
              a: 'No. Listings run in alphabetical order and there is nothing for sale that changes it.',
            },
            {
              q: 'Do I have to join the community to advertise?',
              a: 'No. PS Dog Dad is a community for dog owners, and placing an ad is a business arrangement with us — those are different things and we do not mix them up. You will not appear in the member directory, you are not signed up to anything, and the only email you get from us is about your listing.',
            },
            {
              q: 'How do I actually pay?',
              a: 'On the site, signed in to your own account, after we have accepted you. We will never email you a payment form, a card link, or an invoice to click. If something claiming to be us does, it is not us — sign in at psdogdad.com yourself and check. Payment is handled by Stripe and your card details never reach us.',
            },
            {
              q: 'Can I take my listing down?',
              a: 'Any time, yourself, from the same page you wrote it on.',
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-bold text-plum text-sm">{q}</h3>
              <p className="text-plum/60 text-sm mt-1 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Getting started ─────────────────────────────────────────────── */}
      <section className="border-t-2 border-plum/10 pt-8">
        <h2 className="text-xl font-extrabold text-plum mb-2">Ready, or want to ask first?</h2>
        <p className="text-plum/60 text-sm leading-relaxed mb-5">
          Write your listing at{' '}
          <span className="font-semibold text-plum">{SITE_URL.replace(/^https?:\/\//, '')}/pros/list</span>, or email{' '}
          <a
            href={`mailto:${PRO_DIRECTORY.contactEmail}?subject=${encodeURIComponent('Listing my services')}`}
            className="font-semibold text-brand-orange hover:underline"
          >
            {PRO_DIRECTORY.contactEmail}
          </a>{' '}
          and a person will write back.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <Link href="/pros/list" className="btn-primary">
            List My Services
          </Link>
        </div>

        {/*
          There is deliberately no "pay now" button on this page, whether or not
          a payment link is configured. This sheet is public and gets handed to
          people we have not accepted yet, and two lines above it promises that
          nothing is charged before acceptance. A button here would let somebody
          pay first and be turned down after, which is the one way to turn this
          into a page that lies. Payment lives on the applicant's own listing
          page, behind their sign-in, once they are in.
        */}
        <p className="text-xs text-plum/40 mt-4 leading-relaxed">
          There is nothing to pay yet, and nothing on this page to pay with. Once we have read
          your listing and said yes, the payment step appears on your own listing page when you
          sign in. Nothing is charged before that.
        </p>
      </section>

      <footer className="mt-10 pt-6 border-t border-plum/10 text-xs text-plum/40 leading-relaxed">
        PS Dog Dad · Coachella Valley, CA · {SITE_URL.replace(/^https?:\/\//, '')} ·{' '}
        {PRO_DIRECTORY.contactEmail}
        <br />
        Rates on this sheet are current as of printing. The live version is always at{' '}
        {SITE_URL.replace(/^https?:\/\//, '')}/pros/rate-card
      </footer>
    </div>
  )
}
