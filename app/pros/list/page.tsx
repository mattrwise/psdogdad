'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProListingForm from '@/components/pros/ProListingForm'
import { useUser } from '@/lib/useUser'
import { loadMyListing, readDraft, submitDraft } from '@/lib/proListings'
import {
  PRO_DIRECTORY,
  type ProListing,
  hasListingFee,
  listingFeeLabel,
  listingPaymentLink,
} from '@/lib/pros'

/** The short version of the pitch, shown above the form and to signed-out visitors. */
function Pitch() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        {
          icon: '💵',
          title: 'You set your rates',
          body: 'You publish your own prices and you keep every dollar of them. We take nothing from the work itself.',
        },
        {
          icon: '📄',
          title: 'One flat fee',
          body: hasListingFee()
            ? `${listingFeeLabel()} to be listed. The same for everybody, with no tiers and nothing that buys a better position.`
            : 'The same flat fee for everybody, with no tiers and nothing that buys a better position. The price is still being worked out.',
        },
        {
          icon: '✍️',
          title: 'Yours to edit',
          body: 'Change your rates, your towns or your photo whenever you like. You do not have to come through us.',
        },
      ].map(({ icon, title, body }) => (
        <div key={title} className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-2xl mb-2">{icon}</div>
          <h3 className="font-extrabold text-plum text-sm">{title}</h3>
          <p className="text-xs text-plum/60 mt-1 leading-relaxed">{body}</p>
        </div>
      ))}
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
      <Link href="/pros" className="text-sm font-semibold text-plum/50 hover:text-plum">
        ← All dog pros
      </Link>
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

      <div className="mt-8 text-center">
        <Link href="/pros/rate-card" className="text-sm font-bold text-brand-orange hover:underline">
          What it costs →
        </Link>
      </div>
    </div>
  )
}
