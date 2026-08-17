'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProCard from '@/components/pros/ProCard'
import { loadPublishedListings } from '@/lib/proListings'
import {
  type ProListing,
  coveredCities,
  filterListings,
  offeredServices,
} from '@/lib/pros'

export default function ProsPage() {
  // undefined = still loading, null = the read failed
  const [listings, setListings] = useState<ProListing[] | null | undefined>(undefined)

  const [query, setQuery] = useState('')
  const [service, setService] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    loadPublishedListings().then(setListings)
  }, [])

  const pros = listings ?? []
  const cities = coveredCities(pros)
  const services = offeredServices(pros)

  const filtered = filterListings(pros, { query, service, city })
  const filtersActive = Boolean(query.trim() || service || city)

  function clearFilters() {
    setQuery('')
    setService('')
    setCity('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="section-title">Dog Pros</h1>
          <p className="text-plum/60 mt-2 max-w-2xl">
            Independent trainers, walkers, sitters and groomers working across the valley. They
            set their own rates and you deal with them directly.
          </p>
        </div>
        <Link href="/pros/list" className="btn-primary self-start whitespace-nowrap">
          List Your Services
        </Link>
      </div>

      {/* Filters. Both dropdowns are built from the pros who are actually here,
          so an option can never find nobody. */}
      {pros.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="🔍  Search by name or what you need help with…"
            aria-label="Search dog pros"
            className="w-full border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum placeholder-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px]"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              aria-label="Filter by service"
              className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white"
            >
              <option value="">All Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.label}
                </option>
              ))}
            </select>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              aria-label="Filter by town"
              className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white"
            >
              <option value="">All Towns</option>
              {cities.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {filtersActive && (
            <div className="flex items-center justify-between gap-3 text-xs text-plum/60 pt-1">
              <span>
                {filtered.length === 0
                  ? 'No matches'
                  : `${filtered.length} of ${pros.length} pro${pros.length === 1 ? '' : 's'}`}
              </span>
              <button onClick={clearFilters} className="font-bold text-brand-orange hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {listings === undefined ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(pro => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}

      {/* Nothing matched the filters, as opposed to nobody having listed yet. */}
      {listings && filtered.length === 0 && filtersActive && (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-extrabold text-plum text-xl mb-2">No pros match that</h3>
          <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            The directory is still small, so there is a good chance nobody fits yet. Try a wider
            search.
          </p>
          <button onClick={clearFilters} className="btn-secondary">
            Clear filters
          </button>
        </div>
      )}

      {/*
        Nobody has listed yet.

        While DIRECTORY_IS_PUBLIC is false the only people who reach this page
        are providers we sent here, so it is written to them rather than to a
        member who found a dead end. It is a pitch, not an apology: "first" is
        the offer, not the embarrassment.
      */}
      {listings && listings.length === 0 && (
        <div className="card p-8 sm:p-12 text-center">
          <div className="text-5xl mb-4">🦮</div>
          <h3 className="font-extrabold text-plum text-2xl mb-3">Be the first name here</h3>
          <p className="text-plum/70 text-sm max-w-lg mx-auto mb-4 leading-relaxed">
            This directory is new and it is opening with a handful of pros rather than a crowd.
            If you train, walk, sit for or groom dogs in the Coachella Valley, that is the good
            news: the dog owners who come looking will find a short list, and you will be on it.
          </p>
          <p className="text-plum/70 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            You set your own rates and keep every dollar of them. One flat fee to be listed, the
            same for everybody, and nothing you can buy that moves you up the page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pros/list" className="btn-primary">
              List Your Services
            </Link>
            <Link href="/pros/rate-card" className="btn-secondary">
              See the Rate Card
            </Link>
          </div>
        </div>
      )}

      {listings === null && (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-sm text-plum/70">
            We could not load the directory just now. Please refresh in a moment.
          </p>
        </div>
      )}

      {/* Pitch to providers. Hidden while the directory is empty, where the
          empty state above is already making this exact case and two pitches
          in a row on one short page reads as desperation. */}
      {listings && listings.length > 0 && (
      <div className="mt-16 bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
        <div className="text-4xl mb-4">🦮</div>
        <h2 className="text-2xl font-extrabold mb-3">Work with dogs for a living?</h2>
        <p className="text-white/70 mb-6 max-w-lg mx-auto leading-relaxed">
          One flat fee puts you in front of the dog owners of the Coachella Valley. You set your
          own rates, you keep every dollar of what you charge, and you can edit your listing
          whenever you like.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pros/list" className="btn-primary">
            List Your Services
          </Link>
          <Link
            href="/pros/rate-card"
            className="btn-secondary border-white/40 text-white hover:bg-white hover:text-plum"
          >
            See the Rate Card
          </Link>
        </div>
      </div>
      )}
    </div>
  )
}
