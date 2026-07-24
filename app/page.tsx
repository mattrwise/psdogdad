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
  title: 'Founding Member | PS Dog Dad',
  description: 'Fifty founding memberships for PS Dog Dad. Three guides, the Palm Springs resources list, founding status locked in, and direct email access. $49.',
}

// Update this by hand when someone buys — nothing else drives it, there's no
// backend tracking real Stripe purchases yet.
const TOTAL_SPOTS = 50
const CLAIMED = 0

const WHAT_YOU_GET = [
  {
    icon: 'M6.5 6a2.5 2.5 0 1 1 1.9 2.4l.6.6h6l.6-.6A2.5 2.5 0 1 1 18 9.4l-.6.6.6.6a2.5 2.5 0 1 1-2.4 1.9l-.6-.6H9l-.6.6A2.5 2.5 0 1 1 6 10.6l.6-.6-.6-.6A2.5 2.5 0 0 1 6.5 6Z',
    title: 'Three guides, right away',
    desc: 'Separation anxiety, dog nutrition, and the symptoms that mean call the vet now.',
  },
  {
    icon: 'M12 2c3.9 0 7 3 7 6.8 0 4.9-5.3 10.9-6.4 12.1a.8.8 0 0 1-1.2 0C10.3 19.7 5 13.7 5 8.8 5 5 8.1 2 12 2Zm0 4.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z',
    title: 'The Palm Springs resources list',
    desc: 'Vets, groomers, boarding, emergency numbers. Real ones, with phone numbers that work.',
  },
  {
    icon: 'M12 2.6l2.7 5.7 6.3.9-4.6 4.4 1.1 6.2-5.5-2.9-5.5 2.9L7.6 13.6 3 9.2l6.3-.9L12 2.6Z',
    title: 'Founding status, locked in',
    desc: 'When the full community opens, you are already in, at this rate, permanently.',
  },
  {
    icon: 'M3.5 5.5h17c.6 0 1 .4 1 1v11c0 .6-.4 1-1 1h-17c-.6 0-1-.4-1-1v-11c0-.6.4-1 1-1Zm1.6 2L12 12.4 18.9 7.5H5.1Z',
    title: 'My actual email address',
    desc: 'Not a help desk. You write, I write back.',
  },
]

