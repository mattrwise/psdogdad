import Link from 'next/link'
import type { PostBlock } from '@/lib/posts'

/** Anything that is not an in-app route opens in a new tab. */
function isExternal(href: string) {
  return !href.startsWith('/')
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-xl font-extrabold text-plum pt-3">{block.text}</h2>

    case 'ul':
      return (
        <ul className="list-disc pl-5 space-y-2 text-plum/70 text-[15px] leading-relaxed">
          {block.items.map(item => <li key={item}>{item}</li>)}
        </ul>
      )

    case 'ol':
      return (
        <ol className="list-decimal pl-5 space-y-2 text-plum/70 text-[15px] leading-relaxed">
          {block.items.map(item => <li key={item}>{item}</li>)}
        </ol>
      )

    case 'callout': {
      const urgent = block.tone === 'urgent'
      return (
        <div
          className={`rounded-2xl border-l-4 p-5 ${
            urgent ? 'border-red-400 bg-red-50' : 'border-brand-teal bg-brand-teal/5'
          }`}
        >
          <p className={`font-extrabold text-sm mb-1.5 ${urgent ? 'text-red-700' : 'text-brand-teal'}`}>
            {urgent ? '⚠️ ' : '💡 '}{block.title}
          </p>
          <p className="text-plum/75 text-[15px] leading-relaxed">{block.text}</p>
        </div>
      )
    }

    case 'links':
      return (
        <ul className="space-y-3">
          {block.items.map(item => (
            <li key={item.href + item.label}>
              {isExternal(item.href) ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-teal hover:underline text-[15px]"
                >
                  {item.label} ↗
                </a>
              ) : (
                <Link href={item.href} className="font-bold text-brand-teal hover:underline text-[15px]">
                  {item.label} →
                </Link>
              )}
              {item.note && <p className="text-plum/60 text-sm mt-0.5">{item.note}</p>}
            </li>
          ))}
        </ul>
      )

    default:
      return <p className="text-plum/70 text-[15px] leading-relaxed">{block.text}</p>
  }
}

/**
 * Posts are open to everyone, member account or not. The training guides have
 * tiers; this does not, because the whole point of the summer run is that it
 * gets found by people who have never heard of us.
 */
export default function PostBody({ body }: { body: PostBlock[] }) {
  return (
    <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
      <div className="space-y-5">
        {body.map((block, i) => <Block key={i} block={block} />)}
      </div>
    </article>
  )
}
