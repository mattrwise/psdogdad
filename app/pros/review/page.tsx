'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/lib/useUser'
import { ADMIN_EMAIL } from '@/lib/site'
import { thumbUrl } from '@/lib/images'
import { loadListingsForReview, setListingStatus } from '@/lib/proListings'
import {
  type ProStatus,
  type ReviewListing,
  cityLabel,
  instagramHandle,
  serviceIcon,
  serviceLabel,
  telHref,
  websiteLabel,
} from '@/lib/pros'

/**
 * Approving pro listings, which used to mean typing an update statement into the
 * Supabase SQL editor.
 *
 * Not linked from anywhere. It is in robots.txt as disallowed and absent from
 * the sitemap, and both of those are tidiness rather than security — the reason
 * a stranger cannot use this page is that the route behind it returns 404 to
 * every account but one. The check below only decides what gets drawn.
 */

const THUMB_WIDTH = 320

const statusStyles: Record<ProStatus, string> = {
  pending: 'bg-brand-golden/15 border-brand-golden/40 text-plum',
  published: 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal',
  hidden: 'bg-plum/5 border-plum/20 text-plum/60',
}

const statusLabels: Record<ProStatus, string> = {
  pending: 'Waiting to be read',
  published: 'Live',
  hidden: 'Hidden',
}

