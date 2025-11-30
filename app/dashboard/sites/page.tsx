// app/dashboard/sites/page.tsx
'use client';

import React, { useState, useCallback, useMemo, Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { 
  GlobeAltIcon, UsersIcon, ClipboardDocumentListIcon, 
  BanknotesIcon, ChartBarIcon, XMarkIcon, PlusIcon, 
  Squares2X2Icon, ArrowRightIcon, CheckIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';

// --- CONFIGURACIÓN DE MÓDULOS ---
type ModuleType = 'sites' | 'crm' | 'projects' | 'sales' | 'analytics';

type ModuleDef = {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  Icon: React.ElementType;
  theme: {
    color: string;
    shadow: string;
    shapeClass: string;
  };
  status?: 'Próximamente';
};

// --- MODULE DEFINITIONS ---
const MODULE_DEFINITIONS: Record<ModuleType, Omit<ModuleDef, 'id'>> = {
  sites: {
    type: 'sites',
    title: 'Editor Visual',
    description: 'Crea y edita tus sitios web visualmente.',
    Icon: GlobeAltIcon,
    theme: {
      color: '#14B8A6',
      shadow: 'shadow-[0_10px_40px_-10px_rgba(20,184,166,0.18)]',
      shapeClass: 'geo-editor'
    }
  },
  crm: {
    type: 'crm',
    title: 'Base de Datos',
    description: 'Gestiona clientes y colecciones de contenido.',
    Icon: UsersIcon,
    theme: {
      color: '#FF6B35',
      shadow: 'shadow-[0_10px_40px_-10px_rgba(255,107,53,0.2)]',
      shapeClass: 'geo-cms'
    },
    status: 'Próximamente'
  },
  projects: {
    type: 'projects',
    title: 'Proyectos',
    description: 'Organiza tareas y colabora con tu equipo.',
    Icon: ClipboardDocumentListIcon,
    theme: {
      color: '#E91E63',
      shadow: 'shadow-[0_10px_40px_-10px_rgba(233,30,99,0.2)]',
      shapeClass: 'geo-auth'
    },
    status: 'Próximamente'
  },
  sales: {
    type: 'sales',
    title: 'Ventas & API',
    description: 'Facturación, pasarelas de pago e integraciones.',
    Icon: BanknotesIcon,
    theme: {
      color: '#6C5CE7',
      shadow: 'shadow-[0_10px_40px_-10px_rgba(108,92,231,0.2)]',
      shapeClass: 'geo-forms'
    },
    status: 'Próximamente'
  },
  analytics: {
    type: 'analytics',
    title: 'Métricas',
    description: 'Analiza el rendimiento y SEO de tus sitios.',
    Icon: ChartBarIcon,
    theme: {
      color: '#0984E3',
      shadow: 'shadow-[0_10px_40px_-10px_rgba(9,132,227,0.2)]',
      shapeClass: 'geo-settings'
    },
    status: 'Próximamente'
  }
};

// --- MAIN COMPONENT ---
export default function DashboardHomePage() {
  const router = useRouter();
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  const [activeModules, setActiveModules] = useState<ModuleDef[]>([
    { id: 'initial-sites', ...MODULE_DEFINITIONS.sites }
  ]);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [tenant, setTenant] = useState<{ name: string; slug: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTenant() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/tenants', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setTenant(data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    // fetchTenant(); // Comentado o mantenido según el original
  }, []);

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
      if (module.type === 'sites') {
        router.push('/dashboard/sites/list');
      } else {
        router.push(`/dashboard/${module.type}`);
      }
    }
  }, [router]);

  const handleToolboxToggle = useCallback(() => {
    setIsToolboxOpen(prev => !prev);
  }, []);

  const availableModules = useMemo(() => Object.values(MODULE_DEFINITIONS), []);

  return (
    <div 
      className="relative min-h-full p-6 sm:p-10 font-sans transition-colors duration-200" 
      style={{ 
        position: 'relative',
        // Aplicar el gris claro únicamente en modo claro; en modo oscuro usar el fondo del tema
        backgroundColor: theme === 'light' ? '#F3F4F6' : c.bg.primary,
        color: c.text.primary
      }}
    >
      {activeModules.length > 0 ? (
        // Grid mejorado para el look de dashboard
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-20">
          {activeModules.map((module) => (
            <DashboardCard 
              key={module.id} 
              module={module} 
              onRemove={() => removeModule(module.id)}
              onClick={() => handleCardClick(module)}
            />
          ))}
        </div>
      ) : (
        <EmptyState onOpenToolbox={handleToolboxToggle} />
      )}

      {/* --- TOOLBOX MODAL --- */}
      <ToolboxModal 
        isOpen={isToolboxOpen}
        onClose={() => setIsToolboxOpen(false)}
        modules={availableModules}
        activeModules={activeModules}
        onAddModule={addModule}
      />

      {/* --- FAB (Floating Action Button) --- */}
      <button
        onClick={handleToolboxToggle}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
        style={{
          backgroundColor: c.accent.primary,
          color: c.bg.primary,
          boxShadow: `0 8px 32px ${c.accent.glow}`,
        }}
        title="Agregar módulo"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

    </div>
  );
}

