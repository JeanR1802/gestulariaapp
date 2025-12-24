'use client';

import React, { useState } from 'react';
import { Oswald } from 'next/font/google';
import { 
    ChevronRight, ChevronLeft, 
    MessageSquare, ShoppingBag, Receipt, 
    Share2, Timer, PackagePlus, Wallet, 
    Mic, Users, Gift, Star 
} from 'lucide-react';

const oswald = Oswald({ subsets: ['latin'], weight: '700', display: 'swap' });

/* --- VISUALES INTERNOS (CSS IN-JS PARA RENDIMIENTO) --- */

// 1. NEGOCIADOR IA (Morado)
const VisualNegotiator = () => (
    <div className="flex flex-col h-full pt-12 px-4 bg-[#111]">
        <div className="bg-purple-600 p-3 rounded-2xl rounded-tr-sm w-[85%] ml-auto mb-4 animate-in slide-in-from-right-4 fade-in duration-700">
            <div className="text-[10px] font-bold text-white mb-1 opacity-90">OFERTA FLASH ⚡</div>
            <div className="text-xs text-white">Te doy 10% OFF si compras ya.</div>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl w-[90%] animate-in slide-in-from-left-4 fade-in duration-700 delay-150">
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse" />
                <div className="text-xs text-slate-400">Escribiendo...</div>
            </div>
        </div>
        <button className="mt-auto mb-8 w-full py-3 bg-green-500 rounded-xl text-center text-xs font-bold text-black uppercase shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
            ACEPTAR OFERTA
        </button>
    </div>
);

// 2. TIENDA CINE (Azul)
const VisualStore = () => (
    <div className="relative h-full w-full bg-blue-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1" />
            </div>
        </div>
        <div className="absolute bottom-8 left-0 w-full p-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <button className="w-full py-3 bg-blue-600 rounded-full font-bold text-xs text-white shadow-lg shadow-blue-500/30">
                COMPRAR AHORA
            </button>
        </div>
    </div>
);

// 3. PRECIO VIRAL (Rosa)
const VisualViral = () => (
    <div className="flex flex-col items-center pt-12 px-4 bg-[#0a0508] h-full">
        <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mb-6 border border-pink-500/30">
            <Share2 className="text-pink-500 w-8 h-8" />
        </div>
        <div className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-4 mb-4 animate-in zoom-in fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-pink-400 font-bold uppercase">Precio Viral</span>
                <span className="text-2xl font-black text-white">$600</span>
            </div>
            <div className="text-xs text-slate-500 line-through text-right">$800</div>
            <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-pink-500"></div>
            </div>
            <div className="text-[10px] text-right text-pink-400 mt-1">Falta 1 compartido</div>
        </div>
        <button className="w-full py-3 bg-pink-600 rounded-lg text-[10px] font-bold text-white uppercase shadow-lg shadow-pink-500/30 animate-pulse">
            COMPARTIR AHORA
        </button>
    </div>
);

// 4. FLASH DROPS (Rojo)
const VisualDrops = () => (
    <div className="flex flex-col items-center justify-center h-full pb-8 bg-[#0f0505]">
        <div className="text-red-500 font-black text-6xl mb-2 tracking-tighter animate-pulse">04:59</div>
        <div className="text-xs text-red-400 uppercase tracking-[0.3em] mb-8">La tienda cierra en</div>
        <div className="grid grid-cols-2 gap-4 w-full px-4">
            <div className="bg-white/5 p-2 rounded border border-red-500/20 h-24 animate-in slide-in-from-bottom-4 fade-in duration-500" />
            <div className="bg-white/5 p-2 rounded border border-red-500/20 h-24 animate-in slide-in-from-bottom-4 fade-in duration-700" />
        </div>
    </div>
);

// 5. PACKS INTELIGENTES (Naranja)
const VisualBundles = () => (
    <div className="flex flex-col pt-12 px-4 bg-[#0a0502] h-full">
        <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-slate-800 rounded border border-white/10" />
            <div className="text-white text-xl font-bold">+</div>
            <div className="w-10 h-10 bg-slate-800 rounded border border-white/10" />
            <div className="text-white text-xl font-bold">=</div>
            <div className="text-orange-500 font-bold bg-orange-500/10 px-2 rounded">-20%</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl animate-in zoom-in fade-in duration-500">
            <div className="text-xs text-orange-400 font-bold uppercase mb-2">Sugerencia IA</div>
            <div className="text-sm text-white mb-4">Completa el look y ahorra $200.</div>
            <button className="w-full py-2 bg-orange-600 rounded text-xs font-bold text-white uppercase">
                AGREGAR PACK ($850)
            </button>
        </div>
    </div>
);