function submittedOn(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** One listing, with everything needed to judge it without leaving the page. */
function ReviewCard({
  listing,
  busy,
  onSetStatus,
}: {
  listing: ReviewListing
  busy: boolean
  onSetStatus: (status: ProStatus) => void
}) {
  const photo = thumbUrl(listing.photo_url, THUMB_WIDTH)

  const contacts = [
    listing.phone ? { label: listing.phone, href: telHref(listing.phone) } : null,
    listing.email ? { label: listing.email, href: `mailto:${listing.email}` } : null,
    listing.website ? { label: websiteLabel(listing.website), href: null } : null,
    listing.instagram ? { label: `@${instagramHandle(listing.instagram)}`, href: null } : null,
  ].filter(Boolean) as { label: string; href: string | null }[]

  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row gap-5">
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt={listing.business_name}
            className="w-full sm:w-40 h-40 object-cover rounded-xl flex-shrink-0"
          />
        ) : (
          <div className="w-full sm:w-40 h-40 rounded-xl bg-brand-cream flex items-center justify-center text-4xl flex-shrink-0">
            {serviceIcon(listing.services[0] ?? 'other')}
            <span className="sr-only">No photo</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-extrabold text-plum text-lg leading-tight">
                {listing.business_name}
              </h3>
              <p className="text-sm text-plum/60 mt-0.5">{listing.headline}</p>
            </div>
            <span
              className={`text-xs font-bold rounded-full border px-3 py-1 flex-shrink-0 ${statusStyles[listing.status]}`}
            >
              {statusLabels[listing.status]}
            </span>
          </div>

          <p className="text-xs text-plum/50 mt-2">
            {listing.contact_name}
            {listing.account_email ? ` · ${listing.account_email}` : ' · no account email found'}
            {' · '}
            {submittedOn(listing.created_at)}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.services.map(id => (
              <span
                key={id}
                className="badge bg-brand-teal/10 text-brand-teal normal-case tracking-normal"
              >
                {serviceIcon(id)} {serviceLabel(id)}
              </span>
            ))}
          </div>

          <p className="text-xs text-plum/50 mt-2">📍 {cityLabel(listing.cities)}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-plum/60">
            <span>
              <strong className="text-plum">Rates:</strong> {listing.rate_note || 'on request'}
            </span>
            <span>
              <strong className="text-plum">Experience:</strong>{' '}
              {listing.years_experience === null
                ? 'not given'
                : `${listing.years_experience} ${listing.years_experience === 1 ? 'year' : 'years'}`}
            </span>
            <span>
              <strong className="text-plum">Insured:</strong>{' '}
              {listing.insured ? 'says yes' : 'not stated'}
            </span>
          </div>

          {contacts.length > 0 ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-plum/60">
              {contacts.map(c => (
                <span key={c.label}>
                  {c.href ? (
                    <a href={c.href} className="hover:underline">
                      {c.label}
                    </a>
                  ) : (
                    c.label
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-red-600 mt-2">
              No way to contact them, which the form is supposed to prevent.
            </p>
          )}

          <details className="mt-3">
            <summary className="text-xs font-bold text-brand-orange cursor-pointer hover:underline">
              Read what they wrote
            </summary>
            <p className="text-sm text-plum/70 leading-relaxed whitespace-pre-line mt-2">
              {listing.about}
            </p>
            {listing.credentials && (
              <>
                <p className="text-xs font-bold text-plum mt-3">Training & certifications</p>
                <p className="text-sm text-plum/70 leading-relaxed whitespace-pre-line">
                  {listing.credentials}
                </p>
              </>
            )}
          </details>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-plum/10">
            {listing.status !== 'published' && (
              <button
                onClick={() => onSetStatus('published')}
                disabled={busy}
                className={`btn-primary text-sm ${busy ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {busy ? 'Saving…' : listing.status === 'pending' ? 'Approve' : 'Put back up'}
              </button>
            )}
            {listing.status !== 'hidden' && (
              <button
                onClick={() => onSetStatus('hidden')}
                disabled={busy}
                className={`btn-secondary text-sm ${busy ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {busy ? 'Saving…' : 'Hide'}
              </button>
            )}
            <Link
              href={`/pros/${listing.id}`}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              See their page →
            </Link>
          </div>

          {listing.status === 'pending' && (
            <p className="text-xs text-plum/40 mt-2">
              Approving emails them to say they are live.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProReviewPage() {
  const { user, loading: authLoading } = useUser()
  // undefined = still loading, null = the read failed
  const [listings, setListings] = useState<ReviewListing[] | null | undefined>(undefined)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const load = useCallback(() => {
    setListings(undefined)
    loadListingsForReview().then(setListings)
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) {
      setListings(null)
      return
    }
    load()
  }, [authLoading, isAdmin, load])

  async function changeStatus(id: string, status: ProStatus) {
    setBusyId(id)
    setError(null)
    const result = await setListingStatus(id, status)
    setBusyId(null)

    if (!result.ok) {
      setError(result.error)
      return
    }
    // Redraw from the row that was actually stored, so the page can never show
    // an approval the database did not accept.
    setListings(current =>
      (current ?? []).map(l => (l.id === result.listing.id ? result.listing : l)),
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  // Everybody else. Deliberately says nothing about what is here, and the route
  // behind the page would refuse them anyway.
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="font-extrabold text-plum text-2xl mb-2">Nothing here</h1>
        <p className="text-plum/60 text-sm max-w-sm mb-6 leading-relaxed">
          This page does not exist for your account.
        </p>
        <Link href="/pros" className="btn-primary">
          Back to Dog Pros
        </Link>
      </div>
    )
  }

  const all = listings ?? []
  const pending = all.filter(l => l.status === 'pending')
  const published = all.filter(l => l.status === 'published')
  const hidden = all.filter(l => l.status === 'hidden')

  const sections: { title: string; note: string; rows: ReviewListing[] }[] = [
    {
      title: `Waiting to be read${pending.length > 0 ? ` (${pending.length})` : ''}`,
      note: 'Only the pro can see these. Approving puts them in the directory and emails them.',
      rows: pending,
    },
    { title: `Live (${published.length})`, note: 'In the directory now.', rows: published },
    {
      title: `Hidden (${hidden.length})`,
      note: 'Taken down, but not deleted. Nobody is emailed when you hide one.',
      rows: hidden,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/pros" className="text-sm font-semibold text-plum/50 hover:text-plum">
            ← All dog pros
          </Link>
          <h1 className="section-title mt-3">Review Listings</h1>
          <p className="text-plum/60 mt-2 max-w-2xl leading-relaxed">
            {pending.length === 0
              ? 'Nothing waiting. Everything below is already settled.'
              : `${pending.length} listing${pending.length === 1 ? '' : 's'} waiting to be read.`}
          </p>
        </div>
        <button onClick={load} className="btn-secondary text-sm self-start whitespace-nowrap">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {listings === undefined && (
        <div className="min-h-[30vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
        </div>
      )}

      {listings === null && (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-sm text-plum/70">
            We could not load the listings. Refresh in a moment — and check that
            SUPABASE_SERVICE_ROLE_KEY is set wherever this is deployed, because this page is the
            one thing that cannot work without it.
          </p>
        </div>
      )}

      {listings && listings.length === 0 && (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="font-extrabold text-plum text-xl mb-2">No listings at all yet</h2>
          <p className="text-plum/60 text-sm max-w-md mx-auto leading-relaxed">
            Nobody has submitted one. When somebody does, you will get an email and they will show
            up here.
          </p>
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="space-y-12">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="text-xl font-extrabold text-plum">{section.title}</h2>
              <p className="text-sm text-plum/50 mt-1 mb-4">{section.note}</p>
              {section.rows.length === 0 ? (
                <p className="text-sm text-plum/40">None.</p>
              ) : (
                <div className="space-y-4">
                  {section.rows.map(listing => (
                    <ReviewCard
                      key={listing.id}
                      listing={listing}
                      busy={busyId === listing.id}
                      onSetStatus={status => changeStatus(listing.id, status)}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
