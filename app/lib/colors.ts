// Tipos para las paletas - Solo Turquesa
export type ColorPalette = 'teal';

// Definición de la paleta de colores - Solo Turquesa
export const colorPalettes = {
  teal: {
    name: 'Turquesa',
    dark: {
      bg: { primary: '#021C1C', secondary: '#033333', tertiary: '#044A4A' },
      text: { primary: '#FFFFFF', secondary: '#5EEAD4', tertiary: '#99F6E4', muted: 'rgba(94,234,212,0.75)' },
      accent: { primary: '#14B8A6', secondary: '#2DD4BF', glow: 'rgba(20,184,166,0.18)' },
      border: { primary: 'rgba(20,184,166,0.18)', secondary: 'rgba(255,255,255,0.06)', accent: 'rgba(45,212,191,0.08)' },
      button: {
        primary: { bg: '#14B8A6', hover: '#0F766E', text: '#FFFFFF' },
        secondary: { bg: 'rgba(255,255,255,0.04)', hover: 'rgba(255,255,255,0.08)', text: '#5EEAD4' },
      },
      success: '#10B981', error: '#EF4444', warning: '#F59E0B',
    },
    light: {
      bg: { primary: '#FFFFFF', secondary: '#F0FDFA', tertiary: '#CCFBF1' },
      text: { primary: '#033333', secondary: '#115E59', tertiary: '#0F766E', muted: 'rgba(3,51,51,0.45)' },
      accent: { primary: '#14B8A6', secondary: '#2DD4BF', glow: 'rgba(20,184,166,0.12)' },
      border: { primary: '#99F6E4', secondary: '#CCFBF1', accent: 'rgba(20,184,166,0.08)' },
      button: {
        primary: { bg: '#14B8A6', hover: '#0F766E', text: '#FFFFFF' },
        secondary: { bg: '#F0FDFA', hover: '#CCFBF1', text: '#033333' },
      },
      success: '#059669', error: '#DC2626', warning: '#D97706',
    },
  },
};

// Mantener compatibilidad con código existente
export const colors = colorPalettes.teal;

// Hook para obtener la paleta según el tema actual
export function useColors(theme: 'light' | 'dark') {
  return colors[theme]
}