// --- SUB-COMPONENTES (MODIFICADOS PARA DISEÑO PREMIUM) ---

const EmptyState = React.memo(({ onOpenToolbox }: { onOpenToolbox: () => void }) => {
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  return (
    <div 
      className="h-96 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center" 
      style={{ 
        borderColor: c.border.primary, 
        backgroundColor: c.bg.secondary, 
        color: c.text.tertiary 
      }}
    >
      <Squares2X2Icon className="w-16 h-16 mb-4 opacity-20" style={{ color: c.text.secondary }} />
      <h3 className="text-lg font-medium mb-2" style={{ color: c.text.secondary }}>Espacio Vacío</h3>
      <p className="text-sm mb-6">Añade herramientas para empezar a trabajar.</p>
      <button onClick={onOpenToolbox} className="hover:underline font-semibold" style={{ color: c.accent.primary }}>
        Abrir librería de módulos
      </button>
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

const ToolboxModal = React.memo((props: any) => {
  // Contenido de ToolboxModal sin cambios para brevedad...
  const { isOpen, onClose, modules, activeModules, onAddModule } = props;
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="toolbox-title">
        {/* ... Backdrop ... */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }} onClick={onClose} />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="w-screen max-w-sm shadow-2xl flex flex-col h-full" style={{ backgroundColor: c.bg.secondary, borderLeft: `1px solid ${c.border.primary}` }}>
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: `1px solid ${c.border.secondary}` }}>
                <h2 id="toolbox-title" className="text-lg font-bold" style={{ color: c.text.primary }}>Librería de Módulos</h2>
                <button 
                  onClick={onClose} 
                  className="transition-colors"
                  style={{ color: c.text.tertiary }}
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {modules.map((def: ModuleDef) => {
                  const isActive = activeModules.some((m: ModuleDef) => m.type === def.type);
                  const isDisabled = isActive || !!def.status;
                  
                  return (
                    <div 
                      key={def.type} 
                      className="group flex items-center gap-4 p-4 rounded-xl transition-all"
                      style={{
                        backgroundColor: c.bg.tertiary,
                        borderColor: c.border.primary,
                        borderWidth: '1px'
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center" 
                        style={{ backgroundColor: `${def.theme.color}20`, color: def.theme.color }}
                      >
                        <def.Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium" style={{ color: c.text.primary }}>{def.title}</h4>
                        <p className="text-xs line-clamp-1" style={{ color: c.text.tertiary }}>{def.description}</p>
                      </div>
                      <button 
                        onClick={() => onAddModule(def.type as ModuleType)}
                        disabled={isDisabled}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: isActive 
                            ? 'rgba(34, 197, 94, 0.2)' 
                            : def.status 
                            ? c.bg.primary
                            : c.accent.primary + '1A',
                          color: isActive 
                            ? '#22c55e' 
                            : def.status 
                            ? c.text.muted
                            : c.accent.primary,
                          cursor: isDisabled ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isDisabled && !isActive) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = c.accent.primary;
                            (e.currentTarget as HTMLElement).style.color = theme === 'dark' ? '#0D1222' : '#FFFFFF';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDisabled && !isActive) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = c.accent.primary + '1A';
                            (e.currentTarget as HTMLElement).style.color = c.accent.primary;
                          }
                        }}
                        aria-label={isActive ? 'Módulo activo' : def.status ? 'Próximamente' : 'Agregar módulo'}
                      >
                        {isActive ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
});
ToolboxModal.displayName = 'ToolboxModal';

const DashboardCard = React.memo(({ 
  module, 
  onRemove, 
  onClick 
}: { 
  module: ModuleDef; 
  onRemove: () => void; 
  onClick: () => void;
}) => {
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  
  // Estilos base para la tarjeta moderna
  const cardBaseStyle: React.CSSProperties = { 
    // En modo claro usar #FBFFFE (solicitado), en modo oscuro usar el fondo de la paleta
    backgroundColor: theme === 'light' ? '#FBFFFE' : c.bg.secondary, 
    border: `1px solid transparent`, // eliminar color turquesa del borde
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)', // Sombra inicial suave
    transform: 'translateY(0)',
    willChange: 'transform, box-shadow, border-color',
  };
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // No aplicar color turquesa al borde; usar un borde neutro sutil según el tema
    e.currentTarget.style.borderColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
    e.currentTarget.style.transform = 'translateY(-5px)'; // Más levantamiento
    // Sombra profunda con brillo de acento (mantener brillo de la paleta en sombra)
    e.currentTarget.style.boxShadow = `0 15px 30px -5px ${module.theme.color + '4D'}, 0 5px 15px -5px ${c.accent.glow}`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // Restaurar borde transparente al salir
    e.currentTarget.style.borderColor = 'transparent';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
  };

  return (
    <div
      onClick={module.status ? undefined : onClick}
      onMouseEnter={module.status ? undefined : handleMouseEnter}
      onMouseLeave={module.status ? undefined : handleMouseLeave}
      className={cn(
        "relative rounded-2xl p-8 min-h-[240px] flex flex-col justify-between overflow-hidden group transition-all duration-300",
        module.status ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
      data-module-id={module.id}
      style={cardBaseStyle}
    >
      {/* Icono de Esquina Superior Derecha */}
      <div className="absolute top-7 right-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: module.type === 'sites' ? (theme === 'light' ? c.accent.primary : '#FFFFFF') : 'transparent',
          }}
        >
          <module.Icon
            className={module.type === 'sites' ? 'w-6 h-6' : 'w-8 h-8'}
            style={{ color: module.type === 'sites' ? (theme === 'light' ? '#FFFFFF' : c.bg.primary) : module.theme.color }}
          />
        </div>
      </div>

      {/* Botón Eliminar */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-4 left-4 z-30 w-8 h-8 rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 active:scale-90"
        aria-label="Eliminar módulo"
        style={{ backgroundColor: c.bg.primary, color: c.text.tertiary }}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>

      {/* Contenido */}
      <div className="relative z-10 mt-2">
        <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: c.text.primary }}>{module.title}</h3>
        <p className="text-sm leading-relaxed opacity-80 max-w-[85%]" style={{ color: c.text.secondary }}>{module.description}</p>
        {module.status && (
          <span className="inline-block mt-3 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded" style={{ backgroundColor: c.bg.tertiary, color: c.text.muted, border: `1px solid ${c.border.primary}` }}>{module.status}</span>
        )}
      </div>

      {/* Flecha y Botón de Acción */}
      <div className="relative z-10 mt-4 self-start flex items-center gap-2">
        <div className="text-lg transition-transform duration-300 group-hover:translate-x-1" style={{ color: module.theme.color }}>
          <ArrowRightIcon className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold" style={{ color: module.theme.color }}>
          {module.type === 'sites' ? 'Ir a Sitios' : 'Abrir'}
        </span>
      </div>

      {/* Geometric Art (Mantenido) */}
      <GeometricShape shapeClass={module.theme.shapeClass} color={module.theme.color} />
    </div>
  );
});
DashboardCard.displayName = 'DashboardCard';

