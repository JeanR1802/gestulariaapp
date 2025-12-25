'use client';

import React, { useState, useEffect, useCallback, Fragment, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BLOCKS, BlockType, BlockData, Block, BlockConfig } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';
import { MobileToolbar } from '@/app/components/editor/controls/MobileToolbar';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { MobileAddComponentPanel } from '@/app/components/editor/panels/MobileAddComponentPanel';
import { DesktopAddComponentPanel } from '@/app/components/editor/panels/DesktopAddComponentPanel';
import { AddBlockPanel } from '@/app/components/editor/panels/AddBlockPanel';

import { 
    ArrowLeft, ExternalLink, Save, Plus, Smartphone, Tablet, Monitor, 
    Layers, X, Settings, Palette, Type, LayoutTemplate, Grid, CheckCircle2, Undo2, Redo2
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
    const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
    const [isMobileEdit, setIsMobileEdit] = useState(false);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [isRealMobile, setIsRealMobile] = useState(false);
    const [newBlockId, setNewBlockId] = useState<number | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

    // Atajos teclado: Ctrl+Z / Ctrl+Shift+Z
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) handleRedo();
                else handleUndo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);
    
    // --- ESTADO DEL SIDEBAR ---
    const [sidebarTab, setSidebarTab] = useState<'templates' | 'components'>('templates'); // Por defecto 'templates' para que elijan diseño al inicio
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    
    const [isAddComponentPanelOpen, setIsAddComponentPanelOpen] = useState(false);
    const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const previousBlocksRef = useRef<Block[] | null>(null);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
    const [editorTab, setEditorTab] = useState<'content' | 'style'>('content');

    const categoryOrder = ['Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'] as const;
    const categorizedBlocks = React.useMemo(() => {
        return Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
            const category = (blockInfo as BlockConfig<BlockData> & { category?: string }).category || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push({ key, ...(blockInfo as BlockConfig<BlockData>) });
            return acc;
        }, {} as Record<string, Array<{ key: string } & BlockConfig<BlockData>>>)
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsRealMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const canvasWidthClass = isRealMobile 
        ? 'w-full max-w-full' 
        : previewMode === 'mobile' ? 'w-[375px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-full max-w-6xl';
    
    const editingBlock = editingBlockId !== null ? blocks.find(b => b.id === editingBlockId) ?? null : null;

    const showNotification = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        if (type === 'error') toast.error(message);
        else if (type === 'info') toast.info(message);
        else toast.success(message);
    }, []);

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
                    // Si viene vacío, podríamos cargar un template por defecto, pero dejémoslo vacío
                    setBlocks(Array.isArray(parsedContent) ? parsedContent : []);
                } catch { setBlocks([]); }
            } else { router.push('/dashboard/sites/list'); }
        } catch (error) { router.push('/dashboard/sites/list'); } finally { setLoading(false); }
    }, [id, router]);

    useEffect(() => { loadTenant(); }, [loadTenant]);

    const saveTenant = useCallback(async () => {
        if (!tenant) return;
        setSaving(true);
        try {
            setEditingBlockId(null);
            await new Promise(resolve => setTimeout(resolve, 50));
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

    // --- APLICAR PLANTILLA ---
    const applyTemplate = (templateKey: string) => {
        registerChange();
        const template = PREDEFINED_TEMPLATES[templateKey];
        if(!template) return;

        if (blocks.length > 0) {
            if(!confirm('¿Reemplazar todo el contenido actual por esta plantilla?')) return;
        }

        // Generamos nuevos IDs para evitar conflictos
        const newBlocks = template.blocks.map(b => ({
            ...b,
            id: Date.now() + Math.random()
        }));
        
        setBlocks(newBlocks);
        showNotification(`Diseño "${template.name}" aplicado`);
    };

    const addBlock = (blockType: BlockType, data: BlockData) => {
        registerChange();
        const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data };
        setBlocks(prevBlocks => [...prevBlocks, newBlock]);
        setNewBlockId(newBlock.id);
        setActiveBlockType(null);
        setIsAddComponentPanelOpen(false);
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

    const applyEditorUpdate = useCallback((key: string, value: unknown) => {
        if (!editingBlockId) return;
        updateBlockProperty(editingBlockId, key, value);
    }, [editingBlockId, updateBlockProperty]);

    useEffect(() => {
        if (newBlockId && blockRefs.current[newBlockId]) {
            setTimeout(() => blockRefs.current[newBlockId]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            const timer = setTimeout(() => setNewBlockId(null), 1600);
            return () => clearTimeout(timer);
        }
    }, [newBlockId]);

    const cancelEdit = useCallback(() => {
        if (previousBlocksRef.current) {
            setBlocks(previousBlocksRef.current);
            previousBlocksRef.current = null;
        }
        setEditingBlockId(null);
    }, []);

    const saveEdit = useCallback(async () => {
        await saveTenant();
        previousBlocksRef.current = null;
        setEditingBlockId(null);
    }, [saveTenant]);

    // ------- SETTINGS HANDLER -------
    const handleSaveSettings = async (data: any) => {
        try {
            if (tenant) {
                setTenant({ ...tenant, name: data.name, slug: data.slug });
            }
            toast.success('Configuración guardada');
        } catch (e) {
            toast.error('Error guardando configuración');
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div></div>;

    const activeBlock = editingBlock;
    const ActiveBlockConfig = activeBlock ? BLOCKS[activeBlock.type] : null;
    const ActiveEditor = ActiveBlockConfig?.editor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
    const ActiveStyleEditor = ActiveBlockConfig?.styleEditor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
    const providerMode = isRealMobile ? 'mobile' : (editingBlockId !== null ? 'desktop' : previewMode);

    return (
        <PreviewModeContext.Provider value={{ mode: providerMode, isMobile: providerMode === 'mobile', isTablet: providerMode === 'tablet', isDesktop: providerMode === 'desktop' }}>
            <>
                <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
                <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
                    
                    {/* HEADER */}
                    <header className={cn("bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 shrink-0 transition-all duration-300 relative", activeBlock ? 'translate-y-[-100%] md:translate-y-0' : 'translate-y-0')}>
                        <div className="w-full mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
                            <div className="flex items-center gap-4 z-10">
                                <button onClick={() => router.push('/dashboard/sites/list')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"><ArrowLeft className="w-5 h-5" /></button>

                                {/* SEPARADOR */}
                                <div className="h-6 w-px bg-slate-200 hidden sm:block mx-2"></div>

                                {/* UNDO / REDO */}
                                <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                                    <button 
                                        onClick={handleUndo} 
                                        disabled={!canUndo}
                                        className="p-1.5 rounded-md hover:bg-white text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        title="Deshacer (Ctrl+Z)"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={handleRedo} 
                                        disabled={!canRedo}
                                        className="p-1.5 rounded-md hover:bg-white text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                        title="Rehacer (Ctrl+Shift+Z)"
                                    >
                                        <Redo2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* SETTINGS BUTTON */}
                                <button 
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                                    title="Configuración del Sitio"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>

                                <div className="hidden sm:block"><h1 className="font-bold text-slate-900 leading-tight">{tenant?.name}</h1></div>
                            </div>
                            {!isRealMobile && (
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button onClick={() => setPreviewMode('mobile')} className={cn("p-2 rounded-md transition-all", previewMode === 'mobile' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}><Smartphone className="w-4 h-4" /></button>
                                    <button onClick={() => setPreviewMode('tablet')} className={cn("p-2 rounded-md transition-all", previewMode === 'tablet' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}><Tablet className="w-4 h-4" /></button>
                                    <button onClick={() => setPreviewMode('desktop')} className={cn("p-2 rounded-md transition-all", previewMode === 'desktop' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}><Monitor className="w-4 h-4" /></button>
                                </div>
                            )}
                            <div className="flex items-center gap-3 z-10">
                                <button onClick={() => window.open(`http://${tenant?.slug}.gestularia.com`, '_blank')} className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /> <span className="hidden lg:inline">Ver en vivo</span></button>
                                <button onClick={saveTenant} disabled={saving} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">{saving ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Save className="w-4 h-4" />}<span>{saving ? 'Guardando...' : 'Guardar'}</span></button>
                            </div>
                        </div>
                    </header>

                    <main className="flex flex-1 overflow-hidden relative">
                        
                        {/* --- SIDEBAR IZQUIERDO (replaced by shared component) --- */}
                        <EditorSidebar isOpen={!!activeBlock} onAddBlock={(type) => addBlock(type, {})} onApplyTemplate={(key) => applyTemplate(key)} />

                        {/* --- CANVAS CENTRAL --- */}
                        <div ref={scrollContainerRef} className={cn("flex-1 overflow-y-auto relative bg-[#F8FAFC] transition-all duration-300", isRealMobile ? "p-0" : "p-4 md:p-10", !isRealMobile && activeBlock ? "mr-[400px]" : "")}>
                            <div id="editor-canvas" ref={canvasRef} className={cn("mx-auto transition-all duration-500 ease-in-out relative", canvasWidthClass, !isRealMobile && (previewMode === 'mobile' || previewMode === 'tablet') ? "bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.2)] border-[8px] border-slate-900 rounded-[3rem] overflow-hidden min-h-[800px]" : "bg-white shadow-sm min-h-screen md:min-h-[calc(100vh-100px)] md:rounded-xl", isRealMobile ? "pb-24" : (activeBlock ? "pb-96" : "pb-24"))}>
                                {!isRealMobile && (previewMode === 'mobile' || previewMode === 'tablet') && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20 flex justify-center items-center gap-4 pointer-events-none"><div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div><div className="w-10 h-1 rounded-full bg-slate-800"></div></div>
                                )}
                                <div className={cn("w-full h-full", !isRealMobile && (previewMode === 'mobile' || previewMode === 'tablet') ? "pt-8" : "")}>
                                    {activeBlock ? (
                                        <div className="bg-slate-50/50 min-h-full">
                                            <BlockRenderer key={activeBlock.id} ref={el => { blockRefs.current[activeBlock.id] = el; }} block={activeBlock} isEditing={true} isMobileEdit={isMobileEdit} onUpdate={(key, value) => updateBlockProperty(activeBlock.id, key, value)} onDelete={() => deleteBlock(activeBlock.id)} onClose={() => setEditingBlockId(null)} />
                                        </div>
                                    ) : (
                                        <>
                                            {blocks.map((block, index) => (
                                                <BlockRenderer key={block.id} ref={el => { blockRefs.current[block.id] = el; }} isHighlighted={block.id === newBlockId} block={block} isEditing={editingBlockId === block.id} isMobileEdit={isMobileEdit} onUpdate={(key, value) => updateBlockProperty(block.id, key, value)} onDelete={() => deleteBlock(block.id)} onEdit={() => { previousBlocksRef.current = blocks; setEditingBlockId(block.id); }} onClose={() => setEditingBlockId(null)} onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} />
                                            ))}
                                            <div className="p-8 flex justify-center pb-32">
                                                {blocks.length === 0 ? (
                                                    <div className="text-center py-20">
                                                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Palette className="w-8 h-8 text-blue-500" /></div>
                                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Tu lienzo está vacío</h3>
                                                        <p className="text-slate-500 mb-6">Elige una plantilla del menú izquierdo o añade bloques.</p>
                                                        <button onClick={() => setSidebarTab('components')} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"><Plus className="w-5 h-5" /> Explorar Bloques</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setIsAddComponentPanelOpen(true)} className="group w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"><Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Añadir Bloque al Final</button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- PANEL DERECHO (EDICIÓN) --- */}
                        <Transition show={!!activeBlock && !isRealMobile} as={Fragment} enter="transform transition ease-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                            <aside className="fixed right-0 top-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.1)] z-50 flex flex-col">
                                {activeBlock && (
                                    <>
                                        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white">
                                            <div className="flex items-center gap-3"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", ActiveBlockConfig?.theme.bg)}>{ActiveBlockConfig?.icon && React.createElement(ActiveBlockConfig.icon, { className: cn("w-4 h-4", ActiveBlockConfig.theme.icon) })}</div><span className="font-bold text-slate-800">Editar {ActiveBlockConfig?.name}</span></div>
                                            <button onClick={saveEdit} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"><X className="w-5 h-5" /></button>
                                        </div>
                                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                            <div className="flex p-1 bg-slate-200/50 rounded-xl">
                                                <button onClick={() => setEditorTab('content')} className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2", editorTab === 'content' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}><Type className="w-4 h-4" /> Contenido</button>
                                                <button onClick={() => setEditorTab('style')} className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2", editorTab === 'style' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}><Palette className="w-4 h-4" /> Estilo</button>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                                            {editorTab === 'content' ? (ActiveEditor ? <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} /> : <div className="text-center text-slate-400 py-10">Sin opciones de contenido</div>) : (ActiveStyleEditor ? <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} /> : <div className="text-center text-slate-400 py-10">Sin opciones de estilo</div>)}
                                        </div>
                                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                                            <button onClick={cancelEdit} className="flex-1 py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                                            <button onClick={saveEdit} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Guardar Cambios</button>
                                        </div>
                                    </>
                                )}
                            </aside>
                        </Transition>
                    </main>

                    <MobileToolbar isEditing={isMobileEdit} onToggleEditing={setIsMobileEdit} />
                    {isRealMobile && !editingBlockId && <div className="fixed bottom-6 right-6 z-50"><button onClick={() => setIsAddComponentPanelOpen(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center transform active:scale-90 transition-transform hover:bg-blue-700"><Plus className="w-7 h-7" /></button></div>}
                    {activeBlockType && <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />}
                    {isAddComponentPanelOpen && (
                        <MobileAddComponentPanel
                            onClose={() => setIsAddComponentPanelOpen(false)}
                            onSelectBlock={(type) => { setActiveBlockType(type); setIsAddComponentPanelOpen(false); }}
                            onApplyTemplate={(key) => {
                                applyTemplate(key);
                                setIsAddComponentPanelOpen(false);
                            }}
                        />
                    )}
                    {isAddComponentPanelOpen && !isRealMobile && <DesktopAddComponentPanel onClose={() => setIsAddComponentPanelOpen(false)} onSelectBlock={(type) => { setActiveBlockType(type); setIsAddComponentPanelOpen(false); }} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
                    {/* SETTINGS PANEL */}
                    {tenant && (
                        <SettingsPanel
                            isOpen={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                            siteData={tenant}
                            onSave={handleSaveSettings}
                        />
                    )}
                </div>
            </>
        </PreviewModeContext.Provider>
    );
}