import Link from 'next/link'
import { DIRECTORY_IS_PUBLIC } from '@/lib/pros'

export default function Footer() {
  return (
    <footer className="bg-plum-dark text-white/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <div>
                <span className="font-extrabold text-white text-xl">PS</span>
                <span className="font-extrabold text-brand-teal text-xl"> DOG </span>
                <span className="font-extrabold text-brand-orange text-xl">DAD</span>
              </div>
            </div>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              The Coachella Valley community for gay men and their dogs. Connect, share, and wag together.
            </p>
          </div>

          <div>
            {/* "Explore" rather than "Community", which is now the name of one
                of the sections listed underneath it. The list matches the nav,
                in the same order, because a footer that files the site
                differently from the header is its own small confusion. */}
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Explore</h4>
            {/* No space-y: each row is a 44px tap target and carries its own
                height. Stacked gaps on top of that just spread the footer out. */}
            <ul className="text-sm">
              {[['Start Here', '/learn/roadmap'], ['Learn', '/learn'], ['Local', '/local'], ...(DIRECTORY_IS_PUBLIC ? [['Dog Pros', '/pros']] : []), ['Community', '/forums'], ['Events', '/events']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center min-h-[44px] hover:text-brand-orange transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">About</h4>
            {/* No space-y: each row is a 44px tap target and carries its own
                height. Stacked gaps on top of that just spread the footer out. */}
            <ul className="text-sm">
              {[['About Us', '/about'], ['Code of Conduct', '/conduct'], ['List Your Services', '/pros/list'], ['Privacy Policy', '/privacy'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center min-h-[44px] hover:text-brand-orange transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-xs text-center text-white/40">
          © {new Date().getFullYear()} PS Dog Dad · Coachella Valley, CA · Made with 🐾 and ☀️
        </div>
      </div>
    </footer>
  )
}
