'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ================== LÓGICA DE BLOQUES (INCLUIDA DIRECTAMENTE) ==================
const BLOCK_TYPES = [
  { id: 'hero', name: 'Héroe', icon: '🎯', description: 'Sección principal con título y botón' },
  { id: 'text', name: 'Texto', icon: '📝', description: 'Párrafo de texto simple' },
  { id: 'image', name: 'Imagen', icon: '🖼️', description: 'Imagen con descripción opcional' },
  { id: 'cards', name: 'Tarjetas', icon: '🎴', description: '3 tarjetas con icono, título y texto' },
  { id: 'contact', name: 'Contacto', icon: '📞', description: 'Información de contacto' },
  { id: 'cta', name: 'Llamada a la Acción', icon: '📢', description: 'Sección destacada con botón' }
];

function createBlock(type: string) {
  const baseBlock = {
    id: Date.now() + Math.random(),
    type,
  };

  const templates: { [key: string]: any } = {
    hero: { ...baseBlock, data: { title: 'Tu Título Principal Aquí', subtitle: 'Describe tu negocio o servicio', buttonText: 'Comenzar', backgroundColor: 'bg-gradient-to-br from-blue-50 to-white' } },
    text: { ...baseBlock, data: { content: 'Escribe aquí el contenido de tu párrafo.' } },
    image: { ...baseBlock, data: { imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Pie de foto opcional' } },
    cards: { ...baseBlock, data: { title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción del primer servicio' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción del segundo servicio' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción del tercer servicio' } ] } },
    contact: { ...baseBlock, data: { title: 'Contáctanos', phone: '+52 123 456 7890', email: 'contacto@tuempresa.com', address: 'Tu dirección aquí', showPhone: true, showEmail: true, showAddress: true } },
    cta: { ...baseBlock, data: { title: '¿Listo para comenzar?', subtitle: 'Únete a miles de clientes satisfechos', buttonText: 'Contactar Ahora', backgroundColor: 'bg-blue-600' } }
  };

  return templates[type] || baseBlock;
}

function getBlockName(type: string) {
  const blockType = BLOCK_TYPES.find(b => b.id === type);
  return blockType ? blockType.name : 'Desconocido';
}
// ====================================================================

export default function VisualEditor({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [editingBlock, setEditingBlock] = useState<string | number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      loadTenant();
    }
  }, [params.id]);

  const loadTenant = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setTenant(data.tenant);
        
        const content = data.tenant.pages[0]?.content || '[]';
        let initialBlocks = [];
        try {
          initialBlocks = JSON.parse(content);
          if (!Array.isArray(initialBlocks)) initialBlocks = [];
        } catch (e) {
          console.warn("El contenido no es JSON, se iniciará un lienzo en blanco.");
          initialBlocks = [];
        }
        setBlocks(initialBlocks);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading tenant:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const saveTenant = async () => {
    if (!tenant) return;

    setSaving(true);
    try {
      const jsonContent = JSON.stringify(blocks);
      
      const updatedTenant = {
        ...tenant,
        pages: tenant.pages.map((page: any) => 
          page.slug === '/' 
            ? { ...page, content: jsonContent, updatedAt: new Date() }
            : page
        )
      };

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tenants/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedTenant)
      });
      
      if (res.ok) {
        showNotification('💾 Sitio guardado exitosamente', 'success');
        setTenant(updatedTenant);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      showNotification('❌ Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (blockType: string) => setBlocks([...blocks, createBlock(blockType)]);
  const updateBlock = (blockId: string | number, updates: any) => setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const deleteBlock = (blockId: string | number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlock(null); };
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };

  const showNotification = (message: string, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${ type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  if (loading) { return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-600">Cargando editor...</p></div></div>; }
  if (!tenant) { return <div className="text-center py-8"><h1 className="text-xl text-gray-600">Sitio no encontrado</h1></div>; }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-700 mr-4">← Volver</button>
              <div>
                <h1 className="text-lg font-semibold">{tenant.name}</h1>
                <p className="text-sm text-gray-500">{tenant.slug}.gestularia.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.open(`http://${tenant.slug}.localhost:3000?t=${Date.now()}`, '_blank')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">👁️ Vista Previa</button>
              <button onClick={saveTenant} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? '⏳ Guardando...' : '💾 Guardar'}</button>
            </div>
          </div>
        </div>
      </div>
      {/* Contenido Principal */}
      <div className="flex" style={{ height: 'calc(100vh - 73px)'}}>
        {/* Sidebar de Bloques */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">📦 Agregar Bloques</h2>
            <div className="space-y-2">
              {BLOCK_TYPES.map(blockType => (
                <button key={blockType.id} onClick={() => addBlock(blockType.id)} className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{blockType.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{blockType.name}</p>
                      <p className="text-xs text-gray-500">{blockType.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Principal */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm min-h-[80vh]">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <p className="text-3xl mb-2">🎨</p>
                    <p className="text-lg font-medium mb-2">¡Comienza a crear tu sitio!</p>
                    <p className="text-sm">Selecciona un bloque del panel izquierdo para empezar.</p>
                  </div>
                </div>
              ) : (
                <div className="p-2 md:p-6 space-y-4">
                  {blocks.map((block, index) => (
                    <BlockRenderer key={block.id} block={block} isEditing={editingBlock === block.id} onEdit={() => setEditingBlock(block.id)} onUpdate={(updates: any) => updateBlock(block.id, updates)} onDelete={() => deleteBlock(block.id)} onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined} onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Panel de Edición */}
      {editingBlock && <EditPanel block={blocks.find(b => b.id === editingBlock)} onUpdate={(updates: any) => updateBlock(editingBlock, updates)} onClose={() => setEditingBlock(null)} />}
    </div>
  );
}

function BlockRenderer({ block, isEditing, onEdit, onUpdate, onDelete, onMoveUp, onMoveDown }: any) {
  const renderBlock = () => {
    switch (block.type) {
      case 'hero': return (<div className={`${block.data.backgroundColor} p-16 rounded-lg text-center`}><h1 className="text-4xl font-bold text-gray-900 mb-4">{block.data.title}</h1><p className="text-xl text-gray-600 mb-8">{block.data.subtitle}</p><a href={block.data.buttonLink || '#'} className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">{block.data.buttonText}</a></div>);
      case 'text': return (<div className="prose max-w-none"><p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.content.replace(/\n/g, '<br />') }}></p></div>);
      case 'image': return (<div className="text-center"><img src={block.data.imageUrl} alt={block.data.alt} className="rounded-lg mx-auto max-w-full h-auto" />{block.data.caption && (<p className="text-sm text-gray-600 mt-2">{block.data.caption}</p>)}</div>);
      case 'cards': return (<div className="py-8"><h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{block.data.title}</h2><div className="grid md:grid-cols-3 gap-8">{block.data.cards.map((card: any, index: number) => (<div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm"><div className="text-4xl mb-4">{card.icon}</div><h3 className="text-xl font-semibold mb-2">{card.title}</h3><p className="text-gray-600">{card.description}</p></div>))}</div></div>);
      case 'contact': return (<div className="bg-gray-50 p-8 rounded-lg"><h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{block.data.title}</h2><div className="text-center space-y-4">{block.data.showPhone && (<div className="flex items-center justify-center"><span className="mr-3">📞</span><span>{block.data.phone}</span></div>)}{block.data.showEmail && (<div className="flex items-center justify-center"><span className="mr-3">✉️</span><span>{block.data.email}</span></div>)}{block.data.showAddress && (<div className="flex items-center justify-center"><span className="mr-3">📍</span><span>{block.data.address}</span></div>)}</div></div>);
      case 'cta': return (<div className={`${block.data.backgroundColor} text-white p-12 rounded-lg text-center`}><h2 className="text-3xl font-bold mb-4">{block.data.title}</h2><p className="text-xl mb-8 opacity-90">{block.data.subtitle}</p><a href={block.data.buttonLink || '#'} className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">{block.data.buttonText}</a></div>);
      default: return <div className="p-4 bg-gray-100 rounded">Bloque desconocido: {block.type}</div>;
    }
  };
  return (<div className={`relative group cursor-pointer transition-all ${isEditing ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`} onClick={() => !isEditing && onEdit()}> {renderBlock()} {isEditing && (<div className="absolute top-2 right-2 flex gap-1 bg-white rounded-lg shadow-lg border p-1">{onMoveUp && (<button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1 hover:bg-gray-100 rounded" title="Mover arriba">⬆️</button>)}{onMoveDown && (<button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-1 hover:bg-gray-100 rounded" title="Mover abajo">⬇️</button>)}<button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:bg-red-100 text-red-600 rounded" title="Eliminar">🗑️</button></div>)}</div>);
}

function EditPanel({ block, onUpdate, onClose }: any) {
  if (!block) return null;
  const updateData = (key: string, value: any) => { onUpdate({ data: { ...block.data, [key]: value } }); };
  const updateCardData = (cardIndex: number, key: string, value: any) => { const newCards = [...block.data.cards]; newCards[cardIndex] = { ...newCards[cardIndex], [key]: value }; onUpdate({ data: { ...block.data, cards: newCards } }); };
  return (<div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l shadow-lg z-50 overflow-y-auto"><div className="p-4"><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold">✏️ Editar {getBlockName(block.type)}</h3><button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button></div><div className="space-y-4">{block.type === 'hero' && (<><div><label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label><input type="text" value={block.data.title} onChange={(e) => updateData('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label><textarea value={block.data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Texto del Botón</label><input type="text" value={block.data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></>)}{block.type === 'text' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label><textarea value={block.data.content} onChange={(e) => updateData('content', e.target.value)} rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>)}{block.type === 'image' && (<><div><label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label><input type="url" value={block.data.imageUrl} onChange={(e) => updateData('imageUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://ejemplo.com/imagen.jpg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Alt)</label><input type="text" value={block.data.alt} onChange={(e) => updateData('alt', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Pie de foto (opcional)</label><input type="text" value={block.data.caption} onChange={(e) => updateData('caption', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></>)}{block.type === 'cards' && (<><div><label className="block text-sm font-medium text-gray-700 mb-1">Título de la Sección</label><input type="text" value={block.data.title} onChange={(e) => updateData('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>{block.data.cards.map((card: any, index: number) => (<div key={index} className="border border-gray-200 rounded-lg p-3"><h4 className="font-medium text-sm text-gray-700 mb-2">Tarjeta {index + 1}</h4><div className="space-y-2"><input type="text" value={card.icon} onChange={(e) => updateCardData(index, 'icon', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Emoji (ej: 🚀)" /><input type="text" value={card.title} onChange={(e) => updateCardData(index, 'title', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Título" /><textarea value={card.description} onChange={(e) => updateCardData(index, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Descripción" /></div></div>))}</>)}{block.type === 'contact' && (<><div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" value={block.data.title} onChange={(e) => updateData('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="flex items-center"><input type="checkbox" checked={block.data.showPhone} onChange={(e) => updateData('showPhone', e.target.checked)} className="mr-2" />Mostrar teléfono</label>{block.data.showPhone && (<input type="text" value={block.data.phone} onChange={(e) => updateData('phone', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />)}</div><div><label className="flex items-center"><input type="checkbox" checked={block.data.showEmail} onChange={(e) => updateData('showEmail', e.target.checked)} className="mr-2" />Mostrar email</label>{block.data.showEmail && (<input type="email" value={block.data.email} onChange={(e) => updateData('email', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />)}</div><div><label className="flex items-center"><input type="checkbox" checked={block.data.showAddress} onChange={(e) => updateData('showAddress', e.target.checked)} className="mr-2" />Mostrar dirección</label>{block.data.showAddress && (<textarea value={block.data.address} onChange={(e) => updateData('address', e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />)}</div></>)}</div></div></div>);
}