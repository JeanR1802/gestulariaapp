'use client';
import { useState, useEffect, useCallback, Fragment, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BLOCKS, BlockType, BlockData, Block, BlockConfig } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';
import { MobileToolbar } from '@/app/components/editor/controls/MobileToolbar';
import { PlusIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { MobileAddComponentPanel } from '@/app/components/editor/panels/MobileAddComponentPanel';
import { DesktopAddComponentPanel } from '@/app/components/editor/panels/DesktopAddComponentPanel';
import { AddBlockPanel } from '@/app/components/editor/panels/AddBlockPanel';

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
    const [newBlockId, setNewBlockId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [isAddComponentPanelOpen, setIsAddComponentPanelOpen] = useState(false);

    const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const previousBlocksRef = useRef<Block[] | null>(null);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [viewportWidth, setViewportWidth] = useState<number | null>(null);
    const [viewportHeight, setViewportHeight] = useState<number | null>(null);
    const editorFirstFocusRef = useRef<HTMLButtonElement | null>(null);
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

    const canvasWidthClass = previewMode === 'mobile' ? 'max-w-xs' : previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-4xl';
    const effectiveCanvasWidthClass = editingBlockId !== null ? 'max-w-4xl w-full' : canvasWidthClass;

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
                    setBlocks(Array.isArray(parsedContent) ? parsedContent : []);
                } catch {
                    setBlocks([]);
                }
            } else { router.push('/dashboard/sites'); }
        } catch (error) {
            console.error('Error al cargar:', error);
            router.push('/dashboard/sites');
        } finally {
            setLoading(false);
        }
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
            if (res.ok) {
                showNotification('Sitio guardado exitosamente');
            } else { throw new Error('Failed to save'); }
        } catch (error) {
            showNotification('Error al guardar el sitio', 'error');
        } finally {
            setSaving(false);
        }
    }, [blocks, id, showNotification, tenant]);

    const addBlock = (blockType: BlockType, data: BlockData) => {
        const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data };
        setBlocks(prevBlocks => [...prevBlocks, newBlock]);
        setNewBlockId(newBlock.id);
        setActiveBlockType(null);
        setIsAddComponentPanelOpen(false);
    };

    const updateBlockData = useCallback((blockId: number, newData: BlockData) => {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, data: newData } : b));
    }, []);

    const handleDataChange = useCallback((newData: BlockData) => {
        if (editingBlockId) {
            updateBlockData(editingBlockId, newData);
        }
    }, [editingBlockId, updateBlockData]);

    const updateBlockProperty = useCallback((blockId: number, key: string, value: unknown) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(b =>
                b.id === blockId
                    ? { ...b, data: { ...b.data, [key]: value } }
                    : b
            )
        );
    }, []);

    const deleteBlock = (blockId: number) => {
        setBlocks(blocks.filter(block => block.id !== blockId));
        if (editingBlockId === blockId) setEditingBlockId(null);
    };

    const moveBlock = (fromIndex: number, toIndex: number) => {
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, movedBlock);
        setBlocks(newBlocks);
    };

    const applyEditorUpdate = useCallback((key: string, value: unknown) => {
        if (!editingBlockId) return;
        updateBlockProperty(editingBlockId, key, value);
    }, [editingBlockId, updateBlockProperty]);

    const replaceEditorData = useCallback((newData: BlockData) => {
        if (!editingBlockId) return;
        updateBlockData(editingBlockId, newData);
    }, [editingBlockId, updateBlockData]);

    // Scroll automático al bloque nuevo
    useEffect(() => {
        if (newBlockId && blockRefs.current[newBlockId]) {
            const blockElement = blockRefs.current[newBlockId];
            setTimeout(() => {
                blockElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            const timer = setTimeout(() => {
                setNewBlockId(null);
            }, 1600);

            return () => clearTimeout(timer);
        }
    }, [newBlockId]);

    // Scroll automático al bloque que se está editando
    useEffect(() => {
        if (editingBlockId && blockRefs.current[editingBlockId]) {
            const blockElement = blockRefs.current[editingBlockId] as HTMLElement;
            // small delay to allow layout to settle, but keep it short for responsiveness
            const timer = setTimeout(() => {
                const container = scrollContainerRef.current;
                const extra = (viewportHeight && viewportWidth && viewportWidth < 768) ? Math.round(viewportHeight * 0.52) + 24 : 80;

                const doScroll = () => {
                    try {
                        if (container) {
                            const containerRect = container.getBoundingClientRect();
                            const blockRect = blockElement.getBoundingClientRect();
                            const currentScroll = container.scrollTop;
                            const targetTop = currentScroll + (blockRect.top - containerRect.top) - extra;
                            container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
                        } else {
                            // fallback to window
                            const blockRect = blockElement.getBoundingClientRect();
                            const target = window.scrollY + blockRect.top - extra;
                            window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
                        }
                    } catch (err) {
                        // best-effort fallback
                        if (window.innerWidth < 768) blockElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        else blockElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                };

                // trigger via rAF to improve smoothness on mobile
                if (typeof window !== 'undefined' && window.requestAnimationFrame) {
                    window.requestAnimationFrame(() => {
                        doScroll();
                    });
                } else {
                    doScroll();
                }
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [editingBlockId, viewportHeight, viewportWidth]);

    // Manejar dimensiones del viewport para cálculos responsivos
    useEffect(() => {
        const update = () => { setViewportWidth(window.innerWidth); setViewportHeight(window.innerHeight); };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Añadir padding-bottom al canvas en móvil mientras se edita para que el bloque no quede oculto
    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;
        if (editingBlockId !== null) {
            if (window.innerWidth < 768) {
                // altura aproximada del panel móvil (50vh). Añadimos margen extra.
                el.style.paddingBottom = '52vh';
            } else {
                el.style.paddingBottom = '';
            }
        } else {
            el.style.paddingBottom = '';
        }
        // Limpieza al desmontar
        return () => {
            if (el) el.style.paddingBottom = '';
        };
    }, [editingBlockId]);

    const cancelEdit = useCallback(() => {
        if (previousBlocksRef.current) {
            setBlocks(previousBlocksRef.current);
            previousBlocksRef.current = null;
        }
        setEditingBlockId(null);
    }, []);

    const saveEdit = useCallback(async () => {
        // Guardar todo el sitio (saveTenant ya limpia editingBlockId al inicio)
        await saveTenant();
        previousBlocksRef.current = null;
        setEditingBlockId(null);
    }, [saveTenant]);

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

    const activeBlock = editingBlock;
    const ActiveBlockConfig = activeBlock ? BLOCKS[activeBlock.type] : null;
    const ActiveEditor = ActiveBlockConfig?.editor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
    const ActiveStyleEditor = ActiveBlockConfig?.styleEditor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
    const ActiveIcon = ActiveBlockConfig?.icon as React.ElementType | undefined;

    // Forzamos preview a 'desktop' mientras se edita un bloque para que se muestre completo
    const providerMode = editingBlockId !== null ? 'desktop' : previewMode;
    return (
        <PreviewModeContext.Provider value={{ mode: providerMode, isMobile: providerMode === 'mobile', isTablet: providerMode === 'tablet', isDesktop: providerMode === 'desktop' }}>
            <>
                <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <div className="flex flex-col h-screen bg-slate-50 font-sans">
                    <header className={cn("bg-white border-b border-teal-100 shadow-sm z-30 shrink-0", activeBlock ? 'hidden' : '')}>
                        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={() => router.push('/dashboard/sites')} className="text-teal-600 hover:text-teal-700 text-xl font-semibold transition-colors">←</button>
                                <div>
                                    <h1 className="font-semibold text-slate-800">{tenant?.name}</h1>
                                    <p className="text-xs text-teal-600">{tenant?.slug}.gestularia.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const isLocal = window.location.hostname === 'localhost' || window.location.hostname.endsWith('.localhost');
                                        const url = isLocal
                                            ? `http://${tenant?.slug}.localhost:3000`
                                            : `https://${tenant?.slug}.gestularia.com`;
                                        window.open(url, '_blank');
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
                                >
                                    Ir al sitio
                                </button>
                                <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-sm">{saving ? 'Guardando...' : 'Guardar'}</button>
                            </div>
                        </div>
                    </header>

                    <main className="flex flex-1 overflow-hidden">
                        {/* Sidebar izquierdo - solo visible cuando NO hay bloque editándose en desktop */}
                        <aside className={cn(
                            "w-80 bg-white border-r border-teal-100 p-4 flex flex-col shadow-sm transition-all duration-300",
                            activeBlock ? "hidden" : "hidden md:flex"
                        )}>
                            <h2 className="font-semibold text-teal-900 px-2 pb-2 flex-shrink-0">Componentes</h2>
                            <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                                {['Todos', ...categoryOrder].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={cn(
                                            "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors",
                                            selectedCategory === category
                                                ? "bg-teal-600 text-white shadow-sm"
                                                : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="overflow-y-auto space-y-4">
                                {categoryOrder
                                    .filter(category => selectedCategory === 'Todos' || selectedCategory === category)
                                    .map(category => (
                                        <div key={category}>
                                            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider px-2 mb-2">{category}</h3>
                                            <div className="space-y-1">
                                                {(categorizedBlocks[category] || []).map((blockInfo) => {
                                                    const Icon = blockInfo.icon;
                                                    return (
                                                        <button key={blockInfo.key} onClick={() => setActiveBlockType(blockInfo.key as BlockType)} className="w-full p-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} /></div>
                                                                <div>
                                                                    <p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p>
                                                                    <p className="text-xs text-slate-500">{blockInfo.description}</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </aside>

                        {/* Canvas central - ajusta margen cuando hay panel de edición */}
                        <div ref={scrollContainerRef} style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth', overscrollBehavior: 'contain', touchAction: 'pan-y' }} className={cn(
                            "flex-1 overflow-y-auto transition-all duration-300",
                            activeBlock ? "md:mr-96" : ""
                        )}>
                            <div className="p-4 md:p-8">
                                <div id="editor-canvas" ref={canvasRef} style={{ touchAction: 'pan-y' }} className={cn(
                                    "mx-auto card-bg rounded-2xl card-shadow p-4 md:p-8",
                                    canvasWidthClass,
                                    activeBlock ? 'min-h-screen flex items-start justify-center py-12' : 'min-h-[60vh] flex flex-col gap-0'
                                )}>
                                    {activeBlock ? (
                                        <div className="w-full mx-auto">
                                            <div className="w-full p-2 md:p-0 rounded-lg bg-transparent">
                                                <BlockRenderer
                                                    key={activeBlock.id}
                                                    ref={el => { blockRefs.current[activeBlock.id] = el; }}
                                                    isHighlighted={activeBlock.id === newBlockId}
                                                    block={activeBlock}
                                                    isEditing={true}
                                                    isMobileEdit={isMobileEdit}
                                                    onUpdate={(key, value) => updateBlockProperty(activeBlock.id, key, value)}
                                                    onDelete={() => deleteBlock(activeBlock.id)}
                                                    onEdit={undefined}
                                                    onClose={() => setEditingBlockId(null)}
                                                    onMoveUp={undefined}
                                                    onMoveDown={undefined}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        blocks.map((block, index) => (
                                        <BlockRenderer
                                            key={block.id}
                                            ref={el => { blockRefs.current[block.id] = el; }}
                                            isHighlighted={block.id === newBlockId}
                                            block={block}
                                            isEditing={editingBlockId === block.id}
                                            isMobileEdit={isMobileEdit}
                                            onUpdate={(key, value) => updateBlockProperty(block.id, key, value)}
                                            onDelete={() => deleteBlock(block.id)}
                                            onEdit={editingBlockId === null
                                                ? () => { previousBlocksRef.current = blocks; setEditingBlockId(block.id); }
                                                : undefined}
                                            onClose={() => setEditingBlockId(null)}
                                            onMoveUp={editingBlockId === null && index > 0 ? () => moveBlock(index, index - 1) : undefined}
                                            onMoveDown={editingBlockId === null && index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
                                        />
                                        ))
                                    )}
                                    {!activeBlock && blocks.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-teal-100/50">
                                            <button
                                                onClick={() => {
                                                    setIsAddComponentPanelOpen(true);
                                                }}
                                                className="w-full bg-teal-50 text-teal-700 py-3 rounded-lg font-semibold hover:bg-teal-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                                Añadir Bloque
                                            </button>
                                        </div>
                                    )}
                                    {blocks.length === 0 && (
                                        <div className="text-center py-24 rounded-lg card-bg card-shadow">
                                            <p className="text-5xl mb-4">🎨</p>
                                            <p className="font-semibold text-teal-900 mb-4 text-lg">Tu lienzo está en blanco</p>
                                            <button
                                                onClick={() => {
                                                    setIsAddComponentPanelOpen(true);
                                                }}
                                                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 mx-auto shadow-sm"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                                Añadir tu primer bloque
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {activeBlockType && <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />}
                        {isAddComponentPanelOpen && (
                            <MobileAddComponentPanel
                                onClose={() => setIsAddComponentPanelOpen(false)}
                                onSelectBlock={(type) => { setActiveBlockType(type); setIsAddComponentPanelOpen(false); }}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                            />
                        )}
                        {isAddComponentPanelOpen && (previewMode === 'desktop' || previewMode === 'tablet') && (
                            <DesktopAddComponentPanel
                                onClose={() => setIsAddComponentPanelOpen(false)}
                                onSelectBlock={(type) => { setActiveBlockType(type); setIsAddComponentPanelOpen(false); }}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                            />
                        )}
                    </main>

                    <MobileToolbar isEditing={isMobileEdit} onToggleEditing={setIsMobileEdit} />

                    {isMobileEdit && !editingBlockId && (
                        <div className="md:hidden fixed bottom-6 right-6 z-40">
                            <button
                                onClick={() => { setPreviewMode('mobile'); setIsAddComponentPanelOpen(true); }}
                                className="w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform hover:bg-teal-700"
                            >
                                <PlusIcon className="w-7 h-7" />
                            </button>
                        </div>
                    )}

                    {/* Panel de edición Desktop - side by side con el canvas */}
                    {activeBlock && (
                        <>
                                    <Transition
                                        show={!!activeBlock}
                                        as={Fragment}
                                        enter="transform transition ease-out duration-300"
                                        enterFrom="translate-x-full opacity-0"
                                        enterTo="translate-x-0 opacity-100"
                                        leave="transform transition ease-in duration-200"
                                        leaveFrom="translate-x-0 opacity-100"
                                        leaveTo="translate-x-full opacity-0"
                                    >
                                        <aside className="hidden md:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-slate-200 shadow-2xl z-[60] overflow-hidden">
                                            <div className="h-full flex flex-col">
                                                {/* Header del panel */}
                                                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${ActiveBlockConfig?.theme.bg}`}>
                                                            {ActiveIcon && <ActiveIcon className={`w-6 h-6 ${ActiveBlockConfig?.theme.icon}`} />}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-800">Editar {ActiveBlockConfig?.name}</h3>
                                                            <p className="text-xs text-slate-500">Bloque #{activeBlock.id}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white rounded-md hover:bg-slate-100 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={saveEdit}
                                                            disabled={saving}
                                                            className="px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            {saving ? 'Guardando...' : 'Guardar'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tabs */}
                                                <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-white">
                                                    <nav className="flex gap-1">
                                                        <button 
                                                            onClick={() => setEditorTab('content')} 
                                                            className={cn(
                                                                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                                                editorTab === 'content' 
                                                                    ? 'bg-teal-100 text-teal-900 shadow-sm' 
                                                                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                                                            )}
                                                        >
                                                            Contenido
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditorTab('style')} 
                                                            className={cn(
                                                                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                                                editorTab === 'style' 
                                                                    ? 'bg-teal-100 text-teal-900 shadow-sm' 
                                                                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                                                            )}
                                                        >
                                                            Estilo
                                                        </button>
                                                    </nav>
                                                </div>

                                                {/* Contenido del editor */}
                                                <div className="flex-1 overflow-y-auto p-4">
                                                    {editorTab === 'content' ? (
                                                        ActiveEditor ? (
                                                            <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                        ) : (
                                                            <div className="text-center py-8 text-slate-500">
                                                                <p>No hay editor de contenido para este bloque.</p>
                                                            </div>
                                                        )
                                                    ) : editorTab === 'style' ? (
                                                        ActiveStyleEditor ? (
                                                            <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                        ) : (
                                                            <div className="text-center py-8 text-slate-500">
                                                                <p>No hay editor de estilo para este bloque.</p>
                                                            </div>
                                                        )
                                                    ) : null}
                                                </div>
                                            </div>
                                        </aside>
                                    </Transition>

                                    {/* Panel móvil - optimizado para ver el bloque en tiempo real */}
                                    <Transition show={!!activeBlock} as={Fragment}>
                                        <div className="md:hidden">
                                            <Transition.Child 
                                                as={Fragment} 
                                                enter="ease-out duration-200" 
                                                enterFrom="opacity-0" 
                                                enterTo="opacity-100" 
                                                leave="ease-in duration-150" 
                                                leaveFrom="opacity-100" 
                                                leaveTo="opacity-0"
                                            >
                                                {/* Overlay visual pero no intercepta gestos: permitimos scroll en el canvas detrás */}
                                                <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 z-[50] pointer-events-none" />
                                            </Transition.Child>

                                            <Transition.Child 
                                                as={Fragment} 
                                                enter="transform transition ease-in-out duration-200" 
                                                enterFrom="translate-y-full" 
                                                enterTo="translate-y-0" 
                                                leave="transform transition ease-in-out duration-150" 
                                                leaveFrom="translate-y-0" 
                                                leaveTo="translate-y-full"
                                            >
                                                <div className="fixed inset-x-0 bottom-0 z-[60] h-[50vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden border-t-4 border-teal-500">
                                                    <div className="h-full flex flex-col">
                                                        {/* Drag handle con indicador */}
                                                        <div className="flex flex-col items-center pt-2 pb-2 bg-gradient-to-b from-teal-50 to-white">
                                                            <div className="w-12 h-1.5 bg-teal-400 rounded-full mb-1"></div>
                                                            <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">
                                                                Vista previa arriba ↑
                                                            </p>
                                                        </div>

                                                        {/* Header compacto */}
                                                        <div className="flex items-center justify-between px-4 py-2 border-b border-teal-100 bg-teal-50/50">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${ActiveBlockConfig?.theme.bg}`}>
                                                                    {ActiveIcon && <ActiveIcon className={`w-5 h-5 ${ActiveBlockConfig?.theme.icon}`} />}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-sm text-slate-800">{ActiveBlockConfig?.name}</h3>
                                                                    <p className="text-[10px] text-slate-500">Mira los cambios arriba</p>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={cancelEdit} 
                                                                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-white transition-colors"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Tabs compactos */}
                                                        <div className="px-3 pt-2 pb-1 border-b border-slate-100 bg-white">
                                                            <nav className="flex gap-1.5">
                                                                <button 
                                                                    onClick={() => setEditorTab('content')} 
                                                                    className={cn(
                                                                        'flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                                                                        editorTab === 'content' 
                                                                            ? 'bg-teal-500 text-white shadow-md' 
                                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                    )}
                                                                >
                                                                    📝 Contenido
                                                                </button>
                                                                <button 
                                                                    onClick={() => setEditorTab('style')} 
                                                                    className={cn(
                                                                        'flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                                                                        editorTab === 'style' 
                                                                            ? 'bg-teal-500 text-white shadow-md' 
                                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                    )}
                                                                >
                                                                    🎨 Estilo
                                                                </button>
                                                            </nav>
                                                        </div>

                                                        {/* Contenido con hint superior */}
                                                        <div className="flex-1 overflow-y-auto">
                                                            {/* Banner recordatorio */}
                                                            <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-2 text-xs flex items-center gap-2 shadow-md">
                                                                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="font-medium">Los cambios se ven en tiempo real arriba ↑</span>
                                                            </div>
                                                            
                                                            <div className="p-4">
                                                                {editorTab === 'content' ? (
                                                                    ActiveEditor ? (
                                                                        <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                                    ) : (
                                                                        <div className="text-center py-8 text-slate-500">
                                                                            <p>No hay editor de contenido para este bloque.</p>
                                                                        </div>
                                                                    )
                                                                ) : editorTab === 'style' ? (
                                                                    ActiveStyleEditor ? (
                                                                        <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                                    ) : (
                                                                        <div className="text-center py-8 text-slate-500">
                                                                            <p>No hay editor de estilo para este bloque.</p>
                                                                        </div>
                                                                    )
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        {/* Footer con botón de cerrar destacado */}
                                                        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="px-4 py-2 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                onClick={saveEdit}
                                                                disabled={saving}
                                                                className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold shadow-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                {saving ? 'Guardando...' : 'Guardar'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Transition.Child>
                                        </div>
                                    </Transition>
                        </>
                    )}

                </div>
            </>
        </PreviewModeContext.Provider>
    );
}