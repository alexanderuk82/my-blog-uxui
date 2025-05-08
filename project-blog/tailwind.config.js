/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      maxWidth: {
        'container': '1440px',
      },
      padding: {
        'content-x': '96px',
        'content-y': '48px',
      },
      colors: {
        surface: 'var(--color-surface)',
        background: 'var(--color-background)',
        keyline: 'var(--color-keyline)',
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '32': '32px',
        '64': '64px',
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};