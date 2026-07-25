import type { Metadata } from 'next'
import Image from 'next/image'
import { Fraunces, Karla } from 'next/font/google'
// Imported (not linked by URL) so Next.js serves it from /_next/static/... —
// middleware.ts redirects every other path back to '/', including plain
// files under /public, so a src="/logo-full.png" string would 404-loop.
import logoFull from '@/public/logo-full.png'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['600'], style: ['normal', 'italic'], variable: '--font-fraunces' })
const karla = Karla({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-karla' })

export const metadata: Metadata = {
  title: 'PS Dog Dad',
  description: 'PS Dog Dad. Something for Palm Springs dog dads is on the way.',
}

export default function Page() {
  return (
    <main
      className={`${fraunces.variable} ${karla.variable} min-h-screen bg-[#F7F2E7] text-[#2E3640] text-[17px] leading-[1.65] flex items-center justify-center`}
      style={{ fontFamily: 'var(--font-karla), system-ui, sans-serif' }}
    >
      <div className="max-w-[460px] mx-auto px-[22px] py-[60px] text-center">

        <Image
          src={logoFull}
          alt="PS Dog Dad"
          priority
          className="w-full max-w-[300px] h-auto block mx-auto mb-[36px]"
        />

        <h1
          className="text-[clamp(1.7rem,6vw,2.3rem)] leading-[1.15] tracking-[-.015em] text-[#3B4754] font-semibold mb-[18px]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          We&apos;re working on something.
        </h1>

        <p className="text-[1.05rem] mx-auto max-w-[24rem] text-[#2E3640] opacity-[.85] mb-[30px]">
          Something for Palm Springs dog dads is on the way. Check back soon.
        </p>

        <p className="text-[.92rem]">
          <a href="mailto:psdogdadmc@gmail.com" className="text-[#5F8D8B] font-bold hover:underline">
            psdogdadmc@gmail.com
          </a>
        </p>

      </div>
    </main>
  )
}
