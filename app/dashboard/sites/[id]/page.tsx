// app/dashboard/sites/[id]/page.tsx (CÓDIGO COMPLETO Y CORREGIDO)
'use client';
import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';

// --- Tipos ---
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface EditPanelProps { block: Block | undefined; onUpdate: (key: string, value: unknown) => void; onClose: () => void; }

// --- Iconos ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default function VisualEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const el = document.createElement('div');
    el.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-50 ${ type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
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
      } else {
        router.push('/dashboard/sites');
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      router.push('/dashboard/sites');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadTenant();
  }, [loadTenant]);

  const saveTenant = useCallback(async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      setEditingBlockId(null); // Salir del modo edición antes de guardar
      await new Promise(resolve => setTimeout(resolve, 50)); // Pequeña espera para que React actualice el estado visual

      const jsonContent = JSON.stringify(blocks);
      const updatedTenant = { ...tenant, pages: tenant.pages.map((page) => page.slug === '/' ? { ...page, content: jsonContent } : page ) };
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updatedTenant) });
      if (res.ok) {
        showNotification('Sitio guardado exitosamente', 'success');
      } else { throw new Error('Failed to save'); }
    } catch (error) {
      console.error('Error al guardar:', error);
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
    if (editingBlockId === blockId) {
      setEditingBlockId(null);
    }
  };
  
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  };
  
  const editingBlock = blocks.find(b => b.id === editingBlockId);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;

  return (
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
            <button onClick={() => window.open(`/site/${tenant?.slug}`, '_blank')} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Vista Previa</button>
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
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockInfo.theme.bg}`}>
                        <Icon className={`w-6 h-6 ${blockInfo.theme.icon}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{blockInfo.name}</p>
                      <p className="text-xs text-slate-500">{blockInfo.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
        </aside>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto my-6 p-2">
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200 min-h-full p-4">
              {blocks.map((block, index) => (
                <BlockRenderer 
                  key={block.id} 
                  block={block} 
                  isEditing={editingBlockId === block.id} 
                  onDelete={() => deleteBlock(block.id)} 
                  onEdit={() => setEditingBlockId(block.id)} 
                  onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                  onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
                />
              ))}
              {blocks.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed rounded-lg">
                  <p className="text-5xl mb-4">🎨</p>
                  <p className="text-lg font-semibold text-slate-700 mb-1">Tu lienzo está en blanco</p>
                  <p className="text-sm text-slate-500">Añade un componente desde la barra lateral para empezar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <aside className={`transition-all duration-300 ease-in-out bg-white border-l border-slate-200 overflow-hidden ${editingBlockId ? 'w-96' : 'w-0'}`}>
            {editingBlock && <EditPanel block={editingBlock} onUpdate={(key, value) => updateBlock(editingBlock.id, key, value)} onClose={() => setEditingBlockId(null)} />}
        </aside>

        {activeBlockType && <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />}
      </main>
    </div>
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
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockConfig.theme.bg}`}>
                            <Icon className={`w-6 h-6 ${blockConfig.theme.icon}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Elige un diseño de {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                    {blockConfig.variants.map((variant, index) => {
                        const PreviewComponent = variant.preview as React.FC<{ data: BlockData }>;
                        return (
                            <div key={index} onClick={() => onAddBlock(blockType, variant.defaultData)} className="border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all">
                                <div className="p-4 bg-slate-50 flex items-center justify-center h-48">
                                    <PreviewComponent data={variant.defaultData} />
                                </div>
                                <div className="p-3">
                                    <h4 className="font-semibold text-sm">{variant.name}</h4>
                                    <p className="text-xs text-slate-500">{variant.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function EditPanel({ block, onUpdate, onClose }: { block: Block, onUpdate: (key: string, value: unknown) => void, onClose: () => void }) {
    const blockConfig = BLOCKS[block.type as BlockType];
    const Icon = blockConfig.icon;
    const EditorComponent = blockConfig.editor as React.FC<{ data: BlockData, updateData: (key: string, value: unknown) => void }>;
  
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockConfig.theme.bg}`}>
                <Icon className={`w-6 h-6 ${blockConfig.theme.icon}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Editando: {blockConfig.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
        </div>
        <div className="p-4 space-y-5 overflow-y-auto flex-1 bg-slate-50/50">
          <EditorComponent data={block.data} updateData={onUpdate} />
        </div>
      </div>
    );
}