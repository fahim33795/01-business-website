/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        syvora: {
          ivory: '#FDFBF7',
          'ivory-dark': '#F4EFE6',
          champagne: '#F4EBE1',
          blush: '#F5E6E8',
          'blush-soft': '#FAF0F2',
          rose: '#D4A373',
          'rose-dark': '#C68B59',
          charcoal: '#1A1A1A',
          'charcoal-light': '#2D2D2D',
          muted: '#8C857B',
          border: '#E6E0D6',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'luxury': '0 20px 40px -15px rgba(212, 163, 115, 0.15)',
        'float': '0 15px 35px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}
