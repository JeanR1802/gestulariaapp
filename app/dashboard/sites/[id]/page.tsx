'use client';
import { useState, useEffect, useCallback, use, Fragment, useRef } from 'react'; // Importar useRef
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData, Block, BlockConfig } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';

import { ComputerDesktopIcon, DeviceTabletIcon, DevicePhoneMobileIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

import { cn } from '@/lib/utils';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { TextareaField } from '@/app/components/editor/blocks/InputField';
import { Transition } from '@headlessui/react';
import { InlineEditorPanel } from '@/app/components/editor/controls/InlineEditorPanel';
import { MobileToolbar } from '@/app/components/editor/controls/MobileToolbar';

// --- Tipos y Modales ---

interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }

// --- MobileAddComponentPanel (CON FILTROS) ---
function MobileAddComponentPanel({ onClose, onSelectBlock, selectedCategory, setSelectedCategory }: { onClose: () => void, onSelectBlock: (type: BlockType) => void, selectedCategory: string, setSelectedCategory: (category: string) => void }) {
    // Estas constantes ahora se pasan como props, pero las necesitamos aquí para renderizar
    const categorizedBlocks = Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
      const category = blockInfo.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ key, ...blockInfo });
      return acc;
    }, {} as Record<string, (BlockConfig<any> & { key: string })[]>);
    
    const categoryOrder: (keyof typeof categorizedBlocks)[] = ['Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'];

    return (
        <Transition show={true} as={Fragment}>
            <div className="fixed inset-0 z-40 md:hidden">
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                </Transition.Child>
                <div className="fixed inset-y-0 left-0 max-w-full flex">
                    <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                        <div className="w-screen max-w-xs">
                            <div className="h-full flex flex-col bg-white shadow-xl">
                                <div className="p-4 border-b bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900">Añadir Componente</h2>
                                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><XMarkIcon className="h-6 w-6" /></button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                                        {['Todos', ...categoryOrder].map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={cn(
                                                    "px-3 py-1 text-sm font-semibold rounded-full flex-shrink-0 transition-colors",
                                                    selectedCategory === category
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                )}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                            
                                    {categoryOrder
                                        .filter(category => selectedCategory === 'Todos' || selectedCategory === category)
                                        .map(category => (
                                        <div key={category}>
                                            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider px-2 mb-2">{category}</h3>
                                            <div className="space-y-2">
                                                {(categorizedBlocks[category] || []).map((blockInfo) => {
                                                    const Icon = blockInfo.icon;
                                                    return (
                                                        <button key={blockInfo.key} onClick={() => onSelectBlock(blockInfo.key as BlockType)} className="w-full p-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} /></div>
                                                                <div><p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
}

// --- AddBlockPanel (SIN CAMBIOS) ---
function AddBlockPanel({ blockType, onAddBlock, onClose }: { blockType: BlockType | null, onAddBlock: (type: BlockType, data: BlockData) => void, onClose: () => void }) {
    if (!blockType) return null;
    const blockConfig = BLOCKS[blockType];
    const Icon = blockConfig.icon;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockConfig.theme.bg}`}><Icon className={`w-6 h-6 ${blockConfig.theme.icon}`} /></div>
                        <h3 className="text-lg font-semibold text-slate-800">Elige un diseño de {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                    {blockConfig.variants.map((variant, index) => {
                        const PreviewComponent = variant.preview as React.FC<{ data: BlockData }>;
                        return (
                            <div key={index} onClick={() => onAddBlock(blockType, variant.defaultData)} className="border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all">
                                <div className="p-4 bg-slate-50 flex items-center justify-center h-48"><PreviewComponent data={variant.defaultData} /></div>
                                <div className="p-3"><h4 className="font-semibold text-sm">{variant.name}</h4><p className="text-xs text-slate-500">{variant.description}</p></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL: VisualEditor ---
export default function VisualEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Lógica de categorización DENTRO del componente
  const categorizedBlocks = Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
    const category = blockInfo.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ key, ...blockInfo });
    return acc;
  }, {} as Record<string, (BlockConfig<any> & { key: string })[]>);

  const categoryOrder: (keyof typeof categorizedBlocks)[] = ['Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'];
  
  const router = useRouter();

  // Estados del componente
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isMobileEdit, setIsMobileEdit] = useState(false);
  const [isAddComponentPanelOpen, setAddComponentPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos'); 
  const [newBlockId, setNewBlockId] = useState<number | null>(null); // Estado para resalte
  const blockRefs = useRef<Record<number, HTMLDivElement | null>>({}); // Refs para los bloques

  // Calculados
  const editingBlock = editingBlockId ? blocks.find(b => b.id === editingBlockId) : null;
  const editingBlockIndex = editingBlock ? blocks.findIndex(b => b.id === editingBlock.id) : -1;
  const previewContextValue = { mode: previewMode, isMobile: previewMode === 'mobile', isTablet: previewMode === 'tablet', isDesktop: previewMode === 'desktop' };

  // Funciones de notificación y carga/guardado
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const el = document.createElement('div');
    el.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-[100] ${ type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
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
        // Asegurarse de parsear correctamente o inicializar vacío
        try {
          const parsedContent = JSON.parse(content);
          setBlocks(Array.isArray(parsedContent) ? parsedContent : []);
        } catch {
          setBlocks([]); // Si hay error al parsear, empezar con array vacío
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
      setEditingBlockId(null); // Cerrar panel de edición antes de guardar
      await new Promise(resolve => setTimeout(resolve, 50)); // Pequeño delay
      const jsonContent = JSON.stringify(blocks);
      const updatedTenant = { 
        ...tenant, 
        pages: tenant.pages.map((page) => page.slug === '/' ? { ...page, content: jsonContent } : page ),
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

  // Funciones de manejo de bloques
  const addBlock = (blockType: BlockType, data: BlockData) => {
    const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data }; // + Math.random() para IDs más únicos
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setNewBlockId(newBlock.id); // Guardar ID para resalte
    setActiveBlockType(null);
    setAddComponentPanelOpen(false); // Cerrar panel móvil si está abierto
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
  
  // Efecto para scroll y resalte
  useEffect(() => {
    if (newBlockId && blockRefs.current[newBlockId]) {
        const blockElement = blockRefs.current[newBlockId];
        setTimeout(() => {
            blockElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); // Pequeño delay para asegurar que el DOM está listo

        const timer = setTimeout(() => {
            setNewBlockId(null); // Limpiar el ID después de la animación
        }, 1600); // Duración de animación + margen

        return () => clearTimeout(timer); // Limpieza al desmontar o si cambia newBlockId
    }
  }, [newBlockId]); 

  // Renderizado
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

  return (
    <PreviewModeContext.Provider value={previewContextValue}>
      <div className="flex flex-col h-screen bg-slate-100 font-sans">
        {/* Header */}
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
                Vista Previa
              </button>
              <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Panel Lateral Desktop (CON FILTROS) */}
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

          {/* Lienzo Principal */}
          <div className="flex-1 overflow-y-auto">
            {/* Controles de Vista Previa */}
            <div className="sticky top-0 z-20 bg-slate-100/80 backdrop-blur-sm py-2 border-b border-slate-200">
              <div className="flex justify-center">
                  <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border">
                      <button onClick={() => setPreviewMode('desktop')} title="Vista de Escritorio" className={cn( "p-2 rounded-full transition-colors", previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100' )}><ComputerDesktopIcon className="w-5 h-5" /></button>
                      <button onClick={() => setPreviewMode('tablet')} title="Vista de Tableta" className={cn("p-2 rounded-full transition-colors", previewMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100' )}><DeviceTabletIcon className="w-5 h-5" /></button>
                      <button onClick={() => setPreviewMode('mobile')} title="Vista de Móvil" className={cn("p-2 rounded-full transition-colors", previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100' )}><DevicePhoneMobileIcon className="w-5 h-5" /></button>
                  </div>
              </div>
            </div>
            
            {/* Contenedor del Lieneo */}
            <div className="p-4 md:p-8">
              <div className={cn("mx-auto bg-white rounded-lg shadow-sm ring-1 ring-slate-200 min-h-full transition-all duration-300 ease-in-out", { 'max-w-full': previewMode === 'desktop', 'max-w-screen-md': previewMode === 'tablet', 'max-w-sm': previewMode === 'mobile' })}>
                {/* Renderizado de Bloques */}
                <div className="p-4">
                  {blocks.map((block, index) => (
                    <BlockRenderer 
                        key={block.id} 
                        ref={el => { blockRefs.current[block.id] = el; }} // Corregido: no retorna nada
                        isHighlighted={block.id === newBlockId}
                        block={block} 
                        isEditing={editingBlockId === block.id} 
                        isMobileEdit={isMobileEdit}
                        onUpdate={(key, value) => updateBlockProperty(block.id, key, value)}
                        onDelete={() => deleteBlock(block.id)} 
                        onEdit={editingBlockId === null ? () => setEditingBlockId(block.id) : undefined}
                        onClose={() => setEditingBlockId(null)}
                        onMoveUp={editingBlockId === null && (previewMode !== 'mobile' || isMobileEdit) && index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                        onMoveDown={editingBlockId === null && (previewMode !== 'mobile' || isMobileEdit) && index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
                    />
                  ))}
                  {/* Placeholder si no hay bloques */}
                  {blocks.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed rounded-lg">
                      <p className="text-5xl mb-4">🎨</p>
                      <p className={cn("font-semibold text-slate-700 mb-1", {'text-lg': previewMode === 'desktop', 'text-base': previewMode === 'tablet', 'text-sm': previewMode === 'mobile'})}>Tu lienzo está en blanco</p>
                      <p className={cn("text-slate-500", {'text-sm': previewMode === 'desktop', 'text-xs': previewMode === 'mobile'})}>Añade un componente desde la barra lateral para empezar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel Modal para Añadir Bloque (variantes) */}
          {activeBlockType && <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />}
        </main>

        {/* Barra de Herramientas Móvil (Edición/Preview) */}
        <MobileToolbar isEditing={isMobileEdit} onToggleEditing={setIsMobileEdit} />

        {/* Botón Flotante Añadir en Móvil (solo en modo edición) */}
        {isMobileEdit && (
          <div className="md:hidden fixed bottom-6 right-6 z-40">
              <button
                  onClick={() => setAddComponentPanelOpen(true)}
                  className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
              >
                  <PlusIcon className="w-7 h-7" />
              </button>
          </div>
        )}
      </div>

      {/* Panel Lateral Móvil para Añadir Componente (CON FILTROS) */}
      {isAddComponentPanelOpen && (
          <MobileAddComponentPanel 
            onClose={() => setAddComponentPanelOpen(false)}
            onSelectBlock={(type) => {
                setActiveBlockType(type); // Abre el modal de variantes
                setAddComponentPanelOpen(false); // Cierra este panel
            }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
      )}

      {/* Panel de Edición Inline */}
      {editingBlock && (
        <InlineEditorPanel
          key={editingBlock.id} // Re-montar si cambia el bloque
          block={editingBlock}
          onClose={() => setEditingBlockId(null)}
          onDataChange={handleDataChange} // Para preview en tiempo real
          onDelete={() => deleteBlock(editingBlock.id)}
          onMoveUp={editingBlockIndex > 0 ? () => {
            moveBlock(editingBlockIndex, editingBlockIndex - 1);
            // No cerramos el editor, solo movemos
          } : undefined}
          onMoveDown={editingBlockIndex < blocks.length - 1 ? () => {
            moveBlock(editingBlockIndex, editingBlockIndex + 1);
             // No cerramos el editor, solo movemos
          } : undefined}
        />
      )}


    </PreviewModeContext.Provider>
  );
}