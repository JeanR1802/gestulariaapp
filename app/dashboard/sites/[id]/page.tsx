// Archivo: app/dashboard/sites/[id]/page.tsx (CÓDIGO FINAL Y FUNCIONAL)
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';

// --- Definiciones de Tipos ---
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
// Se corrige la firma de onUpdate para que sea específica y segura
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<BlockData>) => void; onClose: () => void; }

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
  
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [activeBlockType, setActiveBlockType] = useState<BlockType | null>(null);
  
  const [mobileToolbarBlockId, setMobileToolbarBlockId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (editingBlockId !== null) {
      setMobileToolbarBlockId(null);
    }
  }, [editingBlockId]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const el = document.createElement('div');
    el.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-50 ${ type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }, []);

  const loadTenant = useCallback(async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTenant(data.tenant);
        const content = data.tenant.pages[0]?.content || '[]';
        let initialBlocks: Block[] = [];
        try { const parsed = JSON.parse(content); if (Array.isArray(parsed)) initialBlocks = parsed; }
        catch { console.warn("Contenido inválido, iniciando lienzo en blanco."); }
        setBlocks(initialBlocks);
      } else { router.push('/dashboard'); }
    } catch (error) { console.error('Error al cargar:', error); router.push('/dashboard'); }
    finally { setLoading(false); }
  }, [params.id, router]);

  useEffect(() => { 
    if(isMounted) {
      loadTenant(); 
    }
  }, [isMounted, loadTenant]);

  const saveTenant = useCallback(async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      const jsonContent = JSON.stringify(blocks);
      const updatedTenant = { ...tenant, pages: tenant.pages.map((page) => page.slug === '/' ? { ...page, content: jsonContent } : page ) };
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updatedTenant) });
      if (res.ok) {
        showNotification('Sitio guardado exitosamente', 'success');
        setTenant(updatedTenant);
      } else { throw new Error('Failed to save'); }
    } catch (error) {
      console.error('Error al guardar:', error);
      showNotification('Error al guardar el sitio', 'error');
    } finally {
      setSaving(false);
    }
  }, [blocks, params.id, showNotification, tenant]);
  
  const addBlock = (blockType: BlockType, data: BlockData) => {
    const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data, };
    setBlocks([...blocks, newBlock]);
    setIsMobilePanelOpen(false);
    setActiveBlockType(null);
  };

  // ESTA ES LA FUNCIÓN CORREGIDA QUE ARREGLA LA EDICIÓN
  const updateBlock = (blockId: number, dataUpdates: Partial<BlockData>) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? { ...block, data: { ...block.data, ...dataUpdates } }
          : block
      )
    );
  };
  
  const deleteBlock = (blockId: number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlockId(null); setMobileToolbarBlockId(null); };
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };
  
  const editingBlock = blocks.find(b => b.id === editingBlockId);
  
  const handleToggleMobileToolbar = useCallback((blockId: number | null) => {
    setMobileToolbarBlockId(prevId => (prevId === blockId ? null : blockId));
  }, []);

  if (!isMounted || loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  if (!tenant) return <div className="text-center py-10"><h1 className="text-xl text-slate-600">Sitio no encontrado o sin acceso.</h1></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-800 text-xl">←</button>
              <div> <h1 className="font-semibold text-slate-800">{tenant.name}</h1> <p className="text-xs text-slate-500">{tenant.slug}.gestularia.com</p> </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.open(`https://${tenant.slug}.gestularia.com`, '_blank')} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Vista Previa</button>
              <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"> {saving ? 'Guardando...' : 'Guardar'} </button>
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
              <button key={blockKey} onClick={() => setActiveBlockType(blockKey)} className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3"> <span className="text-2xl">{blockInfo.icon}</span> <div><p className="font-medium text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div> </div>
              </button>
            );
          })}
        </aside>

        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 61px)'}}>
          <div className="max-w-3xl mx-auto my-6 p-2" onClick={() => setMobileToolbarBlockId(null)}>
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200 min-h-[85vh] p-2 md:p-4">
              {blocks.length > 0 ? (
                blocks.map((block, index) => (
                  <BlockRenderer key={block.id} block={block} isEditing={editingBlockId === block.id} onDelete={() => deleteBlock(block.id)} onEdit={() => setEditingBlockId(block.id)} onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} onToggleMobileToolbar={handleToggleMobileToolbar} isMobileToolbarVisible={mobileToolbarBlockId === block.id} />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center"><div><p className="text-5xl mb-4">🎨</p><p className="text-lg font-semibold text-slate-700 mb-1">Tu lienzo está en blanco</p><p className="text-sm text-slate-500">Agrega un bloque para empezar a construir.</p></div></div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl transition-transform duration-300 ease-in-out z-50 w-full max-w-sm ${editingBlockId ? 'translate-x-0' : 'translate-x-full'}`}>
          {editingBlock && <EditPanel block={editingBlock} onUpdate={(updates) => updateBlock(editingBlock.id, updates)} onClose={() => setEditingBlockId(null)} />}
        </div>
        
        <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobilePanelOpen ? 'bg-black bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`} onClick={() => setIsMobilePanelOpen(false)}>
          <div className={`absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${isMobilePanelOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-slate-800 text-center mb-4">Agregar Bloque</h2>
            <div className="space-y-2">
              {Object.keys(BLOCKS).map((key) => {
                const blockKey = key as BlockType;
                const blockInfo = BLOCKS[blockKey];
                return (
                  <button key={blockKey} onClick={() => { setIsMobilePanelOpen(false); setActiveBlockType(blockKey); }} className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50">
                    <div className="flex items-center gap-3"><span className="text-2xl">{blockInfo.icon}</span><div><p className="font-medium text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500">{blockInfo.description}</p></div></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className={`fixed top-0 left-0 h-full bg-black bg-opacity-50 z-40 transition-opacity ${activeBlockType ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setActiveBlockType(null)}>
          <div className={`absolute top-0 bg-white h-full shadow-2xl transition-transform duration-300 ease-in-out w-96 ${activeBlockType ? 'translate-x-0' : '-translate-x-full'} left-0 md:left-72`} onClick={(e) => e.stopPropagation()}>
            <AddBlockPanel blockType={activeBlockType} onAddBlock={addBlock} onClose={() => setActiveBlockType(null)} />
          </div>
        </div>
        
        <button onClick={() => setIsMobilePanelOpen(true)} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 z-40">
          <PlusIcon/>
        </button>
      </main>
    </div>
  );
}

function AddBlockPanel({ blockType, onAddBlock, onClose }: { blockType: BlockType | null, onAddBlock: (type: BlockType, data: BlockData) => void, onClose: () => void }) {
  if (!blockType) return null;
  const blockConfig = BLOCKS[blockType];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between"> <div className="flex items-center gap-2"> <span className="text-2xl">{blockConfig.icon}</span> <h3 className="text-lg font-semibold text-slate-800">Elige un diseño de {blockConfig.name}</h3> </div> <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">×</button> </div>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50">
        {blockConfig.variants.map((variant, index) => {
          const PreviewComponent = variant.preview as React.FC<{ data: BlockData }>;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">{variant.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{variant.description}</p>
              <div className="w-full border border-dashed border-slate-300 rounded-md mb-3 p-4 flex items-center justify-center bg-slate-50"> <PreviewComponent data={variant.defaultData} /> </div>
              <button onClick={() => onAddBlock(blockType, variant.defaultData)} className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700"> Agregar </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
  if (!block) return null;

  // ESTA FUNCIÓN AHORA RECIBE UN OBJETO DE CAMBIOS Y FUNCIONA CORRECTAMENTE
  const updateData = (updates: Partial<BlockData>) => {
    onUpdate(updates);
  };

  const renderEditorContent = () => {
    const blockConfig = BLOCKS[block.type as BlockType];
    const EditorComponent = blockConfig.editor as React.FC<{ data: BlockData, updateData: (updates: Partial<BlockData>) => void }>;
    return <EditorComponent data={block.data} updateData={updateData} />;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"> <EditIcon/> <h3 className="text-lg font-semibold text-slate-800">Editar {BLOCKS[block.type as BlockType].name}</h3> </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">×</button>
        </div>
      </div>
      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {renderEditorContent()}
      </div>
    </div>
  );
}