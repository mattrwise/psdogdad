const chapters = [
  {
    number: 1,
    icon: '🏠',
    title: 'Before You Bring Them Home',
    intro: 'The decisions you make before day one shape everything that follows.',
    topics: [
      { title: 'Choosing the right dog', text: 'Match energy level to your lifestyle, not looks to your Instagram. A high-drive herding dog in a quiet condo is a recipe for frustration on both ends of the leash.' },
      { title: 'Puppy vs. adult vs. senior', text: 'Puppies are a blank slate and a full-time job. Adults come with known personalities. Seniors are calm, grateful companions who fit right into desert retirement life.' },
      { title: 'Supplies checklist', text: 'Crate, bed, leash and harness, ID tag, food and water bowls, age-appropriate food, a few toys, grooming basics, and enzyme cleaner. Everything else can wait.' },
      { title: 'Puppy-proofing your space', text: 'Get on your hands and knees and look around — cords, shoes, medications, houseplants, and pool access all need attention before paws hit the floor.' },
      { title: 'Finding a vet first', text: 'Pick your vet before you need one, and book a wellness visit for the first week. Our Health & Wellness page has a full valley directory.' },
      { title: 'Planning the daily routine', text: 'Decide in advance who feeds, who walks, and where the dog sleeps. Starting the routine on day one prevents confusion later.' },
    ],
  },
  {
    number: 2,
    icon: '📆',
    title: 'The First 30 Days',
    intro: 'Go slow. The first month sets the tone for the next decade.',
    topics: [
      { title: 'Set up a safe space', text: 'A crate or quiet corner that is theirs alone. New dogs need somewhere to decompress where nobody — human or dog — will bother them.' },
      { title: 'The 3-3-3 rule', text: 'Three days to decompress, three weeks to learn your routine, three months to feel truly at home. Do not judge who your dog is in week one.' },
      { title: 'House training', text: 'Out the same door, to the same spot, on a schedule — after waking, eating, and playing. Reward outside within two seconds. Accidents mean more supervision, not scolding.' },
      { title: 'Building trust', text: 'Be predictable. Feed on time, keep your tone calm, let the dog approach you. Trust is deposited in small, boring moments.' },
      { title: 'Introductions done right', text: 'One new person, place, or pet at a time. Neutral territory for dog-to-dog meetings, parallel walks before face-to-face greetings.' },
    ],
  },
  {
    number: 3,
    icon: '❤️',
    title: 'Building Your Bond',
    intro: 'The bond is built on purpose, not by accident.',
    topics: [
      { title: 'Learn their love language', text: 'Some dogs live for touch, others for play, treats, or simply being near you. Notice what makes your dog lean in — and give more of that.' },
      { title: 'Quality time over quantity', text: 'Ten minutes of undivided attention beats three hours of sharing a couch with your phone. Sniff walks with no agenda are relationship gold.' },
      { title: 'Reading body language', text: 'Loose wiggly body means happy. Lip licks, yawns, whale eye, and a tucked tail mean stress. Listening to the quiet signals earns your dog’s confidence.' },
      { title: 'The importance of play', text: 'Play is how dogs express joy and burn stress. Find your dog’s game — tug, fetch, chase, hide-and-seek — and play it daily.' },
      { title: 'Positive associations', text: 'Pair the things your dog finds scary — nail trims, car rides, the vet lobby — with chicken. Slowly, scary becomes fine, and fine becomes fun.' },
    ],
  },
  {
    number: 4,
    icon: '🌱',
    title: 'Life Stages & Transitions',
    intro: 'Your dog will change. The best dog dads change with them.',
    topics: [
      { title: 'Puppyhood (0–1 year)', text: 'Socialization window closes fast — safely expose them to the world early. Expect teething, testing, and a hundred small wins.' },
      { title: 'Adolescence (1–3 years)', text: 'The teenage phase is real: selective hearing and boundary testing. Stay consistent — this is when most dogs get surrendered, and when they most need you.' },
      { title: 'The adult years (3–7)', text: 'Your rhythm years. Keep skills sharp, weight healthy, and adventures coming — routine should not mean rut.' },
      { title: 'Senior care (7+)', text: 'Twice-yearly vet visits, joint support, softer bedding, shorter walks, more patience. Old dogs are the best dogs — let them set the pace.' },
      { title: 'Handling major life changes', text: 'Moves, new partners, new babies, loss — dogs feel it all. Keep their routine as the one constant while everything else shifts.' },
    ],
  },
  {
    number: 5,
    icon: '🌴',
    title: 'Being Part of the Community',
    intro: 'Dog dadhood is better together — that is the whole reason this site exists.',
    topics: [
      { title: 'Dog park etiquette', text: 'Watch your dog, not your phone. Know the signs of over-arousal, leash up when asked, and leave before things go sideways rather than after.' },
      { title: 'Making dog dad friends', text: 'The dog park, our forums, and community events are full of guys who get it. Say hi — dogs are the world’s best icebreaker.' },
      { title: 'Traveling with your dog', text: 'Book pet-friendly early, pack their food and meds, bring the familiar-smelling blanket, and never leave a dog in a parked car in the desert. Ever.' },
      { title: 'Advocating responsible ownership', text: 'Pick up every time, license and microchip, respect leash laws, and model what good dog ownership looks like — it keeps places dog-friendly for all of us.' },
    ],
  },
]

