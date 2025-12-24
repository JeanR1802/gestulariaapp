'use client';
import React from 'react';

export const PrismaBackground = () => {
  // Ultra optimizado: Forzamos aceleración de hardware con translate3d
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none" 
      style={{ 
        transform: 'translate3d(0,0,0)', 
        willChange: 'transform',
        background: 'linear-gradient(180deg, rgba(6,7,11,0.98), rgba(12,14,18,0.98))' // Fondo oscuro con 2% de transparencia
      }}
    >
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          // Gradiente radial simple, menos costoso que los múltiples ellipses complejos
          background: 'radial-gradient(circle at 50% 30%, rgba(79,70,229,0.15), transparent 60%)'
        }}
      />
      {/* Segunda capa estática ligera para dar profundidad sin recalcular */}
      <div 
        className="absolute bottom-0 right-0 w-full h-1/2 opacity-20"
        style={{
           background: 'radial-gradient(circle at 80% 80%, rgba(219,39,119,0.1), transparent 50%)'
        }}
      />
    </div>
  );
};