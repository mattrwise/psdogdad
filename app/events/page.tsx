'use client'

import { useState } from 'react'
import ProposeEventModal from '@/components/events/ProposeEventModal'

const upcomingEvents = [
  {
    id: 1,
    date: { month: 'JUL', day: '12' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM – 8:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    description: 'Monthly Yappy Hour on the patio at Bootlegger. Dog-friendly, happy hour specials, and the best people watching on Palm Canyon. Leashed dogs on the patio.',
    tags: ['Social', '21+', 'Dog-Friendly Patio'],
    attending: 21,
    host: 'Marco & Biscuit',
    recurring: 'Second Saturday monthly',
    color: 'border-brand-orange bg-brand-orange/5',
    tagColor: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    id: 2,
    date: { month: 'JUL', day: '19' },
    title: 'Morning Dog Walk — Ruth Hardy Park',
    time: '7:00 AM – 8:30 AM',
    location: 'Ruth Hardy Park, Palm Springs',
    description: 'Kick off your Saturday with a casual morning walk through Ruth Hardy Park. All breeds welcome, leashed on the main path. Off-leash in the fenced area after the walk.',
    tags: ['Walk', 'All Dogs Welcome', 'Free'],
    attending: 14,
    host: 'PS Dog Dad Community',
    recurring: 'Every other Saturday',
    color: 'border-brand-teal bg-brand-teal/5',
    tagColor: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    id: 3,
    date: { month: 'JUL', day: '26' },
    title: 'Pool Party & Paws',
    time: '1:00 PM – 6:00 PM',
    location: 'Member Hosted — Uptown Palm Springs (address DM\'d to RSVPs)',
    description: 'Summer pool party for members and their water-loving pups! Bring your dog\'s towel, sunscreen, and favorite treats. Pool floats encouraged. Snacks and drinks provided.',
    tags: ['Pool', 'Members Only', 'Summer Series'],
    attending: 27,
    host: 'Chris & Noodle',
    recurring: null,
    color: 'border-plum bg-plum/5',
    tagColor: 'bg-plum/10 text-plum',
  },
  {
    id: 4,
    date: { month: 'AUG', day: '2' },
    title: 'Evening Sunset Hike — Araby Trail',
    time: '6:00 PM – 8:30 PM',
    location: 'Araby Trail Trailhead, Palm Springs',
    description: 'Beat the heat with an evening hike up Araby Trail for sunset views. Dogs must be leashed. Bring plenty of water for you and your pup — it\'s desert terrain.',
    tags: ['Hike', 'Moderate Difficulty', 'Bring Water'],
    attending: 9,
    host: 'Derek & Zeus',
    recurring: null,
    color: 'border-brand-golden bg-brand-golden/5',
    tagColor: 'bg-brand-golden/20 text-plum',
  },
  {
    id: 5,
    date: { month: 'AUG', day: '9' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM – 8:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    description: 'Monthly patio Yappy Hour returns. Happy hour drinks and dog-friendly fun on the patio at Bootlegger.',
    tags: ['Social', '21+', 'Dog-Friendly Patio'],
    attending: 6,
    host: 'Marco & Biscuit',
    recurring: 'Second Saturday monthly',
    color: 'border-brand-orange bg-brand-orange/5',
    tagColor: 'bg-brand-orange/10 text-brand-orange',
  },
]

const pastEvents = [
  { title: 'Morning Dog Walk — Ruth Hardy Park', date: 'July 5, 2026', attended: 16 },
  { title: 'Yappy Hour at Bootlegger Tiki', date: 'June 28, 2026', attended: 33 },
  { title: 'Summer Pool Party Kickoff', date: 'June 21, 2026', attended: 27 },
  { title: 'Morning Walk — Ruth Hardy Park', date: 'June 14, 2026', attended: 19 },
  { title: 'Yappy Hour at Eight4Nine', date: 'June 7, 2026', attended: 29 },
  { title: 'Spring Paws Picnic at Demuth Park', date: 'May 18, 2026', attended: 42 },
]

const FILTERS = ['All Events', 'Walks', 'Social', 'Pool / Water', 'Hikes', 'Members Only']

export default function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All Events')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Events & Meetups</h1>
          <p className="text-plum/60 mt-2">Dog walks, yappy hours, pool parties, and community meetups across Palm Springs, Cathedral City, Rancho Mirage, and beyond.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary self-start md:self-auto whitespace-nowrap">
          + Propose an Event
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-10 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeFilter === filter ? 'bg-plum text-white' : 'bg-plum/10 text-plum hover:bg-plum/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="mb-14">
        <h2 className="font-extrabold text-plum text-xl mb-5">Upcoming Events</h2>
        <div className="space-y-5">
          {upcomingEvents.map((event) => (
            <div key={event.id} className={`card border-l-4 ${event.color} p-6 hover:-translate-y-0.5`}>
              <div className="flex gap-4">
                {/* Date badge */}
                <div className="flex-shrink-0 w-16 h-16 bg-plum rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-golden">{event.date.month}</span>
                  <span className="text-2xl font-extrabold leading-none">{event.date.day}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="font-extrabold text-plum text-lg leading-snug">{event.title}</h3>
                    {/* Attendee count — teal/confirmed style */}
                    <div className="flex items-center gap-1.5 bg-brand-teal/10 border border-brand-teal/20 rounded-full px-3 py-1 text-xs font-bold text-brand-teal flex-shrink-0">
                      <span className="text-brand-teal">✓</span>
                      {event.attending} going
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-plum/60 mt-1">
                    <span>🕐 {event.time}</span>
                    <span>📍 {event.location}</span>
                  </div>

                  <p className="text-plum/70 text-sm mt-3 leading-relaxed">{event.description}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {event.tags.map((tag) => (
                      <span key={tag} className={`badge ${event.tagColor}`}>{tag}</span>
                    ))}
                    {event.recurring && (
                      <span className="text-xs text-plum/40 italic">↻ {event.recurring}</span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <button className="btn-teal text-sm px-5 py-2.5">RSVP</button>
                      <button className="btn-secondary text-sm px-5 py-2.5">Details</button>
                    </div>
                    <div className="text-xs text-plum/40 sm:ml-auto">
                      Hosted by <span className="font-semibold">{event.host}</span>
                      &nbsp;·&nbsp;
                      <a href="/conduct" className="text-brand-teal hover:underline">Community Guidelines</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <h2 className="font-extrabold text-plum text-xl mb-5">Past Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pastEvents.map((e) => (
            <div key={e.title} className="card p-5 opacity-75 hover:opacity-100 transition-opacity">
              <p className="font-extrabold text-plum text-sm leading-snug">{e.title}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-plum/40">{e.date}</p>
                <p className="text-xs text-plum/50 font-semibold">{e.attended} attended</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-brand-orange font-bold text-sm hover:underline">View all past events →</button>
        </div>
      </section>

      {/* Propose Event Modal */}
      {modalOpen && <ProposeEventModal onClose={() => setModalOpen(false)} />}

    </div>
  )
}
