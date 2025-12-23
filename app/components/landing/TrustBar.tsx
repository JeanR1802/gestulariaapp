'use client';
import React from 'react';

export const TrustBar = () => {
  return (
    <section className="py-8 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
                Tecnología que cumple con México
            </p>
            {/* NOTA: Usamos texto/SVGs simulados por ahora. 
               Lo ideal es reemplazar esto con los SVGs reales de SAT, Oxxo, etc.
            */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholder para Logo SAT */}
                <div className="h-8 flex items-center font-bold text-xl text-slate-600">SAT<span className="text-xs ml-1 border border-slate-400 px-1 rounded">CFDI 4.0</span></div>
                
                {/* Placeholder para OXXO */}
                <div className="h-8 flex items-center font-black text-xl text-red-600 bg-white px-2 border border-yellow-400 rounded">OXXO</div>
                
                {/* Placeholder para SPEI */}
                <div className="h-8 flex items-center font-bold text-xl text-blue-700">SPEI</div>

                {/* Placeholder para WhatsApp API */}
                <div className="h-8 flex items-center font-bold text-xl text-green-600">WhatsApp API</div>
            </div>
        </div>
    </section>
  );
};