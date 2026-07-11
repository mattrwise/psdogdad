'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

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

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>()
  // undefined = still loading, null = no such (confirmed) member
  const [profile, setProfile] = useState<ProfileRow | null | undefined>(undefined)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, city, dog_name, dog_breed, dogs, avatar_url, dog_photo_url, created_at')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setProfile(null); return }
        setProfile(data as ProfileRow)
      })
  }, [id])

  if (profile === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🐾</p>
        <h1 className="text-2xl font-extrabold text-plum mb-2">Member not found</h1>
        <p className="text-plum/60 mb-6">This profile doesn&apos;t exist or isn&apos;t public.</p>
        <Link href="/members" className="btn-primary">Back to Member Directory</Link>
      </div>
    )
  }

  // Prefer the dogs list; older rows may only have the single-dog columns.
  const rawDogs = profile.dogs && profile.dogs.length > 0
    ? profile.dogs
    : [{ name: profile.dog_name, breed: profile.dog_breed, photo_url: null }]
  const dogs = rawDogs.map((d, i) => ({
    name: d.name || '—',
    breed: d.breed || '—',
    photo_url: d.photo_url ?? (i === 0 ? profile.dog_photo_url : null),
  }))

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-brand-cream min-h-screen pb-16">

      {/* Hero */}
      <div className="bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.name ?? 'Member'}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-xl" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-brand-orange flex items-center justify-center text-4xl font-extrabold text-white border-4 border-white/30 shadow-xl">
                  {profile.name ? initials(profile.name) : '?'}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left pb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{profile.name || 'PS Dog Dad'}</h1>
              <p className="text-white/70 mt-1">
                {profile.city && <span>📍 {profile.city} · </span>}
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <Link href="/members" className="text-sm font-semibold text-brand-orange hover:underline">
            ← Back to Member Directory
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dogs.map((dog, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-md overflow-hidden">
              {dog.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dog.photo_url} alt={dog.name} className="w-full h-52 object-cover" />
              ) : (
                <div className="w-full h-52 bg-gradient-to-br from-brand-teal to-brand-teal-light flex items-center justify-center text-8xl">
                  🐶
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-extrabold text-plum">{dog.name}</h2>
                <p className="text-plum/50 text-sm mt-1">🐾 {dog.breed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
