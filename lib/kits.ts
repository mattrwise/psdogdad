// The printable kits sold through the Payhip store.
//
// These are the one thing on the site that costs money, so the prices live in
// exactly one place. Payhip is the source of truth for what a buyer is actually
// charged; when a price changes there, change it here in the same sitting.
//
// Launch prices run through Sunday, October 11, 2026. On the 12th the singles
// go to $12, Desert Dog to $19, and the bundle to $39.

export type Kit = {
  slug: string
  title: string
  blurb: string
  pages: number
  price: number
  cover: string
  href: string
}

export const kits: Kit[] = [
  {
    slug: 'separation-anxiety',
    title: 'Separation Anxiety Workbook',
    blurb: 'A fourteen day plan for dogs who panic when you leave, with scripts and a progress log.',
    pages: 17,
    price: 9,
    cover: '/kits/separation-anxiety.jpg',
    href: 'https://payhip.com/b/u9W24',
  },
  {
    slug: 'when-company-comes',
    title: 'When Company Comes',
    blurb: 'A calm visitor plan for dogs who bark, lunge, or nip when people come over.',
    pages: 8,
    price: 9,
    cover: '/kits/when-company-comes.jpg',
    href: 'https://payhip.com/b/tAeTo',
  },
  {
    slug: 'starter-kit',
    title: 'New PS Dog Dad Starter Kit',
    blurb: 'Your first 30 days with a rescue: day one, week one, and every week after.',
    pages: 19,
    price: 9,
    cover: '/kits/starter-kit.jpg',
    href: 'https://payhip.com/b/u3Loi',
  },
  {
    slug: 'desert-dog',
    title: 'Desert Dog',
    blurb: 'Heat, snakes, valley fever, emergency numbers, and where to go when it is 118.',
    pages: 30,
    price: 12,
    cover: '/kits/desert-dog.jpg',
    href: 'https://payhip.com/b/SFaHr',
  },
  {
    slug: 'reliable-recall',
    title: 'Building a Reliable Recall',
    blurb: 'A four week plan for a dog who comes when called, five minutes at a time.',
    pages: 13,
    price: 9,
    cover: '/kits/reliable-recall.jpg',
    href: 'https://payhip.com/b/4Ungm',
  },
]

export const bundle = {
  title: 'The PS Dog Dad Guide Library',
  blurb: 'All five kits in one download.',
  price: 29,
  href: 'https://payhip.com/b/Pld5o',
}

/** What the five cost bought one at a time, so the bundle saving is never typed by hand. */
export const kitsTotal = kits.reduce((sum, k) => sum + k.price, 0)
