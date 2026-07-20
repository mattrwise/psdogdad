import Link from 'next/link'

const principles = [
  { icon: '📅', title: 'Consistency is Key', text: 'Same cues, same rules, same rewards — from everyone in the house. Dogs learn fastest when the answer never changes.' },
  { icon: '🎉', title: 'Positive Reinforcement', text: 'Reward what you want to see more of. Treats, praise, and play build behavior far faster than punishment ever will.' },
  { icon: '⏱️', title: 'Patience & Timing', text: 'Mark the exact moment your dog gets it right — within a second or two. Short 5–10 minute sessions beat marathon drills.' },
  { icon: '🎾', title: 'Make it Fun', text: 'If training feels like a game, your dog will beg to play it. End every session on a win, while tails are still wagging.' },
]

const modules = [
  {
    icon: '🐾',
    title: 'Basic Commands',
    level: 'Beginner',
    levelColor: 'bg-brand-teal/10 text-brand-teal',
    learn: ['Sit, down, stay, and come when called', 'Loose-leash walking basics', 'Name recognition and focus', 'Leave it and drop it'],
  },
  {
    icon: '🛠️',
    title: 'Behavioral Training',
    level: 'Intermediate',
    levelColor: 'bg-brand-orange/10 text-brand-orange',
    learn: ['Managing barking, jumping, and door-dashing', 'Crate comfort and alone-time confidence', 'Impulse control around food and toys', 'Working through leash reactivity'],
  },
  {
    icon: '🏆',
    title: 'Advanced Skills',
    level: 'Advanced',
    levelColor: 'bg-plum/10 text-plum',
    learn: ['Reliable off-leash recall', 'Distance commands and hand signals', 'Place training and long stays with distractions', 'Trick chains and canine good citizen prep'],
  },
  {
    icon: '🐶',
    title: 'Socialization',
    level: 'All Levels',
    levelColor: 'bg-brand-golden/20 text-plum',
    learn: ['Calm greetings with dogs and people', 'Confidence with new sounds, surfaces, and places', 'Dog park manners and reading play styles', 'Patio and public-space etiquette'],
  },
]

const mistakes = [
  { mistake: 'Repeating commands over and over', solution: 'Say it once, then help your dog succeed. Repetition teaches them that "sit-sit-SIT" is the actual cue.' },
  { mistake: 'Punishing after the fact', solution: 'Dogs connect consequences only to the current moment. Interrupt and redirect in the act — or let it go and manage better next time.' },
  { mistake: 'Training only when things go wrong', solution: 'Practice daily in calm moments. A skill that only gets rehearsed during chaos will never be reliable.' },
  { mistake: 'Inconsistent rules between people', solution: 'Agree on the house rules — if the couch is off-limits with you but fine with your partner, your dog just hears noise.' },
  { mistake: 'Ending sessions on frustration', solution: 'When it stops going well, ask for one easy win, reward big, and stop. Tomorrow is another session.' },
]

const proTips = [
  { author: 'James & Rocky', tip: 'Carry treats on every single walk for the first year. Every time Rocky checked in with me unprompted, he got paid. Now he never leaves my side.' },
  { author: 'Mike & Buddy', tip: 'We do "commercial break training" — every ad break during a game, Buddy and I run one two-minute drill. It adds up to real skills without setting aside time.' },
  { author: 'David & Max', tip: 'Train at sunrise in summer. Max learns twice as fast when the pavement is not scorching and there are fewer distractions at the park.' },
  { author: 'Alex & Charlie', tip: 'Film your sessions on your phone. Watching them back, I realized my timing was late by two seconds — fixing that changed everything for Charlie.' },
]

export default function TrainingResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title">Professional Training Techniques</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          The methods professional trainers actually use — broken down for everyday dog dads.
        </p>
      </div>

      {/* Core principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {principles.map(p => (
          <div key={p.title} className="card p-6 text-center">
            <div className="text-4xl mb-3">{p.icon}</div>
            <h2 className="font-extrabold text-plum text-base mb-2">{p.title}</h2>
            <p className="text-sm text-plum/60 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      {/* Training modules */}
      <div className="flex items-start gap-3 mb-6 border-l-4 border-brand-orange pl-4">
        <span className="text-3xl flex-shrink-0 mt-0.5">🎓</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-orange">Training Modules</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {modules.map(m => (
          <div key={m.title} className="card p-6 hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{m.icon}</span>
                <h3 className="font-extrabold text-plum text-lg">{m.title}</h3>
              </div>
              <span className={`badge text-xs flex-shrink-0 ${m.levelColor}`}>{m.level}</span>
            </div>
            <p className="text-xs font-bold text-plum/40 uppercase tracking-wider mb-2">What you&apos;ll learn</p>
            <ul className="space-y-1.5 mb-5">
              {m.learn.map(item => (
                <li key={item} className="flex gap-2 text-sm text-plum/70">
                  <span className="text-brand-teal flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/training" className="text-sm font-semibold text-brand-teal hover:underline">
              Learn More →
            </Link>
          </div>
        ))}
      </div>

      {/* Common mistakes */}
      <div className="flex items-start gap-3 mb-6 border-l-4 border-plum pl-4">
        <span className="text-3xl flex-shrink-0 mt-0.5">⚠️</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-plum">Common Training Mistakes</h2>
      </div>
      <div className="space-y-3 mb-16">
        {mistakes.map((m, i) => (
          <div key={m.mistake} className="card p-5">
            <div className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange font-extrabold flex items-center justify-center text-sm">{i + 1}</span>
              <div>
                <h3 className="font-extrabold text-plum text-base">{m.mistake}</h3>
                <p className="text-sm text-plum/70 mt-1 leading-relaxed"><span className="font-semibold text-brand-teal">Instead:</span> {m.solution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pro tips */}
      <div className="flex items-start gap-3 mb-6 border-l-4 border-brand-golden pl-4">
        <span className="text-3xl flex-shrink-0 mt-0.5">💡</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-plum">Pro Tips from the Pack</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {proTips.map(t => (
          <div key={t.author} className="card p-6">
            <p className="text-sm text-plum/70 leading-relaxed italic">&ldquo;{t.tip}&rdquo;</p>
            <p className="text-sm font-extrabold text-brand-teal mt-3">— {t.author}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
        <div className="text-4xl mb-4">🎓</div>
        <h2 className="text-2xl font-extrabold mb-3">Want step-by-step guides?</h2>
        <p className="text-white/70 mb-6 max-w-lg mx-auto">
          Our Training section has full written guides — from loose-leash walking to desert heat safety.
        </p>
        <Link href="/training" className="btn-primary text-base px-8">Browse Training Guides</Link>
      </div>
    </div>
  )
}
