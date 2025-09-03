'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer'; // <-- Importamos el nuevo componente

// --- Definiciones de Tipos ---
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<Block>) => void; onClose: () => void; }

// --- Iconos ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default function VisualEditor({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const router = useRouter();

  useEffect(() => { setIsMounted(true); }, []);

  const loadTenant = useCallback(async () => { /* ... (sin cambios) ... */ }, [params.id, router, isMounted]);
  useEffect(() => { loadTenant(); }, [loadTenant]);

  const saveTenant = async () => { /* ... (sin cambios) ... */ };
  const showNotification = (message: string, type = 'info') => { /* ... (sin cambios) ... */ };

  const addBlock = (blockType: BlockType) => {
    const blockConfig = BLOCKS[blockType];
    if (!blockConfig) return;
    const newBlock: Block = {
      id: Date.now() + Math.random(),
      type: blockType,
      data: blockConfig.defaultData,
    };
    setBlocks([...blocks, newBlock]);
    setIsAddPanelOpen(false);
  };
  const updateBlock = (blockId: number, updates: Partial<Block>) => setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const deleteBlock = (blockId: number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlockId(null); };
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };
  
  const editingBlock = blocks.find(b => b.id === editingBlockId);

  if (!isMounted || loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  if (!tenant) return <div className="text-center py-10"><h1 className="text-xl text-slate-600">Sitio no encontrado o sin acceso.</h1></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-800 text-xl">←</button>
              <div>
                <h1 className="font-semibold text-slate-800">{tenant.name}</h1>
                <p className="text-xs text-slate-500">{tenant.slug}.gestularia.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.open(`https://${tenant.slug}.gestularia.com`, '_blank')} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Vista Previa</button>
              <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex">
        <aside className="w-72 bg-white border-r border-slate-200 p-4 space-y-4 hidden md:block" style={{ height: 'calc(100vh - 61px)'}}>
          <h2 className="font-semibold text-slate-800">Agregar Bloques</h2>
          {Object.keys(BLOCKS).map((key) => {
            const blockKey = key as BlockType;
            const blockInfo = BLOCKS[blockKey];
            return (
              <button key={blockKey} onClick={() => addBlock(blockKey)} className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{blockInfo.icon}</span>
                  <div><p className="font-medium text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div>
                </div>
              </button>
            );
          })}
        </aside>

        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 61px)'}}>
          <div className="max-w-3xl mx-auto my-6 p-2">
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200 min-h-[85vh] p-2 md:p-4 space-y-2">
              {blocks.length > 0 ? (
                blocks.map((block, index) => (
                  <BlockRenderer 
                    key={block.id} 
                    block={block} 
                    isEditing={editingBlockId === block.id} 
                    onEdit={() => setEditingBlockId(block.id)} 
                    onDelete={() => deleteBlock(block.id)}
                    onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                    onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center">
                  <div>
                    <p className="text-5xl mb-4">🎨</p>
                    <p className="text-lg font-semibold text-slate-700 mb-1">Tu lienzo está en blanco</p>
                    <p className="text-sm text-slate-500">Agrega un bloque para empezar a construir.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl transition-transform duration-300 ease-in-out z-50 w-full max-w-sm ${editingBlockId ? 'translate-x-0' : 'translate-x-full'}`}>
          {editingBlock && <EditPanel block={editingBlock} onUpdate={(updates) => updateBlock(editingBlock.id, updates)} onClose={() => setEditingBlockId(null)} />}
        </div>
        
        {/* Mobile UI */}
        <div className={`md:hidden fixed inset-0 z-40 ...`}>{/* ... */}</div>
        <button onClick={() => setIsAddPanelOpen(true)} className="md:hidden fixed ..."><PlusIcon/></button>
      </main>
    </div>
  );
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
    if (!block) return null;
    const blockConfig = BLOCKS[block.type as BlockType];
    if (!blockConfig) return null;
    const EditorComponent = blockConfig.editor;

    const updateData = (key: string, value: any) => {
        onUpdate({ data: { ...block.data, [key]: value } });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <EditIcon/>
                        <h3 className="text-lg font-semibold text-slate-800">Editar {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">×</button>
                </div>
            </div>
            <div className="p-4 space-y-5 overflow-y-auto flex-1">
                <EditorComponent data={block.data} updateData={updateData} />
            </div>
        </div>
    );
}