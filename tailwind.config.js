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
        'sans': ['Inter', 'Neue Haas Grotebok', 'system-ui', 'sans-serif'],
      },
      colors: {
        'charcoal': '#111111',
        'sand': '#f3efe9',
        'cream': '#faf9f6',
        'rust': '#c36a2d',
        'sage': '#a4b494',
        'warm-gray': {
          50: '#faf9f6',
          100: '#f3efe9',
          200: '#e8e3db',
          300: '#d4cfc7',
          400: '#b8b3ab',
          500: '#9c9790',
          600: '#7a7570',
          700: '#5a5653',
          800: '#3a3835',
          900: '#1a1917',
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

