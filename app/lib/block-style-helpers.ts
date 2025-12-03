// app/lib/block-style-helpers.ts
// Helpers para aplicar estilos a bloques con fallback inline SIEMPRE

/**
 * Mapa de clases Tailwind comunes a sus valores hex
 * Se usa como fallback cuando las clases dinámicas no se generan en JIT
 */
export const TAILWIND_COLOR_MAP: Record<string, string> = {
  // Backgrounds
  'bg-white': '#ffffff',
  'bg-black': '#000000',
  'bg-slate-50': '#f8fafc',
  'bg-slate-100': '#f1f5f9',
  'bg-slate-200': '#e2e8f0',
  'bg-slate-300': '#cbd5e1',
  'bg-slate-400': '#94a3b8',
  'bg-slate-500': '#64748b',
  'bg-slate-600': '#475569',
  'bg-slate-700': '#334155',
  'bg-slate-800': '#1e293b',
  'bg-slate-900': '#0f172a',
  'bg-blue-400': '#60a5fa',
  'bg-blue-500': '#3b82f6',
  'bg-blue-600': '#2563eb',
  'bg-blue-700': '#1d4ed8',
  'bg-blue-800': '#1e40af',
  
  // Text colors
  'text-white': '#ffffff',
  'text-black': '#000000',
  'text-slate-50': '#f8fafc',
  'text-slate-100': '#f1f5f9',
  'text-slate-200': '#e2e8f0',
  'text-slate-300': '#cbd5e1',
  'text-slate-400': '#94a3b8',
  'text-slate-500': '#64748b',
  'text-slate-600': '#475569',
  'text-slate-700': '#334155',
  'text-slate-800': '#1e293b',
  'text-slate-900': '#0f172a',
  'text-blue-400': '#60a5fa',
  'text-blue-500': '#3b82f6',
  'text-blue-600': '#2563eb',
  'text-blue-700': '#1d4ed8',
  // Red colors
  'bg-red-400': '#f87171',
  'bg-red-500': '#ef4444',
  'bg-red-600': '#dc2626',
  'bg-red-700': '#b91c1c',
  'bg-red-800': '#7f1d1d',
  'text-red-400': '#f87171',
  'text-red-500': '#ef4444',
  'text-red-600': '#dc2626',
  'text-red-700': '#b91c1c',
  // Green colors
  'bg-green-400': '#4ade80',
  'bg-green-500': '#22c55e',
  'bg-green-600': '#16a34a',
  'bg-green-700': '#047857',
  'bg-green-800': '#064e3b',
  'text-green-400': '#4ade80',
  'text-green-500': '#22c55e',
  'text-green-600': '#16a34a',
  'text-green-700': '#047857',
};

/**
 * Convierte un color (custom [#abc] o clase Tailwind) a inline style
 * SIEMPRE retorna un style inline para asegurar visibilidad en editor
 */
export const getTextStyles = (
  colorValue: string | undefined,
  defaultClass: string
): { className: string; style: React.CSSProperties } => {
  // Si es color custom [#abc], extraer hex
  if (colorValue?.startsWith('[#')) {
    return {
      className: '',
      style: { color: colorValue.slice(1, -1) },
    };
  }
  
  // Si es clase Tailwind o default, convertir a hex inline
  const finalClass = colorValue || defaultClass;
  const hexColor = TAILWIND_COLOR_MAP[finalClass];
  
  return {
    className: finalClass,
    style: hexColor ? { color: hexColor } : {},
  };
};

/**
 * Convierte un color de fondo a inline style
 * SIEMPRE retorna un style inline para asegurar visibilidad en editor
 */
export const getBackgroundStyles = (
  colorValue: string | undefined,
  defaultClass: string = 'bg-slate-100'
): { className: string; style: React.CSSProperties } => {
  // Si es color custom [#abc], extraer hex
  if (colorValue?.startsWith('[#')) {
    return {
      className: '',
      style: { backgroundColor: colorValue.slice(1, -1) },
    };
  }
  
  // Si es clase Tailwind o default, convertir a hex inline
  const finalClass = colorValue || defaultClass;
  const hexColor = TAILWIND_COLOR_MAP[finalClass];
  
  return {
    className: finalClass,
    style: hexColor ? { backgroundColor: hexColor } : {},
  };
};

/**
 * Obtiene estilos para botones (bg + text)
 * SIEMPRE retorna inline styles para asegurar visibilidad en editor
 */
export const getButtonStyles = (
  bgColor: string | undefined,
  textColor: string | undefined,
  defaultBg: string = 'bg-blue-600',
  defaultText: string = 'text-white'
): { className: string; style: React.CSSProperties } => {
  const isCustomBg = bgColor?.startsWith('[#');
  const isCustomText = textColor?.startsWith('[#');
  const style: React.CSSProperties = {};
  
  // Background color
  if (isCustomBg && bgColor) {
    style.backgroundColor = bgColor.slice(1, -1);
  } else {
    const bgClass = bgColor || defaultBg;
    const hexBg = TAILWIND_COLOR_MAP[bgClass];
    if (hexBg) style.backgroundColor = hexBg;
  }
  
  // Text color
  if (isCustomText && textColor) {
    style.color = textColor.slice(1, -1);
  } else {
    const textClass = textColor || defaultText;
    const hexText = TAILWIND_COLOR_MAP[textClass];
    if (hexText) style.color = hexText;
  }
  
  // Clases CSS (solo si no son custom)
  const bgClass = !isCustomBg ? (bgColor || defaultBg) : '';
  const textClass = !isCustomText ? (textColor || defaultText) : '';
  
  return {
    className: `${bgClass} ${textClass}`.trim(),
    style,
  };
};
