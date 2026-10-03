import { IS_DEMO } from '@/lib/brand'

/** Shown on every page of the demo, nowhere on the live site. */
export default function DemoBanner() {
  if (!IS_DEMO) return null
  return (
    <div
      role="note"
      className="bg-plum-dark text-white text-center text-xs font-semibold py-1.5 px-4"
    >
      Demo site with sample content.
    </div>
  )
}
