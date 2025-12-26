'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BLOCKS, BlockType, BlockData, Block, BlockConfig } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';
import { MobileToolbar } from '@/app/components/editor/controls/MobileToolbar';
import { cn } from '@/lib/utils';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { MobileAddComponentPanel } from '@/app/components/editor/panels/MobileAddComponentPanel';
import { DesktopAddComponentPanel } from '@/app/components/editor/panels/DesktopAddComponentPanel';
import { AddBlockPanel } from '@/app/components/editor/panels/AddBlockPanel';

import { 
    ArrowLeft, ExternalLink, Save, Plus, Smartphone, Tablet, Monitor, 
    Undo2, Redo2, Settings, Palette
} from 'lucide-react';

import { EditorSidebar } from '@/app/components/editor/EditorSidebar';
import { PREDEFINED_TEMPLATES } from '@/app/lib/templates-data';
import { useHistory } from '@/app/hooks/useHistory';
import { SettingsPanel } from '@/app/components/editor/panels/SettingsPanel';

interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }

export default function EditorPage() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // ESTADOS DEL EDITOR
    const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
    const [isMobileEdit, setIsMobileEdit] = useState(false);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [isRealMobile, setIsRealMobile] = useState(false);
    const [newBlockId, setNewBlockId] = useState<number | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // PANELES DE AGREGAR
    const [isAddComponentPanelOpen, setIsAddComponentPanelOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null); // Para el fallback

    // REFS
    const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const canvasRef = useRef<HTMLDivElement | null>(null);

    // --- HISTORIAL (UNDO/REDO) ---
    const { addToHistory, undo, redo, canUndo, canRedo } = useHistory<Block[]>([]);

    const registerChange = useCallback(() => {
        try { addToHistory(blocks); } catch (e) { /* ignore */ }
    }, [addToHistory, blocks]);

    const handleUndo = useCallback(() => {
        const previous = undo(blocks);
        if (previous) setBlocks(previous);
    }, [undo, blocks]);

    const handleRedo = useCallback(() => {
        const next = redo(blocks);
        if (next) setBlocks(next);
    }, [redo, blocks]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) handleRedo(); else handleUndo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    // DETECCIÓN MÓVIL
    useEffect(() => {
        const checkMobile = () => setIsRealMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const canvasWidthClass = isRealMobile 
        ? 'w-full max-w-full' 
        : previewMode === 'mobile' ? 'w-[375px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-full max-w-6xl';
    
    // BLOQUE ACTIVO (Objeto completo)
    const editingBlock = editingBlockId !== null ? blocks.find(b => b.id === editingBlockId) ?? null : null;

    const showNotification = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        if (type === 'error') toast.error(message);
        else toast.success(message);
    }, []);

    // CARGAR DATOS
    const loadTenant = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/tenants/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setTenant(data.tenant);
                const content = data.tenant.pages[0]?.content || '[]';
                try {
                    const parsedContent = JSON.parse(content);
                    setBlocks(Array.isArray(parsedContent) ? parsedContent : []);
                } catch { setBlocks([]); }
            } else { router.push('/dashboard/sites/list'); }
        } catch (error) { router.push('/dashboard/sites/list'); } finally { setLoading(false); }
    }, [id, router]);

    useEffect(() => { loadTenant(); }, [loadTenant]);

    // GUARDAR DATOS
    const saveTenant = useCallback(async () => {
        if (!tenant) return;
        setSaving(true);
        try {
            // setEditingBlockId(null); // Opcional: No cerrar editor al guardar
            const jsonContent = JSON.stringify(blocks);
            const updatedTenant = {
                ...tenant,
                pages: tenant.pages.map((page) => page.slug === '/' ? { ...page, content: jsonContent } : page),
            };
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/tenants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updatedTenant) });
            if (res.ok) showNotification('Guardado correctamente');
            else throw new Error('Failed');
        } catch (error) { showNotification('Error al guardar', 'error'); } 
        finally { setSaving(false); }
    }, [blocks, id, showNotification, tenant]);

    // --- ACCIONES DEL EDITOR ---

    const applyTemplate = (templateKey: string) => {
        registerChange();
        const template = PREDEFINED_TEMPLATES[templateKey];
        if(!template) return;
        if (blocks.length > 0 && !confirm('¿Reemplazar todo el contenido actual?')) return;

        const newBlocks = template.blocks.map(b => ({ ...b, id: Date.now() + Math.random() }));
        setBlocks(newBlocks);
        showNotification(`Diseño "${template.name}" aplicado`);
    };

    // CORRECCIÓN CLAVE: Aceptar initialData
    const addBlock = (blockType: BlockType, initialData?: Partial<BlockData>) => {
        registerChange();
        
        const blockConfig = BLOCKS[blockType];
        const defaultData = blockConfig?.initialData || {};
        
        // Merge de datos: Prioridad a initialData (que viene del botón Variante)
        const data = { ...defaultData, ...initialData } as BlockData;
        
        const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data };
        
        setBlocks(prevBlocks => [...prevBlocks, newBlock]);
        setNewBlockId(newBlock.id);
        setActiveBlockType(null); // Limpiar fallback
        setIsAddComponentPanelOpen(false); // Cerrar panel
        
        // Auto-seleccionar el nuevo bloque para editar (Opcional, buena UX)
        if (!isRealMobile) setEditingBlockId(newBlock.id);
    };

    const updateBlockProperty = useCallback((blockId: number, key: string, value: unknown) => {
        setBlocks(prevBlocks => prevBlocks.map(b => b.id === blockId ? { ...b, data: { ...b.data, [key]: value } } : b));
    }, []);

    const deleteBlock = (blockId: number) => {
        registerChange();
        setBlocks(blocks.filter(block => block.id !== blockId));
        if (editingBlockId === blockId) setEditingBlockId(null);
    };

    const moveBlock = (fromIndex: number, toIndex: number) => {
        registerChange();
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, movedBlock);
        setBlocks(newBlocks);
    };

    const handleSaveSettings = async (data: any) => {
        if (tenant) setTenant({ ...tenant, name: data.name, slug: data.slug });
        toast.success('Configuración local actualizada');
    };

    // --- SCROLL AUTOMÁTICO AL NUEVO BLOQUE ---
    useEffect(() => {
        if (newBlockId && blockRefs.current[newBlockId]) {
            setTimeout(() => blockRefs.current[newBlockId]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            const timer = setTimeout(() => setNewBlockId(null), 1600);
            return () => clearTimeout(timer);
        }
    }, [newBlockId]);

    const providerMode = isRealMobile ? 'mobile' : (editingBlockId !== null ? 'desktop' : previewMode);

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div></div>;

    return (
        <PreviewModeContext.Provider value={{ mode: providerMode, isMobile: providerMode === 'mobile', isTablet: providerMode === 'tablet', isDesktop: providerMode === 'desktop' }}>
            <>
                <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
                <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
                    
                    {/* HEADER */}
                    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 shrink-0 h-16 flex items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/dashboard/sites/list')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></button>
                            
                            <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                                <button onClick={handleUndo} disabled={!canUndo} className="p-1.5 rounded-md hover:bg-white text-slate-500 disabled:opacity-30"><Undo2 className="w-4 h-4" /></button>
                                <button onClick={handleRedo} disabled={!canRedo} className="p-1.5 rounded-md hover:bg-white text-slate-500 disabled:opacity-30"><Redo2 className="w-4 h-4" /></button>
                            </div>

                            <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg"><Settings className="w-5 h-5" /></button>
                            <div className="hidden sm:block font-bold text-slate-900">{tenant?.name}</div>
                        </div>

                        {!isRealMobile && (
                            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                                <button onClick={() => setPreviewMode('mobile')} className={cn("p-2 rounded-md", previewMode === 'mobile' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}><Smartphone className="w-4 h-4" /></button>
                                <button onClick={() => setPreviewMode('tablet')} className={cn("p-2 rounded-md", previewMode === 'tablet' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}><Tablet className="w-4 h-4" /></button>
                                <button onClick={() => setPreviewMode('desktop')} className={cn("p-2 rounded-md", previewMode === 'desktop' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}><Monitor className="w-4 h-4" /></button>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button onClick={() => window.open(`http://${tenant?.slug}.gestularia.com`, '_blank')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"><ExternalLink className="w-4 h-4" /> Ver en vivo</button>
                            <button onClick={saveTenant} disabled={saving} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">{saving ? '...' : <Save className="w-4 h-4" />}<span>Guardar</span></button>
                        </div>
                    </header>

                    {/* MAIN LAYOUT */}
                    <main className="flex flex-1 overflow-hidden relative">
                        
                        {/* 1. SIDEBAR IZQUIERDO (Ahora maneja Navegación Y Edición) */}
                        <EditorSidebar 
                            isOpen={true} // Siempre visible en escritorio
                            editingBlock={editingBlock} // Pasamos el bloque activo
                            onCloseEditor={() => setEditingBlockId(null)} // Cerrar edición
                            onUpdateBlock={updateBlockProperty} // Guardar cambios
                            // Props de navegación:
                            onAddBlock={(type, data) => addBlock(type, data)} // CORREGIDO: Pasa data
                            onApplyTemplate={applyTemplate}
                        />

                        {/* 2. CANVAS CENTRAL */}
                        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] relative transition-all duration-300 p-4 md:p-10" onClick={(e) => { if(e.target === e.currentTarget) setEditingBlockId(null); }}>
                            <div className={cn("mx-auto transition-all duration-500 ease-in-out relative min-h-[800px] bg-white shadow-sm md:rounded-xl overflow-hidden", canvasWidthClass, isRealMobile ? "pb-32" : "pb-32")}>
                                {/* Frame de dispositivo en modo preview */}
                                {!isRealMobile && (previewMode !== 'desktop') && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20 pointer-events-none" />
                                )}
                                
                                <div className={cn("w-full h-full", !isRealMobile && (previewMode !== 'desktop') ? "pt-8 border-[8px] border-slate-900 rounded-[2.5rem]" : "")}>
                                    
                                    {blocks.length === 0 ? (
                                        <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4"><Palette className="w-8 h-8 text-blue-500" /></div>
                                            <h3 className="text-xl font-bold text-slate-800">Lienzo Vacío</h3>
                                            <p className="text-slate-500 mb-6 max-w-xs mx-auto">Añade tu primer bloque desde el menú lateral o usa una plantilla.</p>
                                            <button onClick={() => setIsAddComponentPanelOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2"><Plus className="w-5 h-5" /> Añadir Bloque</button>
                                        </div>
                                    ) : (
                                        blocks.map((block, index) => (
                                            <BlockRenderer 
                                                key={block.id} 
                                                ref={el => { blockRefs.current[block.id] = el; }} 
                                                block={block} 
                                                isEditing={editingBlockId === block.id} 
                                                isMobileEdit={isMobileEdit} 
                                                onUpdate={(key, value) => updateBlockProperty(block.id, key, value)} 
                                                onDelete={() => deleteBlock(block.id)} 
                                                onEdit={() => { setEditingBlockId(block.id); }} 
                                                onClose={() => setEditingBlockId(null)} 
                                                onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                                                onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} 
                                                isHighlighted={block.id === newBlockId}
                                            />
                                        ))
                                    )}
                                    {blocks.length > 0 && (
                                        <div className="p-8 flex justify-center">
                                            <button onClick={() => setIsAddComponentPanelOpen(true)} className="group w-full max-w-md border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all">
                                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Añadir Bloque al Final
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ELIMINADO EL PANEL DERECHO "FLOTANTE" - AHORA TODO ESTÁ EN EL SIDEBAR IZQUIERDO */}
                    
                    </main>

                    {/* MÓVIL: BOTÓN FLOTANTE */}
                    <MobileToolbar isEditing={isMobileEdit} onToggleEditing={setIsMobileEdit} />
                    {isRealMobile && !editingBlockId && (
                        <div className="fixed bottom-6 right-6 z-50">
                            <button onClick={() => setIsAddComponentPanelOpen(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-transform"><Plus className="w-7 h-7" /></button>
                        </div>
                    )}

                    {/* PANELES MODALES (AGREGAR BLOQUE) */}
                    
                    {/* Fallback para bloques sin variante específica */}
                    {activeBlockType && (
                        <AddBlockPanel 
                            blockType={activeBlockType} 
                            onAddBlock={(type, data) => addBlock(type, data)} 
                            onClose={() => setActiveBlockType(null)} 
                        />
                    )}

                    {/* Panel Móvil Renovado */}
                    {isAddComponentPanelOpen && (
                        <MobileAddComponentPanel
                            onClose={() => setIsAddComponentPanelOpen(false)}
                            // CORRECCIÓN: Aceptamos initialData y agregamos DIRECTAMENTE
                            onSelectBlock={(type, initialData) => { 
                                if (initialData) {
                                    addBlock(type, initialData); 
                                } else {
                                    setActiveBlockType(type); // Fallback antiguo
                                }
                                setIsAddComponentPanelOpen(false);
                            }}
                            onApplyTemplate={(key) => { applyTemplate(key); setIsAddComponentPanelOpen(false); }}
                        />
                    )}

                    {/* Panel Escritorio Flotante (Si se usa desde el canvas) */}
                    {isAddComponentPanelOpen && !isRealMobile && (
                        <DesktopAddComponentPanel 
                            onClose={() => setIsAddComponentPanelOpen(false)} 
                            onSelectBlock={(type) => {
                                setActiveBlockType(type);
                                setIsAddComponentPanelOpen(false); 
                            }} 
                            selectedCategory={selectedCategory} 
                            setSelectedCategory={setSelectedCategory} 
                        />
                    )}

                    {tenant && <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} siteData={tenant} onSave={handleSaveSettings} />}
                </div>
            </>
        </PreviewModeContext.Provider>
    );
}