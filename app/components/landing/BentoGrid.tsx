'use client';

import React from 'react';
import { Oswald } from 'next/font/google';
import { MessageCircle, CreditCard, Play, ArrowDown } from 'lucide-react';

const oswald = Oswald({ subsets: ['latin'], weight: '700', display: 'swap' });

export const BentoGrid = () => {
  return (
    <section className="relative bg-[#020202] text-white overflow-hidden pb-20">
      
      {/* --- ESTILOS CSS INCRUSTADOS PARA ASEGURAR EL LOOK EXACTO --- */}
      <style jsx global>{`
        /* Animación de Revelado segura para Móviles */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .reveal-card {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0; /* Inicia invisible hasta que la animación corre */
        }

        /* Retardos para efecto cascada */
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }

        /* Activar animación solo cuando es visible (fallback simple) */
        /* En producción real usaríamos IntersectionObserver, pero para este efecto rápido: */
        .reveal-card { animation-play-state: running; }

        /* GRADIENTES POTENTES (Tal cual el HTML) */
        .card-purple {
            background: radial-gradient(circle at 50% -20%, rgba(124, 58, 237, 0.25), rgba(0,0,0,0) 70%), #080808;
            border: 1px solid rgba(139, 92, 246, 0.3);
        }
        .card-orange {
            background: radial-gradient(circle at 50% -20%, rgba(249, 115, 22, 0.25), rgba(0,0,0,0) 70%), #080808;
            border: 1px solid rgba(251, 146, 60, 0.3);
        }
        .card-green {
            background: radial-gradient(circle at 50% -20%, rgba(34, 197, 94, 0.25), rgba(0,0,0,0) 70%), #080808;
            border: 1px solid rgba(74, 222, 128, 0.3);
        }

        /* EFECTOS HOVER Y LUCES */
        .premium-card { transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .premium-card:hover { transform: translateY(-8px) scale(1.02); z-index: 10; }
        
        .card-purple:hover { border-color: rgba(167, 139, 250, 0.8); box-shadow: 0 0 40px rgba(124, 58, 237, 0.15); }
        .card-orange:hover { border-color: rgba(253, 186, 116, 0.8); box-shadow: 0 0 40px rgba(249, 115, 22, 0.15); }
        .card-green:hover { border-color: rgba(134, 239, 172, 0.8); box-shadow: 0 0 40px rgba(34, 197, 94, 0.15); }

        /* LUZ VIAJERA (Scanline) */
        .scanline::after {
            content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: skewX(-25deg); animation: shine 6s infinite; pointer-events: none;
        }
        @keyframes shine { 0% { left: -150%; } 20% { left: 150%; } 100% { left: 150%; } }

        /* ANIMACIONES INTERNAS */
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); } 70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); } }
      `}</style>

      {/* --- INTRO ÉPICA (Dentro de la sección para mantener flujo) --- */}
      <div className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4 z-10 min-h-[60vh]">
          {/* Luz Ambiental */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Scroll Prompt */}
          <div className="mb-10 flex flex-col items-center gap-3 text-slate-500 animate-bounce">
              <span className="text-xs uppercase tracking-[0.3em] font-mono">Desliza hacia abajo</span>
              <ArrowDown className="w-5 h-5" />
          </div>

          {/* TITULO GIGANTE */}
          <h2 className={`${oswald.className} text-6xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 tracking-tighter leading-none drop-shadow-2xl scale-y-110 mb-8`}>
              EXPERIMENTA<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  EL PODER.
              </span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
             Domina el mercado con herramientas diseñadas para vender. Sin excusas.
          </p>
      </div>

      {/* --- GRID DE TARJETAS (Visualmente Idéntico al HTML) --- */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            
            {/* 1. LA REINA (MORADO) */}
            <div className="md:col-span-2 md:row-span-2 reveal-card delay-100">
                <div className="premium-card card-purple scanline h-full flex flex-col p-8 md:p-12 relative rounded-[32px] overflow-hidden group">
                    
                    <div className="flex items-center gap-3 mb-8">
                        <div className="px-4 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/50 text-purple-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span> Inmersivo
                        </div>
                    </div>

                    <h3 className={`${oswald.className} text-5xl md:text-8xl text-white mb-6 leading-[0.85] tracking-tight`}>
                        TIENDAS <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">VIVAS.</span>
                    </h3>
                    
                    <p className="text-purple-100/70 text-lg max-w-sm font-light leading-relaxed mb-10">
                        Atrapa a tus clientes. Vende con video a pantalla completa.
                    </p>

                    {/* VIDEO PLAYER (Siempre visible en móvil, interactivo en desktop) */}
                    <div className="flex-1 w-full relative perspective-1000 flex items-end justify-center">
                        <div className="relative w-64 h-80 bg-[#0a0a0a] rounded-2xl border border-purple-500/30 shadow-[0_0_60px_rgba(147,51,234,0.3)] overflow-hidden z-20 transform transition-all duration-500 translate-y-4 scale-100 md:translate-y-8 md:group-hover:translate-y-0 md:group-hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#2e1065] to-black"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl animate-pulse-ring">
                                    <Play className="w-8 h-8 text-white ml-1 fill-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-900 border border-white/20"></div>
                                    <div className="space-y-1.5">
                                        <div className="w-24 h-2 bg-white/40 rounded-full"></div>
                                        <div className="w-14 h-2 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACCIÓN (NARANJA/ROJO) */}
            <div className="reveal-card delay-200">
                <div className="premium-card card-orange scanline h-full flex flex-col p-8 relative rounded-[32px] overflow-hidden group">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(249,115,22,0.3)]">
                        <MessageCircle className="w-7 h-7" />
                    </div>

                    <h3 className={`${oswald.className} text-3xl font-black mb-2 text-white uppercase italic`}>
                        Pedidos <br/> <span className="text-orange-500">Flash</span>
                    </h3>
                    <p className="text-orange-100/60 text-sm mb-8 font-medium">
                        El bot cierra la venta. Tú solo despachas.
                    </p>

                    <div className="mt-auto relative w-full flex flex-col gap-3">
                        <div className="bg-[#1a0c05] border border-orange-500/30 p-3 rounded-xl shadow-lg w-[90%] self-end transform rotate-1 animate-float">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-orange-400 font-bold uppercase">Nuevo Pedido</span>
                                <span className="text-[10px] text-slate-500">1m</span>
                            </div>
                            <div className="text-white font-bold text-xs">Quiero 3 Pares 🔥</div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 rounded-xl shadow-lg w-[85%] self-start transform -rotate-1 flex items-center gap-2 font-bold text-xs">
                           <span>⚡ Orden Confirmada</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. DINERO (VERDE NEÓN) */}
            <div className="reveal-card delay-300">
                <div className="premium-card card-green scanline h-full flex flex-col p-8 relative rounded-[32px] overflow-hidden group">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(34,197,94,0.3)]">
                        <CreditCard className="w-7 h-7" />
                    </div>

                    <h3 className={`${oswald.className} text-3xl font-black mb-2 text-white uppercase italic`}>
                        Pagos <br/> <span className="text-green-500">Blindados</span>
                    </h3>
                    <p className="text-green-100/60 text-sm mb-8 font-medium">
                        Dinero en tu cuenta, automáticamente.
                    </p>

                    <div className="mt-auto h-32 flex items-center justify-center relative perspective-1000">
                        <div className="absolute top-4 w-[85%] h-20 bg-green-900/40 rounded-xl border border-green-500/20 transform rotate-[-5deg] z-0"></div>
                        <div className="w-[90%] h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl border border-white/20 shadow-2xl relative p-4 flex flex-col justify-between group-hover:translate-y-[-5px] transition-transform duration-300 z-10 animate-float">
                             <div className="flex justify-between items-center">
                                <span className="text-white/80 font-mono text-[10px]">SALDO DISPONIBLE</span>
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                             </div>
                             <div className="text-2xl font-black text-white tracking-widest">$ 12,450</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};