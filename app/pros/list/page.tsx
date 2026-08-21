'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProListingForm from '@/components/pros/ProListingForm'
import PrintButton from '@/components/PrintButton'
import { useUser } from '@/lib/useUser'
import { loadMyListing, readDraft, submitDraft } from '@/lib/proListings'
import {
  PRO_DIRECTORY,
  SERVICES,
  type ProListing,
  hasListingFee,
  listingFeeLabel,
  listingPaymentLink,
} from '@/lib/pros'

/**
 * What it costs and what it buys, above the form.
 *
 * This was a separate page, /pros/rate-card, which meant a provider had to
 * read one page and then go and find another to act on it. The two are one
 * page now: the pitch, then the form, then what happens after you send it.
 * /pros/rate-card redirects here so anything already printed or emailed still
 * lands somewhere true.
 */
function Pitch() {
  return (
    <>
      {/* ── The price ─────────────────────────────────────────────────── */}
      <section className="bg-plum rounded-3xl p-6 sm:p-8 text-white mb-6">
        <div className="text-sm font-bold uppercase tracking-wider text-brand-golden mb-2">
          One flat fee
        </div>

        {/* The number is printed once, by listingFeeLabel(), so lib/pros.ts stays
            the only place the price lives. With no price set yet that label reads
            "Price not set yet", which cannot be dropped into a sentence, so the
            unpriced state keeps the bare figure and says why. */}
        {hasListingFee() ? (
          <p className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Just <span className="text-brand-golden">{listingFeeLabel()}</span> to be listed.
          </p>
        ) : (
          <>
            <div className="text-4xl sm:text-5xl font-extrabold leading-none">
              {listingFeeLabel()}
            </div>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              The price is still being settled. Ask us and we will tell you what it is before you
              write a word of your listing.
            </p>
          </>
        )}

      </section>

      {/* ── You set your rates ────────────────────────────────────────── */}
      <section className="bg-brand-golden/10 border border-brand-golden/30 rounded-2xl p-5 mb-6">
        <h2 className="font-extrabold text-plum text-lg mb-1">You set your rates</h2>
        <p className="text-plum/70 text-sm leading-relaxed">
          You publish your own rates, you work out payment with the client directly, and you keep
          every dollar of it. No commission, ever. The flat fee above is the only money that comes
          to us.
        </p>
      </section>

      {/* ── What the fee buys, and what you can list under ─────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-4">What it gets you</h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
          {PRO_DIRECTORY.includes.map(line => (
            <li key={line} className="flex gap-2.5 items-start">
              <span className="text-brand-teal font-bold flex-shrink-0 mt-0.5">✓</span>
              <span className="text-plum/70 text-sm leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>

        <p className="text-plum/50 text-sm mb-2.5">
          <span className="font-semibold text-plum/70">List under as many as apply.</span>{' '}
          Members filter the directory by these and by town.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SERVICES.map(({ id, icon, label }) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 bg-white border border-plum/15 rounded-full px-2.5 py-1 text-xs font-semibold text-plum"
            >
              {icon} {label}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}

/** What happens once the form above is sent. Everything here used to sit on the
 *  rate card; it reads better after the form than before it, because it is all
 *  about what we do next rather than what they have to do now. */
function AfterTheForm() {
  const steps = [
    {
      n: '1',
      title: 'We read it',
      body: 'A real person, usually the same day. You hear back by email either way.',
    },
    {
      n: '2',
      title: "You're in, then you pay",
      body: 'Sign in and the payment step is waiting on your own listing page. Nothing is charged before that, and we never email you a payment link.',
    },
    {
      n: '3',
      title: "You're live",
      body: 'Your listing goes up as soon as the first payment lands, usually the same day.',
    },
  ]


  return (
    <div className="mt-12 border-t-2 border-plum/10 pt-8">
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-4">What happens next</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map(({ n, title, body }) => (
            <div key={n} className="card p-5">
              <div className="w-9 h-9 rounded-full bg-brand-orange text-white font-extrabold flex items-center justify-center mb-3">
                {n}
              </div>
              <h3 className="font-extrabold text-plum text-sm">{title}</h3>
              <p className="text-plum/60 text-sm mt-1 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Was "What we ask of you", then "What works here". Both were lists of
          instructions aimed at somebody who has been walking dogs for a living
          longer than this site has existed, and the second one closed on a
          takedown rule dressed up as protecting the pros doing it properly,
          which is the same sentence wearing a nicer coat.

          This is the same section from our side of it instead. The conduct
          rules did not disappear, they live on /conduct where they always did,
          for advertisers the same as everybody. */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-plum mb-4">What you get from us</h2>
        <ul className="space-y-2.5">
          {PRO_DIRECTORY.promises.map(line => (
            <li key={line} className="flex gap-3 items-start">
              <span className="text-brand-teal font-bold flex-shrink-0 mt-0.5">✓</span>
              <span className="text-plum/70 text-sm leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
        <p className="text-plum/50 text-sm mt-4 leading-relaxed">
          The{' '}
          <Link href="/conduct" className="font-semibold text-brand-orange hover:underline">
            Code of Conduct
          </Link>{' '}
          covers the rest, and it is short.
        </p>
      </section>


      {/*
        There is deliberately no "pay now" control anywhere on this page. It is
        public and gets read by people we have not accepted yet, and the steps
        above promise nothing is charged before acceptance. A button here would
        let somebody pay first and be turned down after, which is the one way to
        turn this into a page that lies. Payment lives on the applicant's own
        listing page, behind their sign-in, once they are in.
      */}
      <p className="text-sm text-plum/60 leading-relaxed">
        Would rather ask a person first? Email{' '}
        <a
          href={`mailto:${PRO_DIRECTORY.contactEmail}?subject=${encodeURIComponent('Listing my services')}`}
          className="font-semibold text-brand-orange hover:underline"
        >
          {PRO_DIRECTORY.contactEmail}
        </a>{' '}
        and somebody will write back.
      </p>
    </div>
  )
}

export default function ListYourServicesPage() {
  const { user, loading: authLoading } = useUser()
  // undefined = still loading, null = they have no listing yet
  const [listing, setListing] = useState<ProListing | null | undefined>(undefined)
  const [loadFailed, setLoadFailed] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  /** Set once a confirmation link has gone out, so the page can stop and say so. */
  const [awaitingEmail, setAwaitingEmail] = useState<string | null>(null)
  /** A draft survived the round trip but would not save. */
  const [draftFailed, setDraftFailed] = useState(false)

  /**
   * Nothing is decided until auth has resolved. Answering "no listing" while
   * the session is still loading is not a harmless guess: the page would drop
   * out of its loading state, mount the form with no listing behind it, and a
   * provider who does have one would be looking at empty boxes — which saving
   * would then write over the top of their real listing.
   */
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setListing(null)
      return
    }
    setListing(undefined)
    loadMyListing(user.id).then(async result => {
      if (result === undefined) {
        setLoadFailed(true)
        setListing(null)
        return
      }
      if (result) {
        setListing(result)
        return
      }

      // No listing on this account. If they got here by following the
      // confirmation link, what they typed before they had an account is
      // sitting in this browser waiting to be written up.
      const draft = readDraft()
      if (draft) {
        const created = await submitDraft(user.id, draft)
        if (created) {
          setListing(created)
          return
        }
        // The draft is deliberately left in place, so a refresh tries again
        // rather than quietly binning twenty minutes of somebody's typing.
        setDraftFailed(true)
      }
      setListing(null)
    })
  }, [user, authLoading])

  const header = (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4 no-print">
        <Link href="/pros" className="text-sm font-semibold text-plum/50 hover:text-plum">
          ← All dog pros
        </Link>
        {/* The rate card was a page you could hand somebody on paper, and the
            print stylesheet in globals.css already drops the nav, the footer
            and the shadows. Folding it in here would have quietly lost that, so
            the form is marked no-print and Print still gives you the handout. */}
        <PrintButton label="Print This Page" />
      </div>
      <h1 className="section-title mt-3">List Your Services</h1>
      <p className="text-plum/60 mt-2 max-w-2xl leading-relaxed">
        For trainers, walkers, sitters, groomers and anyone else around the valley who works with
        dogs and works for themselves. One listing, one flat fee, and the dog owners here find you.
      </p>
    </div>
  )

  if (authLoading || listing === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {header}
        <div className="min-h-[30vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // ── The link is on its way ──────────────────────────────────────────────────
  if (awaitingEmail) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {header}
        <div className="card p-8 sm:p-12 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="font-extrabold text-plum text-2xl mb-3">Check your email</h2>
          <p className="text-plum/70 text-sm max-w-md mx-auto mb-4 leading-relaxed">
            We have sent a link to <strong className="text-plum">{awaitingEmail}</strong>. Click
            it and your listing is submitted — that is the whole of it. No password, nothing else
            to fill in.
          </p>
          <p className="text-plum/50 text-xs max-w-md mx-auto leading-relaxed">
            Everything you typed is saved in this browser, so open the link on this device if you
            can. If it has not arrived in a few minutes, check your spam folder, or email{' '}
            <a
              href={`mailto:${PRO_DIRECTORY.contactEmail}`}
              className="font-semibold text-brand-orange hover:underline"
            >
              {PRO_DIRECTORY.contactEmail}
            </a>{' '}
            and a person will sort it out.
          </p>
        </div>
      </div>
    )
  }

  // ── The form ────────────────────────────────────────────────────────────────
  // Shown to everybody, signed in or not. Being stopped at the door before you
  // have seen what you are signing up for is the friction worth removing; the
  // one email at the end is not. Somebody placing an ad is doing business with
  // us, not joining a community, and nothing on this path should suggest
  // otherwise.
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {header}

      {loadFailed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          We could not check whether you already have a listing. Please refresh before filling
          this in, so you do not end up writing it twice.
        </div>
      )}

      {draftFailed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700 leading-relaxed">
          Your email is confirmed, but we could not save the listing you wrote. Nothing is lost —
          it is still held in this browser, so refreshing this page will try again. If it keeps
          failing, email{' '}
          <a href={`mailto:${PRO_DIRECTORY.contactEmail}`} className="font-bold underline">
            {PRO_DIRECTORY.contactEmail}
          </a>{' '}
          and we will put it up by hand.
        </div>
      )}

      {/*
        Accepted, waiting on payment. This gets a card of its own rather than a
        line in the banner below, because it is the one moment in the whole flow
        where the provider has something to do and nothing else on the page
        matters as much.

        The payment step lives here, behind their own sign-in, and never in an
        email. A payment form that arrives by email is indistinguishable from a
        phishing attempt, and asking somebody to trust one is a poor way to
        start taking their money. The email we send says "you are in, sign in" —
        they arrive here under their own steam, at an address they typed.
      */}
      {listing?.status === 'approved' && (
        <div className="card border-2 border-brand-teal/40 p-6 sm:p-8 mb-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="font-extrabold text-plum text-2xl mb-2">You&rsquo;re in.</h2>
          <p className="text-plum/70 text-sm leading-relaxed max-w-md mx-auto mb-6">
            We have read your listing and we would like you in the directory. There is one step
            left: set up payment, and your listing goes live for the dog owners of the valley.
          </p>

          {listingPaymentLink() ? (
            <>
              <a
                href={listingPaymentLink()!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Set up payment · {listingFeeLabel()}
              </a>
              <p className="text-xs text-plum/50 mt-4 leading-relaxed max-w-sm mx-auto">
                Handled by Stripe. Your card details go to them, never to us. Your listing goes
                live once the first payment lands, usually the same day.
              </p>
            </>
          ) : (
            /* No link set yet. Say so honestly and give them a person, rather
               than a button that goes nowhere. */
            <div className="bg-brand-golden/15 border border-brand-golden/40 rounded-xl p-4 text-sm text-plum/80 leading-relaxed max-w-md mx-auto">
              We are still setting up card payments. Email{' '}
              <a
                href={`mailto:${PRO_DIRECTORY.contactEmail}?subject=${encodeURIComponent(`Payment for ${listing.business_name}`)}`}
                className="font-bold text-brand-orange hover:underline"
              >
                {PRO_DIRECTORY.contactEmail}
              </a>{' '}
              and we will sort it out with you directly. Your listing goes live as soon as it is
              done — you are already accepted, so nothing else is riding on it.
            </div>
          )}

          <p className="text-xs text-plum/40 mt-5">
            You can still{' '}
            <Link href={`/pros/${listing.id}`} className="font-semibold hover:underline">
              preview your listing
            </Link>{' '}
            or change anything below.
          </p>
        </div>
      )}

      {/* Where the listing stands. A provider who has just submitted needs to
          know it arrived and is not live yet; one who is live needs to know
          edits go up straight away. The accepted-and-unpaid case is handled by
          the card above, so it is deliberately absent here. */}
      {listing && listing.status !== 'approved' ? (
        <div
          className={`rounded-xl p-4 mb-8 text-sm leading-relaxed border ${
            listing.status === 'published'
              ? 'bg-brand-teal/10 border-brand-teal/30 text-plum/80'
              : 'bg-brand-golden/15 border-brand-golden/40 text-plum/80'
          }`}
        >
          {listing.status === 'published' && (
            <>
              <strong className="text-plum">Your listing is live.</strong> It is in the directory
              now. Changes you save here show up straight away.{' '}
              <Link href={`/pros/${listing.id}`} className="font-bold text-brand-orange hover:underline">
                View it
              </Link>
            </>
          )}
          {listing.status === 'pending' && (
            <>
              <strong className="text-plum">Waiting to be reviewed.</strong> We have got it, and a
              person reads every listing before it goes up. We will email the address on your
              account once we have — payment comes after that, and nothing is charged before you
              are accepted.{' '}
              <Link href={`/pros/${listing.id}`} className="font-bold text-brand-orange hover:underline">
                Preview it
              </Link>
            </>
          )}
          {listing.status === 'hidden' && (
            <>
              <strong className="text-plum">Your listing is hidden.</strong> It is not showing in
              the directory at the moment. If that is a surprise, email{' '}
              <a
                href={`mailto:${PRO_DIRECTORY.contactEmail}`}
                className="font-bold text-brand-orange hover:underline"
              >
                {PRO_DIRECTORY.contactEmail}
              </a>
              .
            </>
          )}
        </div>
      ) : null}

      {/* The pitch is for somebody who has not written a listing yet. Anybody
          who has — accepted or not — is past being sold to. */}
      {!listing && (
        <div className="mb-8">
          <Pitch />
        </div>
      )}

      {justSaved && (
        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-4 mb-8 text-sm text-plum/80">
          <strong className="text-plum">Saved.</strong> Everything above is up to date.
        </div>
      )}

      {/* Keyed so the form is rebuilt if the listing behind it ever changes
          identity. Its fields are React state seeded from these props, and
          state seeded from a prop does not follow that prop when it moves. */}
      <div className="no-print">
        <ProListingForm
          key={listing?.id ?? 'new'}
          user={user}
          existing={listing ?? null}
          onAwaitingEmail={setAwaitingEmail}
          onSaved={saved => {
            setListing(saved)
            setJustSaved(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </div>

      {/* Same rule as the pitch above: somebody who already has a listing is
          past being told what happens when they send one. */}
      {!listing && <AfterTheForm />}
    </div>
  )
}
