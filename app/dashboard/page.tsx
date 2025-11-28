// app/dashboard/page.tsx
'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, XMarkIcon, Squares2X2Icon, 
  ArrowTrendingUpIcon, SparklesIcon, UserCircleIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/hooks/useAuth';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';

// --- CONFIGURACIÓN DE MÓDULOS ---
type ModuleSize = 'size-1x1' | 'size-2x1' | 'size-2x2' | 'size-4x1';

type Module = {
  id: string;
  type: 'kpi' | 'chart' | 'list' | 'banner';
  title: string;
  size: ModuleSize;
  data?: any;
};

type Site = {
  id: string;
  name: string;
  domain: string;
};

// Datos iniciales simulados
const INITIAL_MODULES: Module[] = [
  { id: '1', type: 'banner', title: 'Bienvenido a Gestularia', size: 'size-4x1', data: { subtitle: 'Tu panel está listo.' } },
  { id: '2', type: 'kpi', title: 'Visitas Totales', size: 'size-1x1', data: { value: '12.5k', trend: '+15%' } },
  { id: '3', type: 'chart', title: 'Rendimiento', size: 'size-2x1', data: { bars: [40, 70, 45, 90, 60] } },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [loadingSites, setLoadingSites] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isInsertMode, setIsInsertMode] = useState(false);
  const [pendingModuleType, setPendingModuleType] = useState<{type: Module['type'], size: ModuleSize} | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  // Cargar sitios del usuario
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchSites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        try {
          const res = await fetch('/api/tenants', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            if (res.status === 401) {
              // Redirigir al login si el token es inválido
              router.push('/login');
              return;
            }
            throw new Error('Error al obtener los tenants');
          }

          const data = await res.json();
          const sitesList = data.tenants || [];
          setSites(sitesList);
          if (sitesList.length > 0) {
            setCurrentSite(sitesList[0]);
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [user, authLoading, router]);

  // --- ACCIONES (useCallback para evitar re-renders) ---
  const activateInsertMode = useCallback((type: Module['type'], size: ModuleSize) => {
    setIsFabOpen(false);
    setPendingModuleType({ type, size });
    setIsInsertMode(true);
    
    // Usar ref en lugar de querySelector
    setTimeout(() => {
      if (slotRef.current) {
        slotRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }, []);

  const confirmInsert = useCallback(() => {
    if (!pendingModuleType) return;
    
    const newModule: Module = {
      id: Date.now().toString(),
      type: pendingModuleType.type,
      size: pendingModuleType.size,
      title: pendingModuleType.type === 'kpi' ? 'Nueva Métrica' : 'Nuevo Módulo',
      data: generateMockData(pendingModuleType.type)
    };

    setModules(prev => [...prev, newModule]);
    setIsInsertMode(false);
    setPendingModuleType(null);
  }, [pendingModuleType]);

  const removeModule = useCallback((id: string) => {
    setModules(prev => prev.filter(m => m.id !== id)); 
  }, []);

  // Helper para datos falsos (fuera del componente si es posible, pero aquí es ok)
  const generateMockData = useCallback((type: string) => {
    if (type === 'kpi') return { value: Math.floor(Math.random() * 1000), trend: '+5%' };
    if (type === 'chart') return { bars: Array.from({length: 5}, () => Math.floor(Math.random() * 100)) };
    return {};
  }, []);

  // Cancelar inserción al hacer click fuera del slot o FAB (OPTIMIZADO)
  React.useEffect(() => {
    if (!isInsertMode) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Usar referencias directas en lugar de closest (más rápido)
      const clickedSlot = slotRef.current?.contains(target);
      const clickedFab = target.closest('.fab-container');
      
      if (!clickedSlot && !clickedFab) {
        setIsInsertMode(false);
        setPendingModuleType(null);
      }
    };

    // Usar capture phase para mejor rendimiento
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [isInsertMode]);

  if (authLoading || loadingSites) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div style={{ color: c.text.primary }}>Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full" style={{ backgroundColor: c.bg.primary }}>
      {/* Header removed here to avoid duplicate; using the site-specific header elsewhere */}

      {/* --- GRID DE MÓDULOS (Bento Grid optimizado) --- */}
      <div className="p-6 sm:p-8">
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[160px] gap-6 pb-24"
          style={{ 
            gridAutoFlow: 'row dense',
            // Optimización: usar contain para aislar el layout
            contain: 'layout style paint'
          }}
        >
          {/* Módulos Renderizados */}
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} onRemove={removeModule} />
          ))}

          {/* Slot Fantasma AL FINAL - Muestra el tamaño real del módulo */}
          {isInsertMode && pendingModuleType && (
            <div 
              ref={slotRef}
              onClick={(e) => {
                e.stopPropagation();
                confirmInsert();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmInsert();
              }}
              className={cn(
                "ghost-slot border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 group will-change-[background-color] touch-manipulation select-none min-h-[140px] relative z-50 isolate",
                // Aplicar el tamaño real del módulo que se va a insertar
                {
                  'col-span-1 row-span-1': pendingModuleType.size === 'size-1x1',
                  'col-span-1 sm:col-span-2 row-span-1': pendingModuleType.size === 'size-2x1',
                  'col-span-1 sm:col-span-2 row-span-2': pendingModuleType.size === 'size-2x2',
                  'col-span-1 sm:col-span-2 lg:col-span-4 row-span-1': pendingModuleType.size === 'size-4x1',
                }
              )}
              style={{
                borderColor: `${c.accent.primary}40`,
                backgroundColor: `${c.accent.primary}0D`,
                color: c.accent.primary
              }}
            >
              <PlusIcon className="w-10 h-10 mb-3 transition-colors duration-200 pointer-events-none" style={{ color: c.accent.primary }} />
              <span className="font-semibold text-sm transition-colors duration-200 pointer-events-none" style={{ color: c.accent.primary }}>
                Toca para Insertar Aquí
              </span>
              <span className="text-xs mt-1 transition-colors duration-200 pointer-events-none" style={{ color: `${c.accent.primary}99` }}>
                {pendingModuleType.type === 'kpi' && '📊 KPI (1x1)'}
                {pendingModuleType.type === 'chart' && '📈 Gráfico (2x1)'}
                {pendingModuleType.type === 'banner' && '🚀 Banner (4x1)'}
              </span>
            </div>
          )}

          {/* Estado Vacío */}
          {!isInsertMode && modules.length === 0 && (
            <div className="col-span-full h-96 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500">
              <Squares2X2Icon className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-semibold">Panel Vacío</p>
              <p className="text-sm mt-1">Usa el botón + para comenzar</p>
            </div>
          )}
        </div>
      </div>

      {/* --- FAB (Floating Action Button) FIJO --- */}
      <div className="fab-container fixed bottom-8 right-8 flex flex-col items-end gap-4 z-40">
        {/* Menú Desplegable */}
        <div className={cn(
          "absolute right-0 bottom-20 flex flex-col gap-3 transition-all duration-300 origin-bottom-right",
          isFabOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto z-50" : "opacity-0 scale-90 translate-y-10 pointer-events-none z-0"
        )}>
          <FabItem 
            label="KPI (Pequeño 1x1)" 
            icon="📊" 
            onClick={() => activateInsertMode('kpi', 'size-1x1')} 
          />
          <FabItem 
            label="Gráfico (Ancho 2x1)" 
            icon="📈" 
            onClick={() => activateInsertMode('chart', 'size-2x1')} 
          />
          <FabItem 
            label="Banner (Full 4x1)" 
            icon="🚀" 
            onClick={() => activateInsertMode('banner', 'size-4x1')} 
          />
        </div>

        {/* Botón Principal */}
        <button 
          onClick={() => {
            if (isInsertMode) {
              setIsInsertMode(false);
              setPendingModuleType(null);
            } else {
              setIsFabOpen(!isFabOpen);
            }
          }}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-50",
            isInsertMode ? "" : ""
          )}
          style={{
            boxShadow: `0 0 30px ${c.accent.primary}33`,
            backgroundColor: isInsertMode ? '#ef4444' : (isFabOpen ? c.bg.primary : c.accent.primary),
            color: isInsertMode ? '#FFFFFF' : (isFabOpen ? c.text.primary : c.button.primary.text)
          }}
        >
          {isInsertMode ? <XMarkIcon className="w-8 h-8 text-white" /> : <PlusIcon className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---

function FabItem({ label, icon, onClick }: { label: string, icon: string, onClick: () => void }) {
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];

  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-3 rounded-full shadow-xl transition-all group whitespace-nowrap"
      style={{ backgroundColor: c.bg.secondary, border: `1px solid ${c.border.secondary}`, color: c.text.primary }}
    >
      <span className="text-lg" style={{ color: c.text.primary }}>{icon}</span>
      <span className="text-sm font-semibold" style={{ color: c.text.primary }}>{label}</span>
    </button>
  );
}