export default function Page() {
  const left = TOTAL_SPOTS - CLAIMED

  return (
    <main
      className={`${fraunces.variable} ${karla.variable} min-h-screen bg-[#F7F2E7] text-[#2E3640] text-[17px] leading-[1.65]`}
      style={{ fontFamily: 'var(--font-karla), system-ui, sans-serif' }}
    >
      <div className="max-w-[660px] mx-auto px-[22px]">

        {/* Header */}
        <header className="pt-11 pb-2 text-center">
          <Image
            src={logoFull}
            alt="PS Dog Dad"
            priority
            className="w-full max-w-[330px] h-auto block mx-auto"
          />
        </header>

        {/* Hero */}
        <div className="pt-[30px] pb-[44px] text-center border-b border-[#2E3640]/[.14]">
          <p className="text-[12.5px] tracking-[.16em] uppercase font-bold text-[#5F8D8B] mb-[18px]">
            Founding Membership
          </p>
          <h1
            className="text-[clamp(2.1rem,7vw,3.05rem)] leading-[1.12] tracking-[-.015em] text-[#3B4754] font-semibold mb-[18px]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            Fifty spots. Then it <em className="italic text-[#C9A24B]">closes</em>.
          </h1>
          <p className="text-[1.09rem] mx-auto max-w-[30rem] text-[#2E3640]">
            PS Dog Dad opens this year. Fifty people get in first, at a price that never goes up, and they help shape what it becomes.
          </p>
        </div>

        {/* What you get today */}
        <section className="py-11 border-b border-[#2E3640]/[.14]">
          <h2
            className="text-[1.45rem] font-semibold text-[#3B4754] tracking-[-.01em] mb-[22px]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            What you get today
          </h2>
          <ul className="list-none m-0 p-0">
            {WHAT_YOU_GET.map((item, i) => (
              <li
                key={item.title}
                className={`flex items-start gap-[15px] py-[15px] border-t border-[#2E3640]/[.14] ${i === 0 ? 'border-t-0 pt-0' : ''}`}
              >
                <svg className="flex-none w-[22px] h-[22px] mt-[3px] text-[#C9A24B]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={item.icon} />
                </svg>
                <div>
                  <strong className="block font-bold text-[#3B4754]">{item.title}</strong>
                  <span className="block text-[.96rem] text-[#2E3640] opacity-[.85]">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* How many are left */}
        <section className="py-11 border-b border-[#2E3640]/[.14]">
          <h2
            className="text-[1.45rem] font-semibold text-[#3B4754] tracking-[-.01em] mb-[22px]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            How many are left
          </h2>
          {/* To update: change CLAIMED at the top of this file. Nothing else. */}
          <div
            className="mb-[14px] flex flex-wrap gap-[7px] justify-center"
            role="img"
            aria-label={`${left} of ${TOTAL_SPOTS} founding spots still open`}
          >
            {Array.from({ length: TOTAL_SPOTS }, (_, i) => (
              <span
                key={i}
                className={`w-[15px] h-[15px] rounded-full border-[1.5px] border-[#C9A24B] ${i < CLAIMED ? 'bg-[#C9A24B]' : ''}`}
              />
            ))}
          </div>
          <p className="text-center text-[.93rem] tracking-[.03em] text-[#2E3640] opacity-80">
            <b className="text-[#3B4754]">{left}</b> of {TOTAL_SPOTS} spots still open
          </p>
        </section>

        {/* Offer / CTA */}
        <div className="py-[46px] text-center">
          <p
            className="text-[3.4rem] font-bold text-[#3B4754] leading-none tracking-[-.02em] mb-[6px]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            $49
          </p>
          <p className="text-[.97rem] opacity-80 mb-[30px]">One time. Not a subscription. Nothing renews.</p>
          <a
            href="https://buy.stripe.com/14A3cw1F74y1fX64Pud7q00"
            className="inline-block bg-[#3B4754] text-[#F7F2E7] font-bold text-[1.06rem] tracking-[.02em] py-[17px] px-10 rounded-[3px] no-underline border-[1.5px] border-[#3B4754] transition-colors duration-[180ms] motion-reduce:transition-none hover:bg-[#C9A24B] hover:border-[#C9A24B] hover:text-[#2E3640] focus-visible:bg-[#C9A24B] focus-visible:border-[#C9A24B] focus-visible:text-[#2E3640] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#5F8D8B] focus-visible:outline-offset-[3px]"
          >
            Become a founding member
          </a>
          <p className="mt-4 text-[.86rem] opacity-70">Secure checkout through Stripe. Your guides arrive by email.</p>
        </div>

        {/* Why I am doing this */}
        <section className="py-11 border-b border-[#2E3640]/[.14]">
          <h2
            className="text-[1.45rem] font-semibold text-[#3B4754] tracking-[-.01em] mb-[22px]"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            Why I am doing this
          </h2>
          <p className="mb-[15px]">
            I adopted a small tan Chiweenie named Lucy and found out fast how much nobody tells you. Not the training part. The other part. What to do at 2am when something is wrong, who to call, and how to keep going on the days it feels like too much.
          </p>
          <p className="mb-[15px]">
            PS Dog Dad is the thing I wanted when I started. It is being built here in Palm Springs, by one person, slowly and carefully.
          </p>
          <p className="mb-[15px]">
            Fifty founding members is not a marketing number. It is how many people I can actually answer.
          </p>
          <p
            className="italic text-[1.1rem] text-[#3B4754] mb-0"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            Matt and Lucy
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-[34px] pb-[50px] text-center text-[.86rem] opacity-[.68]">
          <p>
            PS Dog Dad · Palm Springs, California
            <br />
            Questions before you join?{' '}
            <a href="mailto:psdogdadmc@gmail.com" className="text-[#5F8D8B] hover:underline">
              psdogdadmc@gmail.com
            </a>
          </p>
        </footer>

      </div>
    </main>
  )
}
