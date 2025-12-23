'use client';

import React, { useState } from 'react';
import { Check, X, Zap, ShieldCheck, Gem } from 'lucide-react';

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="relative py-24 px-4 bg-[#050505] overflow-hidden" id="precios">
      
      {/* Fondo sutil */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Pruébalo primero. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Paga solo si te funciona.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sin trucos, sin letras chiquitas y <strong>sin tarjeta de crédito</strong> para empezar.
            Queremos que Gestularia sea tu mejor inversión.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensual</span>
            <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors hover:bg-slate-700"
            >
                <div 
                    className="w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                    style={{ transform: isAnnual ? 'translateX(24px)' : 'translateX(0)' }}
                />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                Anual <span className="text-green-400 text-xs font-bold ml-1">AHORRAS 20%</span>
            </span>
          </div>
        </div>

        {/* --- GRID DE PRECIOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* 1. PLAN GRATUITO */}
            <div className="lg:col-span-5 bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-24 h-24 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Emprendedor</h3>
                <p className="text-slate-400 text-sm mb-6">Para validar tu idea y hacer tus primeras ventas.</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-white">$0</span>
                    <span className="text-slate-500">/mes</span>
                </div>

                <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all mb-8">
                    Crear cuenta gratis
                </button>

                <ul className="space-y-4 text-sm text-slate-300">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Tienda en línea básica</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Hasta 10 productos</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Pedidos por WhatsApp</li>
                    <li className="flex gap-3 opacity-50"><X className="w-5 h-5" /> Chatbot de negociación</li>
                </ul>
            </div>


            {/* 2. PLAN PRO (La Estrella) */}
            <div className="lg:col-span-7 bg-gradient-to-b from-indigo-900/40 to-[#0f0f0f] border border-indigo-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-indigo-900/20 hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                    <ShieldCheck className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wide">Garantía 30 días</span>
                </div>

                <div className="mb-8">
                    <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                        Plan Negocio <Gem className="w-6 h-6 text-indigo-400" />
                    </h3>
                    <p className="text-indigo-200/70 text-base">Todo lo que necesitas para escalar y automatizar.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:items-end mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-white">
                            ${isAnnual ? '299' : '349'}
                        </span>
                        <div className="flex flex-col text-left ml-2">
                            <span className="text-lg font-bold text-indigo-400">MXN</span>
                            <span className="text-slate-500 text-sm">/mes</span>
                        </div>
                    </div>
                    
                    <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/20 flex-1">
                        <p className="text-xs text-indigo-300 mb-1 font-bold uppercase">Análisis de Costo:</p>
                        <p className="text-sm text-slate-300 leading-snug">
                            Recuperas tu inversión con <span className="text-white font-bold underline decoration-indigo-500">1 sola venta</span> al mes.
                        </p>
                    </div>
                </div>

                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-600/25 transition-all mb-10 hover:-translate-y-1">
                    Comenzar Prueba Pro de 15 Días
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-200">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> <strong>Productos Ilimitados</strong></li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> <strong>Chatbot Negociador IA</strong></li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> Dominio .com incluido</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> 0% Comisiones por venta</li>
                </div>
            </div>

        </div>

        {/* FAQ RÁPIDO */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-white/5 pt-8">
            <div className="p-2">
                <h4 className="text-white font-bold mb-1">¿Necesito tarjeta?</h4>
                <p className="text-sm text-slate-400">No. Empieza gratis sin poner datos bancarios.</p>
            </div>
            <div className="p-2">
                <h4 className="text-white font-bold mb-1">¿Hay comisiones?</h4>
                <p className="text-sm text-slate-400">En el Plan Negocio, el 100% de la venta es tuya.</p>
            </div>
            <div className="p-2">
                <h4 className="text-white font-bold mb-1">¿Puedo cancelar?</h4>
                <p className="text-sm text-slate-400">Cuando quieras, con un solo clic.</p>
            </div>
        </div>

      </div>
    </section>
  );
};
