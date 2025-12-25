import React from 'react';
import { BlockType } from '@/app/components/editor/blocks';
import * as Previews from '@/app/components/editor/previews/BlockWireframes';

export interface BlockVariant {
    id: string;
    name: string;
    category: string;
    blockType: BlockType; // Debe coincidir con las keys de BLOCKS
    initialData: any;     // La configuración específica para esta variante
    preview: React.ReactNode;
}

export const BLOCK_VARIANTS: BlockVariant[] = [
    // --- PRINCIPAL (HEROES) ---
    // NUEVO: HERO DE DECISIÓN (EL MEJOR)
    {
        id: 'hero_impact',
        name: 'Hero de Impacto',
        category: 'Principal',
        blockType: 'hero_decision',
        initialData: { 
            badge: "OFERTA LIMITADA",
            title: "Impacta desde el inicio",
            subtitle: "Un diseño pensado para convertir visitantes en clientes.",
            ctaText: "Ver Productos",
            ctaLink: "#productos",
            align: 'center',
            overlayOpacity: 60,
            height: 'large',
            bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
        },
        preview: <Previews.HeroImpactPreview />
    },
    {
        id: 'hero_centered',
        name: 'Hero Centrado',
        category: 'Principal',
        blockType: 'hero',
        initialData: { align: 'center', overlayOpacity: 40, title: 'Impacto Central' },
        preview: <Previews.HeroCenteredPreview />
    },
    {
        id: 'hero_split',
        name: 'Imagen Lateral',
        category: 'Principal',
        blockType: 'hero',
        initialData: { align: 'left', overlayOpacity: 0, title: 'Diseño Dividido', bgImage: '' }, // bgImage vacío o específico para split
        preview: <Previews.HeroSplitPreview />
    },
    {
        id: 'hero_overlay',
        name: 'Fondo Oscuro',
        category: 'Principal',
        blockType: 'hero',
        initialData: { align: 'center', overlayOpacity: 80, title: 'Enfoque Total' },
        preview: <Previews.HeroOverlayPreview />
    },

    // --- ESTRUCTURA (HEADERS) ---
    {
        id: 'header_simple',
        name: 'Header Clásico',
        category: 'Estructura',
        blockType: 'header', // Asegúrate de tener este bloque registrado en index.tsx
        initialData: { layout: 'simple', align: 'left' },
        preview: <Previews.HeaderSimplePreview />
    },
    {
        id: 'header_centered',
        name: 'Logo Central',
        category: 'Estructura',
        blockType: 'header',
        initialData: { layout: 'centered', align: 'center' },
        preview: <Previews.HeaderCenteredPreview />
    },

    // --- COMERCIO (PRODUCTOS) ---
    {
        id: 'product_card',
        name: 'Tarjeta Producto',
        category: 'Comercio',
        blockType: 'catalog',
        initialData: { layout: 'card', showButton: true },
        preview: <Previews.ProductCardPreview />
    },
    {
        id: 'product_list',
        name: 'Lista Compacta',
        category: 'Comercio',
        blockType: 'catalog',
        initialData: { layout: 'list', showButton: false },
        preview: <Previews.ProductListPreview />
    }
];