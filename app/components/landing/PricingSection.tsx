'use client';

import React, { useState } from 'react';
import { Check, X, Zap, ShieldCheck, Gem } from 'lucide-react';

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    // OPTIMIZACIÓN: will-change-transform ayuda a preparar el renderizado al hacer scroll
    <section className="relative py-24 px-4 bg-[#0a0a0a] overflow-hidden" id="precios" style={{ willChange: 'transform' }}>
      
      {/* OPTIMIZACIÓN: Fondo limpio sin gradientes radiales costosos */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0a0a0a] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Pruébalo primero. <br/>
            Paga solo si te funciona.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sin trucos, sin letras chiquitas y <strong>sin tarjeta de crédito</strong> para empezar.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensual</span>
            <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors active:bg-slate-700"
            >
                <div 
                    className="w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300"
                    style={{ transform: isAnnual ? 'translateX(24px)' : 'translateX(0)' }}
                />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                Anual <span className="text-green-400 text-xs font-bold ml-1">-20%</span>
            </span>
          </div>
        </div>

        {/* --- GRID DE PRECIOS OPTIMIZADO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1. PLAN GRATUITO */}
            {/* OPTIMIZACIÓN: translateZ(0) aísla la tarjeta en la GPU */}
            <div 
                className="lg:col-span-5 bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden group transition-colors"
                style={{ transform: 'translateZ(0)' }}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-24 h-24 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Emprendedor</h3>
                <p className="text-slate-400 text-sm mb-6">Para validar tu idea.</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-white">$0</span>
                    <span className="text-slate-500">/mes</span>
                </div>

                <button className="w-full py-3 bg-white/10 active:bg-white/20 text-white font-bold rounded-xl border border-white/10 mb-8">
                    Crear cuenta gratis
                </button>

                <ul className="space-y-4 text-sm text-slate-300">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Tienda básica</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> 10 productos</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Pedidos WhatsApp</li>
                    <li className="flex gap-3 opacity-50"><X className="w-5 h-5 shrink-0" /> Chatbot IA</li>
                </ul>
            </div>


            {/* 2. PLAN PRO */}
            <div 
                className="lg:col-span-7 bg-[#0f111a] border border-indigo-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-none md:shadow-2xl md:shadow-indigo-900/20"
                style={{ transform: 'translateZ(0)' }}
            >
                {/* Degradado interno simple */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
                
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                    <ShieldCheck className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wide">Garantía 30 días</span>
                </div>

                <div className="mb-8 relative z-10">
                    <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                        Plan Negocio <Gem className="w-6 h-6 text-indigo-400" />
                    </h3>
                    <p className="text-indigo-200/70 text-base">Escala y automatiza hoy mismo.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:items-end mb-8 relative z-10">
                    <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-white">
                            ${isAnnual ? '299' : '349'}
                        </span>
                        <div className="flex flex-col text-left ml-2">
                            <span className="text-lg font-bold text-indigo-400">MXN</span>
                            <span className="text-slate-500 text-sm">/mes</span>
                        </div>
                    </div>
                    
                    <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/20 flex-1">
                        <p className="text-xs text-indigo-300 mb-1 font-bold uppercase">Rentabilidad:</p>
                        <p className="text-sm text-slate-300 leading-snug">
                            Se paga solo con <span className="text-white font-bold decoration-indigo-500 underline">1 venta</span> al mes.
                        </p>
                    </div>
                </div>

                <button className="relative z-10 w-full py-4 bg-indigo-600 active:bg-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-900/20 transition-transform active:scale-[0.98] mb-10">
                    Prueba Pro de 15 Días
                </button>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-200">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> <strong>Productos Ilimitados</strong></li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> <strong>Chatbot Negociador</strong></li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Dominio .com incluido</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> 0% Comisiones</li>
                </div>
            </div>

        </div>

        {/* FAQ RÁPIDO - Simplificado */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-white/5 pt-8">
            <div className="p-2">
                <h4 className="text-white font-bold mb-1">Sin tarjeta</h4>
                <p className="text-xs text-slate-400">Empieza gratis, pon datos luego.</p>
            </div>
            <div className="p-2">
                <h4 className="text-white font-bold mb-1">0% Comisiones</h4>
                <p className="text-xs text-slate-400">Tu venta es 100% tuya.</p>
            </div>
            <div className="p-2">
                <h4 className="text-white font-bold mb-1">Cancela fácil</h4>
                <p className="text-xs text-slate-400">Un clic y listo, sin llamadas.</p>
            </div>
        </div>

      </div>
    </section>
  );
};