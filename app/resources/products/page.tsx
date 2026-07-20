const shoppingTips = [
  { icon: '📏', title: 'Measure first', text: 'Harnesses, crates, and beds are sized by girth and length, not "small/medium/large" vibes. Two minutes with a tape measure saves two returns.' },
  { icon: '⭐', title: 'Read the 3-star reviews', text: 'Five-star reviews are love letters, one-star are rage. The 3-star reviews tell you the honest trade-offs.' },
  { icon: '🧪', title: 'Buy one before buying five', text: 'Test a single bag, toy, or bed before stocking up — your dog gets the final vote, and dogs love vetoing.' },
  { icon: '🏷️', title: 'Ingredients over marketing', text: 'For food and treats, flip the bag over. A named meat first and short ingredient list beats any wolf on the front.' },
  { icon: '🔄', title: 'Check return policies', text: 'Many pet retailers take back opened food and unused gear. Know the policy before you buy — especially for pricey items.' },
  { icon: '💬', title: 'Ask the pack first', text: 'Before any big purchase, search our forums or ask at a meetup. Somebody here has already tried it in desert conditions.' },
]

const categories = [
  {
    icon: '🍖',
    title: 'Food & Treats',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    products: [
      { name: 'Premium Dry Dog Food', price: '$45–$90 / large bag', note: 'Look for AAFCO complete-and-balanced, a named protein first, and a formula matched to your dog’s age and size.' },
      { name: 'Training Treats', price: '$5–$15 / bag', note: 'Pea-sized, soft, and smelly wins training sessions. Keep them under 10% of daily calories.' },
      { name: 'Dental Chews', price: '$15–$35 / month', note: 'Choose VOHC-accepted chews sized for your dog. Daily chewing genuinely slows tartar buildup.' },
    ],
  },
  {
    icon: '🦮',
    title: 'Gear & Equipment',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    products: [
      { name: 'No-Pull Harness', price: '$25–$50', note: 'A front-clip harness redirects pulling without pressure on the throat. Fit it snug — two fingers under every strap.' },
      { name: 'Durable Leash', price: '$15–$40', note: 'A 6-foot flat leash with traffic handle covers 95% of life. Skip retractables near roads — you have no control when it matters.' },
      { name: 'Travel Water Bottle', price: '$12–$25', note: 'Non-negotiable in the desert. The flip-bowl style lets your dog drink anywhere — carry it on every walk May through October.' },
    ],
  },
  {
    icon: '🧸',
    title: 'Toys & Enrichment',
    color: 'border-brand-golden',
    titleColor: 'text-plum',
    products: [
      { name: 'Indestructible Chew Toys', price: '$10–$30', note: '"Indestructible" is a challenge your dog will accept. Buy for power-chewer rating and inspect weekly for damage.' },
      { name: 'Interactive Puzzle Feeder', price: '$15–$45', note: 'Turns dinner into a 20-minute brain workout. Start on easy mode — frustrated dogs quit, successful dogs get hooked.' },
      { name: 'Fetch & Tug Toy', price: '$8–$20', note: 'A dedicated "us" toy that only comes out when you play together makes you the most exciting thing in the yard.' },
    ],
  },
  {
    icon: '🛁',
    title: 'Health & Grooming',
    color: 'border-plum',
    titleColor: 'text-plum',
    products: [
      { name: 'Slicker Brush', price: '$10–$25', note: 'A few minutes weekly cuts shedding dramatically and doubles as bonding time. Undercoat rakes for double-coated breeds.' },
      { name: 'Nail Clippers', price: '$10–$30', note: 'Clippers with a safety guard, or a quiet grinder for wigglers. If you can hear nails on tile, it’s time.' },
      { name: 'Dog Shampoo', price: '$8–$20', note: 'Dog-specific only — human shampoo strips their skin. Oatmeal formulas are gentle for desert-dry coats.' },
    ],
  },
  {
    icon: '😴',
    title: 'Comfort & Rest',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    products: [
      { name: 'Orthopedic Dog Bed', price: '$50–$150', note: 'Real memory foam holds its shape under weight — worth it from puppyhood, essential for seniors and big breeds.' },
      { name: 'Cozy Blanket', price: '$15–$35', note: 'A washable blanket that smells like home makes crates, car rides, and hotel stays instantly familiar.' },
      { name: 'Calming Bed', price: '$30–$80', note: 'The donut-style bolster bed gives anxious dogs something to burrow into. Great for thunder, fireworks, and new-home jitters.' },
    ],
  },
  {
    icon: '🛡️',
    title: 'Safety & ID',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    products: [
      { name: 'Personalized ID Tag', price: '$8–$20', note: 'Name and two phone numbers, checked yearly for legibility. The cheapest insurance you will ever buy — pair it with a microchip.' },
      { name: 'LED Collar Light', price: '$10–$25', note: 'Desert dog walks happen in the dark half the year. A clip-on light makes your dog visible to cars and easy to spot off-leash.' },
      { name: 'GPS Tracker', price: '$30–$100 + subscription', note: 'Real-time location for escape artists and off-leash adventurers. Check battery life and cellular coverage before committing.' },
    ],
  },
]