const GeometricShape = React.memo(({ shapeClass, color }: { shapeClass: string; color: string }) => (
  <div className="absolute bottom-[-20px] right-[-20px] w-[150px] h-[150px] z-0 pointer-events-none opacity-20">
    {shapeClass === 'geo-editor' && (
      <>
        <div className="absolute bottom-2 right-10 w-20 h-20 rounded-full bg-white/10 blur-[2px]" />
        <div className="absolute bottom-12 right-0 w-14 h-14 rounded-full border-4 border-white/20" />
      </>
    )}
    {shapeClass === 'geo-cms' && (
      <>
        <div className="absolute bottom-0 right-0 w-14 h-20 rounded-tl-[40px] bg-current" style={{ color }} />
        <div className="absolute bottom-0 right-16 w-10 h-10 rounded-full bg-current opacity-50" style={{ color }} />
      </>
    )}
    {shapeClass === 'geo-auth' && (
      <>
        <div className="absolute bottom-0 right-0 w-20 h-10 rounded-t-[20px] bg-current" style={{ color }} />
        <div className="absolute bottom-6 right-10 w-10 h-10 rounded-full border-4 border-current opacity-50" style={{ color }} />
      </>
    )}
    {shapeClass === 'geo-forms' && (
      <>
        <div className="absolute bottom-6 right-0 w-12 h-12 rounded-full bg-current" style={{ color }} />
        <div className="absolute bottom-0 right-8 w-14 h-8 rounded-t-[30px] bg-current opacity-50" style={{ color }} />
      </>
    )}
    {shapeClass === 'geo-settings' && (
      <div 
        className="absolute bottom-[-5px] right-[-5px] w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-current opacity-30 transform rotate-12" 
        style={{ color }} 
      />
    )}
  </div>
));
GeometricShape.displayName = 'GeometricShape';