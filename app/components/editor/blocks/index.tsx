'use client';

import React from 'react';
import { 
    LayoutTemplate, Type, Image as ImageIcon, ShoppingBag, 
    Box, Video, MessageCircle, Clock, Zap, Star, ShieldCheck, 
    PlayCircle, HelpCircle, User, List, Grid
} from 'lucide-react';

// --- 1. IMPORTAR TUS COMPONENTES NUEVOS (HEROES) ---
import { HeroDecision } from './Hero/HeroDecision';
import { HeroVideo } from './Hero/HeroVideo';
import { HeroSplit } from './Hero/HeroSplit';
import { HeroWhatsApp } from './Hero/HeroWhatsApp';
import { HeroCountdown } from './Hero/HeroCountdown';

// --- 2. IMPORTAR COMPONENTES DE COMERCIO ---
import { CatalogPremium } from './Catalog/CatalogPremium';

// --- 3. IMPORTAR BLOQUES CLÁSICOS (Para no romper lo anterior) ---
import { HeaderBlock } from './HeaderBlock';
import { FooterBlock } from './FooterBlock';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
// import { GalleryBlock } from './GalleryBlock'; // Descomenta si lo tienes

// --- TIPOS ---
export type BlockType = 
    // Nuevos
    | 'hero_decision' | 'hero_video' | 'hero_split' | 'hero_whatsapp' | 'hero_countdown'
    | 'catalog'
    // Clásicos
    | 'header' | 'footer' | 'hero' | 'text' | 'image' | 'video'
    // Adicionales necesarios para templates
    | 'gallery' | 'featuredProduct' | 'cta' | 'stack' | 'pricing' | 'team' | 'testimonial' | 'faq' | 'banner' | 'cards';

export interface Block {
    id: number;
    type: BlockType;
    data: any;
}

// Export BlockData type alias for compatibility
export type BlockData = any;

// Export BlockComponentProps for presentational components
export interface BlockComponentProps<T = any> {
    data: T;
    isEditing?: boolean;
    onUpdate?: (key: string, value: unknown) => void;
}

export interface BlockConfig {
    name: string;
    description?: string;
    icon: any;
    category?: string;
    theme?: { bg: string; icon: string };
    component: React.FC<any>;
    renderer?: React.FC<any>; // For BlockRenderer compatibility
    editor?: React.FC<any>;
    styleEditor?: React.FC<any>;
    initialData: any;
    variants?: Array<{
        name: string;
        description: string;
        preview: React.FC<any>;
        defaultData: any;
    }>;
}

