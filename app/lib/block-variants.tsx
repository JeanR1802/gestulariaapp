import React from 'react';
import { BlockType } from '@/app/components/editor/blocks';

// IMPORTAR DESDE LA CARPETA CORRECTA: blocks/Hero/HeroPreviews
import { 
    HeroPreviewImpact, 
    HeroPreviewSplit, 
    HeroPreviewVideo, 
    HeroPreviewWhatsApp, 
    HeroPreviewCountdown,
    HeroPreviewDefault
} from '@/app/components/editor/blocks/Hero/HeroPreviews';

export interface BlockVariant {
    id: string;
    name: string;
    category: string;
    blockType: BlockType; 
    initialData: any;     
    preview: React.ReactNode;
}

export const BLOCK_VARIANTS: BlockVariant[] = [
    // --- 1. HERO IMPACTO ---
    {
        id: 'hero_impact',
        name: 'Impacto Oscuro',
        category: 'Portadas',
        blockType: 'hero_decision',
        initialData: { align: 'center', overlayOpacity: 60, title: 'Gran Venta Anual', badge: 'SOLO HOY' },
        preview: <HeroPreviewImpact /> 
    },
    
    // --- 2. HERO SPLIT ---
    {
        id: 'hero_split_prod',
        name: 'Producto Destacado',
        category: 'Portadas',
        blockType: 'hero_split',
        initialData: { title: 'Sneakers Pro', price: '$1,299', reverse: false },
        preview: <HeroPreviewSplit /> 
    },

    // --- 3. HERO WHATSAPP ---
    {
        id: 'hero_whatsapp',
        name: 'Contacto Directo',
        category: 'Portadas',
        blockType: 'hero_whatsapp',
        initialData: { title: 'Asesoría Gratis', ctaText: 'Enviar Mensaje' },
        preview: <HeroPreviewWhatsApp /> 
    },

    // --- 4. HERO VIDEO ---
    {
        id: 'hero_video',
        name: 'Video Background',
        category: 'Portadas',
        blockType: 'hero_video',
        initialData: { title: 'Descubre más' },
        preview: <HeroPreviewVideo /> 
    },

    // --- 5. HERO COUNTDOWN ---
    {
        id: 'hero_fomo',
        name: 'Oferta Flash',
        category: 'Portadas',
        blockType: 'hero_countdown',
        initialData: { title: 'Venta Nocturna' },
        preview: <HeroPreviewCountdown /> 
    },

    // --- 6. HERO MINIMALISTA ---
    {
        id: 'hero_minimal',
        name: 'Minimal Clean',
        category: 'Portadas',
        blockType: 'hero_decision',
        initialData: { align: 'center', overlayOpacity: 0, title: 'Simplicidad', badge: '', bgImage: '', height: 'medium' },
        preview: <HeroPreviewDefault /> 
    }
];