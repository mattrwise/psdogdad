// Training guide content, recovered from the live site (www.psdogdad.com/training)
// after the original source was lost. Each guide renders at /training/<slug>.

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }

export type Guide = {
  slug: string
  emoji: string
  title: string
  shortTitle: string
  category: string
  minutes: number
  premium: boolean
  description: string
  body: GuideBlock[]
}

export const guides: Guide[] = [
  {
    slug: 'desert-heat-safety',
    emoji: '☀️',
    title: 'Keeping Your Dog Safe in Desert Heat',
    shortTitle: 'Desert Heat Safety',
    category: 'Health & Safety',
    minutes: 6,
    premium: false,
    description:
      "Palm Springs summers are no joke. How to exercise, hydrate, and protect your dog when it's 110° outside.",
    body: [
      { type: 'p', text: "Palm Springs heat is a different animal. From May through September, daytime temperatures regularly pass 105°F — and pavement gets far hotter than the air. A dog's paw pads can burn in under a minute on asphalt that's been baking all afternoon." },
      { type: 'h2', text: 'The 7-second rule' },
      { type: 'p', text: "Before any walk, press the back of your hand against the pavement for 7 seconds. If you can't hold it there comfortably, it's too hot for paws. In summer that usually means walks happen before 8 AM or after 8 PM. No exceptions." },
      { type: 'h2', text: 'Signs of overheating' },
      { type: 'ul', items: [
        "Heavy panting that doesn't settle when resting",
        'Thick, ropey drool',
        'Bright red or pale gums',
        'Stumbling, weakness, or confusion',
        'Vomiting or diarrhea',
      ] },
      { type: 'p', text: "If you see these, get your dog into shade or AC immediately, offer small amounts of cool (not ice-cold) water, wet their belly and paws, and call your vet. Heatstroke moves fast in dogs — it's an emergency, not a wait-and-see." },
      { type: 'h2', text: 'Everyday habits that help' },
      { type: 'ul', items: [
        'Carry water on every outing, even short ones. Collapsible bowls live in your car and your bag.',
        'Flat-faced breeds (Frenchies, bulldogs, pugs) overheat much faster — cut all times in half for them.',
        'A kiddie pool in the shade is the cheapest cooling tool in the desert.',
        'Never leave a dog in a parked car here. Even at 85° outside, a car interior passes 120° in minutes.',
      ] },
      { type: 'h2', text: 'Best summer exercise options' },
      { type: 'p', text: 'Early-morning walks at Ruth Hardy Park, the shaded stretches of Tahquitz Creek Trail, and indoor play. Many of our members shift to a "sunrise club" schedule June through September — check the Events page and join a morning walk.' },
    ],
  },
  {
    slug: 'loose-leash-walking',
    emoji: '🦮',
    title: 'Loose-Leash Walking Basics',
    shortTitle: 'Loose-Leash Walking',
    category: 'Training Basics',
    minutes: 8,
    premium: false,
    description:
      'Stop the pulling. A simple, positive method to teach your dog to walk beside you — no prong collars needed.',
    body: [
      { type: 'p', text: "A dog that pulls turns every walk into a workout you didn't sign up for. The good news: loose-leash walking is one of the most teachable skills there is, and you don't need any special equipment beyond a standard 6-foot leash and a pouch of small treats." },
      { type: 'h2', text: 'Why dogs pull' },
      { type: 'p', text: 'Pulling works. Your dog pulls, you follow, they get where they wanted to go. Every step you take while the leash is tight teaches them that pulling is how walks work. The whole method below comes down to one idea: pulling stops progress, a loose leash makes progress.' },
      { type: 'h2', text: 'The method' },
      { type: 'ol', items: [
        'Start somewhere boring — your living room or driveway, not the dog park.',
        'The moment the leash goes tight, stop walking. Stand still. Say nothing.',
        'Wait for any slack — your dog turning back, stepping toward you, or just easing off.',
        'The instant the leash loosens, mark it ("yes!") and walk forward again.',
        'When your dog walks near your side, feed a treat at your hip seam. That spot becomes a paycheck zone.',
      ] },
      { type: 'h2', text: 'Sessions, not marathons' },
      { type: 'p', text: 'Five minutes, twice a day, beats one long frustrating outing. For the first two weeks, treat "training walks" and "exercise" as separate things — use a sniffy park session for exercise so your dog isn\'t bursting with energy during training.' },
      { type: 'h2', text: 'Troubleshooting' },
      { type: 'ul', items: [
        'If your dog ignores treats outside, your environment is too exciting. Move somewhere quieter and work back up.',
        'If they hit the end of the leash like a freight train, try turning and walking the other direction instead of stopping — movement resets their attention.',
        "Progress isn't linear. A great Tuesday can be followed by a terrible Wednesday. Stay consistent; the average improves.",
      ] },
    ],
  },
  {
    slug: 'new-to-palm-springs',
    emoji: '🌴',
    title: 'New to Palm Springs: A Dog Dad Starter Guide',
    shortTitle: 'New to Palm Springs',
    category: 'Local Life',
    minutes: 5,
    premium: false,
    description:
      'Just moved to the desert with your dog? Everything to set up in your first month — vet, licenses, parks, and heat prep.',
    body: [
      { type: 'p', text: 'Welcome to the desert. Palm Springs is one of the most dog-friendly small cities anywhere — patios, parks, and a community that treats dogs like family. Here\'s your first-month checklist.' },
      { type: 'h2', text: 'Week 1: The essentials' },
      { type: 'ul', items: [
        'Register with a vet before you need one. See our Resources page for member-recommended clinics, including 24/7 emergency options.',
        "License your dog with Riverside County (required, and it's how a lost dog gets home fast).",
        'Update microchip and tag info with your new address.',
      ] },
      { type: 'h2', text: 'Week 2: Learn the terrain' },
      { type: 'p', text: "Walk your neighborhood early and note the hazards that are new here: rattlesnakes in brushy areas (keep dogs leashed on trails), coyotes at dawn and dusk (small dogs stay close), and cholla cactus that seems magnetically attracted to paws. Carry a comb in your car — it's the tool for flicking cholla out." },
      { type: 'h2', text: 'Week 3: Find your spots' },
      { type: 'p', text: 'Ruth Hardy Park and Demuth Park have off-leash areas. Tahquitz Creek Trail is the best shaded walk in summer. Half the patios on Palm Canyon Drive welcome dogs — our Resources page lists member favorites.' },
      { type: 'h2', text: 'Week 4: Meet people' },
      { type: 'p', text: "Come to a community event. The biweekly morning walk at Ruth Hardy Park is the easiest entry point — show up, say hi, and you'll leave with three new friends and a list of local tips no guide can cover." },
    ],
  },
  {
    slug: 'reliable-recall',
    emoji: '📣',
    title: 'Building a Reliable Recall',
    shortTitle: 'Reliable Recall',
    category: 'Training Basics',
    minutes: 7,
    premium: false,
    description:
      "The one command that can save your dog's life. Train a recall that works even with distractions.",
    body: [
      { type: 'p', text: '"Come" is the most important thing you\'ll ever teach your dog. In the desert — where an open gate can mean a dog loose near a busy road or out into rattlesnake country — a reliable recall isn\'t a nice-to-have.' },
      { type: 'h2', text: 'The golden rule' },
      { type: 'p', text: 'Never call your dog for anything they\'ll dislike. If "come" sometimes means a bath, nail trim, or the end of playtime, the word gets poisoned. Go get them for those things instead. "Come" should predict wonderful things, every single time.' },
      { type: 'h2', text: 'Start indoors' },
      { type: 'ol', items: [
        'Say your dog\'s name + "come!" in a happy voice, once.',
        'The moment they turn toward you, praise enthusiastically.',
        'When they reach you, jackpot: several small treats fed one at a time, plus real celebration.',
        "Release them back to whatever they were doing — coming to you shouldn't end the fun.",
      ] },
      { type: 'h2', text: 'Level up gradually' },
      { type: 'p', text: 'Move from the living room, to the backyard, to the front yard on a long line, to a quiet park on a long line. Each new location, make the rewards better. Only when your dog is 9-for-10 at one level do you move to the next.' },
      { type: 'h2', text: 'The long line is your friend' },
      { type: 'p', text: "A 20- or 30-foot training line lets you practice \"off-leash-feeling\" recalls with a safety net. Don't rush to true off-leash — most dogs need months of long-line success first." },
      { type: 'h2', text: 'Maintenance forever' },
      { type: 'p', text: "Recall isn't trained once; it's maintained. A few surprise recalls a week — each one paid generously — keeps the behavior sharp for life." },
    ],
  },
  {
    slug: 'reactivity-program',
    emoji: '🧠',
    title: 'The 4-Week Leash Reactivity Program',
    shortTitle: 'Reactivity Program',
    category: 'Behavior',
    minutes: 25,
    premium: true,
    description:
      'A structured week-by-week plan for dogs that bark and lunge at other dogs on leash. Our most in-depth guide.',
    body: [
      { type: 'p', text: 'This premium guide walks you through a complete four-week desensitization and counter-conditioning program for leash-reactive dogs — the barking, lunging, hair-trigger behavior that makes walks stressful for both of you.' },
      { type: 'h2', text: "What's inside" },
      { type: 'ul', items: [
        'Week-by-week training plans with specific daily exercises',
        "How to find and work at your dog's threshold distance",
        'The "engage-disengage" game, step by step with progressions',
        'Handling surprise encounters when a dog appears around a corner',
        'Palm Springs-specific practice locations with good sightlines',
        'When to bring in a professional, and how to choose one',
      ] },
    ],
  },
  {
    slug: 'summer-routine-blueprint',
    emoji: '🗓️',
    title: 'The Desert Summer Routine Blueprint',
    shortTitle: 'Summer Routine Blueprint',
    category: 'Health & Safety',
    minutes: 15,
    premium: true,
    description:
      'A complete June-through-September daily schedule: exercise, enrichment, and cooling strategies for 110° months.',
    body: [
      { type: 'p', text: 'This premium guide is a complete daily and weekly routine template for surviving — and enjoying — desert summers with your dog.' },
      { type: 'h2', text: "What's inside" },
      { type: 'ul', items: [
        'Hour-by-hour summer day template (when to walk, when to stay in)',
        '15 indoor enrichment activities ranked by effort and payoff',
        'DIY cooling setups: pools, mats, frozen treats, and misters compared',
        'Breed-specific adjustments for flat-faced and thick-coated dogs',
        'A printable fridge chart of heatstroke warning signs',
      ] },
    ],
  },
]

export const freeGuides = guides.filter(g => !g.premium)
export const premiumGuides = guides.filter(g => g.premium)

export function getGuide(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug)
}

/** The two related guides shown at the bottom of each guide page. */
export function relatedGuides(slug: string): Guide[] {
  return freeGuides.filter(g => g.slug !== slug).slice(0, 2)
}
