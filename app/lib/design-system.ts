// app/lib/design-system.ts

export const COLOR_PALETTES = [
    {
        id: 'ocean',
        name: 'Océano Profundo',
        colors: ['#0f172a', '#3b82f6', '#eff6ff'], // Primary (Dark), Accent (Blue), Bg (Light)
        cssVars: { '--primary': '#0f172a', '--accent': '#3b82f6', '--bg': '#eff6ff' }
    },
    {
        id: 'sunset',
        name: 'Atardecer',
        colors: ['#431407', '#f97316', '#fff7ed'], // Primary (Brown), Accent (Orange), Bg (Warm)
        cssVars: { '--primary': '#431407', '--accent': '#f97316', '--bg': '#fff7ed' }
    },
    {
        id: 'forest',
        name: 'Bosque',
        colors: ['#064e3b', '#10b981', '#ecfdf5'], // Primary (Green), Accent (Emerald), Bg (Mint)
        cssVars: { '--primary': '#064e3b', '--accent': '#10b981', '--bg': '#ecfdf5' }
    },
    {
        id: 'berry',
        name: 'Frutos Rojos',
        colors: ['#881337', '#e11d48', '#fff1f2'], // Primary (Rose), Accent (Pink), Bg (Rose light)
        cssVars: { '--primary': '#881337', '--accent': '#e11d48', '--bg': '#fff1f2' }
    },
    {
        id: 'mono',
        name: 'Minimalista',
        colors: ['#000000', '#666666', '#ffffff'],
        cssVars: { '--primary': '#000000', '--accent': '#666666', '--bg': '#ffffff' }
    }
];

export const FONT_PAIRS = [
    { id: 'modern', name: 'Modern Sans', title: 'Inter', body: 'Inter' },
    { id: 'elegant', name: 'Editorial Serif', title: 'Playfair Display', body: 'Lato' },
    { id: 'tech', name: 'Tech Mono', title: 'Space Grotesk', body: 'Roboto' },
    { id: 'friendly', name: 'Amigable', title: 'Quicksand', body: 'Nunito' }
];