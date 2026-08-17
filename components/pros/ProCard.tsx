'use client'

import Link from 'next/link'
import { thumbUrl } from '@/lib/images'
import { type ProListing, cityLabel, serviceIcon, serviceLabel } from '@/lib/pros'

/** Width the card photo is actually displayed at, doubled for retina screens. */
const CARD_PHOTO_WIDTH = 640

/**
 * Listings with no photo still need to look like something, and a gradient
 * picked from the pro's own name keeps that stable — the same listing gets the
 * same colour on every visit rather than shuffling as the directory grows.
 */
const gradients = [
  'from-plum to-plum-light',
  'from-brand-orange to-brand-orange-light',
  'from-brand-teal to-brand-teal-light',
  'from-plum to-brand-teal',
  'from-brand-golden to-brand-orange',
]

function gradientFor(name: string): string {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return gradients[sum % gradients.length]
}

export default function ProCard({ pro }: { pro: ProListing }) {
  const photo = thumbUrl(pro.photo_url, CARD_PHOTO_WIDTH)

  return (
    <Link
      href={`/pros/${pro.id}`}
      className="card block hover:-translate-y-1 cursor-pointer group"
    >
      {photo ? (
        <div className="h-40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={pro.business_name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        <div
          className={`bg-gradient-to-br ${gradientFor(pro.business_name)} h-40 flex items-center justify-center text-6xl`}
        >
          {serviceIcon(pro.services[0] ?? 'other')}
        </div>
      )}

      <div className="p-5">
        <h3 className="font-extrabold text-plum text-lg leading-tight">{pro.business_name}</h3>
        <p className="text-sm text-plum/60 mt-1 leading-snug">{pro.headline}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {pro.services.slice(0, 3).map(id => (
            <span key={id} className="badge bg-brand-teal/10 text-brand-teal normal-case tracking-normal">
              {serviceIcon(id)} {serviceLabel(id)}
            </span>
          ))}
          {pro.services.length > 3 && (
            <span className="badge bg-plum/5 text-plum/50 normal-case tracking-normal">
              +{pro.services.length - 3} more
            </span>
          )}
        </div>

        <p className="text-xs text-plum/50 mt-3">📍 {cityLabel(pro.cities)}</p>

        <div className="flex items-end justify-between gap-3 mt-3 pt-3 border-t border-plum/10">
          {/* The pro sets their own rates, so this is their sentence, not ours. */}
          <span className="text-sm font-bold text-plum">
            {pro.rate_note || <span className="font-semibold text-plum/40">Rates on request</span>}
          </span>
          <span className="text-xs font-bold text-brand-orange group-hover:underline whitespace-nowrap">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
