import Link from 'next/link'
import SignedOut from '@/components/auth/SignedOut'

const categories = [
  {
    slug: 'introductions',
    icon: '👋',
    title: 'Introductions',
    description: 'New to the community? Introduce yourself and your dog(s) here.',
    threads: 87,
    posts: 412,
    latest: { title: 'Just moved from WeHo — golden retriever dad here!', time: '1h ago' },
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    slug: 'health-wellness',
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Vet recommendations, supplements, senior dog care, and more.',
    threads: 134,
    posts: 891,
    latest: { title: 'Best vets in PS for senior dogs?', time: '2h ago' },
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    slug: 'training-behavior',
    icon: '🎓',
    title: 'Training & Behavior',
    description: 'Tips, trainer recommendations, and behavior questions.',
    threads: 62,
    posts: 348,
    latest: { title: 'Trainer referral for reactive dog?', time: '4h ago' },
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
  },
  {
    slug: 'local-spots',
    icon: '🌴',
    title: 'Local Spots',
    description: 'Dog parks, hiking trails, pet-friendly patios and more in the Coachella Valley.',
    threads: 98,
    posts: 623,
    latest: { title: 'Demuth Park small dog area is finally fixed!', time: '6h ago' },
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
  },
  {
    slug: 'nutrition-food',
    icon: '🍽️',
    title: 'Nutrition & Food',
    description: 'Raw feeding, brands, treat recipes, and diet advice.',
    threads: 45,
    posts: 218,
    latest: { title: "Anyone tried Farmer's Dog delivery?", time: '1d ago' },
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    slug: 'show-off',
    icon: '📸',
    title: 'Show Off Your Pup',
    description: 'Photos, milestones, and all the good boy energy.',
    threads: 203,
    posts: 1240,
    latest: { title: "Rocky's first birthday pool party 🎉", time: '3h ago' },
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    slug: 'travel',
    icon: '✈️',
    title: 'Travel with Dogs',
    description: 'Pet-friendly hotels, airlines, road trips, and travel tips.',
    threads: 41,
    posts: 187,
    latest: { title: 'Flying with a French Bulldog — tips?', time: '2d ago' },
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
  },
  {
    slug: 'events-meetups',
    icon: '🎉',
    title: 'Events & Meetups',
    description: 'Community event planning, feedback, and coordination.',
    threads: 58,
    posts: 394,
    latest: { title: 'Pool party recap + photos from Saturday!', time: '5d ago' },
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
  },
]

const recentPosts = [
  { author: 'Marco & Biscuit', time: '1h ago', category: 'Health & Wellness', categorySlug: 'health-wellness', title: 'Best vets in PS for senior dogs?', replies: 14 },
  { author: 'Tyler & Mango', time: '2h ago', category: 'Introductions', categorySlug: 'introductions', title: 'Just moved from WeHo — golden retriever dad here!', replies: 22 },
  { author: 'Derek & Zeus', time: '4h ago', category: 'Training', categorySlug: 'training-behavior', title: 'Trainer referral for reactive dog near DT Palm Springs?', replies: 7 },
  { author: 'James & Pretzel', time: '6h ago', category: 'Local Spots', categorySlug: 'local-spots', title: 'Demuth Park small dog area is finally fixed!', replies: 19 },
  { author: 'Chris & Noodle', time: '8h ago', category: 'Show Off', categorySlug: 'show-off', title: "Noodle's first swim of the season 🏊", replies: 31 },
]

export default function ForumsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title">Community Forums</h1>
        <p className="text-plum/60 mt-2">Ask questions, share tips, and connect with dog dads across the Coachella Valley.</p>
      </div>

      {/* Join CTA — visitors only */}
      <SignedOut>
        <div className="card p-5 border-2 border-brand-orange/30 bg-brand-orange/5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-extrabold text-plum">Join the conversation</h3>
            <p className="text-sm text-plum/60 mt-1">Create a free account to post, reply, and connect.</p>
          </div>
          <Link href="/members/join" className="btn-primary whitespace-nowrap self-start sm:self-auto">
            Sign Up Free
          </Link>
        </div>
      </SignedOut>

      {/* Forum Categories */}
      <h2 className="font-extrabold text-plum text-xl mb-4">Forum Categories</h2>
      <div className="space-y-4 mb-12">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/forums/${cat.slug}`}
            className={`card border ${cat.color} p-5 hover:-translate-y-0.5 flex items-start gap-4 group`}
          >
            <div className="text-3xl flex-shrink-0">{cat.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-plum text-base group-hover:text-brand-teal transition-colors">{cat.title}</h3>
                <span className={`badge text-xs ${cat.badge}`}>{cat.threads} threads</span>
              </div>
              <p className="text-plum/60 text-sm mt-1">{cat.description}</p>
              <div className="mt-2 text-xs text-plum/40">
                Latest: <span className="text-plum/70 font-medium">{cat.latest.title}</span> · {cat.latest.time}
              </div>
            </div>
            <div className="flex-shrink-0 text-center hidden sm:block">
              <div className="text-xl font-extrabold text-plum">{cat.posts}</div>
              <div className="text-xs text-plum/40 uppercase tracking-wider">posts</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="font-extrabold text-plum text-lg mb-4">Recent Activity</h3>
        <div className="divide-y divide-gray-100">
          {recentPosts.map((post) => (
            <div key={post.title} className="py-3 first:pt-0 last:pb-0">
              <Link href={`/forums/${post.categorySlug}`} className="text-xs text-brand-orange font-semibold hover:underline">
                {post.category}
              </Link>
              <p className="text-sm font-semibold text-plum leading-snug mt-0.5">{post.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-plum/40">{post.author} · {post.time}</p>
                <p className="text-xs text-plum/50">{post.replies} replies</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
