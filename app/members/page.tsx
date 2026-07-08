'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import SignedIn from '@/components/auth/SignedIn'
import SignedOut from '@/components/auth/SignedOut'

type MemberCard = {
  id: string
  name: string
  location: string
  dog: string
  breed: string
  joined: string
  emoji: string
  color: string
  avatarUrl: string | null
  dogPhotoUrl: string | null
}

// Sample members shown until real profiles exist in Supabase
const sampleMembers: MemberCard[] = [
  { id: 's1', name: 'Marco', location: 'Uptown PS', dog: 'Biscuit', breed: 'French Bulldog', joined: 'Jan 2023', emoji: '🐾', color: 'from-plum to-plum-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's2', name: 'Tyler', location: 'Palm Canyon', dog: 'Mango', breed: 'Golden Retriever', joined: 'Mar 2023', emoji: '🌟', color: 'from-brand-orange to-brand-orange-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's3', name: 'Derek', location: 'Cathedral City', dog: 'Zeus', breed: 'Doberman', joined: 'Jun 2022', emoji: '⚡', color: 'from-brand-teal to-brand-teal-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's4', name: 'James', location: 'Old Las Palmas', dog: 'Pretzel', breed: 'Dachshund', joined: 'Feb 2021', emoji: '🥨', color: 'from-plum to-brand-teal', avatarUrl: null, dogPhotoUrl: null },
  { id: 's5', name: 'Chris', location: 'Movie Colony', dog: 'Noodle', breed: 'Labradoodle', joined: 'Aug 2023', emoji: '🍜', color: 'from-brand-golden to-brand-orange', avatarUrl: null, dogPhotoUrl: null },
  { id: 's6', name: 'Ryan', location: 'South PS', dog: 'Taco', breed: 'Chihuahua Mix', joined: 'Nov 2022', emoji: '🌮', color: 'from-brand-orange to-brand-orange-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's7', name: 'Matt', location: 'Rancho Mirage', dog: 'Duke', breed: 'German Shepherd', joined: 'May 2023', emoji: '👑', color: 'from-plum to-plum-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's8', name: 'Alex', location: 'Desert Hot Springs', dog: 'Pepper', breed: 'Border Collie', joined: 'Sep 2023', emoji: '🌶️', color: 'from-brand-teal to-brand-teal-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's9', name: 'Jordan', location: 'Palm Springs', dog: 'Waffle', breed: 'Corgi', joined: 'Jan 2024', emoji: '🧇', color: 'from-brand-golden to-brand-orange', avatarUrl: null, dogPhotoUrl: null },
  { id: 's10', name: 'Kevin', location: 'Indian Wells', dog: 'Bruno', breed: 'Bulldog', joined: 'Apr 2022', emoji: '🏋️', color: 'from-plum to-brand-teal', avatarUrl: null, dogPhotoUrl: null },
  { id: 's11', name: 'Sam', location: 'Uptown PS', dog: 'Olive', breed: 'Italian Greyhound', joined: 'Jul 2023', emoji: '🫒', color: 'from-brand-teal to-brand-teal-light', avatarUrl: null, dogPhotoUrl: null },
  { id: 's12', name: 'Will', location: 'Palm Canyon', dog: 'Beans', breed: 'Beagle', joined: 'Dec 2021', emoji: '🫘', color: 'from-brand-orange to-brand-orange-light', avatarUrl: null, dogPhotoUrl: null },
]

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
  avatar_url: string | null
  dog_photo_url: string | null
  created_at: string
}

function profileToCard(p: ProfileRow, index: number): MemberCard {
  return {
    id: p.id,
    name: p.name ?? 'New Member',
    location: p.city ?? 'Coachella Valley',
    dog: p.dog_name ?? 'Good Boy',
    breed: p.dog_breed ?? 'Mixed Breed',
    joined: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    emoji: '🐾',
    color: gradients[index % gradients.length],
    avatarUrl: p.avatar_url,
    dogPhotoUrl: p.dog_photo_url,
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberCard[] | null>(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, city, dog_name, dog_breed, avatar_url, dog_photo_url, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          // No profiles table yet, or no confirmed members — show sample community
          if (error) console.warn('Could not load member profiles:', error.message)
          setMembers(sampleMembers)
          return
        }
        setMembers((data as ProfileRow[]).map(profileToCard))
      })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Member Directory</h1>
          <p className="text-plum/60 mt-2">Meet the dog dads of the Coachella Valley — and their very good boys (and girls).</p>
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
          placeholder="🔍  Search members or dog names..."
          className="w-full border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum placeholder-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px]"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <select className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white">
            <option>All Neighborhoods</option>
            <option>Uptown PS</option>
            <option>Palm Canyon</option>
            <option>Old Las Palmas</option>
            <option>Cathedral City</option>
            <option>Rancho Mirage</option>
          </select>
          <select className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white">
            <option>All Breeds</option>
            <option>Small Dogs</option>
            <option>Medium Dogs</option>
            <option>Large Dogs</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(members ?? []).map((member) => (
          <div key={member.id} className="card hover:-translate-y-1 cursor-pointer group">

            {/* Photo header — split panel if both photos exist, single if one, gradient if none */}
            {member.avatarUrl && member.dogPhotoUrl ? (
              <div className="h-36 flex overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.avatarUrl} alt={member.name}
                  className="w-1/2 h-full object-cover border-r-2 border-white" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.dogPhotoUrl} alt={member.dog}
                  className="w-1/2 h-full object-cover" />
              </div>
            ) : member.avatarUrl ? (
              <div className="h-36 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
              </div>
            ) : member.dogPhotoUrl ? (
              <div className="h-36 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.dogPhotoUrl} alt={member.dog} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`bg-gradient-to-br ${member.color} h-36 flex items-center justify-center text-6xl`}>
                {member.emoji}
              </div>
            )}

            <div className="p-4">
              <h3 className="font-extrabold text-plum text-lg">{member.name}</h3>
              <p className="text-xs text-plum/50 mb-3">📍 {member.location}</p>

              <div className="bg-brand-cream rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2">
                  {member.dogPhotoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={member.dogPhotoUrl} alt={member.dog}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm" />
                  ) : (
                    <span className="text-2xl">🐶</span>
                  )}
                  <div>
                    <div className="font-bold text-plum text-sm">{member.dog}</div>
                    <div className="text-xs text-plum/60">{member.breed}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-plum/40">Member since {member.joined}</span>
                <button className="text-xs font-bold text-brand-orange group-hover:underline">View Profile</button>
              </div>
            </div>
          </div>
        ))}

        {/* Join card — visitors only */}
        <SignedOut>
          <div className="card border-2 border-dashed border-plum/20 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
            <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center text-3xl mb-4">🐾</div>
            <h3 className="font-extrabold text-plum text-lg mb-2">Be part of the pack</h3>
            <p className="text-plum/50 text-sm mb-5">Create your free member profile and introduce your dog to the community.</p>
            <Link href="/members/join" className="btn-primary text-sm">Join Free</Link>
          </div>
        </SignedOut>
      </div>
    </div>
  )
}