const budgetTips = [
  'Buy food in the largest bag your dog will finish within 6 weeks — the per-pound savings are real.',
  'Subscribe-and-save programs typically knock 5–15% off recurring items like food and chews.',
  'Rotate two or three toys instead of owning twenty — novelty is free when you swap weekly.',
  'Watch for seasonal sales: pet gear drops hard around holidays and back-to-school.',
  'A DIY snuffle mat or frozen KONG costs pennies and rivals any $40 enrichment toy.',
  'Skip gimmicks; spend where safety lives — harness, ID, and vet fund come before outfits.',
]

const shopUrl = (product: string) =>
  `https://www.google.com/search?tbm=shop&q=${encodeURIComponent('dog ' + product)}`

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h1 className="section-title">Community-Tested Products</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          The gear categories our members reach for every day — and what to look for before you buy.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 mb-10 text-sm text-plum/70">
        <strong className="text-plum">Just so you know:</strong> PS Dog Dad is not affiliated with, sponsored by, or paid by any brand or retailer. These are general recommendations from our community&apos;s experience — the &ldquo;View Options&rdquo; buttons simply open a shopping search so you can compare brands and prices yourself.
      </div>

      {/* Smart shopping tips */}
      <div className="flex items-start gap-3 mb-6 border-l-4 border-brand-teal pl-4">
        <span className="text-3xl flex-shrink-0 mt-0.5">🧠</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-teal">Smart Shopping Tips</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {shoppingTips.map(t => (
          <div key={t.title} className="card p-5">
            <div className="text-3xl mb-2">{t.icon}</div>
            <h3 className="font-extrabold text-plum text-base mb-1">{t.title}</h3>
            <p className="text-sm text-plum/60 leading-relaxed">{t.text}</p>
          </div>
        ))}
      </div>

      {/* Product categories */}
      <div className="space-y-12 mb-14">
        {categories.map(cat => (
          <div key={cat.title}>
            <div className={`flex items-start gap-3 mb-5 border-l-4 ${cat.color} pl-4`}>
              <span className="text-3xl flex-shrink-0 mt-0.5">{cat.icon}</span>
              <h2 className={`text-xl sm:text-2xl font-extrabold ${cat.titleColor}`}>{cat.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cat.products.map(p => (
                <div key={p.name} className="card p-5 flex flex-col hover:-translate-y-0.5">
                  <h3 className="font-extrabold text-plum text-base">{p.name}</h3>
                  <p className="text-sm font-semibold text-brand-orange mt-1">{p.price}</p>
                  <p className="text-sm text-plum/60 leading-relaxed mt-2 flex-1">{p.note}</p>
                  <a
                    href={shopUrl(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm text-center mt-4"
                  >
                    View Options ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Budget tips */}
      <div className="bg-plum rounded-3xl p-6 sm:p-10 text-white">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💰</div>
          <h2 className="text-2xl font-extrabold">Dog Dad on a Budget</h2>
          <p className="text-white/60 text-sm mt-2">Spoiling them doesn&apos;t have to break you.</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-4xl mx-auto">
          {budgetTips.map(tip => (
            <li key={tip} className="flex gap-3 text-sm leading-relaxed text-white/90">
              <span className="text-brand-golden flex-shrink-0">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
