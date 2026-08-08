/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05070d',
          900: '#0a0f1a',
          850: '#0d1420',
          800: '#111b2e',
          700: '#16223a',
          600: '#1b2740',
          500: '#243352',
        },
        accent: {
          DEFAULT: '#2f6fed',
          50: '#eaf1ff',
          100: '#d5e3ff',
          200: '#aac6ff',
          300: '#7fa9ff',
          400: '#5ea1ff',
          500: '#2f6fed',
          600: '#2559c4',
          700: '#1c449b',
          800: '#152f6e',
          900: '#0f1f4a',
        },
        success: { DEFAULT: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        danger: { DEFAULT: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
        warning: { DEFAULT: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(47,111,237,0.35), 0 0 24px -4px rgba(47,111,237,0.45)',
      },
      backgroundImage: {
        'grid-dots': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-sm': '14px 14px',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.97)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        scaleIn: 'scaleIn 0.18s ease-out',
      },
    },
  },
  plugins: [],
}
