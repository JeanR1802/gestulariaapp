// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'amor-bg': '#0b1020',
        'amor-card': '#101732',
        'amor-muted': '#9aa3b2',
        'amor-text': '#eef2ff',
        'amor-brand': '#7c5cff',
        'amor-brand-2': '#10e7ff',
        'amor-success': '#16db65',
      },
      borderRadius: {
        '2xl': '24px',
        'xl': '16px',
      },
      boxShadow: {
        'custom': '0 15px 50px rgba(0,0,0,.45)',
      },
      keyframes: {
        'dot-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        'dot-bounce': 'dot-bounce 1.2s infinite ease-in-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /./
    }
  ]
}