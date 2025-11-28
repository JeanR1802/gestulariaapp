'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import { colorPalettes, ColorPalette } from '../lib/colors';

export default function BottomPalettePanel({ onClose }: { onClose: () => void }) {
  const { theme, palette, setPalette } = useTheme();
  const c = colorPalettes[palette][theme];
  const [mounted, setMounted] = React.useState(false);

  const paletteColors: Record<ColorPalette, string> = {
    teal: '#14B8A6',
  };

  // Prevent body scroll while panel is open
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  const content = (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Panel - Bottom sheet en móvil, centrado en desktop */}
      <div
        className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:right-auto sm:top-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 z-[10000] w-full sm:w-auto sm:min-w-[500px] sm:max-w-[650px] max-h-[85vh] sm:max-h-[90vh] overflow-auto rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up sm:animate-none"
        style={{
          backgroundColor: c.bg.secondary,
          border: `1px solid ${c.border.primary}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: c.text.primary }}>
            Elige tu paleta de colores
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:scale-110 transition-transform"
            style={{ backgroundColor: c.bg.tertiary, color: c.text.secondary }}
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grid de paletas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(colorPalettes) as ColorPalette[]).map((key) => {
            const isSelected = key === palette;
            const color = paletteColors[key];

            return (
              <button
                key={key}
                onClick={() => {
                  setPalette(key);
                  onClose();
                }}
                className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: isSelected ? `${color}22` : c.bg.tertiary,
                  border: `2px solid ${isSelected ? color : 'transparent'}`,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex-shrink-0" 
                  style={{ 
                    backgroundColor: color,
                    boxShadow: `0 0 15px ${c.accent.glow}`
                  }} 
                />
                <span className="text-sm font-semibold" style={{ color: c.text.primary }}>
                  {colorPalettes[key].name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <p className="text-xs mt-5 pt-4 text-center" style={{ 
          color: c.text.muted,
          borderTop: `1px solid ${c.border.secondary}`
        }}>
          La paleta se aplica en todo el dashboard
        </p>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
