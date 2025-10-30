/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'forest': '#456456',
        'mint': '#7FB685',
        'bright-green': '#8BC490',
        'peach': '#F9B384',
        'bright-orange': '#F5A65B',
        'cream': '#FDF5E6',
        'white': '#FFFFFF',
        'dark-green': '#2F4538',
        'light-mint': '#E8F5E9',
        'warm-gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      letterSpacing: {
        'relaxed': '0.025em',
        'loose': '0.05em',
      },
    },
  },
  plugins: [],
}