// 6. CASHBACK WALLET (Esmeralda)
const VisualCashback = () => (
    <div className="flex flex-col items-center pt-16 px-6 bg-[#020a05] h-full">
        <div className="w-full h-32 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl shadow-2xl p-4 flex flex-col justify-between animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="flex justify-between text-xs text-white/80">
                <span>TU SALDO</span>
                <Wallet className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-white">$150.00</div>
        </div>
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-200">
            <div className="text-xs text-slate-400 mb-1">Ganaste $50 hoy</div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wide">Expira en 24 horas</div>
        </div>
    </div>
);

// 7. AUDIO RECOVERY (Cyan)
const VisualAudio = () => (
    <div className="flex flex-col pt-16 px-4 bg-[#02080a] h-full">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-cyan-500 rounded-full" />
            <span className="text-xs text-slate-400">Soporte</span>
        </div>
        <div className="bg-[#202c33] p-3 rounded-xl rounded-tl-none w-[90%] border border-white/5 animate-in slide-in-from-left-4 fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
                </div>
                <div className="flex-1 h-8 flex items-center gap-1 opacity-60">
                    <div className="w-1 h-3 bg-slate-400 rounded-full" />
                    <div className="w-1 h-5 bg-slate-400 rounded-full animate-pulse" />
                    <div className="w-1 h-4 bg-slate-400 rounded-full" />
                    <div className="w-1 h-2 bg-slate-400 rounded-full" />
                </div>
                <span className="text-[10px] text-slate-400">0:15</span>
            </div>
        </div>
        <div className="mt-2 text-[10px] text-cyan-400 ml-2">Escuchado • 10:42 AM</div>
    </div>
);

// 8. MURO EN VIVO (Ámbar)
const VisualSocial = () => (
    <div className="flex flex-col justify-end h-full pb-16 px-4 space-y-3 bg-[#0a0500]">
        <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
            <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/10" />
            <div>
                <div className="text-[10px] text-white font-bold">Sofía compró Sneakers</div>
                <div className="text-[9px] text-amber-400">Hace 2 minutos • Monterrey</div>
            </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg flex items-center gap-3 opacity-50 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-200">
            <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/10" />
            <div>
                <div className="text-[10px] text-white font-bold">Carlos agregó al carrito</div>
                <div className="text-[9px] text-slate-500">Hace 5 minutos • CDMX</div>
            </div>
        </div>
    </div>
);

// 9. CAJA MISTERIOSA (Violeta)
const VisualMystery = () => (
    <div className="flex flex-col items-center pt-12 px-4 bg-[#05020a] h-full">
        <div className="w-28 h-28 bg-violet-600 rounded-xl shadow-[0_0_40px_rgba(124,58,237,0.4)] flex items-center justify-center mb-6 border border-white/20 animate-bounce">
            <Gift className="w-12 h-12 text-white/80" />
        </div>
        <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="text-violet-400 font-bold text-xs uppercase mb-1">Regalo Desbloqueable</div>
            <div className="text-white text-sm">
                Agrega <span className="text-violet-300 font-bold">$150</span> más.
            </div>
        </div>
        <div className="mt-6 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[70%] bg-violet-500 shadow-[0_0_10px_#8b5cf6]"></div>
        </div>
    </div>
);

// 10. MODO INFLUENCER (Oro)
const VisualInfluencer = () => (
    <div className="relative h-full w-full bg-[#0a0802]">
        <div className="absolute top-0 w-full h-24 bg-yellow-600/20 border-b border-yellow-500/30" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-yellow-400 shadow-lg mb-2" />
            <div className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-lg shadow-yellow-500/40">
                Selección de Yuya
            </div>
        </div>
        <div className="mt-40 px-4 grid grid-cols-2 gap-2">
            <div className="h-24 bg-white/5 rounded border border-white/10" />
            <div className="h-24 bg-white/5 rounded border border-white/10" />
        </div>
    </div>
);


