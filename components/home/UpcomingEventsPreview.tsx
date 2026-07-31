'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type EventPreview = {
  id: string
  title: string
  event_date: string
  event_time: string
  location: string
}

function dateBadge(isoDate: string) {
  const d = new Date(isoDate + 'T12:00:00')
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
  }
}

export default function UpcomingEventsPreview() {
  const [events, setEvents] = useState<EventPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const today = new Date()
      const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, event_time, location')
        .gte('event_date', todayIso)
        .order('event_date', { ascending: true })
        .limit(3)
      if (cancelled) return
      if (error) console.error('Could not load events:', error.message)
      setEvents((data as EventPreview[]) ?? [])
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) return null

  return (
    <section className="py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-title">Upcoming Events</h2>
          <Link href="/events" className="text-brand-orange font-bold hover:underline text-sm">View all →</Link>
        </div>

        {events.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-4">🌴</div>
            <h3 className="font-extrabold text-plum text-lg mb-2">The calendar is wide open</h3>
            <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              No meetups on the books yet, which means the first one is still up for grabs.
              Pick a park, a patio, or a trail and get it on the map.
            </p>
            <Link href="/events" className="btn-primary inline-block">Propose the First Event</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const badge = dateBadge(event.event_date)
              return (
                <Link key={event.id} href="/events" className="card flex gap-4 p-5 hover:-translate-y-1">
                  <div className="flex-shrink-0 w-14 h-14 bg-plum rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-golden">{badge.month}</span>
                    <span className="text-xl font-extrabold">{badge.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-plum text-sm leading-snug">{event.title}</h3>
                    <p className="text-plum/50 text-xs mt-1">🕐 {event.event_time} · 📍 {event.location}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
