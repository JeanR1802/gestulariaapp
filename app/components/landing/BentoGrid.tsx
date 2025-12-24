'use client';

import React from 'react';
import { Oswald } from 'next/font/google';
import { MessageCircle, CreditCard, Box } from 'lucide-react';

const oswald = Oswald({ subsets: ['latin'], weight: '700', display: 'swap' });

export const BentoGrid = () => {
  return (
    <section className="py-24 px-4 bg-[#050505] relative overflow-hidden">
      
      {/* LUZ AMBIENTAL DE FONDO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* TÍTULO */}
        <div className="mb-12 md:mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              Todo lo que necesitas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">vender más.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Menos herramientas sueltas, más resultados.
            </p>
        </div>

        {/* GRID DE 3 CARTAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
            
            {/* 1. TIENDAS VIVAS (PREMIUM GRADIENT) - Ocupa 2 columnas */}
            <div className="md:col-span-2 md:row-span-2 relative group rounded-[32px] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
                
                {/* MARCO DE NEÓN (Gradiente Vivo) */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[2px]">
                    {/* FONDO INTERNO DEGRADADO PREMIUM */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f1016] via-[#050505] to-[#0a0a1a] rounded-[30px]" />
                </div>
                
                {/* CONTENIDO */}
                <div className="relative h-full rounded-[30px] p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                    
                    {/* Efecto de luz interna superior */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-50 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-indigo-900/20">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_12px_#818cf8]" />
                            Experiencia Inmersiva
                        </div>
                        <h3 className={`${oswald.className} text-5xl md:text-6xl text-white mb-6 leading-none drop-shadow-xl`}>
                            Tiendas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Vivas.</span>
                        </h3>
                        <p className="text-slate-300 text-lg md:text-xl max-w-md leading-relaxed font-light">
                            Tus productos no son fotos estáticas. Son historias. Vende con video a pantalla completa y atrapa a tus clientes.
                        </p>
                    </div>

                    {/* VISUAL MÁS GRANDE Y PROTAGONISTA */}
                    <div className="relative mt-auto h-72 w-full flex items-end justify-center perspective-1000">
                         {/* Tarjeta Flotante Izquierda */}
                         <div className="absolute w-40 h-56 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl transform -rotate-12 -translate-x-28 translate-y-12 opacity-60 scale-90 group-hover:-rotate-6 group-hover:-translate-x-32 transition-all duration-700 ease-out" />
                         
                         {/* Tarjeta Flotante Derecha */}
                         <div className="absolute w-40 h-56 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl transform rotate-12 translate-x-28 translate-y-12 opacity-60 scale-90 group-hover:rotate-6 group-hover:translate-x-32 transition-all duration-700 ease-out" />
                         
                         {/* Tarjeta Central (Hero) Brillante */}
                         <div className="relative w-52 h-72 bg-gradient-to-b from-[#1e1b4b] to-black rounded-2xl border border-indigo-500/50 shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)] transform translate-y-8 group-hover:translate-y-4 transition-all duration-500 z-20 overflow-hidden flex flex-col">
                            {/* Video simulado */}
                            <div className="flex-1 bg-indigo-900/10 relative flex items-center justify-center group-hover:bg-indigo-900/20 transition-colors">
                                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-2xl group-hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                                </div>
                            </div>
                            {/* Footer de la tarjeta */}
                            <div className="h-16 bg-black/60 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between">
                                <div className="space-y-1.5">
                                    <div className="h-2 w-16 bg-white/40 rounded-full" />
                                    <div className="h-2 w-10 bg-white/20 rounded-full" />
                                </div>
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                                    <Box className="w-4 h-4 text-white" />
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* 2. PEDIDOS WHATSAPP (Verde) */}
            <div className="group relative rounded-[32px] overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
                {/* Borde sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/30 to-white/5 p-[1px] rounded-[32px]">
                    <div className="absolute inset-0 bg-[#080808] rounded-[31px]" />
                </div>

                <div className="relative h-full p-8 flex flex-col rounded-[31px] bg-gradient-to-b from-green-900/10 to-transparent">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]">
                        <MessageCircle className="w-6 h-6 text-green-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Pedidos Directos</h3>
                    <p className="text-slate-400 text-sm mb-4">Sin "precio inbox". Órdenes claras directo a tu WhatsApp.</p>

                    {/* Visual: Chat */}
                    <div className="mt-auto bg-[#121212] border border-white/10 rounded-2xl p-4 relative transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                         <div className="flex gap-2 items-center mb-3 border-b border-white/5 pb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-slate-500 font-mono uppercase">Nuevo Mensaje</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white">Quiero 2 pares</span>
                            <span className="text-[10px] font-bold text-black bg-green-400 px-2 py-0.5 rounded-full">PAGADO</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* 3. COBROS AUTOMÁTICOS (Azul) */}
            <div className="group relative rounded-[32px] overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
                 {/* Borde sutil */}
                 <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-white/5 p-[1px] rounded-[32px]">
                    <div className="absolute inset-0 bg-[#080808] rounded-[31px]" />
                </div>

                <div className="relative h-full p-8 flex flex-col rounded-[31px] bg-gradient-to-b from-blue-900/10 to-transparent">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                        <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Pagos Blindados</h3>
                    <p className="text-slate-400 text-sm mb-6">Tarjetas, transferencias y efectivo. Todo automatizado.</p>

                    {/* Visual: Tarjeta Crédito */}
                    <div className="mt-auto relative h-20 w-full flex items-end justify-center perspective-1000">
                        <div className="absolute w-[85%] h-14 bg-[#1e293b] rounded-xl border border-white/10 transform -rotate-3 translate-y-1 group-hover:-rotate-6 transition-transform duration-300 shadow-lg" />
                        <div className="absolute w-[85%] h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl border border-white/10 shadow-2xl transform rotate-2 group-hover:rotate-3 group-hover:-translate-y-2 transition-all duration-300 flex flex-col justify-end p-3">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                </div>
                                <div className="w-4 h-2.5 bg-white/20 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};