/* --- DATOS MAESTROS DE LAS 10 HERRAMIENTAS --- */
const features = [
  {
    title: 'NEGOCIADOR IA',
    subtitle: 'Venta Automática',
    description: 'Tu bot detecta indecisión y lanza la oferta exacta para cerrar la venta.',
    theme: 'purple',
    gradient: 'from-purple-600 via-indigo-600 to-violet-600',
    bgGlow: 'bg-purple-600/20',
    icon: MessageSquare,
    visual: <VisualNegotiator />
  },
  {
    title: 'TIENDA CINE',
    subtitle: 'Modo TikTok',
    description: 'Videos a pantalla completa. Tus clientes no leen, ven.',
    theme: 'blue',
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    bgGlow: 'bg-blue-600/20',
    icon: ShoppingBag,
    visual: <VisualStore />
  },
  {
    title: 'PRECIO VIRAL',
    subtitle: 'Tráfico Gratis',
    description: 'El precio baja si comparten en WhatsApp. 1 cliente te trae a 3.',
    theme: 'pink',
    gradient: 'from-pink-500 via-rose-500 to-red-400',
    bgGlow: 'bg-pink-600/20',
    icon: Share2,
    visual: <VisualViral />
  },
  {
    title: 'FLASH DROPS',
    subtitle: 'Escasez Real',
    description: 'La tienda abre solo 1 hora. Contador regresivo que crea locura de compra.',
    theme: 'red',
    gradient: 'from-red-600 via-orange-600 to-red-500',
    bgGlow: 'bg-red-600/20',
    icon: Timer,
    visual: <VisualDrops />
  },
  {
    title: 'PACKS INTELIGENTES',
    subtitle: 'Ticket Alto',
    description: 'Arma paquetes automáticos. "¿Llevas tenis? Agrega calcetas por $50".',
    theme: 'orange',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    bgGlow: 'bg-orange-600/20',
    icon: PackagePlus,
    visual: <VisualBundles />
  },
  {
    title: 'CASHBACK WALLET',
    subtitle: 'Recompra Segura',
    description: 'No des puntos, da dinero para la SIGUIENTE compra. Obliga a volver.',
    theme: 'emerald',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    bgGlow: 'bg-emerald-600/20',
    icon: Wallet,
    visual: <VisualCashback />
  },
  {
    title: 'AUDIO RECOVERY',
    subtitle: 'Toque Humano',
    description: 'Envía notas de voz por WhatsApp si abandonan el carrito.',
    theme: 'cyan',
    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
    bgGlow: 'bg-cyan-600/20',
    icon: Mic,
    visual: <VisualAudio />
  },
  {
    title: 'MURO EN VIVO',
    subtitle: 'Efecto FOMO',
    description: 'Muestra quién está comprando en tiempo real. Genera confianza masiva.',
    theme: 'amber',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    bgGlow: 'bg-amber-600/20',
    icon: Users,
    visual: <VisualSocial />
  },
  {
    title: 'CAJA MISTERIOSA',
    subtitle: 'Gamificación',
    description: 'Ofrece un regalo sorpresa si agregan $X más al carrito.',
    theme: 'violet',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    bgGlow: 'bg-violet-600/20',
    icon: Gift,
    visual: <VisualMystery />
  },
  {
    title: 'MODO INFLUENCER',
    subtitle: 'Afiliados Pro',
    description: 'Si entran con link de influencer, la tienda cambia de tema.',
    theme: 'yellow',
    gradient: 'from-yellow-500 via-amber-500 to-orange-400',
    bgGlow: 'bg-yellow-600/20',
    icon: Star,
    visual: <VisualInfluencer />
  }
];

