// app/dashboard/sites/list/page.tsx
'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { 
  PlusIcon, 
  PencilSquareIcon, 
  ArrowTopRightOnSquareIcon, 
  TrashIcon, 
  GlobeAltIcon, 
  XMarkIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/solid'
import { generateSlug, cn } from '@/lib/utils'
import { useTheme } from '@/app/contexts/ThemeContext'
import { colorPalettes } from '@/app/lib/colors'

interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: string
}

// --- COMPONENTE DE MODAL BASE ---
function ModalBase({ isOpen, onClose, title, children, size = 'max-w-md' }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: string }) {
  const { theme, palette } = useTheme()
  const c = colorPalettes[palette][theme]
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)' }} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={cn("w-full transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-2xl transition-all", size)}
                style={{ 
                  backgroundColor: c.bg.secondary,
                  borderColor: c.border.primary,
                  borderWidth: '1px'
                }}
              >
                <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: `1px solid ${c.border.secondary}` }}>
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6" style={{ color: c.text.primary }}>
                    {title}
                  </Dialog.Title>
                  <button onClick={onClose} className="transition-colors" style={{ color: c.text.tertiary }} onMouseEnter={(e) => e.currentTarget.style.color = c.text.primary} onMouseLeave={(e) => e.currentTarget.style.color = c.text.tertiary}>
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// --- TIPOS DE SITIO (Configuración) ---
const SITE_TYPES = [
    { id: 'landing', title: 'Landing Page', desc: 'Para campañas, ofertas y captación de leads.', Icon: RocketLaunchIcon },
    { id: 'content', title: 'Sitio de Contenido', desc: 'Para blogs, portafolios y empresas.', Icon: DocumentTextIcon },
    { id: 'store', title: 'Tienda E-commerce', desc: 'Vende productos físicos o digitales.', Icon: ShoppingBagIcon },
    { id: 'contact', title: 'Formulario', desc: 'Página simple de contacto o registro.', Icon: EnvelopeIcon },
];

// --- MODAL CREAR SITIO (Multistep) ---
interface CreateSiteModalProps {
  isOpen: boolean
  onClose: () => void
  onSiteCreated: (siteId: string) => void
}

