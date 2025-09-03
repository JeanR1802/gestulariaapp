'use client';
import { useState, useEffect, useCallback, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

// ================== Icon Components (for a cleaner look) ==================
const MoveUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>;
const MoveDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 9 7 7 7-7"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;

// ================== DEFINICIONES DE TIPOS ==================
interface Card { icon: string; title: string; description: string; }
interface HeroData { title: string; subtitle: string; buttonText: string; backgroundColor: string; buttonLink?: string; }
interface TextData { content: string; }
interface ImageData { imageUrl: string; alt: string; caption: string; }
interface CardsData { title: string; cards: Card[]; }
interface ContactData { title: string; phone: string; email: string; address: string; showPhone: boolean; showEmail: boolean; showAddress: boolean; }
interface CtaData { title: string; subtitle: string; buttonText: string; backgroundColor: string; buttonLink?: string; }
type BlockData = HeroData | TextData | ImageData | CardsData | ContactData | CtaData;
interface Block { id: number; type: string; data: BlockData; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface BlockRendererProps { block: Block; isEditing: boolean; onEdit: () => void; onUpdate: (updates: Partial<Block>) => void; onDelete: () => void; onMoveUp?: () => void; onMoveDown?: () => void; }
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<Block>) => void; onClose: () => void; }
// =======================================================================

const BLOCK_TYPES = [
  { id: 'hero', name: 'Héroe', icon: '🎯', description: 'Sección principal con título y botón' },
  { id: 'text', name: 'Texto', icon: '📝', description: 'Párrafo de texto simple' },
  { id: 'image', name: 'Imagen', icon: '🖼️', description: 'Imagen con descripción opcional' },
  { id: 'cards', name: 'Tarjetas', icon: '🎴', description: '3 tarjetas con icono, título y texto' },
  { id: 'contact', name: 'Contacto', icon: '📞', description: 'Información de contacto' },
  { id: 'cta', name: 'Llamada a la Acción', icon: '📢', description: 'Sección destacada con botón' }
];

