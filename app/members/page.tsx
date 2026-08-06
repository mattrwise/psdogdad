'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import SignedIn from '@/components/auth/SignedIn'
import SignedOut from '@/components/auth/SignedOut'
import { Dog } from '@/lib/dogs'
import { thumbUrl } from '@/lib/images'

// Cards rendered before the Show more button. Every card carries up to two
// photos, so this is really a cap on how much of the directory a single page
// view downloads, which is what used to make this page grow without limit as
// members joined.
const PAGE_SIZE = 24

/** Widths the photos are actually displayed at, doubled for retina screens. */
const CARD_PHOTO_WIDTH = 640
const DOG_CHIP_WIDTH = 96

type MemberCard = {
  id: string
  name: string
  location: string
  dogs: Dog[]
  joined: string
  emoji: string
  color: string
  avatarUrl: string | null
  dogPhotoUrl: string | null
}

/**
 * Members type their own city, so "Palm Springs" and "palm springs" are the
 * same neighbourhood typed twice. Normalising here keeps them as one filter
 * option, and stops the directory showing the same place two different ways.
 */
function tidyCity(city: string): string {
  return city
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\S+/g, w => (w.length > 2 || /^[A-Z]+$/.test(w) ? w[0].toUpperCase() + w.slice(1) : w))
}

const gradients = [
  'from-plum to-plum-light',
  'from-brand-orange to-brand-orange-light',
  'from-brand-teal to-brand-teal-light',
  'from-plum to-brand-teal',
  'from-brand-golden to-brand-orange',
]

type ProfileRow = {
  id: string
  name: string | null
  city: string | null
  dog_name: string | null
  dog_breed: string | null
  dogs: Array<{ name: string | null; breed: string | null; photo_url?: string | null }> | null
  avatar_url: string | null
  dog_photo_url: string | null
  created_at: string
}

