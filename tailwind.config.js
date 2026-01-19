/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Cormorant Garamond', 'Georgia', 'serif'],
        'sans': ['Sora', 'system-ui', 'sans-serif'],
        'display': ['Sora', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'obsidian': '#0D0D0D',
        'charcoal': '#1A1A1A',
        'graphite': '#2A2A2A',
        'slate': '#3D3D3D',
        'mist': '#6B6B6B',
        'silver': '#9B9B9B',
        'cloud': '#E5E5E5',
        'ivory': '#F5F5F5',
        'pure': '#FFFFFF',
        'accent': {
          gold: '#C9A962',
          copper: '#B87333',
          sage: '#87A878',
          violet: '#7B68EE',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #2A2A2A 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(201, 169, 98, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      letterSpacing: {
        'widest': '0.2em',
        'ultra': '0.3em',
      },
    },
  },
  plugins: [],
}
