// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WelcomeLoader } from '@/app/components/landing/WelcomeLoader';
import { PrismaBackground } from '@/app/components/landing/PrismaBackground';
import { LandingNavbar } from '@/app/components/landing/LandingNavbar';
import { HeroSection } from '@/app/components/landing/HeroSection';
import { WhatsAppFloatingBtn } from '@/app/components/landing/WhatsAppFloatingBtn';

// Lazy load componentes pesados
const BentoGrid = dynamic(() => import('@/app/components/landing/BentoGrid').then(mod => ({ default: mod.BentoGrid })), { ssr: false });
const InteractiveShowcase = dynamic(() => import('@/app/components/landing/InteractiveShowcase').then(mod => ({ default: mod.InteractiveShowcase })), { ssr: false });
const PricingSection = dynamic(() => import('@/app/components/landing/PricingSection').then(mod => ({ default: mod.PricingSection })), { ssr: false });
const AboutSection = dynamic(() => import('@/app/components/landing/AboutSection').then(mod => ({ default: mod.AboutSection })), { ssr: false });

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      // Bloquear scroll completamente durante el loading
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      // Restaurar scroll y resetear posición
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, 0); // Forzar scroll al inicio
    }
  }, [loading]);

  return (
    <main className="min-h-screen font-sans bg-transparent text-slate-900 relative overflow-x-hidden w-full">
      <PrismaBackground />
      <WelcomeLoader onLoadingComplete={() => setLoading(false)} />

      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <LandingNavbar />
          <HeroSection />
          <BentoGrid />
          <InteractiveShowcase />
          <PricingSection />
          <AboutSection />

          <footer className="py-8 text-center text-[10px] text-slate-700 uppercase tracking-widest border-t border-white/5 bg-[#050505] relative z-10">
            © {new Date().getFullYear()} Gestularia. Todos los derechos reservados.
          </footer>

          {!loading && <WhatsAppFloatingBtn />}
      </div>
    </main>
  );
}
