'use client';
import { useState, useEffect, useCallback, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

// ================== Icon Components ==================
const MoveUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>;
const MoveDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 9 7 7 7-7"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SmallEditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;


// ================== DEFINICIONES DE TIPOS ==================
interface Card { icon: string; title: string; description: string; }
interface HeroData { title: string; subtitle: string; buttonText: string; backgroundColor: string; buttonLink?: string; }
interface TextData { content: string; }
interface ImageData { imageUrl: string; alt: string; caption: string; }
interface CardsData { title: string; cards: Card[]; }
type BlockData = HeroData | TextData | ImageData | CardsData;
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface BlockRendererProps { block: Block; isEditing: boolean; onEdit: () => void; onDelete: () => void; onMoveUp?: () => void; onMoveDown?: () => void; onToggleMobileToolbar: (blockId: number | null) => void; isMobileToolbarVisible: boolean; }
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<Block>) => void; onClose: () => void; }
// =======================================================================

const BLOCK_TYPES = [
  { id: 'hero', name: 'Héroe', icon: '🎯', description: 'Sección principal llamativa.' },
  { id: 'text', name: 'Texto', icon: '📝', description: 'Párrafo de texto simple.' },
  { id: 'image', name: 'Imagen', icon: '🖼️', description: 'Una sola imagen con pie de foto.' },
  { id: 'cards', name: 'Tarjetas', icon: '🎴', description: 'Grupo de 3 tarjetas de servicio.' },
];

