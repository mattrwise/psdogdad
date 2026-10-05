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
  /** One short line (about 22 characters) for the compact phone card. */
  short: string
  pages: number
  price: number
  cover: string
  /** The Payhip product code: the last part of payhip.com/b/<code>. */
  product: string
}

export const kits: Kit[] = [
  {
    slug: 'separation-anxiety',
    title: 'Separation Anxiety Workbook',
    short: 'A 14-day calm plan',
    blurb: 'A fourteen day plan for dogs who panic when you leave, with scripts and a progress log.',
    pages: 17,
    price: 9,
    cover: '/kits/separation-anxiety.jpg',
    product: 'u9W24',
  },
  {
    slug: 'when-company-comes',
    title: 'When Company Comes',
    short: 'A calm guest plan',
    blurb: 'A calm visitor plan for dogs who bark, lunge, or nip when people come over.',
    pages: 8,
    price: 9,
    cover: '/kits/when-company-comes.jpg',
    product: 'tAeTo',
  },
  {
    slug: 'starter-kit',
    title: 'New PS Dog Dad Starter Kit',
    short: 'Your first 30 days',
    blurb: 'Your first 30 days with a rescue: day one, week one, and every week after.',
    pages: 19,
    price: 9,
    cover: '/kits/starter-kit.jpg',
    product: 'u3Loi',
  },
  {
    slug: 'desert-dog',
    title: 'Desert Dog',
    short: 'Heat, snakes, safety',
    blurb: 'Heat, snakes, valley fever, emergency numbers, and where to go when it is 118.',
    pages: 30,
    price: 12,
    cover: '/kits/desert-dog.jpg',
    product: 'SFaHr',
  },
  {
    slug: 'reliable-recall',
    title: 'Building a Reliable Recall',
    short: 'Come when called',
    blurb: 'A four week plan for a dog who comes when called, five minutes at a time.',
    pages: 13,
    price: 9,
    cover: '/kits/reliable-recall.jpg',
    product: '4Ungm',
  },
  {
    slug: 'training-techniques',
    title: 'Training Techniques',
    short: 'Train in 5 min a day',
    blurb: 'The complete guide to training your dog at home in five minutes a day, with five printable pages.',
    pages: 20,
    price: 15,
    cover: '/kits/training-techniques.jpg',
    product: 'Qvcr7',
  },
]

// All six PDFs in one ordinary Payhip product. It was a Payhip "bundle" for
// about an afternoon; Payhip's on-site checkout does not work for bundles, so
// it became a plain digital product holding the kit files instead.
export const bundle = {
  title: 'The PS Dog Dad Guide Library',
  blurb: 'All six guides in one download.',
  short: 'All six, one download',
  price: 39,
  product: 'eMf21',
}

/** What the six cost bought one at a time, so the bundle saving is never typed by hand. */
export const kitsTotal = kits.reduce((sum, k) => sum + k.price, 0)
