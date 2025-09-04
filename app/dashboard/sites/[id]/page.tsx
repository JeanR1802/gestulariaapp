'use client';
import { useState, useEffect, useCallback, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData, HeaderData } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';

// --- Definiciones de Tipos ---
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<Block>) => void; onClose: () => void; }

// --- Iconos ---
const EditIcon = () => <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default function VisualEditor({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  // CORRECCIÓN: Se reintroduce el estado para la barra de herramientas móvil
  const [mobileToolbarBlockId, setMobileToolbarBlockId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => { setIsMounted(true); }, []);

  // CORRECCIÓN: Se reintroduce el efecto para cerrar la toolbar móvil si se abre el panel de edición
  useEffect(() => {
    if (editingBlockId !== null) {
      setMobileToolbarBlockId(null);
    }
  }, [editingBlockId]);

  const loadTenant = useCallback(async () => {
    if (!params.id || !isMounted) return;
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
        catch (e) { console.warn("Contenido inválido, iniciando lienzo en blanco."); }
        setBlocks(initialBlocks);
      } else { router.push('/dashboard'); }
    } catch (error) { console.error('Error al cargar:', error); router.push('/dashboard'); } 
    finally { setLoading(false); }
  }, [params.id, router, isMounted]);

  useEffect(() => { loadTenant(); }, [loadTenant]);

  const saveTenant = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      const jsonContent = JSON.stringify(blocks);
      const updatedTenant = { ...tenant, pages: tenant.pages.map((page) => page.slug === '/' ? { ...page, content: jsonContent, updatedAt: new Date() } : page ) };
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
  };

  const addBlock = (blockType: BlockType) => {
    const blockConfig = BLOCKS[blockType];
    if (!blockConfig) return;
    const newBlock: Block = { id: Date.now() + Math.random(), type: blockType, data: blockConfig.defaultData, };
    setBlocks([...blocks, newBlock]);
    setIsAddPanelOpen(false);
  };
  const updateBlock = (blockId: number, updates: Partial<Block>) => setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const deleteBlock = (blockId: number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlockId(null); setMobileToolbarBlockId(null); };
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };
  const showNotification = (message: string, type = 'info') => {
    const el = document.createElement('div');
    el.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-50 ${ type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };
  
  const editingBlock = blocks.find(b => b.id === editingBlockId);
  
  // CORRECCIÓN: Se reintroduce la función para manejar la barra de herramientas móvil.
  const handleToggleMobileToolbar = useCallback((blockId: number | null) => {
    setMobileToolbarBlockId(prevId => (prevId === blockId ? null : blockId));
  }, []);

  if (!isMounted || loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  if (!tenant) return <div className="text-center py-10"><h1 className="text-xl text-slate-600">Sitio no encontrado o sin acceso.</h1></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">{/* ... */}</header>
      
      <main className="flex">
        <aside className="w-72 bg-white border-r border-slate-200 p-4 space-y-4 hidden md:block" style={{ height: 'calc(100vh - 61px)'}}>{/* ... */}</aside>

        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 61px)'}}>
          <div className="max-w-3xl mx-auto my-6 p-2" onClick={() => setMobileToolbarBlockId(null)}>
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200 min-h-[85vh] p-2 md:p-4">
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
                    // CORRECCIÓN: Se vuelven a pasar las props para la lógica móvil.
                    onToggleMobileToolbar={handleToggleMobileToolbar}
                    isMobileToolbarVisible={mobileToolbarBlockId === block.id}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 p-8 text-center">{/* ... */}</div>
              )}
            </div>
          </div>
        </div>

        <div className={`fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl transition-transform duration-300 ease-in-out z-50 w-full max-w-sm ${editingBlockId ? 'translate-x-0' : 'translate-x-full'}`}>
          {editingBlock && <EditPanel block={editingBlock} onUpdate={(updates) => updateBlock(editingBlock.id, updates)} onClose={() => setEditingBlockId(null)} />}
        </div>
        
        <div className={`md:hidden fixed inset-0 z-40 ...`}>{/* ... */}</div>
        <button onClick={() => setIsAddPanelOpen(true)} className="md:hidden fixed ..."><PlusIcon/></button>
      </main>
    </div>
  );
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
    if (!block) return null;

    const updateData = (key: string, value: unknown) => {
        onUpdate({ data: { ...block.data, [key]: value } as BlockData });
    };

    const renderEditorContent = () => {
      switch(block.type) {
          case 'header': { const Editor = BLOCKS.header.editor; return <Editor data={block.data as HeaderData} updateData={updateData} />; }
          case 'hero': { const Editor = BLOCKS.hero.editor; return <Editor data={block.data as HeroData} updateData={updateData} />; }
          case 'text': { const Editor = BLOCKS.text.editor; return <Editor data={block.data as TextData} updateData={updateData} />; }
          case 'image': { const Editor = BLOCKS.image.editor; return <Editor data={block.data as ImageData} updateData={updateData} />; }
          case 'cards': { const Editor = BLOCKS.cards.editor; return <Editor data={block.data as CardsData} updateData={updateData} />; }
          case 'cta': { const Editor = BLOCKS.cta.editor; return <Editor data={block.data as CtaData} updateData={updateData} />; }
          case 'footer': { const Editor = BLOCKS.footer.editor; return <Editor data={block.data as FooterData} updateData={updateData} />; }
          default: return <div className="text-sm text-slate-500">Este bloque no tiene opciones de edición.</div>;
      }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200">{/* ... */}</div>
            <div className="p-4 space-y-5 overflow-y-auto flex-1">{renderEditorContent()}</div>
        </div>
    );
}