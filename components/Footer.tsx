import Link from 'next/link'

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
              Palm Springs&apos; community for gay men and their dogs. Connect, share, and wag together.
            </p>
            <div className="flex gap-4 mt-4">
              {['📘', '📸', '🐦'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-brand-orange rounded-full flex items-center justify-center transition-colors text-sm">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2 text-sm">
              {[['Training', '/training'], ['Forums', '/forums'], ['Members', '/members'], ['Events', '/events'], ['Resources', '/resources']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand-orange transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">About</h4>
            <ul className="space-y-2 text-sm">
              {[['About Us', '/about'], ['Code of Conduct', '/conduct'], ['Privacy Policy', '/privacy'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand-orange transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-xs text-center text-white/40">
          © {new Date().getFullYear()} PS Dog Dad · Palm Springs, CA · Made with 🐾 and ☀️
        </div>
      </div>
    </footer>
  )
}
