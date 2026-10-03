import type { Config } from 'tailwindcss'
import { brand } from './lib/brand'

const c = brand.colors

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        plum: { DEFAULT: c.plum, light: c.plumLight, dark: c.plumDark },
        brand: {
          orange: c.primary,
          'orange-light': c.primaryLight,
          golden: c.accent,
          'golden-light': c.accentLight,
          teal: c.secondary,
          'teal-light': c.secondaryLight,
          cream: c.cream,
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': `linear-gradient(135deg, ${c.plum} 0%, ${c.plumLight} 40%, ${c.primary} 100%)`,
        'card-gradient': `linear-gradient(135deg, ${c.plum}, ${c.secondary})`,
      },
    },
  },
  plugins: [],
}
export default config