// --- REGISTRO MAESTRO DE BLOQUES ---
export const BLOCKS: Record<string, BlockConfig> = {
    
    // =========================================
    //  GRUPO 1: PORTADAS (HEROES) - ¡NUEVOS!
    // =========================================
    
    hero_decision: {
        name: 'Hero de Impacto',
        description: 'Imagen fondo + Texto centrado + Badge.',
        icon: LayoutTemplate,
        category: 'Portadas',
        theme: { bg: 'bg-purple-50', icon: 'text-purple-600' },
        component: HeroDecision,
        initialData: { 
            title: "Impacta a tus clientes", 
            subtitle: "Tu propuesta de valor aquí.", 
            badge: "NUEVO", 
            ctaText: "Ver Más",
            align: 'center',
            overlayOpacity: 50
        },
        editor: ({data, updateData}) => (
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400">Título Principal</label>
                <input className="w-full p-2 border rounded text-sm" value={data.title} onChange={e => updateData('title', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">Subtítulo</label>
                <textarea className="w-full p-2 border rounded text-sm" value={data.subtitle} onChange={e => updateData('subtitle', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">Texto Botón</label>
                <input className="w-full p-2 border rounded text-sm" value={data.ctaText} onChange={e => updateData('ctaText', e.target.value)} />
            </div>
        )
    },

    hero_split: {
        name: 'Hero Dividido',
        description: 'Mitad texto, mitad imagen.',
        icon: Grid,
        category: 'Portadas',
        theme: { bg: 'bg-blue-50', icon: 'text-blue-600' },
        component: HeroSplit,
        initialData: { title: "Producto Estrella", price: "$499", reverse: false },
        editor: ({data, updateData}) => (
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400">Título Producto</label>
                <input className="w-full p-2 border rounded text-sm" value={data.title} onChange={e => updateData('title', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">Precio</label>
                <input className="w-full p-2 border rounded text-sm" value={data.price} onChange={e => updateData('price', e.target.value)} />
                
                <label className="flex items-center gap-2 text-sm mt-2">
                    <input type="checkbox" checked={data.reverse} onChange={e => updateData('reverse', e.target.checked)} />
                    Invertir Lado
                </label>
            </div>
        )
    },

    hero_video: {
        name: 'Hero Video',
        description: 'Fondo de video en bucle.',
        icon: Video,
        category: 'Portadas',
        theme: { bg: 'bg-pink-50', icon: 'text-pink-600' },
        component: HeroVideo,
        initialData: { title: "Experiencia Visual", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4" },
        editor: ({data, updateData}) => (
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400">Título</label>
                <input className="w-full p-2 border rounded text-sm" value={data.title} onChange={e => updateData('title', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">URL del Video (MP4)</label>
                <input className="w-full p-2 border rounded text-sm" value={data.videoUrl} onChange={e => updateData('videoUrl', e.target.value)} />
            </div>
        )
    },

    hero_whatsapp: {
        name: 'Hero WhatsApp',
        description: 'Enfoque en contacto directo.',
        icon: MessageCircle,
        category: 'Portadas',
        theme: { bg: 'bg-green-50', icon: 'text-green-600' },
        component: HeroWhatsApp,
        initialData: { title: "Hablemos de tu proyecto", phone: "521..." },
        editor: ({data, updateData}) => (
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400">Título Llamativo</label>
                <input className="w-full p-2 border rounded text-sm" value={data.title} onChange={e => updateData('title', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">Número WhatsApp</label>
                <input className="w-full p-2 border rounded text-sm" value={data.phone} onChange={e => updateData('phone', e.target.value)} placeholder="Ej: 521..." />
            </div>
        )
    },

    hero_countdown: {
        name: 'Hero Oferta',
        description: 'Cuenta regresiva para urgencia.',
        icon: Clock,
        category: 'Portadas',
        theme: { bg: 'bg-red-50', icon: 'text-red-600' },
        component: HeroCountdown,
        initialData: { title: "Oferta Flash", endDate: "2024-12-31" },
        editor: ({data, updateData}) => (
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400">Título Evento</label>
                <input className="w-full p-2 border rounded text-sm" value={data.title} onChange={e => updateData('title', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">Fecha Fin</label>
                <input type="date" className="w-full p-2 border rounded text-sm" value={data.endDate} onChange={e => updateData('endDate', e.target.value)} />
            </div>
        )
    },

    // =========================================
    //  GRUPO 2: COMERCIO
    // =========================================

    catalog: {
        name: 'Catálogo Productos',
        description: 'Grid de productos autoadministrable.',
        icon: ShoppingBag,
        category: 'Comercio',
        theme: { bg: 'bg-orange-50', icon: 'text-orange-600' },
        component: CatalogPremium,
        initialData: { title: "Nuestros Productos", columns: 4 },
        editor: ({data, updateData}) => (
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400">Título Sección</label>
                <input className="w-full p-2 border rounded text-sm" value={data.title} onChange={e => updateData('title', e.target.value)} />
                
                <label className="text-xs font-bold text-slate-400">Columnas</label>
                <div className="flex gap-2">
                    {[2,3,4].map(n => (
                        <button key={n} onClick={() => updateData('columns', n)} className={`flex-1 py-1 border rounded ${data.columns === n ? 'bg-blue-50 border-blue-500' : ''}`}>{n}</button>
                    ))}
                </div>
            </div>
        )
    },

    // =========================================
    //  GRUPO 3: ESTRUCTURA (CLÁSICOS)
    // =========================================

    header: { 
        name: 'Header', 
        icon: Box, 
        category: 'Estructura',
        component: HeaderBlock, 
        initialData: { layout: 'simple' },
        editor: ({data, updateData}) => (
            <select className="w-full p-2 border rounded" value={data.layout} onChange={e => updateData('layout', e.target.value)}>
                <option value="simple">Simple</option>
                <option value="centered">Centrado</option>
            </select>
        ) 
    },
    
    footer: { 
        name: 'Footer', 
        icon: Box, 
        category: 'Estructura',
        component: FooterBlock, 
        initialData: {}, 
        editor: () => <div>Opciones del Footer</div> 
    },

    text: { 
        name: 'Texto', 
        icon: Type, 
        category: 'Contenido',
        component: TextBlock, 
        initialData: { content: "Escribe aquí..." }, 
        editor: ({data, updateData}) => <textarea className="w-full p-2 border" value={data.content} onChange={e => updateData('content', e.target.value)} /> 
    },

    image: { 
        name: 'Imagen', 
        icon: ImageIcon, 
        category: 'Contenido',
        component: ImageBlock, 
        initialData: { url: "" }, 
        editor: ({data, updateData}) => <input className="w-full p-2 border" placeholder="URL imagen" value={data.url} onChange={e => updateData('url', e.target.value)} /> 
    },

    // Mantén el 'hero' antiguo por si acaso tienes bloques viejos guardados
    hero: {
        name: 'Hero Clásico',
        icon: LayoutTemplate,
        category: 'Portadas',
        component: HeroDecision, // Lo redirigimos al nuevo para que no se rompa
        initialData: {},
        editor: () => <div>Usar bloques nuevos</div>
    }
};