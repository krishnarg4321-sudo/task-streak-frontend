/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#E2D9FC',        // Lavender base background from reference
          card: '#FFFFFF',
          dark: '#111827',
          black: '#000000',
          peach: '#FFE2CA',     // Warm cream peach header button
          peachDark: '#FDBA74',
          mint: '#D1FADF',      // Soft mint card background
          mintDark: '#86EFAC',
          yellow: '#FEF08A',    // Sticky yellow
          pink: '#FBCFE8',      // Sticky pink
          blue: '#BAE6FD',      // Sticky blue
          purple: '#DDD6FE',    // Sticky purple
          green: '#BBF7D0',     // Sticky green
        }
      },
      boxShadow: {
        'neo': '3.5px 3.5px 0px #000000',
        'neo-sm': '2px 2px 0px #000000',
        'neo-lg': '6px 6px 0px #000000',
        'neo-xl': '8px 8px 0px #000000',
        'neo-inner': 'inset 2px 2px 0px #000000',
      },
      borderRadius: {
        'neo': '18px',
        'neo-lg': '26px',
        'neo-xl': '32px',
      },
      borderWidth: {
        'neo': '2.5px',
        '3': '3px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}