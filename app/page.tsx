// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WelcomeLoader } from '@/app/components/landing/WelcomeLoader';
import { PrismaBackground } from '@/app/components/landing/PrismaBackground';
import { HeroSection } from '@/app/components/landing/HeroSection';
import { WhatsAppFloatingBtn } from '@/app/components/landing/WhatsAppFloatingBtn';

// Placeholder ligero
const SectionLoader = () => (
  <div className="w-full h-[400px] flex items-center justify-center bg-transparent">
      <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);

const BentoGrid = dynamic(() => import('@/app/components/landing/BentoGrid').then(mod => ({ default: mod.BentoGrid })), { 
  ssr: false,
  loading: () => <SectionLoader />
});
const InteractiveShowcase = dynamic(() => import('@/app/components/landing/InteractiveShowcase').then(mod => ({ default: mod.InteractiveShowcase })), { ssr: false });
const PricingSection = dynamic(() => import('@/app/components/landing/PricingSection').then(mod => ({ default: mod.PricingSection })), { ssr: false });
const AboutSection = dynamic(() => import('@/app/components/landing/AboutSection').then(mod => ({ default: mod.AboutSection })), { ssr: false });

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [showHeavyComponents, setShowHeavyComponents] = useState(false);

  useEffect(() => {
    // Ya no necesitamos bloquear el body manualmente porque lo hicimos por CSS global
    if (!loading) {
      setTimeout(() => setShowHeavyComponents(true), 200);
    }
  }, [loading]);

  return (
    // Main fijo sin scroll
    <main className="fixed inset-0 w-full h-full overflow-hidden font-sans bg-transparent text-slate-900">
      
      {/* Fondo fijo fuera del scroll (Rendimiento máximo) */}
      <PrismaBackground />
      <WelcomeLoader onLoadingComplete={() => setLoading(false)} />

      {/* --- ESTE ES EL NUEVO CONTENEDOR DE SCROLL --- */}
      <div
        id="main-scroll-container"
        className="app-scroll-container transition-opacity duration-700 relative"
        style={{ opacity: loading ? 0 : 1 }}
      >
          <HeroSection />
          
          {showHeavyComponents && (
            <>
              <div className="render-lazy">
                  <BentoGrid />
              </div>
              <div className="render-lazy">
                  <InteractiveShowcase />
              </div>
              <div className="render-lazy">
                  <PricingSection />
              </div>
              <div className="render-lazy">
                  <AboutSection />
              </div>

              <footer className="py-8 text-center text-[10px] text-slate-700 uppercase tracking-widest border-t border-white/5 bg-[#050505] relative z-10 render-lazy">
                © {new Date().getFullYear()} Gestularia. Todos los derechos reservados.
              </footer>
            </>
          )}

          {!loading && <WhatsAppFloatingBtn />}
      </div>
    </main>
  );
}