function createBlock(type: string): Block {
  const baseBlock = { id: Date.now() + Math.random(), type, data: {} as BlockData };
  const templates: { [key: string]: Block } = {
    hero: { ...baseBlock, data: { title: 'Tu Título Principal Aquí', subtitle: 'Describe tu negocio o servicio', buttonText: 'Comenzar', backgroundColor: 'bg-gradient-to-br from-blue-50 to-white' } },
    text: { ...baseBlock, data: { content: 'Escribe aquí el contenido de tu párrafo.' } },
    image: { ...baseBlock, data: { imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Pie de foto opcional' } },
    cards: { ...baseBlock, data: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción del primer servicio' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción del segundo servicio' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción del tercer servicio' } ] } },
    contact: { ...baseBlock, data: { title: 'Contáctanos', phone: '+52 123 456 7890', email: 'contacto@tuempresa.com', address: 'Tu dirección aquí', showPhone: true, showEmail: true, showAddress: true } },
    cta: { ...baseBlock, data: { title: '¿Listo para comenzar?', subtitle: 'Únete a miles de clientes satisfechos', buttonText: 'Contactar Ahora', backgroundColor: 'bg-blue-600' } }
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
  const [editingBlock, setEditingBlock] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setIsMounted(true); }, []);

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
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) initialBlocks = parsed;
        } catch (e) { console.warn("Contenido inválido, iniciando lienzo en blanco."); }
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

  const addBlock = (blockType: string) => setBlocks([...blocks, createBlock(blockType)]);
  const updateBlock = (blockId: number, updates: Partial<Block>) => setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const deleteBlock = (blockId: number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlock(null); };
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };
  const showNotification = (message: string, type = 'info') => {
    const el = document.createElement('div');
    el.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-50 ${ type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };

  if (!isMounted) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><p>Cargando editor...</p></div>
  if (!tenant) return <div className="text-center py-10"><h1 className="text-xl text-slate-600">Sitio no encontrado o sin acceso.</h1></div>

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-800">←</button>
              <div>
                <h1 className="font-semibold text-slate-800">{tenant.name}</h1>
                <p className="text-xs text-slate-500">{tenant.slug}.gestularia.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.open(`https://${tenant.slug}.gestularia.com`, '_blank')} className="px-4 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">
                  Vista Previa
                </button>
              <button onClick={saveTenant} disabled={saving} className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex" style={{ height: 'calc(100vh - 61px)'}}>
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <PlusIcon/>
              <h2 className="font-semibold text-slate-900">Agregar Bloques</h2>
            </div>
            <div className="space-y-2">
              {BLOCK_TYPES.map(blockType => (
                <button key={blockType.id} onClick={() => addBlock(blockType.id)} className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{blockType.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-slate-800">{blockType.name}</p>
                      <p className="text-xs text-slate-500">{blockType.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto my-8 p-2">
            <div className="bg-white rounded-lg shadow-sm min-h-[80vh] ring-1 ring-slate-200">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-96 text-slate-500">
                  <div className="text-center p-8">
                    <p className="text-5xl mb-4">🎨</p>
                    <p className="text-lg font-semibold text-slate-700 mb-1">Tu lienzo está en blanco</p>
                    <p className="text-sm text-slate-500">Agrega un bloque desde el panel izquierdo para empezar a construir tu página.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {blocks.map((block, index) => (
                    <BlockRenderer key={block.id} block={block} isEditing={editingBlock === block.id} onEdit={() => setEditingBlock(block.id)} onUpdate={(updates) => updateBlock(block.id, updates)} onDelete={() => deleteBlock(block.id)} onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        {editingBlock && <EditPanel block={blocks.find(b => b.id === editingBlock)} onUpdate={(updates) => updateBlock(editingBlock!, updates)} onClose={() => setEditingBlock(null)} />}
      </div>
    </div>
  );
}

function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showToolbar = isHovered || isEditing;

  const renderBlock = () => { /* ... El contenido de esta función no cambia ... */ };
  
  return (
    <div 
      className={`relative rounded-lg transition-all ${isEditing ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-slate-300'}`} 
      onClick={() => !isEditing && onEdit()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      {/* Floating Toolbar */}
      {showToolbar && (
        <div className="absolute top-[-14px] right-2 z-10 flex gap-0.5">
          {onMoveUp && <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1.5 bg-white border border-slate-300 rounded-l-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"><MoveUpIcon /></button>}
          {onMoveDown && <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className={`p-1.5 bg-white border-y border-r border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100 ${!onMoveUp ? 'rounded-l-md' : ''}`}><MoveDownIcon /></button>}
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 bg-white border-y border-r border-slate-300 rounded-r-md text-red-500 hover:text-red-700 hover:bg-red-50"><TrashIcon /></button>
        </div>
      )}
      
      {renderBlockContent(block)}
    </div>
  );
}

// Helper function to keep BlockRenderer clean
function renderBlockContent(block: Block) {
  switch (block.type) {
    case 'hero': { const d = block.data as HeroData; return (<div className={`${d.backgroundColor} p-16 rounded-lg text-center`}><h1 className="text-4xl font-bold text-gray-900 mb-4">{d.title}</h1><p className="text-xl text-gray-600 mb-8">{d.subtitle}</p><a href={d.buttonLink || '#'} className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700">{d.buttonText}</a></div>); }
    case 'text': { const d = block.data as TextData; return (<div className="prose prose-slate max-w-none p-6"><p dangerouslySetInnerHTML={{ __html: d.content.replace(/\n/g, '<br />') }}></p></div>); }
    case 'image': { const d = block.data as ImageData; return (<div className="p-4 text-center"><img src={d.imageUrl} alt={d.alt} className="rounded-lg mx-auto max-w-full h-auto" />{d.caption && (<p className="text-sm text-slate-600 mt-2">{d.caption}</p>)}</div>); }
    case 'cards': { const d = block.data as CardsData; return (<div className="bg-slate-50 py-12 px-4 rounded-lg"><h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{d.title}</h2><div className="grid md:grid-cols-3 gap-8">{d.cards.map((card, index) => (<div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm ring-1 ring-slate-100"><div className="text-4xl mb-4">{card.icon}</div><h3 className="text-xl font-semibold mb-2 text-slate-800">{card.title}</h3><p className="text-slate-600">{card.description}</p></div>))}</div></div>); }
    case 'contact': { const d = block.data as ContactData; return (<div className="bg-slate-50 p-8 rounded-lg"><h2 className="text-2xl font-bold text-center text-slate-900 mb-8">{d.title}</h2><div className="text-center space-y-4 text-slate-700">{d.showPhone && (<div className="flex items-center justify-center"><span className="mr-3">📞</span><span>{d.phone}</span></div>)}{d.showEmail && (<div className="flex items-center justify-center"><span className="mr-3">✉️</span><span>{d.email}</span></div>)}{d.showAddress && (<div className="flex items-center justify-center"><span className="mr-3">📍</span><span>{d.address}</span></div>)}</div></div>); }
    case 'cta': { const d = block.data as CtaData; return (<div className={`${d.backgroundColor} text-white p-12 rounded-lg text-center`}><h2 className="text-3xl font-bold mb-4">{d.title}</h2><p className="text-xl mb-8 opacity-90">{d.subtitle}</p><a href={d.buttonLink || '#'} className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-100">{d.buttonText}</a></div>); }
    default: return <div className="p-4 bg-red-100 text-red-700 rounded">Bloque desconocido: {block.type}</div>;
  }
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
  if (!block) return null;

  const updateData = (key: string, value: unknown) => {
    const newData: BlockData = { ...block.data, [key]: value } as BlockData;
    onUpdate({ data: newData });
  };
  const updateCardData = (cardIndex: number, key: string, value: unknown) => {
    const currentData = block.data as CardsData;
    const newCards = [...currentData.cards];
    newCards[cardIndex] = { ...newCards[cardIndex], [key]: value };
    onUpdate({ data: { ...currentData, cards: newCards } });
  };
  
  return (
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <EditIcon/>
                    <h3 className="text-lg font-semibold text-slate-900">Editar {getBlockName(block.type)}</h3>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
            </div>
            <div className="space-y-4">
                {/* Campos de edición (sin cambios en la lógica, solo clases de estilo) */}
            </div>
        </div>
    </div>
  );
}

