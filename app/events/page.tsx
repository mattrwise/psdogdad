import Link from 'next/link'

const events = [
  {
    id: 1,
    date: { month: 'JUN', day: '7', year: '2025' },
    title: 'Morning Dog Walk — Ruth Hardy Park',
    time: '7:30 AM – 9:00 AM',
    location: 'Ruth Hardy Park, Palm Springs',
    description: 'Start your Saturday right with a casual morning walk through Ruth Hardy Park. All breeds welcome, leashed dogs only on main path, off-leash in the fenced area after the walk.',
    tags: ['Walk', 'All Dogs Welcome', 'Free'],
    attending: 18,
    host: 'PS Dog Dad Community',
    recurring: 'Every other Saturday',
    color: 'border-brand-teal bg-brand-teal/5',
    tagColor: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    id: 2,
    date: { month: 'JUN', day: '14', year: '2025' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM – 8:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    description: 'Monthly Yappy Hour on the patio at Bootlegger. Dog-friendly, happy hour specials, and the best people watching on Palm Canyon. Leashed dogs on the patio.',
    tags: ['Social', '21+', 'Dog-Friendly Patio'],
    attending: 34,
    host: 'Marco & Biscuit',
    recurring: 'Second Saturday monthly',
    color: 'border-brand-orange bg-brand-orange/5',
    tagColor: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    id: 3,
    date: { month: 'JUN', day: '21', year: '2025' },
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
    date: { month: 'JUN', day: '28', year: '2025' },
    title: 'Evening Sunset Hike — Araby Trail',
    time: '6:00 PM – 8:30 PM',
    location: 'Araby Trail Trailhead',
    description: 'Beat the heat with an evening hike up Araby Trail for sunset views. Dogs must be leashed. Bring plenty of water for you and your pup — it\'s desert terrain.',
    tags: ['Hike', 'Moderate Difficulty', 'Bring Water'],
    attending: 12,
    host: 'Derek & Zeus',
    recurring: null,
    color: 'border-brand-golden bg-brand-golden/5',
    tagColor: 'bg-brand-golden/20 text-plum',
  },
  {
    id: 5,
    date: { month: 'JUL', day: '5', year: '2025' },
    title: 'Morning Dog Walk — Ruth Hardy Park',
    time: '7:30 AM – 9:00 AM',
    location: 'Ruth Hardy Park, Palm Springs',
    description: 'Our recurring biweekly morning walk. Post-Fourth of July recovery walk — check in on pups that may be stressed from fireworks.',
    tags: ['Walk', 'All Dogs Welcome', 'Free'],
    attending: 9,
    host: 'PS Dog Dad Community',
    recurring: 'Every other Saturday',
    color: 'border-brand-teal bg-brand-teal/5',
    tagColor: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    id: 6,
    date: { month: 'JUL', day: '12', year: '2025' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM – 8:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    description: 'Monthly patio Yappy Hour returns. Happy hour drinks and dog-friendly fun on the patio.',
    tags: ['Social', '21+', 'Dog-Friendly Patio'],
    attending: 21,
    host: 'Marco & Biscuit',
    recurring: 'Second Saturday monthly',
    color: 'border-brand-orange bg-brand-orange/5',
    tagColor: 'bg-brand-orange/10 text-brand-orange',
  },
]

const pastEvents = [
  { title: 'Spring Paws Picnic at Demuth Park', date: 'May 18, 2025', attended: 42 },
  { title: 'Yappy Hour at Eight4Nine', date: 'May 10, 2025', attended: 29 },
  { title: 'Morning Walk — Ruth Hardy Park', date: 'May 3, 2025', attended: 16 },
]

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Events & Meetups</h1>
          <p className="text-plum/60 mt-2">Dog walks, yappy hours, pool parties, and community meetups across the Coachella Valley.</p>
        </div>
        <button className="btn-primary self-start">+ Propose an Event</button>
      </div>

      {/* Filter bar — horizontally scrollable on mobile */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {['All Events', 'Walks', 'Social', 'Pool / Water', 'Hikes', 'Members Only'].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                i === 0 ? 'bg-plum text-white' : 'bg-plum/10 text-plum hover:bg-plum/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events list */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <h2 className="font-extrabold text-plum text-xl">Upcoming Events</h2>
          {events.map((event) => (
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
                    <div className="flex items-center gap-1 bg-plum/10 rounded-full px-3 py-1 text-xs font-semibold text-plum flex-shrink-0">
                      👥 {event.attending} going
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

                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <button className="btn-teal text-sm px-5 py-2.5">RSVP</button>
                      <button className="btn-secondary text-sm px-5 py-2.5">Details</button>
                    </div>
                    <p className="text-xs text-plum/40 mt-2">Hosted by {event.host}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Mini calendar placeholder */}
          <div className="card p-5">
            <h3 className="font-extrabold text-plum mb-4">June 2025</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="text-plum/40 font-bold pb-1">{d}</div>
              ))}
              {Array.from({ length: 6 }, (_, i) => i + 1).map((offset) => <div key={`o${offset}`} />)}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-semibold cursor-pointer transition-colors
                    ${[7, 14, 21, 28].includes(day)
                      ? 'bg-brand-orange text-white'
                      : 'text-plum/70 hover:bg-plum/10'
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <p className="text-xs text-plum/40 mt-3 text-center">🟠 Event days highlighted</p>
          </div>

          {/* Past events */}
          <div className="card p-5">
            <h3 className="font-extrabold text-plum mb-4">Past Events</h3>
            <div className="space-y-3">
              {pastEvents.map((e) => (
                <div key={e.title} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <p className="text-sm font-semibold text-plum leading-snug">{e.title}</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-plum/40">{e.date}</p>
                    <p className="text-xs text-plum/50">{e.attended} attended</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-brand-orange font-bold text-sm mt-4 hover:underline">View all past events →</button>
          </div>

          {/* Host an event */}
          <div className="card p-5 border-2 border-brand-teal/30 bg-brand-teal/5">
            <h3 className="font-extrabold text-plum mb-2">Host an Event</h3>
            <p className="text-sm text-plum/60 mb-4">Have a pool? A great trail you want to share? Propose an event for the community.</p>
            <button className="btn-teal w-full text-sm">Propose an Event</button>
          </div>
        </div>
      </div>
    </div>
  )
}
