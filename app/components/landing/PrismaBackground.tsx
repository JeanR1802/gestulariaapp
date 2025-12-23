'use client';
import React from 'react';

export const PrismaBackground = () => {
  // Ultra optimizado: solo CSS puro, SIN JavaScript, SIN animaciones
  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-[#020202] pointer-events-none">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(79,70,229,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(219,39,119,0.15) 0%, transparent 50%)'
        }}
      />
    </div>
  );
};
