// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        brand: ['var(--font-oswald)', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Colores existentes de Gestularia
        'gestularia-bg': '#0D1222',
        'gestularia-card': '#111933',
        'gestularia-muted': '#8A94A6',
        'gestularia-text': '#EAF0FF',
        'gestularia-brand': '#4A90E2',
        'gestularia-brand-2': '#50E3C2',
        'gestularia-success': '#16db65',
        // Nuevos colores del tema Alive
        brand: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          success: '#10b981'
        },
        slate: {
          950: '#020617', // Midnight Nebula base
        }
      },
      backgroundImage: {
        'alive-dark': "radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.1), transparent 25%)",
        'alive-light': "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.05), transparent 40%)",
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
        'highlight-pulse': {
          '0%': {
            'box-shadow': '0 0 0 4px rgba(59, 130, 246, 0.4)',
            'background-color': 'rgba(59, 130, 246, 0.05)'
          },
          '70%': {
            'box-shadow': '0 0 0 4px rgba(59, 130, 246, 0)',
            'background-color': 'rgba(59, 130, 246, 0)'
          },
          '100%': {
            'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)',
            'background-color': 'transparent'
          }
        },
      },
      animation: {
        'dot-bounce': 'dot-bounce 1.2s infinite ease-in-out',
        'highlight': 'highlight-pulse 1.5s ease-out',
      },
    },
  },
  safelist: [
    'bg-blue-600', 'text-white', 'bg-white', 'text-slate-800', 'text-slate-900', 'text-slate-600',
    'bg-slate-800', 'bg-slate-900', 'text-blue-600', 'bg-blue-50', 'bg-slate-50', 'bg-slate-100',
    'bg-yellow-400/90', 'text-blue-900', 'hover:bg-slate-100', 'hover:text-white'
  ],
  plugins: [require("tailwindcss-animate")],
}