// Memoizar ModuleCard para evitar re-renders innecesarios
const ModuleCard = React.memo(({ module, onRemove }: { module: Module, onRemove: (id: string) => void }) => {
    const { theme, palette } = useTheme();
    const c = colorPalettes[palette][theme];

    // Mapeo de clases de tamaño
    const sizeClasses = {
        'size-1x1': 'col-span-1 row-span-1',
        'size-2x1': 'col-span-1 sm:col-span-2 row-span-1',
        'size-2x2': 'col-span-1 sm:col-span-2 row-span-2',
        'size-4x1': 'col-span-1 sm:col-span-2 lg:col-span-4 row-span-1',
    };

    return (
        <div
            className={cn("relative rounded-3xl p-6 shadow-lg hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden flex flex-col will-change-[border-color]", sizeClasses[module.size])}
            data-module-id={module.id}
            style={{
                backgroundColor: c.bg.secondary,
                border: `1px solid ${c.border.primary}`,
                color: c.text.primary
            }}
        >
            {/* CAPA OVERLAY (PRODUCCIÓN) - invisible y no bloqueante */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                data-overlay="true"
            />

            {/* Botón Cerrar - Visible en móviles, hover en desktop */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove(module.id);
                }}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 active:scale-90 touch-manipulation pointer-events-auto"
                aria-label="Eliminar módulo"
                style={{ backgroundColor: c.bg.primary, color: c.text.tertiary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.bg.primary)}
            >
                <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Contenido según tipo - Todo con z-index bajo y pointer-events-none donde sea necesario */}
            {module.type === 'kpi' && (
                <div className="relative z-0 flex flex-col h-full">
                    <h3 className="text-sm font-medium uppercase tracking-wider" style={{ color: c.text.secondary }}>{module.title}</h3>
                    <div className="flex-1 flex flex-col justify-end">
                         <p className="text-4xl font-bold" style={{ color: c.text.primary }}>{module.data.value}</p>
                         <div className="flex items-center gap-1 text-sm mt-1" style={{ color: c.success }}>
                            <ArrowTrendingUpIcon className="w-4 h-4" />
                            <span>{module.data.trend}</span>
                         </div>
                    </div>
                </div>
            )}

            {module.type === 'chart' && (
                <div className="relative z-0 flex flex-col h-full">
                    <h3 className="text-sm font-medium uppercase mb-4" style={{ color: c.text.secondary }}>{module.title}</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {module.data.bars.map((h: number, i: number) => (
                            <div key={i} className="w-full rounded-t-sm transition-colors relative" style={{ height: `${h}%`, backgroundColor: `${c.accent.primary}33` }}>
                                <div className="absolute inset-0 transition-colors" style={{ backgroundColor: `${c.accent.primary}${h > 50 ? 'CC' : '88'}` }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {module.type === 'banner' && (
                <div className="flex items-center justify-between h-full px-4 relative z-0 pointer-events-none">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1" style={{ color: c.text.primary }}>{module.title}</h2>
                        <p style={{ color: c.text.secondary }}>{module.data.subtitle}</p>
                    </div>
                    <div className="relative flex-shrink-0 w-16 h-16">
                        <div style={{ background: `radial-gradient(circle at 30% 30%, ${c.accent.primary}30, transparent 40%), linear-gradient(135deg, ${c.accent.primary}, ${c.accent.secondary})` }} className="w-16 h-16 rounded-full opacity-70 blur-lg absolute inset-0" />
                        <SparklesIcon className="w-12 h-12" style={{ color: c.accent.primary, position: 'absolute', inset: 0, margin: 'auto' }} />
                    </div>
                </div>
            )}
            
            {/* Decoración de fondo (Glow sutil) - Reducido para mejor rendimiento */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-xl pointer-events-none z-0" style={{ backgroundColor: `${c.accent.primary}0D` }} />
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si el módulo cambió
    return prevProps.module.id === nextProps.module.id && 
           prevProps.module.type === nextProps.module.type &&
           prevProps.module.title === nextProps.module.title;
});

ModuleCard.displayName = 'ModuleCard';