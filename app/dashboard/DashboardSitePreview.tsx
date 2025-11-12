// app/dashboard/DashboardSitePreview.tsx
'use client';

import { useEffect, useRef } from 'react';

interface DashboardSitePreviewProps {
  content: string; // Se espera que esto sea una cadena HTML
  customCSS?: string;
}

export default function DashboardSitePreview({ content, customCSS = '' }: DashboardSitePreviewProps) {
  // Renderiza el HTML directamente en un div, sin iframe
  return (
    <div className="h-64 md:h-96 bg-white rounded-b-xl border-t border-slate-200 overflow-hidden relative group-hover:shadow-inner">
      <div
        className="w-full h-full overflow-auto"
        style={{ pointerEvents: 'none' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {/* Sutil degradado para el fondo */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