function CreateSiteModal({ isOpen, onClose, onSiteCreated }: CreateSiteModalProps) {
  const { theme, palette } = useTheme()
  const c = colorPalettes[palette][theme]
  const [step, setStep] = useState(1); // 1: Nombre, 2: Tipo
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reiniciar estado al abrir
  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setName('');
        setSlug('');
        setSelectedType(null);
        setError('');
        setLoading(false);
    }
  }, [isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  const handleNextStep = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !slug) return;
      setStep(2);
  };

  const handleCreateSite = async () => {
    if (!selectedType) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            name, 
            slug,
            type: selectedType // Enviamos el tipo al backend (aunque el backend actual no lo use, queda listo)
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSiteCreated(data.tenant.id); 
      } else {
        setError(data.error || 'No se pudo crear el sitio.');
      }
    } catch (err) {
      setError('Ocurrió un error de red.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 1: Nombre y Dominio
  if (step === 1) {
      return (
        <ModalBase isOpen={isOpen} onClose={onClose} title="Paso 1: Identidad del Sitio">
          <form onSubmit={handleNextStep} className="space-y-5">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium mb-1" style={{ color: c.text.secondary }}>Nombre del Proyecto</label>
              <input 
                type="text" 
                id="siteName" 
                value={name} 
                onChange={handleNameChange} 
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition-all" 
                style={{
                  backgroundColor: c.bg.tertiary,
                  borderColor: c.border.primary,
                  borderWidth: '1px',
                  color: c.text.primary
                }}
                placeholder="Ej: Mi Startup Increíble"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="siteSlug" className="block text-sm font-medium mb-1" style={{ color: c.text.secondary }}>Dirección URL</label>
              <div className="flex items-center rounded-lg overflow-hidden focus-within:ring-2 transition-all" style={{ backgroundColor: c.bg.tertiary, borderColor: c.border.primary, borderWidth: '1px' }}>
                <span className="px-3 text-sm py-2.5" style={{ color: c.text.tertiary, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRight: `1px solid ${c.border.secondary}` }}>gestularia.com/</span>
                <input 
                  type="text" 
                  id="siteSlug" 
                  value={slug} 
                  onChange={e => setSlug(generateSlug(e.target.value))} 
                  className="flex-1 bg-transparent border-none px-3 py-2.5 focus:ring-0 text-sm" 
                  style={{ color: c.text.primary }}
                  placeholder="mi-startup"
                />
              </div>
            </div>
    
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ color: c.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = c.text.primary
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = c.text.secondary
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={!name || !slug} 
                className="px-5 py-2 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                style={{
                  backgroundColor: c.accent.primary,
                  color: theme === 'dark' ? '#0D1222' : '#FFFFFF'
                }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = c.accent.secondary)}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = c.accent.primary)}
              >
                Continuar <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </form>
        </ModalBase>
      );
  }

  // PASO 2: Selección de Tipo (Grid)
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Paso 2: Elige una plantilla" size="max-w-2xl">
      <div className="space-y-6">
          <p className="text-sm" style={{ color: c.text.secondary }}>
            Selecciona la estructura base que mejor se adapte a <strong style={{ color: c.text.primary }}>{name}</strong>. Podrás cambiar esto más tarde.
          </p>

          {/* Grid de Opciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {SITE_TYPES.map((type) => {
                 const isSelected = selectedType === type.id;
                 return (
                    <div 
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className="cursor-pointer rounded-xl p-5 border transition-all duration-200 group relative flex flex-col"
                        style={{
                          backgroundColor: isSelected 
                            ? (theme === 'dark' ? 'rgba(0,245,255,0.1)' : 'rgba(0,149,255,0.1)')
                            : c.bg.tertiary,
                          borderColor: isSelected 
                            ? c.accent.primary 
                            : c.border.primary
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = c.accent.secondary
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = c.border.primary
                          }
                        }}
                    >
                        <type.Icon 
                          className="w-8 h-8 mb-3 transition-colors" 
                          style={{ color: isSelected ? c.accent.primary : c.text.tertiary }}
                        />
                        <h4 
                          className="font-bold text-sm mb-1" 
                          style={{ color: isSelected ? c.text.primary : c.text.secondary }}
                        >
                          {type.title}
                        </h4>
                        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: c.text.tertiary }}>
                          {type.desc}
                        </p>
                        
                        <div 
                          className="mt-auto w-full py-1.5 rounded text-center text-xs font-bold uppercase tracking-wider border transition-all"
                          style={{
                            backgroundColor: isSelected ? c.accent.primary : 'transparent',
                            color: isSelected ? (theme === 'dark' ? '#0D1222' : '#FFFFFF') : c.text.tertiary,
                            borderColor: isSelected ? c.accent.primary : c.border.secondary
                          }}
                        >
                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                        </div>
                    </div>
                 )
             })}
          </div>

          {error && (
            <div 
              className="p-3 border rounded-lg text-sm text-center" 
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                borderColor: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444'
              }}
            >
              {error}
            </div>
          )}

          <div className="flex justify-between items-center pt-4" style={{ borderTop: `1px solid ${c.border.secondary}` }}>
             <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-sm flex items-center gap-1 px-2 py-1 rounded transition-all"
                style={{ color: c.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = c.text.primary
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = c.text.secondary
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <ArrowLeftIcon className="w-3 h-3" /> Volver
              </button>

              <div className="flex gap-3">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                    style={{ color: c.text.secondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = c.text.primary
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = c.text.secondary
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleCreateSite}
                    disabled={loading || !selectedType} 
                    className="px-6 py-2 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    style={{
                      backgroundColor: c.accent.primary,
                      color: theme === 'dark' ? '#0D1222' : '#FFFFFF'
                    }}
                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = c.accent.secondary)}
                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = c.accent.primary)}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme === 'dark' ? '#0D1222' : '#FFFFFF', borderTopColor: 'transparent' }}></div>
                            Creando...
                        </>
                    ) : (
                        <>
                            <RocketLaunchIcon className="w-4 h-4" />
                            Crear Sitio
                        </>
                    )}
                </button>
              </div>
          </div>
      </div>
    </ModalBase>
  );
}

// --- MODAL ELIMINAR SITIO ---
interface DeleteSiteModalProps {
  tenant: Tenant | null
  onClose: () => void
  onDelete: (id: string) => void
}

function DeleteSiteModal({ tenant, onClose, onDelete }: DeleteSiteModalProps) {
  const { theme, palette } = useTheme()
  const c = colorPalettes[palette][theme]
  
  if (!tenant) return null;
  
  return (
    <ModalBase isOpen={!!tenant} onClose={onClose} title="Eliminar Sitio">
      <div className="space-y-4">
        <div 
          className="rounded-lg p-4 flex gap-3 items-start" 
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderColor: 'rgba(239, 68, 68, 0.2)',
            borderWidth: '1px'
          }}
        >
          <TrashIcon className="w-6 h-6 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
             <h4 className="font-bold text-sm" style={{ color: '#ef4444' }}>Zona de Peligro</h4>
             <p className="text-sm mt-1" style={{ color: c.text.secondary }}>
               Estás a punto de eliminar <strong style={{ color: c.text.primary }}>{tenant.name}</strong>. Esta acción borrará todo el contenido y no se puede deshacer.
             </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={{ color: c.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = c.text.primary
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = c.text.secondary
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={() => onDelete(tenant.id)} 
            className="px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-lg"
            style={{
              backgroundColor: '#ef4444',
              color: '#fff'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Sí, eliminar sitio
          </button>
        </div>
      </div>
    </ModalBase>
  )
}

// --- COMPONENTE PRINCIPAL ---
export default function SitesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalTarget, setDeleteModalTarget] = useState<Tenant | null>(null)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const router = useRouter()

  const { theme, toggleTheme, palette } = useTheme()
  const c = colorPalettes[palette][theme]

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/tenants', { headers: { Authorization: `Bearer ${token ?? ''}` } })
        const data = await res.json()
        setTenants(data.tenants || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTenants()
  }, [])

  const deleteTenant = async (tenantId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token ?? ''}` }
      })

      if (res.ok) {
        setTenants((prev) => prev.filter((t) => t.id !== tenantId))
        setDeleteModalTarget(null)
      } else {
        alert('Error al eliminar')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSiteCreated = (newSiteId: string) => {
    router.push(`/dashboard/sites/${newSiteId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: theme === 'light' ? '#F3F4F6' : c.bg.primary }}>
        <div className="relative w-16 h-16">
           <div 
             className="absolute top-0 left-0 w-full h-full border-4 rounded-full" 
             style={{ borderColor: theme === 'dark' ? 'rgba(0,245,255,0.2)' : 'rgba(8,145,178,0.2)' }}
           ></div>
           <div 
             className="absolute top-0 left-0 w-full h-full border-4 rounded-full border-t-transparent animate-spin"
             style={{ borderColor: c.accent.primary }}
           ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-200" style={{ backgroundColor: theme === 'light' ? '#F3F4F6' : c.bg.primary, color: c.text.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header de Sección */}
        <div className="mb-10">
          {/* Botón Volver */}
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center gap-2 text-sm transition-colors group mb-6"
            style={{ color: c.text.tertiary }}
            onMouseEnter={(e) => e.currentTarget.style.color = c.accent.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = c.text.tertiary}
          >
            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver al Panel de Control</span>
          </Link>

          {/* Título y Botón Crear */}
          <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: c.text.primary }}>
                  Mis Sitios
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(0,245,255,0.1)' : 'rgba(8,145,178,0.1)',
                      color: c.accent.primary,
                      borderColor: c.border.accent,
                      borderWidth: '1px'
                    }}
                  >
                    {tenants.length}
                  </span>
                </h2>
                <p className="text-sm" style={{ color: c.text.tertiary }}>Selecciona el sitio que deseas editar o publicar.</p>
            </div>
            <button
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
                style={{ 
                  backgroundColor: c.accent.primary,
                  color: theme === 'dark' ? '#0D1222' : '#FFFFFF',
                  boxShadow: `0 0 20px ${c.accent.glow}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = c.accent.secondary
                  e.currentTarget.style.boxShadow = theme === 'dark' ? '0 0 30px rgba(0,245,255,0.4)' : '0 0 30px rgba(8,145,178,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = c.accent.primary
                  e.currentTarget.style.boxShadow = `0 0 20px ${c.accent.glow}`
                }}
            >
                <PlusIcon className="h-5 w-5 transition-transform hover:rotate-90" />
                Crear Sitio
            </button>
          </div>
        </div>

        {/* Grid de Tarjetas */}
        {tenants.length === 0 ? (
          <div 
            className="border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
            style={{ 
              borderColor: c.border.primary,
              backgroundColor: theme === 'light' ? '#FBFFFE' : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)')
            }}
          >
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
              style={{ 
                backgroundColor: c.bg.primary,
                borderColor: c.border.secondary,
                borderWidth: '1px'
              }}
            >
                <GlobeAltIcon className="h-10 w-10" style={{ color: c.text.muted }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: c.text.primary }}>Tu portafolio está vacío</h3>
            <p className="max-w-md mx-auto mb-8" style={{ color: c.text.tertiary }}>No tienes ningún sitio creado todavía. Dale vida a tu primera idea hoy mismo.</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="font-semibold flex items-center gap-2 transition-colors"
              style={{ color: c.accent.primary }}
              onMouseEnter={(e) => e.currentTarget.style.color = c.text.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = c.accent.primary}
            >
              <PlusIcon className="h-4 w-4" />
              Crear mi primer sitio ahora
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {tenants.map((tenant) => (
              <div 
                key={tenant.id} 
                className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group flex flex-col"
                style={{ 
                  backgroundColor: theme === 'light' ? '#FBFFFE' : c.bg.secondary,
                  borderColor: c.border.secondary,
                  borderWidth: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = c.border.accent
                  e.currentTarget.style.boxShadow = theme === 'dark' 
                    ? '0 10px 40px -10px rgba(0,245,255,0.1)' 
                    : '0 10px 40px -10px rgba(8,145,178,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = c.border.secondary
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* --- ÁREA DE PREVIEW (Top) --- */}
                <div 
                  className="h-44 relative flex items-center justify-center overflow-hidden"
                  style={{ 
                    backgroundColor: c.bg.primary,
                    borderBottom: `1px solid ${c.border.secondary}`
                  }}
                >
                    {/* Fondo decorativo estilo blueprint */}
                    <div 
                      className="absolute inset-0 opacity-5 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]"
                      style={{ color: c.accent.primary }}
                    ></div>
                    
                    {/* Thumbnail abstracto */}
                    <div 
                      className="w-24 h-16 rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-300 flex flex-col p-2 gap-1"
                      style={{ 
                        backgroundColor: c.bg.tertiary,
                        borderColor: c.border.primary,
                        borderWidth: '1px'
                      }}
                    >
                       <div className="w-full h-2 rounded-full" style={{ backgroundColor: c.border.primary }}></div>
                       <div className="flex gap-1">
                          <div className="w-1/3 h-8 rounded" style={{ backgroundColor: theme === 'dark' ? 'rgba(0,245,255,0.2)' : 'rgba(8,145,178,0.2)' }}></div>
                          <div className="w-2/3 h-8 rounded" style={{ backgroundColor: c.border.secondary }}></div>
                       </div>
                    </div>

                    {/* Botones flotantes (aparecen en hover) */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const protocol = window.location.protocol
                            const host = window.location.host.includes('localhost') ? 'localhost:3000' : 'gestularia.com'
                            window.open(`${protocol}//${tenant.slug}.${host}`, '_blank')
                          }}
                          className="p-2 backdrop-blur rounded-lg shadow-lg transition-colors"
                          style={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(13,18,34,0.9)' : 'rgba(255,255,255,0.9)',
                            color: c.text.tertiary,
                            borderColor: c.border.primary,
                            borderWidth: '1px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = c.accent.primary}
                          onMouseLeave={(e) => e.currentTarget.style.color = c.text.tertiary}
                          title="Ver en vivo"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteModalTarget(tenant); }}
                          className="p-2 backdrop-blur rounded-lg shadow-lg transition-colors"
                          style={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(13,18,34,0.9)' : 'rgba(255,255,255,0.9)',
                            color: c.text.tertiary,
                            borderColor: c.border.primary,
                            borderWidth: '1px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = c.error}
                          onMouseLeave={(e) => e.currentTarget.style.color = c.text.tertiary}
                          title="Eliminar"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* --- CUERPO DE LA TARJETA (Bottom) --- */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 
                      className="text-lg font-bold truncate mb-1 transition-colors" 
                      title={tenant.name}
                      style={{ color: c.text.primary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = c.accent.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = c.text.primary}
                    >
                      {tenant.name}
                    </h3>
                    <p className="text-xs font-mono truncate" style={{ color: c.text.muted }}>
                      {tenant.slug}.gestularia.com
                    </p>
                  </div>
                  
                  {/* Estado */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: c.text.secondary }}>Publicado</span>
                  </div>

                  {/* Botón Principal (Full Width) */}
                  <Link
                    href={`/dashboard/sites/${tenant.id}`}
                    className="mt-auto w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all text-center shadow-sm"
                    style={{ 
                      backgroundColor: c.bg.tertiary,
                      color: c.text.primary,
                      borderColor: c.border.secondary,
                      borderWidth: '1px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = c.accent.primary
                      e.currentTarget.style.color = theme === 'dark' ? '#0D1222' : '#FFFFFF'
                      e.currentTarget.style.borderColor = c.accent.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = c.bg.tertiary
                      e.currentTarget.style.color = c.text.primary
                      e.currentTarget.style.borderColor = c.border.secondary
                    }}
                  >
                    Editar Sitio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateSiteModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)} 
        onSiteCreated={handleSiteCreated} 
      />
      
      <DeleteSiteModal
        tenant={deleteModalTarget}
        onClose={() => setDeleteModalTarget(null)}
        onDelete={deleteTenant}
      />
    </div>
  )
}
