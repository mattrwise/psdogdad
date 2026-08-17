'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'
import { thumbUrl } from '@/lib/images'
import {
  PRO_COLUMNS,
  PRO_DIRECTORY,
  type ProListing,
  instagramHandle,
  instagramHref,
  serviceIcon,
  serviceLabel,
  telHref,
  websiteHref,
  websiteLabel,
} from '@/lib/pros'

const HERO_PHOTO_WIDTH = 1200

export default function ProListingPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  // undefined = still loading, null = no such published listing
  const [pro, setPro] = useState<ProListing | null | undefined>(undefined)

  useEffect(() => {
    supabase
      .from('pro_listings')
      .select(PRO_COLUMNS)
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setPro(null)
          return
        }
        setPro(data as ProListing)
      })
  }, [id])

  if (pro === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  if (!pro) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="font-extrabold text-plum text-2xl mb-2">No listing here</h1>
        <p className="text-plum/60 text-sm max-w-sm mb-6 leading-relaxed">
          This listing may have been taken down, or it is still waiting to be reviewed.
        </p>
        <Link href="/pros" className="btn-primary">
          Back to Dog Pros
        </Link>
      </div>
    )
  }

  const isMine = user?.id === pro.user_id
  const photo = thumbUrl(pro.photo_url, HERO_PHOTO_WIDTH)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/pros" className="text-sm font-semibold text-plum/50 hover:text-plum">
        ← All dog pros
      </Link>

      {/* The owner's own view of a listing that is not live yet, so submitting
          it does not feel like it vanished. */}
      {isMine && pro.status !== 'published' && (
        <div className="mt-4 bg-brand-golden/15 border border-brand-golden/40 rounded-xl p-4 text-sm text-plum/80">
          <strong className="text-plum">
            {pro.status === 'pending' ? 'Waiting to be reviewed.' : 'Currently hidden.'}
          </strong>{' '}
          {pro.status === 'pending'
            ? 'Only you can see this page until we have read it through. You will hear from us at the email on your account.'
            : 'This listing is not showing in the directory. Email us if that is a surprise.'}{' '}
          <Link href="/pros/list" className="font-bold text-brand-orange hover:underline">
            Edit it
          </Link>
        </div>
      )}

      <div className="card mt-4 overflow-hidden">
        {photo ? (
          <div className="h-56 sm:h-72 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={pro.business_name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="bg-card-gradient h-40 flex items-center justify-center text-6xl">
            {serviceIcon(pro.services[0] ?? 'other')}
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-plum leading-tight">
                {pro.business_name}
              </h1>
              <p className="text-plum/60 mt-1">{pro.headline}</p>
            </div>
            {pro.insured && (
              <span className="badge bg-brand-teal/10 text-brand-teal flex-shrink-0">Insured</span>
            )}
          </div>

          {/* Facts worth scanning before the prose */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-brand-cream rounded-xl p-3">
              <div className="text-xs text-plum/50 font-semibold">Rates</div>
              <div className="text-sm font-bold text-plum mt-0.5">
                {pro.rate_note || 'On request'}
              </div>
            </div>
            {pro.years_experience !== null && (
              <div className="bg-brand-cream rounded-xl p-3">
                <div className="text-xs text-plum/50 font-semibold">Experience</div>
                <div className="text-sm font-bold text-plum mt-0.5">
                  {pro.years_experience} {pro.years_experience === 1 ? 'year' : 'years'}
                </div>
              </div>
            )}
            <div className="bg-brand-cream rounded-xl p-3">
              <div className="text-xs text-plum/50 font-semibold">Works with</div>
              <div className="text-sm font-bold text-plum mt-0.5">{pro.contact_name}</div>
            </div>
            <div className="bg-brand-cream rounded-xl p-3">
              <div className="text-xs text-plum/50 font-semibold">Insurance</div>
              <div className="text-sm font-bold text-plum mt-0.5">
                {pro.insured ? 'Carries their own' : 'Not stated'}
              </div>
            </div>
          </div>

          {/* Services */}
          <h2 className="font-extrabold text-plum text-lg mt-8 mb-3">What they do</h2>
          <div className="flex flex-wrap gap-2">
            {pro.services.map(sid => (
              <span
                key={sid}
                className="inline-flex items-center gap-1.5 bg-white border border-plum/15 rounded-full px-3 py-1.5 text-sm font-semibold text-plum"
              >
                {serviceIcon(sid)} {serviceLabel(sid)}
              </span>
            ))}
          </div>

          {/* About, as they wrote it */}
          <h2 className="font-extrabold text-plum text-lg mt-8 mb-2">About</h2>
          <p className="text-plum/70 text-sm leading-relaxed whitespace-pre-line">{pro.about}</p>

          {pro.credentials && (
            <>
              <h2 className="font-extrabold text-plum text-lg mt-8 mb-2">
                Training & certifications
              </h2>
              <p className="text-plum/70 text-sm leading-relaxed whitespace-pre-line">
                {pro.credentials}
              </p>
              <p className="text-xs text-plum/40 mt-2">
                Listed by the pro themselves. We have not verified it, so ask to see it.
              </p>
            </>
          )}

          {/* Where */}
          <h2 className="font-extrabold text-plum text-lg mt-8 mb-3">Where they work</h2>
          <div className="flex flex-wrap gap-2">
            {pro.cities.length > 0 ? (
              pro.cities.map(c => (
                <span key={c} className="badge bg-plum/5 text-plum/70 normal-case tracking-normal">
                  📍 {c}
                </span>
              ))
            ) : (
              <span className="text-sm text-plum/60">Across the Coachella Valley</span>
            )}
          </div>

          {/* Contact. The point of the whole page, so it gets real buttons. */}
          <h2 className="font-extrabold text-plum text-lg mt-8 mb-3">Get in touch</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {pro.phone && (
              <a href={telHref(pro.phone)} className="btn-primary">
                📞 {pro.phone}
              </a>
            )}
            {pro.email && (
              <a href={`mailto:${pro.email}`} className="btn-secondary">
                ✉️ Email
              </a>
            )}
            {pro.website && (
              <a
                href={websiteHref(pro.website)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-secondary"
              >
                🔗 {websiteLabel(pro.website)}
              </a>
            )}
            {pro.instagram && (
              <a
                href={instagramHref(pro.instagram)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-secondary"
              >
                📷 @{instagramHandle(pro.instagram)}
              </a>
            )}
          </div>

          {!pro.phone && !pro.email && !pro.website && !pro.instagram && (
            <p className="text-sm text-plum/50">
              This pro has not added a way to contact them yet.
            </p>
          )}

          {isMine && (
            <Link
              href="/pros/list"
              className="inline-block mt-6 text-sm font-bold text-brand-orange hover:underline"
            >
              Edit my listing →
            </Link>
          )}
        </div>
      </div>

      {/* Booking happens off this site, so the site cannot stand behind it. */}
      <div className="mt-6 bg-white rounded-2xl border border-plum/10 p-5 text-sm text-plum/60 leading-relaxed">
        <strong className="text-plum">You are booking with them, not with us.</strong> PS Dog Dad
        does not take a cut of the work, hold your money, or vouch for what happens next.{' '}
        {pro.contact_name} pays a flat fee to be listed here and that is the whole of the
        arrangement. If something goes wrong, or a listing is not what it claims, tell us at{' '}
        <a
          href={`mailto:${PRO_DIRECTORY.contactEmail}?subject=${encodeURIComponent(`About the ${pro.business_name} listing`)}`}
          className="font-semibold text-brand-orange hover:underline"
        >
          {PRO_DIRECTORY.contactEmail}
        </a>{' '}
        and we will look into it.
      </div>
    </div>
  )
}
