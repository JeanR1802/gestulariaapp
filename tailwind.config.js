/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Asegúrate de que estas variables estén definidas en tu app/layout.tsx
        sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui'],
        brand: ['var(--font-oswald)', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Colores del tema Alive
        brand: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          success: '#10b981'
        },
        alive: {
          dark: '#020617', // Midnight Nebula base
          light: '#f8fafc', // Soft Porcelain base
        }
      },
      backgroundImage: {
        'alive-dark': "radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.1), transparent 25%)",
        'alive-light': "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.05), transparent 40%)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}