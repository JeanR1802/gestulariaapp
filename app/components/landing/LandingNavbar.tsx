'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-[#020617]/80 backdrop-blur-md border-white/5 py-4 shadow-lg' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 relative flex justify-between items-center">
        
        {/* LOGO (Izquierda) */}
        <Link href="/" className="flex items-center gap-2 z-20 hover:opacity-80 transition-opacity">
          <Image src="/lgc.png" alt="Gestularia Logo" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold text-white tracking-tight">Gestularia</span>
        </Link>

        {/* MENÚ CENTRAL (Centrado Absoluto) */}
        <div 
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-8 items-center px-8 py-2.5 transition-all duration-500 ease-in-out ${
                scrolled 
                ? 'bg-transparent border-transparent' // SCROLL: Solo quita el fondo/borde, deja los textos
                : 'bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]' // TOP: Efecto cápsula
            }`}
        >
          {['Características', 'Precios', 'Nosotros'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* BOTONES (Derecha) */}
        <div className="flex items-center gap-6 z-20">
          {!loading && (
            <Link 
              href={user ? "/dashboard" : "/login"}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Entrar
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};