const lessons = [
  { icon: '⏳', title: 'Patience beats perfection', text: 'Your dog is not giving you a hard time — they are having a hard time. Breathe, lower the difficulty, try again.' },
  { icon: '🔁', title: 'Routine is love', text: 'Predictable days make confident dogs. Boring on purpose is a feature, not a bug.' },
  { icon: '👀', title: 'Watch more, assume less', text: 'Your dog is talking constantly with their body. The best dog dads are the best listeners.' },
  { icon: '🎓', title: 'Training never ends', text: 'Five minutes a day, forever. Skills rust without practice — and dogs love having a job.' },
  { icon: '☀️', title: 'Respect the desert', text: 'Heat kills. Dawn walks, palm-test the pavement, carry water, know the heat-stress signs.' },
  { icon: '🤝', title: 'Ask for help early', text: 'Trainers, vets, and fellow dog dads have seen it all. Struggling alone helps nobody — least of all your dog.' },
]

const mantras = [
  'They are not giving me a hard time — they are having a hard time.',
  'I am the calm my dog borrows.',
  'Short sessions, big rewards, end on a win.',
  'My dog’s pace is the right pace.',
  'Every walk is their internet — let them sniff.',
  'They only get one life; I get to make it great.',
]

export default function HandbookPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title">The Complete Dog Dad Handbook</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          Five chapters covering the whole journey — from the day you decide to get a dog to becoming a pillar of the pack. Tap a chapter to expand it.
        </p>
      </div>

      <div className="space-y-4 mb-16">
        {chapters.map(ch => (
          <details key={ch.number} className="card overflow-hidden group">
            <summary className="p-6 cursor-pointer list-none flex items-center gap-4 hover:bg-plum/5 transition-colors">
              <span className="text-3xl flex-shrink-0">{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">Chapter {ch.number}</p>
                <h2 className="font-extrabold text-plum text-lg leading-snug">{ch.title}</h2>
              </div>
              <span className="flex-shrink-0 text-plum/40 text-xl transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="px-6 pb-6 border-t border-plum/5">
              <p className="text-sm text-plum/50 italic mt-4 mb-5">{ch.intro}</p>
              <div className="space-y-4">
                {ch.topics.map(topic => (
                  <div key={topic.title}>
                    <h3 className="font-extrabold text-plum text-sm mb-1">🐾 {topic.title}</h3>
                    <p className="text-sm text-plum/70 leading-relaxed">{topic.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Essential lessons */}
      <div className="flex items-start gap-3 mb-6 border-l-4 border-brand-teal pl-4">
        <span className="text-3xl flex-shrink-0 mt-0.5">📌</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-teal">Six Essential Lessons</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {lessons.map(l => (
          <div key={l.title} className="card p-5">
            <div className="text-3xl mb-2">{l.icon}</div>
            <h3 className="font-extrabold text-plum text-base mb-1">{l.title}</h3>
            <p className="text-sm text-plum/60 leading-relaxed">{l.text}</p>
          </div>
        ))}
      </div>

      {/* Mantras */}
      <div className="bg-plum rounded-3xl p-6 sm:p-10 text-white">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🧘</div>
          <h2 className="text-2xl font-extrabold">Dog Dad Mantras</h2>
          <p className="text-white/60 text-sm mt-2">For the hard days. Repeat as needed.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {mantras.map(m => (
            <div key={m} className="bg-white/10 rounded-xl px-5 py-4 text-sm leading-relaxed italic">
              &ldquo;{m}&rdquo;
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
