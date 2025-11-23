'use client';
import { useState, useEffect, useCallback, use, Fragment, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BLOCKS, BlockType, BlockData, Block, BlockConfig } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';
import { MobileToolbar } from '@/app/components/editor/controls/MobileToolbar';
import { XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Settings, Edit, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { AdvancedEditorCanvas } from '@/app/components/editor/canvas/AdvancedEditorCanvas';
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
    const editorFirstFocusRef = useRef<HTMLButtonElement | null>(null);
    const [isAdvancedEditingId, setIsAdvancedEditingId] = useState<number | null>(null);
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

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

    const activeBlock = editingBlock;
    const ActiveBlockConfig = activeBlock ? BLOCKS[activeBlock.type] : null;
    const ActiveEditor = ActiveBlockConfig?.editor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
    const ActiveStyleEditor = ActiveBlockConfig?.styleEditor as React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> | undefined;
    const ActiveIcon = ActiveBlockConfig?.icon as React.ElementType | undefined;

    return (
        <PreviewModeContext.Provider value={{ mode: previewMode, isMobile: previewMode === 'mobile', isTablet: previewMode === 'tablet', isDesktop: previewMode === 'desktop' }}>
            <>
                <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <div className="flex flex-col h-screen bg-slate-100 font-sans">
                    <header className="bg-white border-b border-slate-200 z-30 shrink-0">
                        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={() => router.push('/dashboard/sites')} className="text-slate-500 hover:text-slate-800 text-xl">←</button>
                                <div>
                                    <h1 className="font-semibold text-slate-800">{tenant?.name}</h1>
                                    <p className="text-xs text-slate-500">{tenant?.slug}.gestularia.com</p>
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
                                    className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                                >
                                    Ir al sitio
                                </button>
                                <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
                            </div>
                        </div>
                    </header>

                    <main className="flex flex-1 overflow-hidden">
                        <aside className="w-80 bg-white border-r border-slate-200 p-4 flex flex-col hidden md:flex">
                            <h2 className="font-semibold text-slate-800 px-2 pb-2 flex-shrink-0">Componentes</h2>
                            <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                                {['Todos', ...categoryOrder].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={cn(
                                            "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors",
                                            selectedCategory === category
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 md:p-8">
                                <div id="editor-canvas" className={cn("mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 min-h-[60vh] flex flex-col gap-0", canvasWidthClass)}>
                                    {blocks.map((block, index) => (
                                        <BlockRenderer
                                            key={block.id}
                                            ref={el => { blockRefs.current[block.id] = el; }}
                                            isHighlighted={block.id === newBlockId}
                                            block={block}
                                            isEditing={editingBlockId === block.id}
                                            isMobileEdit={isMobileEdit}
                                            onUpdate={(key, value) => updateBlockProperty(block.id, key, value)}
                                            onDelete={() => deleteBlock(block.id)}
                                            onEdit={editingBlockId === null && isAdvancedEditingId === null
                                                ? () => {
                                                    if (block.type === 'header' && block.data.variant === 'custom') {
                                                        setIsAdvancedEditingId(block.id);
                                                        setEditingBlockId(block.id);
                                                    } else {
                                                        setEditingBlockId(block.id);
                                                    }
                                                }
                                                : undefined}
                                            onClose={() => setEditingBlockId(null)}
                                            onMoveUp={editingBlockId === null && index > 0 ? () => moveBlock(index, index - 1) : undefined}
                                            onMoveDown={editingBlockId === null && index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
                                        />
                                    ))}
                                    {blocks.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-slate-200/50">
                                            <button
                                                onClick={() => {
                                                    setIsAddComponentPanelOpen(true);
                                                }}
                                                className="w-full bg-slate-100 text-slate-600 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                                Añadir Bloque
                                            </button>
                                        </div>
                                    )}
                                    {blocks.length === 0 && (
                                        <div className="text-center py-24 border-2 border-dashed rounded-lg">
                                            <p className="text-5xl mb-4">🎨</p>
                                            <p className="font-semibold text-slate-700 mb-4 text-lg">Tu lienzo está en blanco</p>
                                            <button
                                                onClick={() => {
                                                    setIsAddComponentPanelOpen(true);
                                                }}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
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
                        {isAddComponentPanelOpen && previewMode === 'mobile' && (
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

                    {isMobileEdit && (
                        <div className="md:hidden fixed bottom-6 right-6 z-40">
                            <button
                                onClick={() => setIsAddComponentPanelOpen(true)}
                                className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                            >
                                <PlusIcon className="w-7 h-7" />
                            </button>
                        </div>
                    )}

                    {activeBlock && (
                        <>
                            {isAdvancedEditingId === activeBlock.id ? (
                                <AdvancedEditorCanvas
                                    block={activeBlock}
                                    onClose={() => setIsAdvancedEditingId(null)}
                                    onSave={(newData: BlockData) => {
                                        updateBlockData(activeBlock.id, newData);
                                        setIsAdvancedEditingId(null);
                                        setEditingBlockId(null);
                                    }}
                                />
                            ) : (
                                <>
                                    <div className="hidden md:block">
                                        <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-slate-200 shadow-lg z-[60] p-4 overflow-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${ActiveBlockConfig?.theme.bg}`}>
                                                        {ActiveIcon && <ActiveIcon className={`w-6 h-6 ${ActiveBlockConfig?.theme.icon}`} />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">Editar {ActiveBlockConfig?.name}</h3>
                                                        <p className="text-xs text-slate-500">Bloque #{activeBlock.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button ref={editorFirstFocusRef} onClick={() => { setEditingBlockId(null); }} className="text-slate-500 hover:text-slate-800">Cerrar</button>
                                                </div>
                                            </div>

                                            <div className="mb-4 border-b pb-2">
                                                <nav className="flex gap-2">
                                                    <button onClick={() => setEditorTab('content')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'content' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Contenido</button>
                                                    <button onClick={() => setEditorTab('style')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'style' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Estilo</button>
                                                </nav>
                                            </div>

                                            <div>
                                                {editorTab === 'content' ? (
                                                    ActiveEditor ? (
                                                        <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                    ) : (
                                                        <p>No hay editor de contenido para este bloque ({activeBlock.type}).</p>
                                                    )
                                                ) : editorTab === 'style' ? (
                                                    ActiveStyleEditor ? (
                                                        <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                    ) : (
                                                        <p>No hay editor de estilo para este bloque ({activeBlock.type}).</p>
                                                    )
                                                ) : null}
                                            </div>
                                        </aside>
                                    </div>

                                    <Transition show={!!activeBlock} as={Fragment}>
                                        <div className="md:hidden">
                                            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <div className="fixed inset-0 bg-black/40 z-[50]" onClick={() => setEditingBlockId(null)} />
                                            </Transition.Child>

                                            <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-200" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-150" leaveFrom="translate-y-0" leaveTo="translate-y-full">
                                                <div className="fixed inset-x-0 bottom-0 z-[60] h-[80vh] bg-white rounded-t-xl shadow-xl p-4 overflow-auto">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-semibold">Editar {ActiveBlockConfig?.name}</h3>
                                                        <button onClick={() => setEditingBlockId(null)} className="text-slate-500">Cerrar</button>
                                                    </div>

                                                    <div className="mb-4 border-b pb-2">
                                                        <nav className="flex gap-2">
                                                            <button onClick={() => setEditorTab('content')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'content' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Contenido</button>
                                                            <button onClick={() => setEditorTab('style')} className={cn('px-3 py-1 rounded-md text-sm', editorTab === 'style' ? 'bg-slate-100 font-semibold' : 'text-slate-600')}>Estilo</button>
                                                        </nav>
                                                    </div>

                                                    <div>
                                                        {editorTab === 'content' ? (
                                                            ActiveEditor ? (
                                                                <ActiveEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                            ) : (
                                                                <p>No hay editor de contenido para este bloque ({activeBlock.type}).</p>
                                                            )
                                                        ) : editorTab === 'style' ? (
                                                            ActiveStyleEditor ? (
                                                                <ActiveStyleEditor data={activeBlock.data as BlockData} updateData={(k: string, v: unknown) => applyEditorUpdate(k, v)} />
                                                            ) : (
                                                                <p>No hay editor de estilo para este bloque ({activeBlock.type}).</p>
                                                            )
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </Transition.Child>
                                        </div>
                                    </Transition>
                                </>
                            )}
                        </>
                    )}

                </div>
            </>
        </PreviewModeContext.Provider>
    );
}