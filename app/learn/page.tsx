import { brand } from '@/lib/brand'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { kits, bundle, kitsTotal, type Kit } from '@/lib/kits'
import KitLink from '@/components/KitLink'

export const metadata: Metadata = {
  title: `Printable Kits, ${brand.name}`,
  description:
    `Printable plans, checklists, scripts and logs for ${brand.city} area ${brand.members}. Instant PDF download.`,
}

/**
 * The paid kits, and nothing else. The free written guides live at /guides.
 * This page keeps the /learn address because the old kit links, the redirects
 * in next.config.js and the sitemap all point at it.
 */

/**
 * The orange buy button. One class string so every kit and the bundle match,
 * and so the button stays a 44px-tall tap target on a phone.
 */
const buyButton =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brand-orange px-3 sm:px-4 min-h-[44px] text-[13px] sm:text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-orange-light'

/**
 * A kit is a thing you buy, so its card says so: the whole cover, the title,
 * a line about it, and a "Buy now" button with the price on it. On a phone it
 * is a compact horizontal row (small cover, text, button); from `sm` up it is a
 * vertical card. The whole cover is always shown. Plain <img> rather than
 * next/image because these are six small static covers.
 */
function KitCard({ kit }: { kit: Kit }) {
  return (
    <div className="card h-full flex flex-row sm:flex-col items-center sm:items-stretch gap-2.5 sm:gap-0 p-3 sm:p-0 min-h-[108px] sm:min-h-0">
      {/* A fixed box with the whole cover scaled to fit inside it, so nothing
          is ever cropped and every card is the same height whatever shape the
          cover is. The cream matches the covers' own paper. */}
      <KitLink
        product={kit.product}
        className="flex items-center justify-center bg-brand-cream flex-shrink-0 w-16 h-[84px] sm:w-full sm:h-64 sm:p-3 overflow-hidden rounded-lg sm:rounded-none sm:border-b border-plum/10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kit.cover}
          alt={`Cover of ${kit.title}`}
          width={600}
          height={776}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </KitLink>
      <div className="min-w-0 flex-1 sm:px-4 sm:py-3 sm:flex sm:flex-col">
        <h3 className="font-extrabold text-plum text-[15px] leading-snug sm:text-base">{kit.title}</h3>
        <p className="truncate text-xs text-plum/60 sm:hidden">{kit.short}</p>
        <p className="hidden sm:block line-clamp-3 text-sm text-plum/60 leading-snug mt-0.5 flex-1">{kit.blurb}</p>
        <div className="hidden sm:flex items-center justify-between gap-3 mt-2">
          <span className="text-xs text-plum/50">{kit.pages} pages</span>
          <KitLink product={kit.product} className={buyButton}>
            Buy now · ${kit.price}
          </KitLink>
        </div>
        <p className="text-[11px] text-plum/40 sm:hidden">{kit.pages} pages</p>
      </div>
      <KitLink product={kit.product} className={`${buyButton} sm:hidden`}>
        Buy now · ${kit.price}
      </KitLink>
    </div>
  )
}

/** The bundle, featured above the single kits. */
function BundleCard() {
  return (
    <div className="mb-4 rounded-2xl bg-plum p-4 text-white ring-2 ring-brand-golden shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge bg-brand-golden text-plum">Best value</span>
            <h3 className="font-extrabold text-base sm:text-lg leading-snug">{bundle.title}</h3>
          </div>
          <p className="text-xs sm:text-sm text-white/70 mt-0.5">
            {bundle.blurb} <span className="hidden sm:inline">Bought one at a time they come to ${kitsTotal}.</span>
            <span className="sm:hidden">Separately ${kitsTotal}.</span>
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex -space-x-2" aria-hidden="true">
            {kits.map(kit => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={kit.slug}
                src={kit.cover}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 rounded-md border-2 border-plum object-cover object-top"
              />
            ))}
          </div>
          <KitLink product={bundle.product} className={buyButton}>
            Buy now · ${bundle.price}
          </KitLink>
        </div>
      </div>
    </div>
  )
}

export default function LearnPage() {
  // The kits link to the real site's checkout, so the demo has nothing to show
  // here. Send it to the guides instead of an empty page.
  if (brand.isDemo) redirect('/guides')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div id="printable-kits" className="mb-4 scroll-mt-24">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-plum">Printable Kits</h1>
      </div>

      <BundleCard />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
        {kits.map(kit => (
          <KitCard key={kit.slug} kit={kit} />
        ))}
      </div>

      <p className="text-sm mb-6">
        <a
          href="/kits/training-techniques-free-sample.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-teal font-semibold hover:underline"
        >
          Not sure yet? Download a free sample.
        </a>
      </p>

      <p className="text-plum/50 text-xs mb-14">
        Launch prices through Sunday, October 11. General education, not veterinary or
        behavior advice.
      </p>
    </div>
  )
}
