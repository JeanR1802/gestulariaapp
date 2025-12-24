'use client';

import React, { useState } from 'react';
import { ShoppingBag, MessageSquareMore, ReceiptText, CheckCircle2 } from 'lucide-react';

const features = [
  {
    id: 'gallery',
    icon: ShoppingBag,
    label: "Tienda",
    title: "Galería Inmersiva",
    subtitle: "Muestra el producto.",
    description: "Video a pantalla completa con botón de compra.",
    activeColor: "bg-blue-600", 
    activeShadow: "shadow-blue-500/30",
    gradient: "from-blue-900 to-slate-900"
  },
  {
    id: 'deals',
    icon: MessageSquareMore,
    label: "Chat",
    title: "Cierre Automático",
    subtitle: "Trato directo.",
    description: "El sistema negocia por ti y cierra la venta.",
    activeColor: "bg-purple-600",
    activeShadow: "shadow-purple-500/30",
    gradient: "from-purple-950 to-slate-900"
  },
  {
    id: 'orders',
    icon: ReceiptText,
    label: "Recibo",
    title: "Pedidos Claros",
    subtitle: "Orden total.",
    description: "Detalles listos para enviar a WhatsApp.",
    activeColor: "bg-emerald-600",
    activeShadow: "shadow-emerald-500/30",
    gradient: "from-emerald-950 to-slate-900"
  }
];