function profileToCard(p: ProfileRow, index: number): MemberCard {
  // Prefer the dogs list; older rows may only have the single-dog columns.
  const rawDogs = p.dogs && p.dogs.length > 0
    ? p.dogs
    : [{ name: p.dog_name, breed: p.dog_breed, photo_url: null }]
  const cardDogs = rawDogs.map((d, i) => ({
    name: d.name ?? 'Good Boy',
    breed: d.breed ?? 'Mixed Breed',
    // Dog 1's photo may predate per-dog photos and live only in dog_photo_url.
    photo_url: d.photo_url ?? (i === 0 ? p.dog_photo_url : null),
  }))
  return {
    id: p.id,
    name: p.name ?? 'New Member',
    location: p.city ? tidyCity(p.city) : 'Coachella Valley',
    dogs: cardDogs,
    joined: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    emoji: '🐾',
    color: gradients[index % gradients.length],
    avatarUrl: p.avatar_url,
    dogPhotoUrl: cardDogs.find(d => d.photo_url)?.photo_url ?? null,
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberCard[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [shown, setShown] = useState(PAGE_SIZE)

  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [breed, setBreed] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, city, dog_name, dog_breed, dogs, avatar_url, dog_photo_url, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.warn('Could not load member profiles:', error.message)
          setLoadError('We could not load the directory just now. Please refresh in a moment.')
          setMembers([])
          return
        }
        setMembers((data ?? []).map((row, i) => profileToCard(row as ProfileRow, i)))
      })
  }, [])

  /**
   * Both dropdowns are built from the members who are actually here, rather
   * than a fixed list. A fixed list drifts: it used to offer five Palm Springs
   * neighbourhoods that no member had ever typed, so every option found nobody.
   */
  const cities = Array.from(new Set((members ?? []).map(m => m.location))).sort()
  const breeds = Array.from(
    new Set((members ?? []).flatMap(m => m.dogs.map(d => d.breed).filter(Boolean))),
  ).sort()

  const needle = query.trim().toLowerCase()
  const filtered = (members ?? []).filter(m => {
    if (city && m.location !== city) return false
    if (breed && !m.dogs.some(d => d.breed === breed)) return false
    if (needle) {
      const haystack = [m.name, ...m.dogs.map(d => d.name)].join(' ').toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })

  const filtersActive = Boolean(needle || city || breed)
  function clearFilters() {
    setQuery(''); setCity(''); setBreed(''); setShown(PAGE_SIZE)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Member Directory</h1>
          <p className="text-plum/60 mt-2">Meet the dog dads of the Coachella Valley.</p>
        </div>
        <SignedOut>
          <Link href="/members/join" className="btn-primary self-start">Join the Pack</Link>
        </SignedOut>
        <SignedIn>
          <Link href="/members/profile" className="btn-secondary self-start">My Profile</Link>
        </SignedIn>
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col gap-3">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setShown(PAGE_SIZE) }}
          placeholder="🔍  Search members or dog names..."
          aria-label="Search members or dog names"
          className="w-full border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum placeholder-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px]"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={city}
            onChange={e => { setCity(e.target.value); setShown(PAGE_SIZE) }}
            aria-label="Filter by neighborhood"
            className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white"
          >
            <option value="">All Neighborhoods</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={breed}
            onChange={e => { setBreed(e.target.value); setShown(PAGE_SIZE) }}
            aria-label="Filter by breed"
            className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white"
          >
            <option value="">All Breeds</option>
            {breeds.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {filtersActive && (
          <div className="flex items-center justify-between gap-3 text-xs text-plum/60 pt-1">
            <span>
              {filtered.length === 0
                ? 'No matches'
                : `${filtered.length} of ${members?.length ?? 0} member${members?.length === 1 ? '' : 's'}`}
            </span>
            <button onClick={clearFilters} className="font-bold text-brand-orange hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.slice(0, shown).map((member) => {
          const cardInner = (
            <>
              {/* Photo header, split panel if both photos exist, single if one, gradient if none */}
              {member.avatarUrl && member.dogPhotoUrl ? (
                <div className="h-36 flex overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl(member.avatarUrl, CARD_PHOTO_WIDTH)!} alt={member.name}
                    loading="lazy" decoding="async"
                    className="w-1/2 h-full object-cover object-top border-r-2 border-white" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl(member.dogPhotoUrl, CARD_PHOTO_WIDTH)!} alt={member.dogs[0]?.name}
                    loading="lazy" decoding="async"
                    className="w-1/2 h-full object-cover object-top" />
                </div>
              ) : member.avatarUrl ? (
                <div className="h-36 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl(member.avatarUrl, CARD_PHOTO_WIDTH)!} alt={member.name}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover object-top" />
                </div>
              ) : member.dogPhotoUrl ? (
                <div className="h-36 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl(member.dogPhotoUrl, CARD_PHOTO_WIDTH)!} alt={member.dogs[0]?.name}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover object-top" />
                </div>
              ) : (
                <div className={`bg-gradient-to-br ${member.color} h-36 flex items-center justify-center text-6xl`}>
                  {member.emoji}
                </div>
              )}

              <div className="p-4">
                <h3 className="font-extrabold text-plum text-lg">{member.name}</h3>
                <p className="text-xs text-plum/50 mb-3">📍 {member.location}</p>

                <div className="bg-brand-cream rounded-xl p-3 mb-3 space-y-2">
                  {member.dogs.map((dog, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {dog.photo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={thumbUrl(dog.photo_url, DOG_CHIP_WIDTH)!} alt={dog.name}
                          loading="lazy" decoding="async"
                          className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 border-2 border-white shadow-sm" />
                      ) : (
                        <span className="text-2xl">🐶</span>
                      )}
                      <div>
                        <div className="font-bold text-plum text-sm">{dog.name}</div>
                        <div className="text-xs text-plum/60">{dog.breed}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-plum/40">Member since {member.joined}</span>
                  <span className="text-xs font-bold text-brand-orange group-hover:underline">View Profile</span>
                </div>
              </div>
            </>
          )

          return (
            <Link key={member.id} href={`/members/${member.id}`}
              className="card block hover:-translate-y-1 cursor-pointer group">
              {cardInner}
            </Link>
          )
        })}

        {/* Join card, visitors only. Hidden while filtering, where it reads as a result. */}
        {!filtersActive && (
          <SignedOut>
            <div className="card border-2 border-dashed border-plum/20 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
              <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center text-3xl mb-4">🐾</div>
              <h3 className="font-extrabold text-plum text-lg mb-2">Be part of the pack</h3>
              <p className="text-plum/50 text-sm mb-5">Create your free member profile and introduce your dog to the community.</p>
              <Link href="/members/join" className="btn-primary text-sm">Join Free</Link>
            </div>
          </SignedOut>
        )}
      </div>

      {/* Nothing matched the filters, as opposed to nobody having joined yet. */}
      {members && filtered.length === 0 && filtersActive && (
        <div className="card p-10 text-center mt-2">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-extrabold text-plum text-xl mb-2">No members match that</h3>
          <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            The pack is still small, so there is a good chance nobody fits yet. Try a wider search.
          </p>
          <button onClick={clearFilters} className="btn-secondary">Clear filters</button>
        </div>
      )}

      {/* Genuinely nobody yet. An invitation, not an apology. */}
      {members && members.length === 0 && !loadError && (
        <div className="card p-10 text-center mt-2">
          <div className="text-5xl mb-4">🐾</div>
          <h3 className="font-extrabold text-plum text-xl mb-2">The directory starts with you</h3>
          <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            No profiles here yet. Be the first dog dad on the board, introduce your pup, and give
            everyone who lands here next someone to say hello to.
          </p>
          <Link href="/members/join" className="btn-primary">Join the Pack 🐾</Link>
        </div>
      )}

      {loadError && (
        <div className="card p-8 text-center mt-2">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-sm text-plum/70">{loadError}</p>
        </div>
      )}

      {/* Say how many are still hidden rather than quietly stopping at 24. */}
      {filtered.length > shown && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setShown(n => n + PAGE_SIZE)}
            className="btn-secondary"
          >
            Show more members
          </button>
          <p className="text-xs text-plum/40 mt-3">
            Showing {shown} of {filtered.length}
          </p>
        </div>
      )}
    </div>
  )
}
