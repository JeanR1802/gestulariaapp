"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';

export const LandingNavbar = () => {
  const { user, loading } = useAuth();

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">

      {/* NAV estable: glassmorphism explícito para máxima compatibilidad */}
      <nav 
        className="pointer-events-auto w-full max-w-5xl flex items-center justify-between px-4 md:px-6 py-2 border border-white/10 rounded-full shadow-lg"
        style={{
          background: 'rgba(10, 10, 10, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
        aria-label="Landing navbar"
      >
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image 
            src="/lgc.png" 
            alt="Gestularia Logo" 
            width={40} 
            height={40} 
            className="object-contain" 
            priority 
          />
          <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
            Gestularia
          </span>
        </Link>

        {/* 2. ENLACES - directamente en el nav, sin contenedor extra */}
        <div className="hidden md:flex items-center gap-4">
          {['Características', 'Precios', 'Nosotros'].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="px-3 py-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* 3. BOTÓN DE ACCIÓN */}
        <div>
          {!loading && (
            <Link 
              href={user ? "/dashboard" : "/login"}
              className={`
                flex items-center gap-2
                bg-white text-black 
                text-xs font-bold 
                px-5 py-2.5 
                rounded-full 
                transition-all duration-300
                hover:bg-slate-200 hover:scale-105 active:scale-95
                shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]
              `}
            >
              {user ? 'Dashboard' : 'Entrar'}
              {!user && (
                 // Flechita pequeña solo si no está logueado
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              )}
            </Link>
          )}
        </div>

      </nav>
    </div>
  );
};