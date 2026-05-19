import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#3D1A5C',
          light: '#5C2D8A',
          dark: '#2A1140',
        },
        brand: {
          orange: '#E8621A',
          'orange-light': '#F07840',
          golden: '#F5B82A',
          'golden-light': '#F9CC6A',
          teal: '#2A9D8F',
          'teal-light': '#3BBFAF',
          cream: '#FFF8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #3D1A5C 0%, #5C2D8A 40%, #E8621A 100%)',
        'card-gradient': 'linear-gradient(135deg, #3D1A5C, #2A9D8F)',
      },
    },
  },
  plugins: [],
}
export default config
