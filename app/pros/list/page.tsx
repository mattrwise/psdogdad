'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProListingForm from '@/components/pros/ProListingForm'
import { useUser } from '@/lib/useUser'
import { loadMyListing } from '@/lib/proListings'
import {
  PRO_DIRECTORY,
  type ProListing,
  hasListingFee,
  listingFeeLabel,
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
    loadMyListing(user.id).then(result => {
      if (result === undefined) {
        setLoadFailed(true)
        setListing(null)
        return
      }
      setListing(result)
    })
  }, [user, authLoading])

  const header = (
    <div className="mb-8">
      <Link href="/pros" className="text-sm font-semibold text-plum/50 hover:text-plum">
        ← All dog pros
      </Link>
      <h1 className="section-title mt-3">List Your Services</h1>
      <p className="text-plum/60 mt-2 max-w-2xl leading-relaxed">
        For the trainers, walkers, sitters, groomers and everybody else who works with dogs on
        their own around the valley. One listing, one flat fee, and the dog owners here find you.
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

  // ── Signed out ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {header}
        <Pitch />

        <div className="card p-8 text-center mt-8">
          <div className="text-4xl mb-3">🐾</div>
          <h2 className="font-extrabold text-plum text-xl mb-2">Sign in to write your listing</h2>
          <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            A listing hangs off a free member account, which is what lets you edit it yourself
            later and how we know a real person is behind it. It takes a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/members/join" className="btn-primary">
              Join Free
            </Link>
            <Link href="/members/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/pros/rate-card" className="text-sm font-bold text-brand-orange hover:underline">
            See the rate card first →
          </Link>
        </div>
      </div>
    )
  }

  // ── Signed in ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {header}

      {loadFailed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          We could not check whether you already have a listing. Please refresh before filling
          this in, so you do not end up writing it twice.
        </div>
      )}

      {/* Where the listing stands. A provider who has just submitted needs to
          know it arrived and is not live yet; one who is live needs to know
          edits go up straight away. */}
      {listing ? (
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
              <strong className="text-plum">Waiting to be reviewed.</strong> We have got it, and
              we read every listing before it goes up. You will hear from us at the email on your
              account, and we will sort the fee out then — nothing is charged before you are
              listed.{' '}
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
      ) : (
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
        existing={listing}
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