export const InteractiveShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="relative py-16 lg:py-24 px-4 z-10 bg-neutral-950">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* TÍTULO */}
        <div className="text-center mb-10 lg:mb-20">
           <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-2 leading-tight">
              Tu tienda,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
                tu máquina de ventas.
              </span>
           </h2>
        </div>

        {/* --- DISEÑO MÓVIL --- */}
        <div className="lg:hidden flex flex-col items-center">
            <div className="flex w-full max-w-sm gap-2 mb-6">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300 border border-transparent ${
                            activeFeature.id === feature.id 
                            ? `${feature.activeColor} text-white shadow-lg ${feature.activeShadow} scale-105` 
                            : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        <feature.icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{feature.label}</span>
                    </button>
                ))}
            </div>

            <div className="text-center max-w-xs px-2 mb-6 h-[70px]">
                <div className="transition-opacity duration-200">
                    <h3 className="text-lg font-bold text-white leading-tight">{activeFeature.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-snug">
                        {activeFeature.description}
                    </p>
                </div>
            </div>

            <div className="w-full flex justify-center">
                 <PhoneMockup activeFeature={activeFeature} isMobile={true} />
            </div>
        </div>

        {/* --- DISEÑO ESCRITORIO --- */}
        <div className="hidden lg:grid grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature)}
                  className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 ${
                    activeFeature.id === feature.id 
                      ? 'bg-white/5 border-white/20 shadow-2xl' 
                      : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                   <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${activeFeature.id === feature.id ? feature.activeColor : 'bg-transparent'}`} />

                   <div className="relative z-10 pl-4">
                       <div className={`mb-4 inline-flex p-3 rounded-xl transition-colors duration-300 ${activeFeature.id === feature.id ? feature.activeColor : 'bg-white/10'} text-white`}>
                          <feature.icon className="w-6 h-6" />
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                       <p className={`text-slate-400 leading-relaxed transition-all ${activeFeature.id === feature.id ? 'opacity-100 max-h-40' : 'opacity-70 group-hover:opacity-100'}`}>
                          {feature.description}
                       </p>
                   </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
                <PhoneMockup activeFeature={activeFeature} isMobile={false} />
            </div>
        </div>

      </div>
    </section>
  );
};

// COMPONENTE MOCKUP OPTIMIZADO
const PhoneMockup = ({ activeFeature, isMobile }: { activeFeature: typeof features[0], isMobile: boolean }) => {
    return (
        <div 
            className={`relative bg-[#020617] rounded-[40px] border-[8px] border-[#121212] overflow-hidden z-20 mx-auto
                ${isMobile ? 'w-[280px] h-[480px]' : 'w-[340px] h-[680px]'}
            `}
            // OPTIMIZACIÓN CRÍTICA: Quitamos sombras difusas en móvil
            style={{ 
                boxShadow: isMobile 
                  ? '0 0 0 1px rgba(255,255,255,0.1) inset' // Solo borde sutil
                  : '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset' 
            }}
        >
            <div className="absolute top-0 inset-x-0 h-6 bg-[#121212] z-50 rounded-b-xl mx-auto w-28"></div>

            <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                    
                    {/* VISTA 1: TIENDA */}
                    <PhoneScreen key="gallery" gradient={activeFeature.gradient} isActive={activeFeature.id === 'gallery'}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                            
                        <div className={`absolute left-6 text-xs font-bold text-white uppercase tracking-widest ${isMobile ? 'top-8' : 'top-12'}`}>Nike Air Max</div>
                        
                        <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent ${isMobile ? 'p-5 pt-12' : 'p-6 pt-20'}`}>
                            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-white mb-1`}>Red Supreme</h2>
                            <p className={`${isMobile ? 'text-base' : 'text-lg'} text-white mb-4 font-medium`}>$2,499 MXN</p>
                            <button className={`w-full bg-blue-600 rounded-full text-white font-bold flex items-center justify-center gap-2 shadow-lg ${isMobile ? 'py-2.5 text-xs' : 'py-3 text-sm'}`}>
                                <ShoppingBag className="w-4 h-4" /> COMPRAR
                            </button>
                        </div>
                    </PhoneScreen>

                    {/* VISTA 2: CHAT */}
                    <PhoneScreen key="deals" gradient={activeFeature.gradient} isActive={activeFeature.id === 'deals'}>
                        <div className={`${isMobile ? 'pt-12 px-3' : 'pt-20 px-4'} flex flex-col h-full`}>
                            <div className="text-center mb-4">
                                <div className={`bg-purple-600 rounded-full mx-auto flex items-center justify-center mb-2 shadow-lg ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}>
                                    <MessageSquareMore className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                                </div>
                                <h3 className="text-white font-bold text-sm">Asistente Virtual</h3>
                            </div>
                            <div className="flex flex-col gap-2 flex-grow">
                                <ChatMessage isBot compact={isMobile}>El precio es $2,499.</ChatMessage>
                                <ChatMessage isBot compact={isMobile}>Si compras HOY...</ChatMessage>
                                <ChatMessage isBot compact={isMobile}>Oferta: <span className="text-green-400 font-bold">$2,250</span>.</ChatMessage>
                            </div>
                            <div className={`${isMobile ? 'pb-4' : 'pb-6'}`}>
                                <button className={`w-full bg-green-600 rounded-full text-white font-bold flex items-center justify-center gap-2 shadow-lg ${isMobile ? 'py-2.5 text-xs' : 'py-3 text-sm'}`}>
                                    <CheckCircle2 className="w-4 h-4" /> Aceptar Oferta
                                </button>
                            </div>
                        </div>
                    </PhoneScreen>

                    {/* VISTA 3: RECIBO */}
                    <PhoneScreen key="orders" gradient={activeFeature.gradient} isActive={activeFeature.id === 'orders'}>
                        <div className={`${isMobile ? 'pt-12 px-4' : 'pt-20 px-5'} h-full flex flex-col`}>
                            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-4 flex items-center gap-2`}>
                                <ReceiptText className="w-5 h-5" /> Tu Recibo
                            </h2>
                            <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/10">
                                <div className="flex gap-3 mb-3 pb-3 border-b border-white/10">
                                    <div className={`bg-gradient-to-br from-blue-500 to-blue-700 rounded overflow-hidden relative ${isMobile ? 'w-10 h-10' : 'w-14 h-14'}`} />
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Nike Air Max</h3>
                                        <p className="text-slate-400 text-xs">Talla: 28 MX</p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-white font-bold mt-2">
                                    <span>Total</span><span>$2,250</span>
                                </div>
                            </div>
                            <button className={`w-full mt-auto mb-6 bg-emerald-600 rounded-full text-white font-bold flex items-center justify-center gap-2 shadow-lg ${isMobile ? 'py-2.5 text-xs' : 'py-3 text-sm'}`}>
                                Enviar a WhatsApp
                            </button>
                        </div>
                    </PhoneScreen>

            </div>
        </div>
    );
}

const PhoneScreen = ({ children, gradient, isActive }: { children: React.ReactNode, gradient: string, isActive: boolean }) => (
  <div
    className={`w-full h-full absolute inset-0 bg-gradient-to-b ${gradient} transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
  >
    {children}
  </div>
);

const ChatMessage = ({ children, isBot, compact }: { children: React.ReactNode, isBot?: boolean, compact?: boolean }) => (
  <div 
    className={`rounded-2xl max-w-[85%] ${compact ? 'p-2 text-[10px]' : 'p-3 text-xs'} ${
      isBot ? 'bg-white/10 text-white rounded-bl-sm mr-auto' : 'bg-blue-600 text-white rounded-br-sm ml-auto'
    }`}
  >
    {children}
  </div>
);