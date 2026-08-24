/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#081C2E',
          900: '#0C2340',
          800: '#102A43',
          700: '#163B59',
          600: '#1E4D70',
          500: '#2A6490',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#F7F4ED',
          200: '#EDE8DB',
          300: '#DDD5C3',
        },
        copper: {
          50: '#FDF6ED',
          100: '#F5E0C8',
          200: '#EDCCA3',
          300: '#DFB47A',
          400: '#D4A05C',
          500: '#C9823B',
          600: '#B87333',
          700: '#9A5F2A',
          800: '#7C4C22',
          900: '#5E391A',
        },
        gold: {
          50: '#FBF8F1',
          100: '#F0E6CE',
          200: '#E5D4AB',
          300: '#D4BC84',
          400: '#C9A96A',
          500: '#B9955A',
          600: '#A6834D',
          700: '#8A6C40',
          800: '#6E5533',
          900: '#523F26',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'Cambria', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'Cambria', 'serif'],
        body: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-xs': ['1.5rem', { lineHeight: '1.25' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '800px' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'count-up': 'count-up 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