export const InteractiveShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeFeature = features[currentIndex];

  const handleSlideChange = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 300); // 300ms de bloqueo para evitar bugs
  };

  const nextSlide = () => {
    handleSlideChange((currentIndex === features.length - 1) ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    handleSlideChange((currentIndex === 0) ? features.length - 1 : currentIndex - 1);
  };

  return (
    <section className="py-16 sm:py-24 px-4 bg-[#020202] overflow-hidden relative">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* TÍTULO */}
        <div className="mb-8 sm:mb-12 text-center">
            <h2 className={`${oswald.className} text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight`}>
                Laboratorio de <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Ventas.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-mono tracking-widest">
                10 HERRAMIENTAS • {currentIndex + 1} DE 10
            </p>
        </div>

        {/* --- EL VISOR (SLIDER) --- */}
        <div className="relative w-full rounded-3xl sm:rounded-[40px] overflow-hidden flex flex-col md:flex-row group transition-all duration-700 min-h-[600px] md:h-[550px]">
            {/* Borde gradiente exterior */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeFeature.gradient} p-[2px] rounded-3xl sm:rounded-[40px] transition-all duration-500`}>
                <div className="absolute inset-0 bg-[#080808] rounded-3xl sm:rounded-[40px]" />
            </div>
            
            {/* FONDO DINÁMICO */}
            <div className={`absolute inset-0 transition-colors duration-700 ${activeFeature.bgGlow} blur-[150px] opacity-40 pointer-events-none`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080808_100%)] pointer-events-none" />

            {/* --- CONTROLES DESKTOP - MÁS LLAMATIVOS (SOLO PC) --- */}
            <button 
                onClick={prevSlide} 
                className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white transition-all hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] items-center justify-center font-bold group animate-pulse hover:animate-none"
                aria-label="Anterior herramienta"
            >
                <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 group-hover:translate-x-[-2px] transition-transform" strokeWidth={3} />
            </button>
            <button 
                onClick={nextSlide} 
                className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] items-center justify-center font-bold group animate-pulse hover:animate-none"
                aria-label="Siguiente herramienta"
            >
                <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 group-hover:translate-x-[2px] transition-transform" strokeWidth={3} />
            </button>

            {/* --- IZQUIERDA: TEXTO --- */}
            <div className="relative z-20 w-full md:w-1/2 p-6 sm:p-8 md:p-16 flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-white/10">
                
                {/* Barra de color lateral */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${activeFeature.gradient}`} />
                
                {/* Icono Flotante con color */}
                <div key={`icon-${currentIndex}`} className={`mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br ${activeFeature.gradient} flex items-center justify-center animate-in fade-in zoom-in duration-300 shadow-lg`}>
                    <activeFeature.icon className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>

                {/* Textos */}
                <div key={`text-${currentIndex}`} className="animate-in slide-in-from-left-4 fade-in duration-300 mb-6">
                    <h3 className={`${oswald.className} text-3xl sm:text-4xl md:text-5xl text-white mb-2 leading-none uppercase tracking-tight`}>
                        {activeFeature.title}
                    </h3>
                    <h4 className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${activeFeature.gradient} bg-clip-text text-transparent mb-4 uppercase tracking-wider`}>
                        {activeFeature.subtitle}
                    </h4>
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md">
                        {activeFeature.description}
                    </p>
                </div>

                {/* Barra de Progreso con gradiente */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6 md:mb-0 max-w-[200px]">
                    <div 
                        className={`h-full bg-gradient-to-r ${activeFeature.gradient} transition-all duration-300 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]`}
                        style={{ width: `${((currentIndex + 1) / features.length) * 100}%` }} 
                    />
                </div>

                     {/* Controles Móvil - MÁS LLAMATIVOS Y CLAROS */}
                     <div className="flex md:hidden gap-3 w-full mt-4">
                            <button 
                                onClick={prevSlide} 
                                disabled={currentIndex === 0}
                                aria-disabled={currentIndex === 0}
                                className={
                                  `flex-1 py-4 rounded-2xl border-2 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg font-bold ` +
                                  (currentIndex === 0
                                     ? 'bg-white/5 border-white/10 text-white/60 pointer-events-none opacity-40'
                                     : 'bg-white/10 border-white/30 hover:bg-white/20 text-white')
                                }
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                                <span className="text-sm uppercase tracking-wider">Atrás</span>
                            </button>

                            <button 
                                onClick={nextSlide} 
                                className={`flex-1 py-4 bg-gradient-to-r ${activeFeature.gradient} rounded-2xl flex items-center justify-center gap-2 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-95 transition-all font-bold border-2 border-white/20`}
                                aria-label="Siguiente"
                            >
                                <span className="text-sm uppercase tracking-wider">Siguiente</span>
                                <ChevronRight className="w-6 h-6" strokeWidth={3} />
                            </button>
                     </div>
            </div>

            {/* --- DERECHA: VISUAL --- */}
            <div className="relative z-20 w-full md:w-1/2 h-[350px] sm:h-[400px] md:h-auto bg-[#030303]/50 flex items-center justify-center overflow-hidden p-6">
                
                {/* Teléfono */}
                <div className="relative w-full max-w-[260px] sm:max-w-[280px] h-full max-h-[400px] sm:max-h-[450px]">
                     <div className="absolute inset-0 bg-[#0a0a0a] rounded-[2.5rem] border-2 border-white/20 shadow-2xl overflow-hidden transition-all duration-500">
                        {/* Isla Dinámica */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-20 border border-white/10 border-t-0" />
                        
                        {/* PANTALLA */}
                        <div key={`screen-${currentIndex}`} className="absolute inset-0 w-full h-full pt-8 overflow-hidden animate-in fade-in duration-500">
                             {activeFeature.visual}
                        </div>

                        {/* Reflejo */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem]" />
                    </div>
                </div>

            </div>

        </div>

      </div>
    </section>
  );
};