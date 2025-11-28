'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';

export function ColorPaletteSelector() {
  const { theme } = useTheme();
  const palette = 'teal'; // Solo hay una paleta disponible actualmente
  const c = colorPalettes[palette][theme];

  return (
    <div className="w-full">
      <div className="block text-sm font-medium mb-2" style={{ color: c.text.primary }}>
        Paleta de Colores
      </div>
      <div
        className="w-full rounded-lg py-2.5 pl-3 pr-4 shadow-sm border"
        style={{
          backgroundColor: c.bg.secondary,
          color: c.text.primary,
          borderColor: c.border.primary,
        }}
      >
        <div className="flex items-center">
          <span
            className="inline-block h-4 w-4 rounded-full mr-3 ring-2 ring-offset-1"
            style={{
              backgroundColor: c.accent.primary,
              ringColor: c.accent.secondary,
            }}
          />
          <span className="block truncate font-medium">Turquesa</span>
        </div>
      </div>
      <p className="mt-2 text-xs" style={{ color: c.text.muted }}>
        Paleta de colores actual del sitio
      </p>
    </div>
  );
}
