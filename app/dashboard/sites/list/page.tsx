'use client'

import React, { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { 
  Plus, Trash2, X, Store, Package, Palette, ArrowRight,
  ExternalLink, ShoppingBag, Layout, Lock, CheckCircle2
} from 'lucide-react'
import { generateSlug, cn } from '@/lib/utils'
import { useTheme } from '@/app/contexts/ThemeContext'

interface Tenant { id: string; name: string; slug: string; createdAt: string }

// --- COMPONENTE: MINIATURAS VISUALES (Wireframes CSS) ---
// Esto dibuja un "mini sitio web" dentro de la tarjeta
const TemplatePreview = ({ type }: { type: string }) => {
    // Base común: Navegación pequeñita
    const Nav = () => <div className="h-2 w-full mb-2 flex items-center justify-between"><div className="w-4 h-1 rounded-full bg-current opacity-50"></div><div className="flex gap-1"><div className="w-2 h-1 rounded-full bg-current opacity-30"></div><div className="w-2 h-1 rounded-full bg-current opacity-30"></div></div></div>;
    
    switch (type) {
        case 'fashion': // Estilo Editorial / Fotos Grandes
            return (
                <div className="w-full h-full p-3 flex flex-col bg-rose-50/50 text-rose-900">
                    <Nav />
                    <div className="flex-1 w-full bg-rose-200/50 rounded-sm mb-1"></div> {/* Hero Img */}
                    <div className="grid grid-cols-2 gap-1 h-1/3">
                        <div className="bg-rose-900/10 rounded-sm"></div>
                        <div className="bg-rose-900/10 rounded-sm"></div>
                    </div>
                </div>
            );
        case 'food': // Estilo Menú / Restaurante
            return (
                <div className="w-full h-full p-3 flex flex-col bg-orange-50/50 text-orange-900">
                    <Nav />
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1/2 space-y-1">
                             <div className="w-full h-1 bg-current opacity-40 rounded-full"></div>
                             <div className="w-2/3 h-1 bg-current opacity-20 rounded-full"></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-orange-200/50 shrink-0"></div> {/* Plato redondo */}
                    </div>
                    <div className="space-y-1 mt-auto">
                        <div className="w-full h-4 bg-white/60 rounded-sm border border-orange-100"></div>
                        <div className="w-full h-4 bg-white/60 rounded-sm border border-orange-100"></div>
                    </div>
                </div>
            );
        case 'tech': // Estilo Oscuro / Grid
            return (
                <div className="w-full h-full p-3 flex flex-col bg-slate-900 text-slate-100">
                    <Nav />
                    <div className="w-2/3 h-2 bg-blue-500 rounded-full mb-2"></div>
                    <div className="grid grid-cols-3 gap-1 h-full">
                        <div className="col-span-2 row-span-2 bg-slate-800 rounded-sm border border-slate-700"></div>
                        <div className="bg-slate-800 rounded-sm border border-slate-700"></div>
                        <div className="bg-slate-800 rounded-sm border border-slate-700"></div>
                    </div>
                </div>
            );
        case 'services': // Estilo Corporativo / Limpio
            return (
                <div className="w-full h-full p-3 flex flex-col bg-blue-50/30 text-blue-900">
                    <Nav />
                    <div className="w-full h-1/2 bg-blue-100/50 rounded-sm mb-2 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-blue-200/50"></div>
                    </div>
                    <div className="flex gap-1 h-full">
                        <div className="w-1/3 bg-white border border-blue-100 rounded-sm"></div>
                        <div className="w-1/3 bg-white border border-blue-100 rounded-sm"></div>
                        <div className="w-1/3 bg-white border border-blue-100 rounded-sm"></div>
                    </div>
                </div>
            );
        default: // Blank / Estructura
            return (
                <div className="w-full h-full p-3 flex flex-col bg-slate-50 border border-dashed border-slate-300">
                    <div className="w-full h-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-slate-300" />
                    </div>
                </div>
            );
    }
}

// --- DATOS ACTUALIZADOS ---
const SITE_TEMPLATES = [
    { id: 'blank', name: 'Lienzo en Blanco', desc: 'Sin estructura predefinida.', type: 'blank' },
    { id: 'fashion', name: 'Moda & Estilo', desc: 'Visual, elegante, galerías.', type: 'fashion' },
    { id: 'food', name: 'Restaurante', desc: 'Menús, reservas, apetitoso.', type: 'food' },
    { id: 'tech', name: 'Tech Startups', desc: 'Oscuro, moderno, grids.', type: 'tech' },
    { id: 'services', name: 'Consultoría', desc: 'Serio, limpio, confianza.', type: 'services' }
];

// --- MODAL BASE ---
function ModalBase({ isOpen, onClose, title, children, size = 'max-w-md' }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: string }) {
  const { theme } = useTheme()
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className={cn("w-full transform overflow-hidden rounded-3xl p-8 shadow-2xl transition-all border", theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#0F0F0F] border-white/10 text-white', size)}>
                <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-2xl font-bold tracking-tight">{title}</Dialog.Title>
                    <button onClick={onClose}><X className="w-5 h-5 opacity-50 hover:opacity-100" /></button>
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

// --- CREAR SITIO MODAL (ACTUALIZADO) ---
function CreateSiteModal({ isOpen, onClose, onSiteCreated }: { isOpen: boolean, onClose: () => void, onSiteCreated: (id: string) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(''); 
  const [slug, setSlug] = useState(''); 
  const [selectedTemplate, setSelectedTemplate] = useState<string>(''); // Vacío al inicio para obligar selección
  const [loading, setLoading] = useState(false);
  
  useEffect(() => { if(isOpen) { setStep(1); setName(''); setSlug(''); setSelectedTemplate(''); setLoading(false); } }, [isOpen]);

  const handleCreate = async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tenants/create', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name, slug, type: 'store', template: selectedTemplate })
      });
      const data = await res.json();
      if (res.ok) onSiteCreated(data.tenant.id);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <ModalBase 
        isOpen={isOpen} 
        onClose={onClose} 
        title={step === 1 ? "Ponle nombre a tu sueño" : "Elige la estructura base"} 
        size={step === 1 ? 'max-w-md' : 'max-w-5xl'} // Más ancho para las tarjetas nuevas
    >
      {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); if(name && slug) setStep(2); }} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-70">Nombre del Negocio</label>
              <input autoFocus type="text" value={name} onChange={e => {setName(e.target.value); setSlug(generateSlug(e.target.value))}} className="w-full p-4 text-lg rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold" placeholder="Ej: Cafetería Central" />
            </div>
            <div>
               <label className="block text-sm font-bold mb-2 opacity-70">URL (Enlace)</label>
               <div className="flex bg-gray-50 dark:bg-white/5 rounded-2xl px-4 border-2 border-transparent focus-within:border-blue-500 transition-all items-center opacity-80">
                   <span className="text-base font-bold opacity-40 select-none">gestularia.com/</span>
                   <input type="text" value={slug} onChange={e => setSlug(generateSlug(e.target.value))} className="bg-transparent border-none p-4 w-full outline-none text-base font-bold" placeholder="mi-negocio" />
               </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
               <button type="button" onClick={onClose} className="px-5 py-3 text-sm font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">Cancelar</button>
               <button type="submit" disabled={!name} className="px-8 py-3 text-sm font-bold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2">Siguiente <ArrowRight className="w-4 h-4" /></button>
            </div>
          </form>
      ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
             <div>
                <p className="text-lg opacity-60 mb-8 text-center max-w-2xl mx-auto">Estas plantillas incluyen estructuras y bloques pre-configurados para tu industria.</p>
                
                {/* GRID DE TARJETAS VISUALES */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {SITE_TEMPLATES.map((template) => (
                        <div 
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                                "group cursor-pointer relative flex flex-col transition-all duration-300",
                                selectedTemplate === template.id ? "scale-105" : "hover:scale-105 opacity-80 hover:opacity-100"
                            )}
                        >
                            {/* EL MARCO DEL "SITIO" (Wireframe) */}
                            <div className={cn(
                                "aspect-[3/4] rounded-2xl overflow-hidden border-4 shadow-sm transition-all relative bg-white",
                                selectedTemplate === template.id 
                                    ? "border-blue-600 ring-4 ring-blue-600/20 shadow-xl" 
                                    : "border-gray-100 dark:border-white/10 group-hover:border-blue-200 dark:group-hover:border-blue-800"
                            )}>
                                <TemplatePreview type={template.type} />
                                
                                {/* Overlay Check */}
                                {selectedTemplate === template.id && (
                                    <div className="absolute inset-0 bg-blue-600/10 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg animate-in zoom-in duration-200">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Texto debajo */}
                            <div className="text-center mt-3 px-1">
                                <h4 className={cn("font-bold text-sm", selectedTemplate === template.id ? "text-blue-600" : "text-slate-700 dark:text-slate-300")}>{template.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                 <button onClick={() => setStep(1)} className="px-5 py-3 text-sm font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">Atrás</button>
                 <button 
                    onClick={handleCreate} 
                    disabled={loading || !selectedTemplate} 
                    className="px-12 py-3 text-base font-bold rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all flex items-center gap-2"
                 >
                    {loading ? 'Preparando...' : 'Crear Tienda'}
                 </button>
             </div>
          </div>
      )}
    </ModalBase>
  )
}

// --- PÁGINA PRINCIPAL (MISMAS LÓGICAS, SOLO CAMBIAMOS EL MODAL) ---
export default function SitesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/tenants', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        const data = await res.json(); setTenants(data.tenants || [])
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const deleteTenant = async () => {
    if(!deleteId) return;
    await fetch(`/api/tenants/${deleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    setTenants(p => p.filter(t => t.id !== deleteId)); setDeleteId(null);
  }
  const hasStore = tenants.length > 0;
  const bgMain = theme === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#020202]';
  const textMain = theme === 'light' ? 'text-slate-900' : 'text-white';

  return (
    <div className={cn("min-h-screen font-sans transition-colors duration-500", bgMain, textMain)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">{hasStore ? "Mi Negocio" : "Bienvenido"}</h1>
                <p className="opacity-60 text-sm">{hasStore ? "Gestiona el diseño y productos." : "Lanza tu tienda en segundos."}</p>
            </div>
            {!hasStore ? (
                <button onClick={() => setCreateOpen(true)} className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"><Plus className="w-5 h-5 group-hover:rotate-90" /> Crear Tienda</button>
            ) : (
                 <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-full font-bold border border-transparent cursor-not-allowed"><Lock className="w-4 h-4" /> <span className="text-xs">Plan Básico (1/1)</span></button>
            )}
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        ) : !hasStore ? (
          <div className={cn("border-2 border-dashed rounded-[32px] p-24 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500 transition-all bg-white/50 dark:bg-white/5", theme === 'light' ? 'border-slate-200' : 'border-white/10')} onClick={() => setCreateOpen(true)}>
             <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Store className="w-10 h-10 text-blue-600 dark:text-blue-500" />
             </div>
             <h3 className="text-3xl font-black mb-3 tracking-tight">Tu imperio empieza aquí</h3>
             <p className="opacity-60 max-w-md text-lg mb-8 leading-relaxed">Sin código. Sin estrés. Elige una plantilla y vende.</p>
             <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1">Elegir Plantilla &rarr;</button>
          </div>
        ) : (
          <div className="grid gap-10 grid-cols-1">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_#22c55e]"></div><span className="text-sm font-bold opacity-60 uppercase tracking-widest">En Línea</span></div>
                    <div className="flex gap-2">
                        <a href={`http://${tenant.slug}.gestularia.com`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-full text-sm font-bold border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all"><ExternalLink className="w-4 h-4" /><span className="hidden sm:inline">Ver Sitio</span></a>
                        <button onClick={() => setDeleteId(tenant.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-colors opacity-60 hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[40px] overflow-hidden border shadow-2xl min-h-[400px]", theme === 'light' ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[#0A0A0A] border-white/10 shadow-black/80')}>
                    <div className="relative group md:border-r border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/5 dark:to-indigo-900/5 transition-opacity" />
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 text-center group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 mb-6 rounded-3xl bg-white dark:bg-white/5 shadow-xl flex items-center justify-center text-blue-600 dark:text-blue-400 ring-1 ring-black/5 dark:ring-white/10"><Palette className="w-9 h-9" /></div>
                            <h3 className="text-3xl font-black mb-3">Diseño</h3>
                            <p className="text-base opacity-60 mb-8 max-w-[280px]">Personaliza el look de tu tienda visualmente.</p>
                            <Link href={`/dashboard/sites/${tenant.id}?tab=design`} className="px-8 py-3.5 rounded-full font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black transition-all shadow-lg flex items-center justify-center gap-2"><Layout className="w-4 h-4" /> Ir al Editor</Link>
                        </div>
                    </div>
                    <div className="relative group overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-900/5 dark:to-amber-900/5 transition-opacity" />
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 text-center group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 mb-6 rounded-3xl bg-white dark:bg-white/5 shadow-xl flex items-center justify-center text-orange-600 dark:text-orange-400 ring-1 ring-black/5 dark:ring-white/10"><Package className="w-9 h-9" /></div>
                            <h3 className="text-3xl font-black mb-3">Catálogo</h3>
                            <p className="text-base opacity-60 mb-8 max-w-[280px]">Gestiona inventario y precios.</p>
                            <Link href={`/dashboard/sites/${tenant.id}?tab=products`} className="px-8 py-3.5 rounded-full font-bold bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all shadow-lg flex items-center justify-center gap-2 w-full max-w-[280px]"><ShoppingBag className="w-4 h-4" /> Productos</Link>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateSiteModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSiteCreated={(id) => { setCreateOpen(false); router.push(`/dashboard/sites/${id}`); }} />
      <ModalBase isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="¿Borrar Negocio?">
         <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 mb-4"><p className="text-sm text-red-800 dark:text-red-300"><strong>¡Cuidado!</strong> Esta acción es irreversible.</p></div>
         <div className="flex justify-end gap-3"><button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">Cancelar</button><button onClick={deleteTenant} className="px-4 py-2 text-sm font-bold rounded-lg bg-red-600 text-white shadow-lg hover:bg-red-500">Borrar</button></div>
      </ModalBase>
    </div>
  )
}