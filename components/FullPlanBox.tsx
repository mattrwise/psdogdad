import { kits } from '@/lib/kits'
import KitLink from '@/components/KitLink'

/**
 * "Want the full plan?" box for the bottom of a free guide, pointing at the
 * kit that goes deeper on the same subject. Navigation and a sales pitch, so
 * it stays off the paper.
 */
export default function FullPlanBox({ kit: slug, label }: { kit: string; label: string }) {
  const kit = kits.find(k => k.slug === slug)
  if (!kit) return null
  return (
    <div className="mt-10 rounded-2xl bg-plum p-6 sm:p-8 text-white text-center no-print">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Want the full plan?</h2>
      <KitLink product={kit.product} className="btn-primary text-base px-8">
        {label}
      </KitLink>
    </div>
  )
}
