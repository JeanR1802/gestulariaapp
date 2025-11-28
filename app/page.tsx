// app/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EnvelopeIcon, CheckCircleIcon, SparklesIcon, ArrowRightIcon, UserIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './contexts/ThemeContext';
import { colorPalettes } from './lib/colors';

export default function LandingPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const c = colorPalettes.teal[theme];

  // Lógica del cursor optimizada
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // No activar el cursor personalizado en dispositivos táctiles
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouch) {
      cursor.style.display = 'none';
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      // Usamos translate3d para aceleración por GPU
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    // Contenedor principal con estilos globales para ocultar el cursor nativo
    <div className="min-h-screen bg-[#000814] text-white font-sans overflow-hidden flex flex-col relative selection:bg-[#14B8A6] selection:text-[#001A33] cursor-none">
      
      {/* --- CURSOR PERSONALIZADO --- */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform -ml-[5px] -mt-[5px]"
        style={{
          boxShadow: `
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 30px ${c.accent.primary},
            0 0 60px ${c.accent.primary}
          `
        }}
      />

      {/* --- FONDO CON DEGRADADO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_#001A33_0%,_#000d1a_60%,_#000000_100%)]"></div>

      {/* --- HEADER --- */}
      <header className="flex justify-between items-center px-6 py-8 md:px-16 relative z-50">
        <div className="flex items-center gap-3">
          {/* Logo: usa el .ico público */}
          <img src="/lgo.png" alt="Gestularia logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="font-bold tracking-widest text-sm md:text-base">GESTULARIA</span>
          <span className="border border-white/20 px-2 py-0.5 text-[10px] rounded text-slate-400 uppercase tracking-wider ml-2">Beta Access</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 list-none">
            {['Módulos', 'Recursos', 'Blog'].map((item) => (
              <li key={item}>
                <a href="#" className="text-slate-400 text-sm font-medium hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>

          {/* Botón de auth en escritorio (dentro del nav) */}
          <div className="ml-6 hidden md:block">
            {loading ? (
              <button disabled className="px-4 py-2 rounded-md bg-white/5 text-white/60 text-sm">Comprobando...</button>
            ) : user ? (
              <button onClick={() => router.push('/dashboard')} className="px-4 py-2 rounded-md bg-[#14B8A6] text-[#001A33] font-semibold hover:bg-[#0F766E] transition">
                <Squares2X2Icon className="inline-block w-4 h-4 mr-2" /> Dashboard
              </button>
            ) : (
              <button onClick={() => router.push('/login')} className="px-4 py-2 rounded-md bg-transparent border border-white/10 text-slate-200 hover:bg-white/5 transition flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Login
              </button>
            )}
          </div>
        </nav>

        {/* Botón de auth móvil: colocado fuera del nav para que sea visible en pantallas pequeñas */}
        <div className="md:hidden ml-4">
          {loading ? (
            <button disabled className="px-3 py-2 rounded-md bg-white/5 text-white/60 text-sm">Comprobando...</button>
          ) : user ? (
            <button onClick={() => router.push('/dashboard')} className="px-3 py-2 rounded-md bg-[#14B8A6] text-[#001A33] font-semibold hover:bg-[#0F766E] transition">Dashboard</button>
          ) : (
            <button onClick={() => router.push('/login')} className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-slate-200 hover:bg-white/5 transition">Login</button>
          )}
        </div>
      </header>

      {/* --- MAIN HERO --- */}
      <main className="flex-1 flex items-center px-6 md:px-16 relative z-10">
        <div className="w-full md:w-[55%] relative z-10">
          <h1 className="text-5xl md:text-7xl font-normal leading-[1.1] mb-6 tracking-tight">
            <span className="font-light block text-slate-300">Tu negocio,</span>
            <strong className="font-bold block text-white">Modular</strong>
            <span className="font-light block text-slate-300">y sin relleno.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-light mb-10">
            La plataforma donde activas solo lo que necesitas. CRM, Proyectos o Ventas. Sin complicaciones, diseñado para crecer contigo.
          </p>

           {/* Formulario integrado al estilo del ejemplo */}
           <div className="w-full max-w-md relative z-30">
            {status === 'success' ? (
              <div className="p-4 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] flex items-center justify-center gap-3 animate-fade-in-up backdrop-blur-md">
                <CheckCircleIcon className="w-6 h-6" />
                <span className="font-medium">¡Anotado! Te avisaremos.</span>
              </div>
            ) : (
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <form onSubmit={handleSubmit} className="relative flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg transition-all">
                        <EnvelopeIcon className="h-5 w-5 text-slate-400 absolute left-5 pointer-events-none" />
                        <input
                            type="email"
                            required
                            className="block w-full pl-12 pr-40 py-4 bg-transparent border-none rounded-full leading-5 text-white placeholder-slate-500 focus:outline-none focus:ring-0 transition-all font-medium cursor-none"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="absolute right-1 top-1 bottom-1 px-8 py-2 text-sm font-bold rounded-full text-[#000814] bg-white hover:bg-[#14B8A6] focus:outline-none transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] disabled:opacity-70 cursor-none"
                        >
                            {status === 'loading' ? '...' : 'ÚNETE'}
                        </button>
                    </form>
                </div>
            )}
          </div>
        </div>

        {/* --- CAPAS DE BRILLO (GLOWS) ADAPTADAS A GESTULARIA --- */}
        <div className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden z-0 pointer-events-none">
             {/* Capa Profunda (Azul Real) */}
             <div className="absolute top-1/2 -translate-y-1/2 -right-[40%] w-[140vh] h-[140vh] rounded-full blur-[120px] opacity-60" 
                  style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, transparent 70%)' }}></div>
             
             {/* Capa Media (Teal suave) */}
             <div className="absolute top-1/2 -translate-y-1/2 -right-[20%] w-[100vh] h-[100vh] rounded-full blur-[80px] opacity-80"
                  style={{ background: 'radial-gradient(circle at center, rgba(45,212,191,0.3) 10%, rgba(15,118,110,0.1) 50%, transparent 80%)' }}></div>
             
             {/* Núcleo (Blanco/Teal) */}
             <div className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[70vh] h-[70vh] rounded-full blur-[60px] opacity-60"
                  style={{ background: 'radial-gradient(circle at center, rgba(200, 255, 255, 0.5) 0%, rgba(45,212,191,0.2) 40%, transparent 70%)' }}></div>
         </div>
        
        {/* --- VISUALIZACIÓN MODULAR FLOTANTE --- */}
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <a href="#" className="group block relative">
                <div className="absolute inset-0 bg-[#14B8A6] blur-[48px] opacity-20 group-hover:opacity-45 transition-opacity duration-500"></div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-12 py-5 md:px-16 md:py-6 rounded-full md:rounded-xl font-semibold text-base md:text-xl tracking-wide md:tracking-wider shadow-[0_32px_60px_-20px_rgba(20,184,166,0.18)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-24px_rgba(20,184,166,0.36)] group-hover:bg-white/10 flex items-center gap-4">
                    <Squares2X2Icon className="w-6 h-6 md:w-7 md:h-7 text-[#14B8A6]" />
                    <span className="uppercase">Explorar Módulos</span>
                </div>
            </a>
        </div>
      </main>

      {/* Estilos CSS para forzar cursor none en todo el body si es necesario */}
      <style jsx global>{`
        body {
            cursor: none;
        }
        @media (max-width: 900px) {
            body { cursor: auto; }
            .cursor-none { cursor: auto; }
            #cursor-glow { display: none; }
        }
      `}</style>
    </div>
  );
}