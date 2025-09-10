'use client';
import { useState, useEffect, useCallback, use, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData, Block } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';
import { ComputerDesktopIcon, DeviceTabletIcon, DevicePhoneMobileIcon, SparklesIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { PreviewModeContext } from '@/app/contexts/PreviewModeContext';
import { TextareaField } from '@/app/components/editor/blocks/InputField';
import { Transition } from '@headlessui/react';

// --- Tipos y sModales ---

interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }

function GenerateAllModal({ onClose, onGenerate, isLoading }: { onClose: () => void, onGenerate: (desc: string) => void, isLoading: boolean }) {
  const [userDescription, setUserDescription] = useState('');
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-semibold text-slate-800">Generar Contenido con IA</h3><button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button></div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">Describe tu negocio o la idea principal para generar todo el contenido de la página.</p>
          <TextareaField label="Descripción del negocio" value={userDescription} rows={5} onChange={(e) => setUserDescription(e.target.value)} />
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancelar</button>
          <button onClick={() => onGenerate(userDescription)} disabled={isLoading || !userDescription} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {isLoading ? 'Generando...' : <><SparklesIcon className="w-5 h-5" />Generar contenido</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileAddComponentPanel({ onClose, onSelectBlock }: { onClose: () => void, onSelectBlock: (type: BlockType) => void }) {
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
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {Object.entries(BLOCKS).map(([key, blockInfo]) => {
                                        const Icon = blockInfo.icon;
                                        return (
                                            <button key={key} onClick={() => onSelectBlock(key as BlockType)} className="w-full p-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} /></div>
                                                    <div><p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
}

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

export default function VisualEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showGenerateAllModal, setShowGenerateAllModal] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isAddComponentPanelOpen, setAddComponentPanelOpen] = useState(false);

  const previewContextValue = { mode: previewMode, isMobile: previewMode === 'mobile', isTablet: previewMode === 'tablet', isDesktop: previewMode === 'desktop' };

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
        setBlocks(Array.isArray(JSON.parse(content)) ? JSON.parse(content) : []);
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

  const addBlock = (blockType: BlockType, data: BlockData) => {
    const newBlock: Block = { id: Date.now(), type: blockType, data };
    setBlocks([...blocks, newBlock]);
    setActiveBlockType(null);
  };
  
  const updateBlock = (blockId: number, key: string, value: unknown) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, data: { ...b.data, [key]: value } } : b));
  };

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
  
  const handleGenerateAllContent = async (userDescription: string) => {
      setIsGeneratingAll(true);
      try {
          const res = await fetch('/api/ai/generate-page-content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userDescription, blocks }),
          });
          const result = await res.json();
          if (res.ok && result.blocks) {
              setBlocks(result.blocks);
              showNotification('Contenido de la página generado con éxito');
          } else { throw new Error(result.error || 'Error al generar contenido'); }
      } catch (error) {
          showNotification('Error al generar el contenido de la página', 'error');
      } finally {
          setIsGeneratingAll(false);
          setShowGenerateAllModal(false);
      }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

  return (
    <PreviewModeContext.Provider value={previewContextValue}>
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
              <button onClick={() => setShowGenerateAllModal(true)} disabled={isGeneratingAll} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1.5"><SparklesIcon className="h-4 w-4" />{isGeneratingAll ? 'Generando...' : 'Generar con IA'}</button>
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

        <main className="flex flex-1 overflow-hidden">
          <aside className="w-80 bg-white border-r border-slate-200 p-4 space-y-2 hidden md:block overflow-y-auto">
            <h2 className="font-semibold text-slate-800 px-2 pb-2">Componentes</h2>
            {Object.entries(BLOCKS).map(([key, blockInfo]) => {
                const Icon = blockInfo.icon;
                return (
                  <button key={key} onClick={() => setActiveBlockType(key as BlockType)} className="w-full p-2 text-left rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}><Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} /></div>
                      <div><p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div>
                    </div>
                  </button>
                );
              })}
          </aside>

          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 z-20 bg-slate-100/80 backdrop-blur-sm py-2 border-b border-slate-200">
              <div className="flex justify-center">
                  <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border">
                      <button onClick={() => setPreviewMode('desktop')} title="Vista de Escritorio" className={cn( "p-2 rounded-full transition-colors", previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100' )}><ComputerDesktopIcon className="w-5 h-5" /></button>
                      <button onClick={() => setPreviewMode('tablet')} title="Vista de Tableta" className={cn("p-2 rounded-full transition-colors", previewMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100' )}><DeviceTabletIcon className="w-5 h-5" /></button>
                      <button onClick={() => setPreviewMode('mobile')} title="Vista de Móvil" className={cn("p-2 rounded-full transition-colors", previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100' )}><DevicePhoneMobileIcon className="w-5 h-5" /></button>
                  </div>
              </div>
            </div>
            
            <div className="p-4 md:p-8">
              <div className={cn("mx-auto bg-white rounded-lg shadow-sm ring-1 ring-slate-200 min-h-full transition-all duration-300 ease-in-out", { 'max-w-full': previewMode === 'desktop', 'max-w-screen-md': previewMode === 'tablet', 'max-w-sm': previewMode === 'mobile' })}>
                <div className="p-4">
                  {(editingBlockId ? blocks.filter(b => b.id === editingBlockId) : blocks).map((block, index) => (
                    <BlockRenderer 
                        key={block.id} 
                        block={block} 
                        isEditing={editingBlockId === block.id} 
                        onDelete={() => deleteBlock(block.id)} 
                        onEdit={() => setEditingBlockId(block.id)}
                        onClose={() => setEditingBlockId(null)}
                        onUpdate={(key, value) => updateBlock(block.id, key, value)}
                        onMoveUp={editingBlockId === null && index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                        onMoveDown={editingBlockId === null && index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} 
                    />
                  ))}
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
          
          {activeBlockType && <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />}
        </main>

        <div className="md:hidden fixed bottom-6 right-6 z-40">
            <button
                onClick={() => setAddComponentPanelOpen(true)}
                className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
            >
                <PlusIcon className="w-7 h-7" />
            </button>
        </div>
      </div>

      {isAddComponentPanelOpen && (
          <MobileAddComponentPanel 
            onClose={() => setAddComponentPanelOpen(false)}
            onSelectBlock={(type) => {
                setActiveBlockType(type);
                setAddComponentPanelOpen(false);
            }}
          />
      )}

      {showGenerateAllModal && <GenerateAllModal onClose={() => setShowGenerateAllModal(false)} onGenerate={handleGenerateAllContent} isLoading={isGeneratingAll} />}
    </PreviewModeContext.Provider>
  );
}