import Link from 'next/link'
import { notFound } from 'next/navigation'
import SignedIn from '@/components/auth/SignedIn'

const categories: Record<string, {
  icon: string
  title: string
  description: string
  color: string
  badge: string
  threads: Thread[]
}> = {
  'introductions': {
    icon: '👋',
    title: 'Introductions',
    description: 'New to the community? Introduce yourself and your dog(s) here.',
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
    threads: [
      { id: '1', author: 'Tyler & Mango', time: '2h ago', title: 'Just moved from WeHo — golden retriever dad here!', replies: 22, views: 88 },
      { id: '2', author: 'Sam & Peanut', time: '1d ago', title: 'Hello from Cathedral City 🐶', replies: 9, views: 41 },
      { id: '3', author: 'Jordan & Fig', time: '3d ago', title: 'First-time dog dad, excited to be here', replies: 17, views: 63 },
    ],
  },
  'health-wellness': {
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Vet recommendations, supplements, senior dog care, and more.',
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
    threads: [
      { id: '1', author: 'Marco & Biscuit', time: '1h ago', title: 'Best vets in PS for senior dogs?', replies: 14, views: 72 },
      { id: '2', author: 'Kevin & Waffle', time: '5h ago', title: 'Anyone use VCA Desert Animal Hospital?', replies: 6, views: 29 },
      { id: '3', author: 'Ben & Churro', time: '2d ago', title: 'Hip dysplasia management tips?', replies: 21, views: 110 },
    ],
  },
  'training-behavior': {
    icon: '🎓',
    title: 'Training & Behavior',
    description: 'Tips, trainer recommendations, and behavior questions.',
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
    threads: [
      { id: '1', author: 'Derek & Zeus', time: '4h ago', title: 'Trainer referral for reactive dog near DT Palm Springs?', replies: 7, views: 34 },
      { id: '2', author: 'Alex & Taco', time: '1d ago', title: 'Loose leash walking — what worked for you?', replies: 18, views: 95 },
      { id: '3', author: 'Ryan & Boba', time: '4d ago', title: 'Separation anxiety getting worse in summer heat', replies: 25, views: 130 },
    ],
  },
  'local-spots': {
    icon: '🌴',
    title: 'Local Spots',
    description: 'Dog parks, hiking trails, pet-friendly patios and more in the Coachella Valley.',
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
    threads: [
      { id: '1', author: 'James & Pretzel', time: '6h ago', title: 'Demuth Park small dog area is finally fixed!', replies: 19, views: 88 },
      { id: '2', author: 'Mike & Salsa', time: '1d ago', title: 'Best dog-friendly patios in PS?', replies: 31, views: 155 },
      { id: '3', author: 'Luis & Frito', time: '3d ago', title: 'Murray Canyon trail — leash required?', replies: 11, views: 62 },
    ],
  },
  'nutrition-food': {
    icon: '🍽️',
    title: 'Nutrition & Food',
    description: 'Raw feeding, brands, treat recipes, and diet advice.',
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
    threads: [
      { id: '1', author: 'Chris & Noodle', time: '1d ago', title: "Anyone tried Farmer's Dog delivery?", replies: 8, views: 44 },
      { id: '2', author: 'Tom & Dumpling', time: '2d ago', title: 'Raw feeding in summer — any concerns?', replies: 14, views: 67 },
      { id: '3', author: 'Pat & Mochi', time: '5d ago', title: 'Frozen treat recipes for hot days', replies: 29, views: 180 },
    ],
  },
  'show-off': {
    icon: '📸',
    title: 'Show Off Your Pup',
    description: 'Photos, milestones, and all the good boy energy.',
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
    threads: [
      { id: '1', author: 'Greg & Rocky', time: '3h ago', title: "Rocky's first birthday pool party 🎉", replies: 41, views: 210 },
      { id: '2', author: 'Chris & Noodle', time: '8h ago', title: "Noodle's first swim of the season 🏊", replies: 31, views: 148 },
      { id: '3', author: 'Dan & Pretzel', time: '1d ago', title: 'Caught him mid-zoomies — classic', replies: 17, views: 93 },
    ],
  },
  'travel': {
    icon: '✈️',
    title: 'Travel with Dogs',
    description: 'Pet-friendly hotels, airlines, road trips, and travel tips.',
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
    threads: [
      { id: '1', author: 'Brian & Gnocchi', time: '2d ago', title: 'Flying with a French Bulldog — tips?', replies: 12, views: 58 },
      { id: '2', author: 'Nick & Wonton', time: '4d ago', title: 'Pet-friendly Airbnbs in Big Bear?', replies: 8, views: 39 },
      { id: '3', author: 'Eric & Nacho', time: '1w ago', title: 'Road trip from PS to SF with two dogs — our story', replies: 22, views: 121 },
    ],
  },
  'events-meetups': {
    icon: '🎉',
    title: 'Events & Meetups',
    description: 'Community event planning, feedback, and coordination.',
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
    threads: [
      { id: '1', author: 'Admin', time: '5d ago', title: 'Pool party recap + photos from Saturday!', replies: 38, views: 204 },
      { id: '2', author: 'Jake & Pepper', time: '1w ago', title: 'Suggestion: morning meetup at Demuth?', replies: 15, views: 77 },
      { id: '3', author: 'Matt & Biscuit', time: '2w ago', title: 'Fall social — who\'s interested?', replies: 27, views: 130 },
    ],
  },
}

type Thread = {
  id: string
  author: string
  time: string
  title: string
  replies: number
  views: number
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = categories[params.category]
  if (!cat) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-plum/50 mb-6 flex items-center gap-2">
        <Link href="/forums" className="hover:text-brand-teal transition-colors">Forums</Link>
        <span>›</span>
        <span className="text-plum font-medium">{cat.title}</span>
      </nav>

      {/* Category Header */}
      <div className={`card border ${cat.color} p-6 mb-8`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{cat.icon}</div>
            <div>
              <h1 className="font-extrabold text-plum text-2xl">{cat.title}</h1>
              <p className="text-plum/60 text-sm mt-1">{cat.description}</p>
            </div>
          </div>
          <SignedIn>
            <button className="btn-primary self-start sm:self-auto whitespace-nowrap">
              + New Post
            </button>
          </SignedIn>
        </div>
      </div>

      {/* Thread List */}
      <div className="space-y-3">
        {cat.threads.map((thread) => (
          <div
            key={thread.id}
            className="card p-5 hover:-translate-y-0.5 cursor-pointer flex items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-plum text-base leading-snug hover:text-brand-teal transition-colors cursor-pointer">
                {thread.title}
              </h2>
              <p className="text-xs text-plum/40 mt-1">{thread.author} · {thread.time}</p>
            </div>
            <div className="flex-shrink-0 flex gap-6 text-center hidden sm:flex">
              <div>
                <div className="text-base font-extrabold text-plum">{thread.replies}</div>
                <div className="text-xs text-plum/40 uppercase tracking-wider">replies</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-plum">{thread.views}</div>
                <div className="text-xs text-plum/40 uppercase tracking-wider">views</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom New Post CTA */}
      <div className="mt-8 flex justify-center">
        <SignedIn>
          <button className="btn-primary">+ Start a New Thread</button>
        </SignedIn>
      </div>
    </div>
  )
}
