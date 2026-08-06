import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SignedIn from '@/components/auth/SignedIn'
import SignedOut from '@/components/auth/SignedOut'
import NewPostButton from '@/components/forums/NewPostButton'
import ForumPostList from '@/components/forums/ForumPostList'

const categories: Record<string, {
  icon: string
  title: string
  description: string
  color: string
  badge: string
  ideas: string[]
}> = {
  'introductions': {
    icon: '👋',
    title: 'Introductions',
    description: 'New to the community? Introduce yourself and your dog(s) here.',
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
    ideas: [
      'Just moved to Palm Springs with a two year old lab, where do you all walk?',
      'Hello from Cathedral City, this is Biscuit',
      'First time dog dad, what do you wish you had known?',
    ],
  },
  'health-wellness': {
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Vet recommendations, supplements, senior dog care, and more.',
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
    ideas: [
      'Which vet do you actually use, and why?',
      'How do you protect paws on hot pavement in July?',
      'Anyone dealt with allergies in the desert?',
    ],
  },
  'training-behavior': {
    icon: '🎓',
    title: 'Training & Behavior',
    description: 'Tips, trainer recommendations, and behavior questions.',
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
    ideas: [
      'Any trainers near downtown who work with reactive dogs?',
      'Loose leash walking, what actually worked for you?',
      'How do you stop the barking at the door?',
    ],
  },
  'local-spots': {
    icon: '🌴',
    title: 'Local Spots',
    description: 'Dog parks, hiking trails, pet-friendly patios and more in the Coachella Valley.',
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
    ideas: [
      'Which patios genuinely welcome dogs, not just tolerate them?',
      'Best shaded walk for a July morning?',
      'Is the small dog area at Demuth worth it?',
    ],
  },
  'nutrition-food': {
    icon: '🍽️',
    title: 'Nutrition & Food',
    description: 'Raw feeding, brands, treat recipes, and diet advice.',
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
    ideas: [
      'What are you feeding when it is this hot?',
      'Anywhere local for raw food?',
      'Treats that survive a walk without melting?',
    ],
  },
  'show-off': {
    icon: '📸',
    title: 'Show Off Your Pup',
    description: 'Photos, milestones, and all the good boy energy.',
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
    ideas: [
      'First swim of the season',
      'Adoption day, one year on',
      'Caught mid zoomies',
    ],
  },
  'travel': {
    icon: '✈️',
    title: 'Travel with Dogs',
    description: 'Pet-friendly hotels, airlines, road trips, and travel tips.',
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
    ideas: [
      'Driving to San Diego with a nervous dog, any tips?',
      'Which hotels here actually mean pet friendly?',
      'Flying with a dog out of PSP, how did it go?',
    ],
  },
  'events-meetups': {
    icon: '🎉',
    title: 'Events & Meetups',
    description: 'Community event planning, feedback, and coordination.',
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
    ideas: [
      'Would anyone come to an early morning walk at Ruth Hardy Park?',
      'Yappy hour, which patio should we try first?',
      'Pool party season, anyone willing to host?',
    ],
  },
}

/** Each category gets its own title, so a search result says which forum it is. */
export async function generateMetadata(
  { params }: { params: { category: string } },
): Promise<Metadata> {
  const cat = categories[params.category]
  if (!cat) return { title: 'Forum not found, PS Dog Dad' }
  return { title: `${cat.title}, PS Dog Dad Forums`, description: cat.description }
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
            <NewPostButton
              category={params.category}
              categoryTitle={cat.title}
              className="btn-primary self-start sm:self-auto whitespace-nowrap"
            >
              + New Post
            </NewPostButton>
          </SignedIn>
          <SignedOut>
            <Link href="/members/login" className="btn-secondary self-start sm:self-auto whitespace-nowrap">
              Sign in to post
            </Link>
          </SignedOut>
        </div>
      </div>

      {/* Real member posts */}
      <ForumPostList category={params.category} ideas={cat.ideas} />

      {/* Bottom New Post CTA */}
      <div className="mt-8 flex justify-center">
        <SignedIn>
          <NewPostButton
            category={params.category}
            categoryTitle={cat.title}
            className="btn-primary"
          >
            + Start a New Thread
          </NewPostButton>
        </SignedIn>
      </div>
    </div>
  )
}
