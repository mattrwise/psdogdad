'use client'

import Link from 'next/link'
import { useUser } from '@/lib/useUser'
import type { Guide, GuideBlock } from '@/lib/guides'

function Block({ block }: { block: GuideBlock }) {
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
    default:
      return <p className="text-plum/70 text-[15px] leading-relaxed">{block.text}</p>
  }
}

function FullBody({ body }: { body: GuideBlock[] }) {
  return (
    <div className="space-y-5">
      {body.map((block, i) => <Block key={i} block={block} />)}
    </div>
  )
}

function MembersLock() {
  return (
    <div className="mt-8 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 rounded-b-3xl bg-gradient-to-b from-white/0 to-brand-cream border-t border-plum/20 p-8 text-center">
      <div className="text-3xl mb-3">🔐</div>
      <h3 className="font-extrabold text-plum text-lg mb-2">This guide is for members only</h3>
      <p className="text-plum/60 text-sm mb-5 max-w-sm mx-auto">
        Join free to unlock all member guides — no credit card, no catch.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/members/join" className="btn-primary">Join Free</Link>
        <Link href="/members/login" className="btn-secondary">Sign In</Link>
      </div>
    </div>
  )
}

function PremiumLock() {
  return (
    <div className="mt-8 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 rounded-b-3xl bg-gradient-to-b from-white/0 to-brand-cream border-t border-brand-golden/30 p-8 text-center">
      <div className="text-3xl mb-3">🔒</div>
      <h3 className="font-extrabold text-plum text-lg mb-2">The full guide is part of our premium tier</h3>
      <p className="text-plum/60 text-sm mb-5 max-w-sm mx-auto">
        Premium isn&apos;t open yet. Join free and we&apos;ll email you the moment it launches.
      </p>
      <Link href="/members/join" className="btn-primary">Join Free &amp; Get Notified</Link>
    </div>
  )
}

export default function GuideBody({ guide }: { guide: Guide }) {
  const { user, loading } = useUser()

  // Free guides — always show everything
  if (guide.tier === 'free') {
    return (
      <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
        <FullBody body={guide.body} />
      </article>
    )
  }

  // Premium guides — show preview then lock (auth doesn't matter yet)
  if (guide.tier === 'premium') {
    return (
      <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
        <div className="space-y-5">
          <Block block={guide.body[0]} />
        </div>
        <PremiumLock />
      </article>
    )
  }

  // Members-only guides
  if (loading) {
    return (
      <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
        <div className="space-y-5">
          <Block block={guide.body[0]} />
        </div>
        <div className="mt-8 pt-8 border-t border-plum/10 text-center text-sm text-plum/40 animate-pulse">
          Loading…
        </div>
      </article>
    )
  }

  if (!user) {
    return (
      <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
        <div className="space-y-5">
          <Block block={guide.body[0]} />
        </div>
        <MembersLock />
      </article>
    )
  }

  // Signed-in member — full content
  return (
    <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
      <FullBody body={guide.body} />
    </article>
  )
}
