// app/contexts/PreviewModeContext.tsx
'use client';
import { createContext, useContext } from 'react';

// Context para el modo de preview
export const PreviewModeContext = createContext<{
  mode: 'desktop' | 'tablet' | 'mobile';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}>({
  mode: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true
});

// Hook personalizado para usar el contexto
export const usePreviewMode = () => {
  const context = useContext(PreviewModeContext);
  if (!context) {
    throw new Error('usePreviewMode debe usarse dentro de PreviewModeProvider');
  }
  return context;
};