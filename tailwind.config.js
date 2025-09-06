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
        'gestularia-bg': '#0D1222',       // Un azul noche más profundo y corporativo
        'gestularia-card': '#111933',     // Tarjetas con un tono ligeramente más claro
        'gestularia-muted': '#8A94A6',    // Texto secundario con buena legibilidad
        'gestularia-text': '#EAF0FF',      // Texto principal casi blanco para alto contraste
        'gestularia-brand': '#4A90E2',   // Azul principal (profesional y confiable)
        'gestularia-brand-2': '#50E3C2',  // Acento Teal/Verde (para crecimiento e innovación)
        'gestularia-success': '#16db65',
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
    },
  },
  plugins: [],
}