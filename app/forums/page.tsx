import Link from 'next/link'
import SignedOut from '@/components/auth/SignedOut'

const categories = [
  {
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
    icon: '🍽️',
    title: 'Nutrition & Food',
    description: 'Raw feeding, brands, treat recipes, and diet advice.',
    threads: 45,
    posts: 218,
    latest: { title: 'Anyone tried Farmer\'s Dog delivery?', time: '1d ago' },
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    icon: '📸',
    title: 'Show Off Your Pup',
    description: 'Photos, milestones, and all the good boy energy.',
    threads: 203,
    posts: 1240,
    latest: { title: 'Rocky\'s first birthday pool party 🎉', time: '3h ago' },
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
  },
  {
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
  { author: 'Marco & Biscuit', time: '1h ago', category: 'Health & Wellness', title: 'Best vets in PS for senior dogs?', replies: 14 },
  { author: 'Tyler & Mango', time: '2h ago', category: 'Introductions', title: 'Just moved from WeHo — golden retriever dad here!', replies: 22 },
  { author: 'Derek & Zeus', time: '4h ago', category: 'Training', title: 'Trainer referral for reactive dog near DT Palm Springs?', replies: 7 },
  { author: 'James & Pretzel', time: '6h ago', category: 'Local Spots', title: 'Demuth Park small dog area is finally fixed!', replies: 19 },
  { author: 'Chris & Noodle', time: '8h ago', category: 'Show Off', title: 'Noodle\'s first swim of the season 🏊', replies: 31 },
]

export default function ForumsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Community Forums</h1>
          <p className="text-plum/60 mt-2">Ask questions, share tips, and connect with fellow PS Dog Dads.</p>
        </div>
        <button className="btn-primary self-start md:self-auto">+ New Post</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories */}
        <div className="lg:col-span-2">
          <h2 className="font-extrabold text-plum text-xl mb-4">Forum Categories</h2>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.title} className={`card border ${cat.color} p-5 hover:-translate-y-0.5 cursor-pointer`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-plum text-base">{cat.title}</h3>
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="card p-5">
            <h3 className="font-extrabold text-plum mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.title} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <p className="text-xs text-brand-orange font-semibold">{post.category}</p>
                  <p className="text-sm font-semibold text-plum leading-snug mt-0.5">{post.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-plum/40">{post.author} · {post.time}</p>
                    <p className="text-xs text-plum/50">{post.replies} replies</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forum Stats */}
          <div className="card bg-gradient-to-br from-plum to-plum-light text-white p-5">
            <h3 className="font-extrabold mb-4">Forum Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '728', label: 'Threads' },
                { value: '4,313', label: 'Posts' },
                { value: '340', label: 'Members' },
                { value: '23', label: 'Online Now' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-extrabold text-brand-golden">{value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Join CTA — visitors only */}
          <SignedOut>
            <div className="card p-5 border-2 border-brand-orange/30 bg-brand-orange/5">
              <h3 className="font-extrabold text-plum mb-2">Join the conversation</h3>
              <p className="text-sm text-plum/60 mb-4">Create a free account to post, reply, and connect.</p>
              <Link href="/members/join" className="btn-primary w-full text-center block">
                Sign Up Free
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
