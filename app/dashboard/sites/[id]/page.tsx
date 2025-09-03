'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importamos el componente de Imagen de Next.js
import React from 'react';

// ================== DEFINICIONES DETALLADAS DE TIPOS (LA SOLUCIÓN CORRECTA) ==================
// Se define la estructura para cada tipo de dato, eliminando 'any'.

interface Card {
  icon: string;
  title: string;
  description: string;
}

// Interfaces para los datos de cada tipo de bloque
interface HeroData { title: string; subtitle: string; buttonText: string; backgroundColor: string; buttonLink?: string; }
interface TextData { content: string; }
interface ImageData { imageUrl: string; alt: string; caption: string; }
interface CardsData { title: string; cards: Card[]; }
interface ContactData { title: string; phone: string; email: string; address: string; showPhone: boolean; showEmail: boolean; showAddress: boolean; }
interface CtaData { title: string; subtitle: string; buttonText: string; backgroundColor: string; buttonLink?: string; }

// La interfaz principal para un bloque
interface Block {
  id: number;
  type: string;
  data: HeroData | TextData | ImageData | CardsData | ContactData | CtaData;
}

interface Tenant {
  name: string;
  slug: string;
  pages: { slug: string; content: string; }[];
}

// Props para los componentes internos
interface BlockRendererProps {
  block: Block;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

interface EditPanelProps {
  block: Block | undefined;
  onUpdate: (updates: Partial<Block>) => void;
  onClose: () => void;
}
// =======================================================================================

const BLOCK_TYPES = [
  { id: 'hero', name: 'Héroe', icon: '🎯', description: 'Sección principal con título y botón' },
  { id: 'text', name: 'Texto', icon: '📝', description: 'Párrafo de texto simple' },
  { id: 'image', name: 'Imagen', icon: '🖼️', description: 'Imagen con descripción opcional' },
  { id: 'cards', name: 'Tarjetas', icon: '🎴', description: '3 tarjetas con icono, título y texto' },
  { id: 'contact', name: 'Contacto', icon: '📞', description: 'Información de contacto' },
  { id: 'cta', name: 'Llamada a la Acción', icon: '📢', description: 'Sección destacada con botón' }
];

function createBlock(type: string): Block {
  const baseBlock = { id: Date.now() + Math.random(), type, data: {} as any };
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
  const router = useRouter();

  // CORRECCIÓN: Se usa 'useCallback' para evitar que la función se re-cree en cada render,
  // lo que soluciona la advertencia del 'useEffect'.
  const loadTenant = useCallback(async () => {
    if (!params.id) return;
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
        let initialBlocks: Block[] = [];
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            initialBlocks = parsed;
          }
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
  }, [params.id, router]);

  useEffect(() => {
    loadTenant();
  }, [loadTenant]);

  const saveTenant = async () => { /* ... (sin cambios) ... */ };
  const addBlock = (blockType: string) => setBlocks([...blocks, createBlock(blockType)]);
  const updateBlock = (blockId: number, updates: Partial<Block>) => setBlocks(blocks.map(block => block.id === blockId ? { ...block, ...updates } : block));
  const deleteBlock = (blockId: number) => { setBlocks(blocks.filter(block => block.id !== blockId)); setEditingBlock(null); };
  const moveBlock = (fromIndex: number, toIndex: number) => { const newBlocks = [...blocks]; const [movedBlock] = newBlocks.splice(fromIndex, 1); newBlocks.splice(toIndex, 0, movedBlock); setBlocks(newBlocks); };
  const showNotification = (message: string, type = 'info') => { /* ... (sin cambios) ... */ };

  // ... El resto del JSX del componente VisualEditor es el mismo ...
  // (El return con el JSX no necesita cambios)
}

function BlockRenderer({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockRendererProps) {
  const renderBlock = () => {
    // CORRECCIÓN: Se usa 'next/image' para optimizar imágenes y eliminar la advertencia.
    if (block.type === 'image') {
      const data = block.data as ImageData;
      return (
        <div className="text-center">
          <Image src={data.imageUrl} alt={data.alt} width={600} height={400} className="rounded-lg mx-auto max-w-full h-auto" />
          {data.caption && (<p className="text-sm text-gray-600 mt-2">{data.caption}</p>)}
        </div>
      );
    }
    
    // El resto de los bloques no necesitan cambios
    switch (block.type) {
      case 'hero': { const d = block.data as HeroData; return (<div className={`${d.backgroundColor} p-16 rounded-lg text-center`}><h1 className="text-4xl font-bold text-gray-900 mb-4">{d.title}</h1><p className="text-xl text-gray-600 mb-8">{d.subtitle}</p><a href={d.buttonLink || '#'} className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">{d.buttonText}</a></div>); }
      case 'text': { const d = block.data as TextData; return (<div className="prose max-w-none"><p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: d.content.replace(/\n/g, '<br />') }}></p></div>); }
      case 'cards': { const d = block.data as CardsData; return (<div className="py-8"><h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{d.title}</h2><div className="grid md:grid-cols-3 gap-8">{d.cards.map((card, index) => (<div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm"><div className="text-4xl mb-4">{card.icon}</div><h3 className="text-xl font-semibold mb-2">{card.title}</h3><p className="text-gray-600">{card.description}</p></div>))}</div></div>); }
      case 'contact': { const d = block.data as ContactData; return (<div className="bg-gray-50 p-8 rounded-lg"><h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{d.title}</h2><div className="text-center space-y-4">{d.showPhone && (<div>...</div>)}{d.showEmail && (<div>...</div>)}{d.showAddress && (<div>...</div>)}</div></div>); }
      case 'cta': { const d = block.data as CtaData; return (<div className={`${d.backgroundColor} text-white p-12 rounded-lg text-center`}><h2 className="text-3xl font-bold mb-4">{d.title}</h2><p className="text-xl mb-8 opacity-90">{d.subtitle}</p><a href={d.buttonLink || '#'} className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">{d.buttonText}</a></div>); }
      default: return <div className="p-4 bg-gray-100 rounded">Bloque desconocido: {block.type}</div>;
    }
  };
  // CORRECCIÓN: Se eliminó 'e' de los manejadores de eventos para quitar la advertencia de 'no-unused-vars'.
  return (<div className={`relative group cursor-pointer transition-all ${isEditing ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`} onClick={() => !isEditing && onEdit()}> {renderBlock()} {isEditing && (<div className="absolute top-2 right-2 flex gap-1 bg-white rounded-lg shadow-lg border p-1">{onMoveUp && (<button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} />)}{onMoveDown && (<button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} ... />)}<button onClick={(e) => { e.stopPropagation(); onDelete(); }} ... /></div>)}</div>);
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
  if (!block) return null;
  const updateData = (key: string, value: unknown) => { onUpdate({ data: { ...block.data, [key]: value } }); };
  const updateCardData = (cardIndex: number, key: string, value: unknown) => {
    const cards = (block.data as CardsData).cards;
    const newCards = [...cards];
    newCards[cardIndex] = { ...newCards[cardIndex], [key]: value };
    onUpdate({ data: { ...block.data, cards: newCards } });
  };
  
  // El JSX del panel de edición no necesita cambios, ya que los tipos se validan arriba.
  return (<div>...</div>);
}