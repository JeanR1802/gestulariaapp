'use client';

import React from 'react';
import { TrendingUp, Zap, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const BentoGrid = () => {
  return (
    <section className="relative py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                    Todo lo que necesitas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">vender más.</span>
                </h2>
                <p className="text-neutral-400 max-w-lg mx-auto">
                    Sin complicaciones técnicas. Una suite de herramientas diseñada para el comercio moderno en México.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                {/* Card 1 */}
                <div className="group relative bg-neutral-900/60 border border-white/10 rounded-3xl p-8 lg:col-span-2 flex flex-col justify-between hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/20 font-medium">Dashboard</span>
                            </div>
                            <h3 className="text-2xl font-semibold text-white">Ventas en Tiempo Real</h3>
                            <p className="text-neutral-400 text-sm mt-1">Controla tus ingresos diarios sin usar Excel.</p>
                        </div>
                        <div className="p-3 bg-neutral-800/50 rounded-xl border border-white/10">
                            <TrendingUp className="w-6 h-6 text-indigo-400" />
                        </div>
                    </div>
                    <div className="mt-auto w-full h-32 flex items-end justify-between gap-2 px-2">
                        {[40, 60, 30, 80, 55, 95].map((height, i) => (
                            <div key={i} className="w-full bg-neutral-700/30 rounded-t-sm" style={{ height: `${height}%` }} />
                        ))}
                    </div>
                </div>

                {/* Card 2 */}
                <div className="group relative bg-neutral-900/60 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-colors">
                    <div className="p-3 bg-blue-500/20 w-fit rounded-xl border border-blue-500/20 mb-4">
                        <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Velocidad Flash</h3>
                    <p className="text-neutral-400 text-sm mb-6">Carga en menos de 1 segundo. Tus clientes no esperan.</p>
                    <div className="mt-auto flex items-center gap-2 text-sm text-neutral-300">
                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[98%]" />
                        </div>
                        <span className="font-mono text-blue-400">98%</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="group relative bg-neutral-900/60 border border-white/10 rounded-3xl p-8 lg:row-span-2 flex flex-col text-center hover:border-white/20 transition-colors">
                    <div className="relative mx-auto mb-6 w-24 h-24">
                        <div className="relative w-full h-full bg-neutral-800 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                             <span className="text-4xl">👩‍💼</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-neutral-900 rounded-full p-2 border border-neutral-700">
                            <MessageCircle className="w-4 h-4 text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Pedidos por WhatsApp</h3>
                    <p className="text-neutral-400 text-sm mb-6">Recibe la orden lista. Sin &quot;precio por inbox&quot; ni confusiones.</p>
                    <button className="mt-8 mx-auto w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                        Ver Demo Chat <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Card 4 */}
                <div className="group relative bg-neutral-900/60 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                         <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                            <ShieldCheck className="w-6 h-6 text-orange-400" />
                        </div>
                        <span className="text-[10px] text-orange-400 font-mono bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">SSL 256-BIT</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Pagos Blindados</h3>
                    <p className="text-neutral-400 text-sm">Acepta Oxxo, Tarjetas y Transferencias con seguridad bancaria.</p>
                </div>

                {/* Card 5 - SIN IMÁGENES */}
                <div className="group relative lg:col-span-2 min-h-[300px] rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-blue-900/20">
                    <div className="relative h-full w-full bg-[#080808] rounded-[23px] p-8 md:p-10 flex flex-col justify-center items-start">
                        <div className="relative z-20">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                Tiendas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Vivas.</span>
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-md mb-8 font-medium">
                                Los catálogos estáticos murieron. Gestularia transforma tu inventario en <strong>experiencias inmersivas</strong> diseñadas para retener la atención y detonar la compra.
                            </p>
                            <button className="flex items-center gap-2 text-white font-bold bg-indigo-600/90 px-6 py-3 rounded-xl hover:bg-indigo-500 transition-colors">
                                Descubrir cómo <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};
