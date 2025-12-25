'use client';

import React, { useState, useCallback, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { 
  Store, 
  MessageCircle, 
  CreditCard, 
  BarChart3, 
  Plus, 
  X, 
  ArrowRight, 
  LayoutGrid, 
  Zap
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';

// --- CONFIGURACIÓN DE MÓDULOS (DISEÑO BLUE & LANDING MATCH) ---
type ModuleType = 'store' | 'orders' | 'finance' | 'analytics' | 'crm';

type ModuleDef = {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  Icon: React.ElementType;
  theme: {
    gradient: string;
    accent: string;   
    glow: string;     
    shadow: string;   
  };
  status?: 'Próximamente';
  actionLabel: string;
};

const MODULE_DEFINITIONS: Record<ModuleType, Omit<ModuleDef, 'id'>> = {
  store: {
    type: 'store',
    title: 'Mi Tienda',
    description: 'Gestiona tu catálogo y diseño visual.',
    Icon: Store,
    actionLabel: 'Editar Tienda',
    theme: {
      // AZUL / ÍNDIGO (Coincide con botón "Prueba Gratis" de Landing)
      gradient: 'from-blue-600 to-indigo-600',
      accent: '#2563eb', // blue-600
      glow: 'rgba(37, 99, 235, 0.5)',
      shadow: 'shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]'
    }
  },
  orders: {
    type: 'orders',
    title: 'Pedidos & Bot',
    description: 'Ventas flash automatizadas por WhatsApp.',
    Icon: MessageCircle,
    actionLabel: 'Ver Pedidos',
    theme: {
      // NARANJA (Coincide con sección "Pedidos Flash")
      gradient: 'from-orange-500 to-amber-500',
      accent: '#f97316', // orange-500
      glow: 'rgba(249, 115, 22, 0.5)',
      shadow: 'shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]'
    }
  },
  finance: {
    type: 'finance',
    title: 'Finanzas',
    description: 'Pagos blindados y retiros.',
    Icon: CreditCard,
    actionLabel: 'Ir a Billetera',
    theme: {
      // VERDE (Coincide con sección "Pagos Blindados")
      gradient: 'from-emerald-500 to-green-500',
      accent: '#10b981', // emerald-500
      glow: 'rgba(16, 185, 129, 0.5)',
      shadow: 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]'
    }
  },
  analytics: {
    type: 'analytics',
    title: 'Métricas',
    description: 'Rendimiento de tu negocio en tiempo real.',
    Icon: BarChart3,
    actionLabel: 'Ver Reporte',
    theme: {
      // CELESTE / SKY (Coincide con highlights de landing)
      gradient: 'from-sky-500 to-cyan-500',
      accent: '#0ea5e9', // sky-500
      glow: 'rgba(14, 165, 233, 0.5)',
      shadow: 'shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]'
    },
    status: 'Próximamente'
  },
  crm: {
    type: 'crm',
    title: 'Clientes',
    description: 'Base de datos de compradores.',
    Icon: Zap,
    actionLabel: 'Gestionar',
    theme: {
      gradient: 'from-pink-500 to-rose-500',
      accent: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.5)',
      shadow: 'shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]'
    },
    status: 'Próximamente'
  }
};

