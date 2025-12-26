import React from 'react';
import { BlockType } from '@/app/components/editor/blocks';

// Importar previews existentes
import { HeroPreviewDefault, HeroPreviewLeftImage, HeroPreviewDarkMinimal } from '@/app/components/editor/blocks/Hero/HeroPreviews';
import { HeaderVariantDefault, HeaderVariantCentered, HeaderVariantButtonPreview, HeaderVariantSticky } from '@/app/components/editor/blocks/Header/HeaderPreviews';
import { CardsPreviewDefault, CardsPreviewList, CardsPreviewImageTop } from '@/app/components/editor/blocks/Cards/CardsPreviews';
import { CatalogPreviewGrid, CatalogPreviewFeatured } from '@/app/components/editor/blocks/Catalog/CatalogPreviews';

// Preview genérico para nuevos bloques
const GenericPreview = ({ title }: { title: string }) => (
    <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
        <span className="text-xs font-semibold text-purple-700">{title}</span>
    </div>
);

export interface BlockVariant {
    id: string;
    name: string;
    category: string;
    blockType: BlockType; // Debe coincidir con las keys de BLOCKS
    initialData: any;     // La configuración específica para esta variante
    preview: React.ReactNode;
}

export const BLOCK_VARIANTS: BlockVariant[] = [
    // --- PRINCIPAL (HEROES) - 10 VARIANTES ---
    
    // 1. HERO DE IMPACTO (Hero de Decisión oscuro)
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
        preview: <HeroPreviewDarkMinimal data={{} as any} />
    },

    // 2. HERO SPLIT PRODUCTO (2 columnas con producto)
    {
        id: 'hero_split_prod',
        name: 'Producto Destacado',
        category: 'Principal',
        blockType: 'hero_split',
        initialData: {
            title: "Premium Hoodie 2024",
            subtitle: "Diseño exclusivo con materiales de alta calidad. Edición limitada.",
            price: "$99",
            oldPrice: "$150",
            ctaText: "Agregar al Carrito",
            ctaLink: "#",
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
            reverse: false
        },
        preview: <GenericPreview title="Split 2 Columnas" />
    },

    // 3. HERO WHATSAPP (Contacto directo)
    {
        id: 'hero_whatsapp',
        name: 'Contacto WhatsApp',
        category: 'Principal',
        blockType: 'hero_whatsapp',
        initialData: {
            title: "¿Necesitas asesoría personalizada?",
            subtitle: "Nuestro equipo está disponible 24/7 para ayudarte. Respuesta inmediata garantizada.",
            ctaText: "Contactar por WhatsApp",
            phone: "5215512345678",
            bgImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80"
        },
        preview: <GenericPreview title="WhatsApp CTA" />
    },

    // 4. HERO VIDEO (Inmersivo estilo TikTok)
    {
        id: 'hero_video',
        name: 'Video Inmersivo',
        category: 'Principal',
        blockType: 'hero_video',
        initialData: {
            title: "Experimenta la diferencia",
            subtitle: "Un producto que habla por sí mismo",
            ctaText: "Descubrir Más",
            ctaLink: "#catalogo",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
            overlayOpacity: 50
        },
        preview: <GenericPreview title="Video Background" />
    },

    // 5. HERO FOMO (Urgencia con countdown)
    {
        id: 'hero_fomo',
        name: 'Urgencia FOMO',
        category: 'Principal',
        blockType: 'hero_countdown',
        initialData: {
            title: "¡FLASH SALE 50% OFF!",
            subtitle: "No dejes pasar esta oportunidad única. Cupones limitados.",
            ctaText: "Comprar Ahora",
            ctaLink: "#checkout"
        },
        preview: <GenericPreview title="Countdown Timer" />
    },

    // 6. HERO MINIMAL (Hero de Decisión limpio)
    {
        id: 'hero_minimal',
        name: 'Minimal Clean',
        category: 'Principal',
        blockType: 'hero_decision',
        initialData: {
            badge: "",
            title: "Simplicidad que convierte",
            subtitle: "Menos es más. Enfócate en lo importante.",
            ctaText: "Comenzar",
            ctaLink: "#",
            align: 'center',
            overlayOpacity: 20,
            height: 'medium',
            bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
        },
        preview: <HeroPreviewDefault data={{} as any} />
    },

    // 7. HERO SPLIT REVERSE (Imagen derecha)
    {
        id: 'hero_split_rev',
        name: 'Split Invertido',
        category: 'Principal',
        blockType: 'hero_split',
        initialData: {
            title: "Nueva Colección Primavera",
            subtitle: "Descubre los colores de la temporada. Envíos gratis en pedidos +$500.",
            price: "$79",
            oldPrice: "$120",
            ctaText: "Ver Colección",
            ctaLink: "#",
            image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
            reverse: true
        },
        preview: <GenericPreview title="Split Reverse" />
    },

    // 8. HERO APP (Para descarga de apps)
    {
        id: 'hero_app',
        name: 'Descarga App',
        category: 'Principal',
        blockType: 'hero_split',
        initialData: {
            title: "Descarga nuestra App",
            subtitle: "Accede a ofertas exclusivas, notificaciones de nuevos productos y más.",
            price: "GRATIS",
            oldPrice: "",
            ctaText: "Descargar Ahora",
            ctaLink: "#",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
            reverse: false
        },
        preview: <GenericPreview title="App Download" />
    },

    // 9. HERO LEAD (Captura de newsletter)
    {
        id: 'hero_lead',
        name: 'Captura Newsletter',
        category: 'Principal',
        blockType: 'hero_decision',
        initialData: {
            badge: "SUSCRÍBETE",
            title: "Recibe 15% OFF en tu primer compra",
            subtitle: "Únete a nuestra comunidad y recibe ofertas exclusivas, nuevos lanzamientos y consejos.",
            ctaText: "Quiero mi descuento",
            ctaLink: "#newsletter",
            align: 'center',
            overlayOpacity: 50,
            height: 'medium',
            bgImage: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"
        },
        preview: <HeroPreviewLeftImage data={{} as any} />
    },

    // 10. HERO FULL (Pantalla completa dramático)
    {
        id: 'hero_full',
        name: 'Pantalla Completa',
        category: 'Principal',
        blockType: 'hero_decision',
        initialData: {
            badge: "EXPERIENCIA ÚNICA",
            title: "Bienvenido a algo extraordinario",
            subtitle: "Donde la calidad se encuentra con el diseño. Explora nuestra propuesta de valor.",
            ctaText: "Explorar",
            ctaLink: "#",
            align: 'center',
            overlayOpacity: 40,
            height: 'full',
            bgImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
        },
        preview: <HeroPreviewDarkMinimal data={{} as any} />
    },

    // --- ESTRUCTURA (HEADERS) ---
    {
        id: 'header_simple',
        name: 'Header Clásico',
        category: 'Estructura',
        blockType: 'header',
        initialData: { variant: 'default' },
        preview: <HeaderVariantDefault data={{} as any} />
    },
    {
        id: 'header_centered',
        name: 'Logo Central',
        category: 'Estructura',
        blockType: 'header',
        initialData: { variant: 'centered' },
        preview: <HeaderVariantCentered data={{} as any} />
    },
    {
        id: 'header_button',
        name: 'Con Botón CTA',
        category: 'Estructura',
        blockType: 'header',
        initialData: { variant: 'withButton' },
        preview: <HeaderVariantButtonPreview data={{} as any} />
    },
    {
        id: 'header_sticky',
        name: 'Header Sticky',
        category: 'Estructura',
        blockType: 'header',
        initialData: { variant: 'sticky' },
        preview: <HeaderVariantSticky data={{} as any} />
    },

    // --- COMERCIO (CATÁLOGO) ---
    {
        id: 'catalog_grid',
        name: 'Grid Clásico',
        category: 'Comercio',
        blockType: 'catalog',
        initialData: { 
            title: 'Nuevos Arrivos', 
            subtitle: 'Descubre nuestra última colección',
            columns: 4, 
            cardStyle: 'simple' 
        },
        preview: <CatalogPreviewGrid />
    },
    {
        id: 'catalog_cards',
        name: 'Tarjetas Sombra',
        category: 'Comercio',
        blockType: 'catalog',
        initialData: { 
            title: 'Más Vendidos',
            subtitle: 'Los favoritos de nuestros clientes', 
            columns: 3, 
            cardStyle: 'shadow', 
            showButton: true 
        },
        preview: <CatalogPreviewGrid />
    }
];