function createBlock(type: string): Block {
  const baseBlock = { id: Date.now() + Math.random(), type, data: {} as BlockData };
  const templates: { [key: string]: Block } = {
    hero: { ...baseBlock, data: { title: 'Tu Título Principal Aquí', subtitle: 'Un subtítulo atractivo que describa tu negocio.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } },
    text: { ...baseBlock, data: { content: 'Escribe aquí el contenido de tu párrafo. Puedes hablar sobre tu empresa, servicios, o cualquier información que quieras compartir.' } },
    image: { ...baseBlock, data: { imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Un pie de foto opcional.' } },
    cards: { ...baseBlock, data: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve del primer servicio que ofreces.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve del segundo servicio que ofreces.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve del tercer servicio que ofreces.' } ] } },
  };
  return templates[type] || baseBlock;
}

function getBlockName(type: string): string {
  const blockType = BLOCK_TYPES.find(b => b.id === type);
  return blockType ? blockType.name : 'Desconocido';
}

export default function VisualEditor({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [mobileToolbarBlockId, setMobileToolbarBlockId] = useState<number | null>(null); // Nuevo estado para la barra de herramientas móvil
  const router = useRouter();

  useEffect(() => { setIsMounted(true); }, []);

  // Cerrar la barra de herramientas móvil si se abre el panel de edición
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

  const addBlock = (blockType: string) => {
    setBlocks([...blocks, createBlock(blockType)]);
    setIsAddPanelOpen(false);
  };
  const updateBlock = (blockId: number, updates: Partial<Block>) => setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const deleteBlock = (blockId: number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlockId(null); setMobileToolbarBlockId(null); }; // También cerrar toolbar móvil
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };
  const showNotification = (message: string, type = 'info') => {
    const el = document.createElement('div');
    el.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-50 ${ type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };
  
  const editingBlock = blocks.find(b => b.id === editingBlockId);

  // Función para manejar el estado de la barra de herramientas móvil
  const handleToggleMobileToolbar = useCallback((blockId: number | null) => {
    setMobileToolbarBlockId(prevId => (prevId === blockId ? null : blockId));
  }, []);

  if (!isMounted || loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  if (!tenant) return <div className="text-center py-10"><h1 className="text-xl text-slate-600">Sitio no encontrado o sin acceso.</h1></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
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
      </div>
      
      <main className="flex">
        <aside className="w-72 bg-white border-r border-slate-200 p-4 space-y-4 hidden md:block" style={{ height: 'calc(100vh - 61px)'}}>
          <h2 className="font-semibold text-slate-800">Agregar Bloques</h2>
          {BLOCK_TYPES.map(blockType => (
            <button key={blockType.id} onClick={() => addBlock(blockType.id)} className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{blockType.icon}</span>
                <div><p className="font-medium text-sm text-slate-800">{blockType.name}</p><p className="text-xs text-slate-500">{blockType.description}</p></div>
              </div>
            </button>
          ))}
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
                    onEdit={() => { setEditingBlockId(block.id); handleToggleMobileToolbar(null); }} // Cierra toolbar móvil al abrir editor
                    onDelete={() => deleteBlock(block.id)} 
                    onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} 
                    onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} 
                    onToggleMobileToolbar={handleToggleMobileToolbar} // Pasa la función para togglear
                    isMobileToolbarVisible={mobileToolbarBlockId === block.id} // Indica si su toolbar móvil debe estar visible
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
        
        <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isAddPanelOpen ? 'bg-black bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`} onClick={() => setIsAddPanelOpen(false)}>
            <div className={`absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${isAddPanelOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
                <h2 className="font-semibold text-slate-800 text-center mb-4">Agregar Bloque</h2>
                <div className="space-y-2">
                    {BLOCK_TYPES.map(blockType => (
                        <button key={blockType.id} onClick={() => addBlock(blockType.id)} className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50">
                            <div className="flex items-center gap-3"><span className="text-2xl">{blockType.icon}</span><div><p className="font-medium text-sm text-slate-800">{blockType.name}</p><p className="text-xs text-slate-500">{blockType.description}</p></div></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <button onClick={() => setIsAddPanelOpen(true)} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 z-40">
            <PlusIcon/>
        </button>
      </main>
    </div>
  );
}

function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, onToggleMobileToolbar, isMobileToolbarVisible }: BlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // Detectar si es móvil
  const showDesktopToolbar = isHovered || isEditing;
  const showMobileToolbar = isMobileToolbarVisible;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation(); // Evita que el clic se propague y cierre la toolbar si está visible
    if (isMobile) {
      onToggleMobileToolbar(block.id);
    } else {
      // Comportamiento de desktop: abre el panel de edición directamente
      if (!isEditing) {
        onEdit();
      }
    }
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation(); // Evita que el clic se propague
    onEdit(); // Abre el panel de edición
    onToggleMobileToolbar(null); // Oculta la barra de herramientas móvil
  };

  const handleMoveUpClick = (e: MouseEvent) => { e.stopPropagation(); if (onMoveUp) onMoveUp(); onToggleMobileToolbar(null); };
  const handleMoveDownClick = (e: MouseEvent) => { e.stopPropagation(); if (onMoveDown) onMoveDown(); onToggleMobileToolbar(null); };
  const handleDeleteClick = (e: MouseEvent) => { e.stopPropagation(); onDelete(); onToggleMobileToolbar(null); };

  return (
    <div
      className={`relative rounded-md transition-all ${isEditing ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-300'} ${isMobile ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)} // Solo hover en desktop
      onMouseLeave={() => !isMobile && setIsHovered(false)} // Solo hover en desktop
    >
      {/* Barra de herramientas para Desktop */}
      {!isMobile && showDesktopToolbar && (
        <div className="absolute top-[-14px] right-2 z-10 flex">
          {onMoveUp && <button onClick={handleMoveUpClick} className="p-1.5 bg-white border border-slate-300 rounded-l-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"><MoveUpIcon /></button>}
          {onMoveDown && <button onClick={handleMoveDownClick} className={`p-1.5 bg-white border-y border-r border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 ${!onMoveUp ? 'rounded-l-md' : ''}`}><MoveDownIcon /></button>}
          <button onClick={handleDeleteClick} className="p-1.5 bg-white border-y border-r border-slate-300 rounded-r-md text-red-600 hover:text-red-800 hover:bg-red-50"><TrashIcon /></button>
        </div>
      )}

      {/* Barra de herramientas para Móvil */}
      {isMobile && showMobileToolbar && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex bg-white border border-slate-300 rounded-lg shadow-lg divide-x divide-slate-300">
          <button onClick={handleEditClick} className="p-2 flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 rounded-l-lg">
            <SmallEditIcon /> Editar
          </button>
          {onMoveUp && <button onClick={handleMoveUpClick} className="p-2 text-slate-600 hover:bg-slate-50"><MoveUpIcon /></button>}
          {onMoveDown && <button onClick={handleMoveDownClick} className="p-2 text-slate-600 hover:bg-slate-50"><MoveDownIcon /></button>}
          <button onClick={handleDeleteClick} className="p-2 text-red-600 hover:bg-red-50 rounded-r-lg"><TrashIcon /></button>
        </div>
      )}
      
      {renderBlockContent(block)}
    </div>
  );
}

function renderBlockContent(block: Block) {
  switch (block.type) {
    case 'hero': { const d = block.data as HeroData; return (<div className={`${d.backgroundColor} p-12 md:p-20 rounded-md text-center`}><h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{d.title}</h1><p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">{d.subtitle}</p><a href={d.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{d.buttonText}</a></div>); }
    case 'text': { const d = block.data as TextData; return (<div className="prose prose-slate max-w-none p-6"><p dangerouslySetInnerHTML={{ __html: d.content.replace(/\n/g, '<br />') }}></p></div>); }
    case 'image': { const d = block.data as ImageData; return (<div className="p-4 text-center"><img src={d.imageUrl} alt={d.alt} className="rounded-lg mx-auto max-w-full h-auto" />{d.caption && (<p className="text-sm text-slate-600 mt-2">{d.caption}</p>)}</div>); }
    case 'cards': { const d = block.data as CardsData; return (<div className="bg-slate-50 py-12 px-4 rounded-md"><h2 className="text-3xl font-bold text-center text-slate-800 mb-12">{d.title}</h2><div className="grid md:grid-cols-3 gap-8">{d.cards.map((card, index) => (<div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm ring-1 ring-slate-100"><div className="text-4xl mb-4">{card.icon}</div><h3 className="text-xl font-semibold mb-2 text-slate-800">{card.title}</h3><p className="text-slate-600 text-sm">{card.description}</p></div>))}</div></div>); }
    default: return <div className="p-4 bg-red-100 text-red-700 rounded">Bloque desconocido</div>;
  }
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
  if (!block) return null;

  const updateData = (key: string, value: unknown) => { onUpdate({ data: { ...block.data, [key]: value } as BlockData }); };
  const updateCardData = (cardIndex: number, key: string, value: unknown) => {
    const currentData = block.data as CardsData;
    const newCards = [...currentData.cards];
    newCards[cardIndex] = { ...newCards[cardIndex], [key]: value };
    onUpdate({ data: { ...currentData, cards: newCards } });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EditIcon/>
            <h3 className="text-lg font-semibold text-slate-800">Editar {getBlockName(block.type)}</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">×</button>
        </div>
      </div>
      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {block.type === 'hero' && (() => {const d = block.data as HeroData; return (<>
          <InputField label="Título Principal" value={d.title} onChange={(e) => updateData('title', e.target.value)} />
          <TextareaField label="Subtítulo" value={d.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
          <InputField label="Texto del Botón" value={d.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        </>);})()}
        {block.type === 'text' && (() => {const d = block.data as TextData; return (<>
          <TextareaField label="Contenido" value={d.content} rows={8} onChange={(e) => updateData('content', e.target.value)} />
        </>);})()}
        {block.type === 'image' && (() => {const d = block.data as ImageData; return (<>
          <InputField label="URL de la Imagen" value={d.imageUrl} onChange={(e) => updateData('imageUrl', e.target.value)} />
          <InputField label="Descripción (Alt)" value={d.alt} onChange={(e) => updateData('alt', e.target.value)} />
          <InputField label="Pie de foto" value={d.caption} onChange={(e) => updateData('caption', e.target.value)} />
        </>);})()}
        {block.type === 'cards' && (() => {const d = block.data as CardsData; return (<>
          <InputField label="Título de la Sección" value={d.title} onChange={(e) => updateData('title', e.target.value)} />
          {d.cards.map((card, index) => (
            <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
              <h4 className="font-medium text-sm text-slate-600">Tarjeta {index + 1}</h4>
              <InputField label="Icono (Emoji)" value={card.icon} onChange={(e) => updateCardData(index, 'icon', e.target.value)} />
              <InputField label="Título Tarjeta" value={card.title} onChange={(e) => updateCardData(index, 'title', e.target.value)} />
              <TextareaField label="Descripción Tarjeta" value={card.description} onChange={(e) => updateCardData(index, 'description', e.target.value)} />
            </div>
          ))}
        </>);})()}
      </div>
    </div>
  );
}

const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
    </div>
);

const TextareaField = ({ label, value, rows = 3, onChange }: { label: string, value: string, rows?: number, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={rows} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
    </div>
);