export default function DashboardHomePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); // Usamos el contexto para el botón
  
  const [activeModules, setActiveModules] = useState<ModuleDef[]>([
    { id: 'mod-store', ...MODULE_DEFINITIONS.store },
    { id: 'mod-orders', ...MODULE_DEFINITIONS.orders },
    { id: 'mod-finance', ...MODULE_DEFINITIONS.finance }
  ]);
  
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);

  const addModule = useCallback((type: ModuleType) => {
    const def = MODULE_DEFINITIONS[type];
    setActiveModules(prev => {
      if (prev.some(m => m.type === type)) return prev;
      return [...prev, { id: `${type}-${Date.now()}`, ...def }];
    });
    setIsToolboxOpen(false);
  }, []);

  const removeModule = useCallback((id: string) => {
    setActiveModules(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleCardClick = useCallback((module: ModuleDef) => {
    if (!module.status) {
      if (module.type === 'store') {
        router.push('/dashboard/sites/list');
      } else {
        router.push(`/dashboard/${module.type}`);
      }
    }
  }, [router]);

  const availableModules = useMemo(() => Object.values(MODULE_DEFINITIONS), []);

  return (
    <div 
      className="relative min-h-full p-6 sm:p-10 font-sans transition-colors duration-500" 
      style={{ 
        // Fondo: Blanco en modo claro, Azul oscuro en oscuro (coincide con Dashboard)
        backgroundColor: theme === 'light' ? '#F8FAFC' : '#0D1222', 
        color: theme === 'light' ? '#0f172a' : '#ffffff'
      }}
    >
      {/* HEADER CON BOTONES */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">
            Centro de Control
          </h1>
          <p className="text-sm opacity-60">
            Tu ecosistema de ventas automatizado.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* BOTÓN MODO DÍA/NOCHE (Reutilizable) */}
            <ThemeToggle />

            {/* BOTÓN PERSONALIZAR */}
            <button
                onClick={() => setIsToolboxOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{
                    // Azul Real (Blue-600)
                    backgroundColor: '#2563eb', 
                    color: '#ffffff',
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
                }}
            >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Personalizar</span>
            </button>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      {activeModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
          {activeModules.map((module) => (
            <BentoCard 
              key={module.id} 
              module={module} 
              onRemove={() => removeModule(module.id)}
              onClick={() => handleCardClick(module)}
            />
          ))}
          
          {/* Card Placeholder (Añadir) */}
          <div 
            onClick={() => setIsToolboxOpen(true)}
            className="group min-h-[260px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-500/50 hover:bg-blue-500/5 opacity-60 hover:opacity-100"
            style={{ 
              borderColor: theme === 'light' ? '#e2e8f0' : '#333'
            }}
          >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110" 
                style={{ backgroundColor: theme === 'light' ? '#f1f5f9' : '#1a1a1a' }}
              >
                <Plus className="w-6 h-6 opacity-50" />
              </div>
              <span className="text-sm font-bold opacity-60">Añadir Herramienta</span>
          </div>
        </div>
      ) : (
        <EmptyState onOpenToolbox={() => setIsToolboxOpen(true)} />
      )}

      <ToolboxModal 
        isOpen={isToolboxOpen}
        onClose={() => setIsToolboxOpen(false)}
        modules={availableModules}
        activeModules={activeModules}
        onAddModule={addModule}
      />
    </div>
  );
}

// --- TARJETA ESTILO BENTO (Premium & Clean) ---
// Helper: oscurecer un color hex (%) — usado solo para variantes en modo oscuro
function darkenHex(hex: string, percent: number) {
  try {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const num = parseInt(h, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    const factor = 1 - percent / 100;
    r = Math.max(0, Math.min(255, Math.round(r * factor)));
    g = Math.max(0, Math.min(255, Math.round(g * factor)));
    b = Math.max(0, Math.min(255, Math.round(b * factor)));
    const out = (r << 16) + (g << 8) + b;
    return `#${out.toString(16).padStart(6, '0')}`;
  } catch (_e) {
    return hex;
  }
}

const BentoCard = React.memo(({ 
  module, 
  onRemove, 
  onClick 
}: { 
  module: ModuleDef; 
  onRemove: () => void; 
  onClick: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={module.status ? undefined : onClick}
      className={cn(
        "relative rounded-3xl p-8 min-h-[280px] flex flex-col justify-between overflow-hidden group transition-all duration-500",
        module.status ? 'cursor-not-allowed opacity-70 grayscale-[0.5]' : 'cursor-pointer hover:-translate-y-2'
      )}
      style={{
        // En modo oscuro usamos una versión ligeramente más oscura del color accent
        backgroundColor: theme === 'light' ? '#FFFFFF' : darkenHex(module.theme?.accent || '#0A0A0A', 18),
        boxShadow: theme === 'light'
           ? '0 10px 40px -10px rgba(0,0,0,0.08)'
           : `0 6px 20px -6px ${darkenHex(module.theme?.accent || '#000000', 25)}33`
      }}
    >
      {/* GRADIENTE DE FONDO (Hover) */}
      <div 
        className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br",
            module.theme.gradient
        )} 
      />
      
      {/* LUZ DE ESQUINA (Spotlight) */}
      <div 
        className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: theme === 'light' ? module.theme.accent : darkenHex(module.theme.accent, 22) }}
      />

      {/* CABECERA */}
      <div className="relative z-10 flex justify-between items-start">
        <div 
           className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
           style={{ 
             background: `linear-gradient(135deg, ${theme === 'light' ? module.theme.accent : darkenHex(module.theme.accent, 12)}, ${theme === 'light' ? module.theme.accent + 'dd' : darkenHex(module.theme.accent, 12) + 'dd'})`,
             boxShadow: `0 8px 25px -6px ${theme === 'light' ? module.theme.accent + '80' : darkenHex(module.theme.accent, 22) + '80'}`
           }}
        >
          <module.Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500"
          title="Ocultar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 mt-6 space-y-2" style={{ color: theme === 'light' ? undefined : '#ffffff' }}>
        <h3 className="text-2xl font-black tracking-tight" style={{ color: theme === 'light' ? undefined : '#ffffff' }}>
          {module.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed opacity-60 max-w-[90%]" style={{ color: theme === 'light' ? undefined : 'rgba(255,255,255,0.85)' }}>
          {module.description}
        </p>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-6 pt-4 flex items-center justify-between border-t border-dashed" style={{ borderColor: theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
         {module.status ? (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-500/10 text-gray-500">
            {module.status}
          </span>
         ) : (
           <>
            <span 
              className="text-sm font-bold flex items-center gap-2 transition-all group-hover:translate-x-1"
              style={{ color: theme === 'light' ? module.theme.accent : '#ffffff' }}
            >
              {module.actionLabel}
            </span>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              style={{ backgroundColor: theme === 'light' ? (module.theme.accent + '15') : 'rgba(255,255,255,0.08)', color: theme === 'light' ? module.theme.accent : '#ffffff' }}
            >
              <ArrowRight className="w-4 h-4" />
            </div>
           </>
         )}
      </div>
    </div>
  );
});
BentoCard.displayName = 'BentoCard';

// --- MODAL DE HERRAMIENTAS ---
const ToolboxModal = ({ isOpen, onClose, modules, activeModules, onAddModule }: any) => {
  const { theme } = useTheme();
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <div className="absolute inset-y-0 right-0 w-full max-w-sm shadow-2xl bg-white dark:bg-[#0A0A0A] border-l dark:border-white/10 flex flex-col h-full">
                <div className="p-6 border-b dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#0F0F0F]">
                    <h2 className="text-lg font-black uppercase tracking-wide">Galería</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 opacity-60" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {(modules as ModuleDef[]).map((m) => {
                        const isActive = (activeModules as ModuleDef[]).some(am => am.type === m.type);
                        return (
                            <div key={m.type} className="p-4 rounded-xl border dark:border-white/10 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.theme.accent + '20', color: m.theme.accent }}>
                                    <m.Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{m.title}</h4>
                                    <p className="text-xs opacity-60 line-clamp-1">{m.description}</p>
                                </div>
                                <button 
                                    onClick={() => onAddModule(m.type)}
                                    disabled={isActive || !!m.status}
                                    className={cn(
                                        "px-3 py-1.5 rounded text-xs font-bold transition-all",
                                        isActive ? "bg-green-500/10 text-green-600" : "bg-black text-white dark:bg-white dark:text-black hover:scale-105"
                                    )}
                                >
                                    {isActive ? "Activo" : "Añadir"}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

const EmptyState = ({ onOpenToolbox }: { onOpenToolbox: () => void }) => (
  <div className="h-96 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-all border-slate-300 dark:border-slate-700">
    <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
    <h3 className="text-lg font-medium">Panel Vacío</h3>
    <button onClick={onOpenToolbox} className="text-blue-600 dark:text-blue-400 font-bold hover:underline mt-2">
      Configurar Panel
    </button>
  </div>
);