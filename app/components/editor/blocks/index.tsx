// app/components/editor/blocks/index.tsx
'use client';
import React from 'react';
import { ViewfinderCircleIcon, PhotoIcon, QueueListIcon, RectangleGroupIcon, MegaphoneIcon, CurrencyDollarIcon, ChatBubbleBottomCenterTextIcon, CodeBracketIcon, UserCircleIcon, QuestionMarkCircleIcon, UserGroupIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';

// Importaciones de bloques
import { HeaderBlock, HeaderContentEditor, HeaderStyleEditor, HeaderData } from './HeaderBlock';
import { HeroBlock, HeroContentEditor, HeroStyleEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { PricingBlock, PricingEditor, PricingData } from './PricingBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';
import { TestimonialBlock, TestimonialEditor, TestimonialData } from './TestimonialBlock';
import { FaqBlock, FaqEditor, FaqData } from './FaqBlock';
import { TeamBlock, TeamEditor, TeamData } from './TeamBlock';
import { CatalogBlock, CatalogEditor, CatalogData } from './CatalogBlock';
import { FeaturedProductBlock, FeaturedProductContentEditor, FeaturedProductStyleEditor, FeaturedProductData } from './FeaturedProductBlock';

// Importaciones de vistas previas
import { HeaderVariantDefault, HeaderVariantCentered, HeaderVariantButtonPreview } from './Header/HeaderPreviews';
import { HeroPreviewDefault, HeroPreviewLeftImage, HeroPreviewDarkMinimal } from './Hero/HeroPreviews';
import { TextPreviewDefault, TextPreviewQuote, TextPreviewHighlighted } from './Text/TextPreviews';
import { ImagePreviewDefault, ImagePreviewBordered, ImagePreviewFullWidth } from './Image/ImagePreviews';
import { CardsPreviewDefault, CardsPreviewList, CardsPreviewImageTop } from './Cards/CardsPreviews';
import { CtaPreviewDark, CtaPreviewLight, CtaPreviewSplit } from './Cta/CtaPreviews';
import { PricingPreviewColumns, PricingPreviewList, PricingPreviewSimple } from './Pricing/PricingPreviews';
import { FooterPreviewSimple, FooterPreviewMultiColumn, FooterPreviewMinimal } from './Footer/FooterPreviews';
import { TestimonialPreviewDefault, TestimonialPreviewWithImage, TestimonialPreviewGrid } from './Testimonial/TestimonialPreviews';
import { FaqPreviewList, FaqPreviewAccordion } from './Faq/FaqPreviews';
import { TeamPreviewGrid, TeamPreviewList } from './Team/TeamPreviews';
import { CatalogPreviewGrid, CatalogPreviewMinimalGrid, CatalogPreviewCarousel } from './Catalog/CatalogPreviews';
import { FeaturedProductPreviewImageLeft, FeaturedProductPreviewBackground } from './FeaturedProduct/FeaturedProductPreviews';

export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | PricingData | FooterData | TestimonialData | FaqData | TeamData | CatalogData | FeaturedProductData;

export const BLOCKS = {
  header: {
    name: 'Encabezado', 
    icon: QueueListIcon, 
    description: 'Barra de navegación principal.', 
    renderer: HeaderBlock, 
    editor: HeaderContentEditor,
    styleEditor: HeaderStyleEditor,
    theme: { bg: 'bg-sky-50', icon: 'text-sky-600' },
    variants: [ /* ... */ ]
  },
  hero: {
    name: 'Héroe', 
    icon: ViewfinderCircleIcon, 
    description: 'Sección principal llamativa.', 
    renderer: HeroBlock, 
    editor: HeroContentEditor,
    styleEditor: HeroStyleEditor,
    theme: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
    variants: [ /* ... */ ]
  },
  featuredProduct: {
    name: 'Producto Destacado',
    icon: StarIcon,
    description: 'Destaca un producto con una sección especial.',
    renderer: FeaturedProductBlock,
    editor: FeaturedProductContentEditor,
    styleEditor: FeaturedProductStyleEditor,
    theme: { bg: 'bg-amber-50', icon: 'text-amber-600' },
    variants: [
        { name: 'Imagen a la Izquierda', description: 'Un diseño clásico con imagen y detalles.', preview: FeaturedProductPreviewImageLeft, defaultData: { variant: 'imageLeft', imageUrl: '', tag: 'Más Vendido', title: 'Nombre del Producto Increíble', description: 'Describe por qué este producto es esencial. Habla de sus beneficios y características únicas.', price: '$99.99', rating: 5, buttonText: 'Añadir al Carrito' } as FeaturedProductData },
        { name: 'Imagen de Fondo', description: 'Un diseño inmersivo y moderno.', preview: FeaturedProductPreviewBackground, defaultData: { variant: 'background', imageUrl: '', tag: 'Exclusivo Online', title: 'Producto de Edición Limitada', description: 'Una experiencia premium. Atrapa la atención de tus clientes con este diseño audaz.', price: '$149.99', rating: 5, buttonText: 'Comprar Ahora' } as FeaturedProductData },
    ]
  },
  catalog: { name: 'Catálogo', icon: ShoppingBagIcon, description: 'Muestra una cuadrícula de productos.', renderer: CatalogBlock, editor: CatalogEditor, theme: { bg: 'bg-green-50', icon: 'text-green-600' }, variants: [/* ... */] },
  team: { name: 'Equipo', icon: UserGroupIcon, description: 'Presenta a los miembros de tu equipo.', renderer: TeamBlock, editor: TeamEditor, theme: { bg: 'bg-pink-50', icon: 'text-pink-600' }, variants: [/* ... */] },
  testimonial: { name: 'Testimonios', icon: UserCircleIcon, description: 'Muestra reseñas de tus clientes.', renderer: TestimonialBlock, editor: TestimonialEditor, theme: { bg: 'bg-yellow-50', icon: 'text-yellow-600' }, variants: [/* ... */] },
  faq: { name: 'Preguntas Frecuentes', icon: QuestionMarkCircleIcon, description: 'Responde las dudas de tus visitantes.', renderer: FaqBlock, editor: FaqEditor, theme: { bg: 'bg-teal-50', icon: 'text-teal-600' }, variants: [/* ... */] },
  text: { name: 'Texto', icon: ChatBubbleBottomCenterTextIcon, description: 'Párrafo de texto simple.', renderer: TextBlock, editor: TextEditor, theme: { bg: 'bg-gray-50', icon: 'text-gray-600' }, variants: [/* ... */] },
  image: { name: 'Imagen', icon: PhotoIcon, description: 'Una sola imagen con pie de foto.', renderer: ImageBlock, editor: ImageEditor, theme: { bg: 'bg-fuchsia-50', icon: 'text-fuchsia-600' }, variants: [/* ... */] },
  cards: { name: 'Tarjetas', icon: RectangleGroupIcon, description: 'Grupo de tarjetas de servicio.', renderer: CardsBlock, editor: CardsEditor, theme: { bg: 'bg-orange-50', icon: 'text-orange-600' }, variants: [/* ... */] },
  cta: { name: 'Llamada a la Acción', icon: MegaphoneIcon, description: 'Invita a los usuarios a actuar.', renderer: CtaBlock, editor: CtaEditor, theme: { bg: 'bg-lime-50', icon: 'text-lime-600' }, variants: [/* ... */] },
  pricing: { name: 'Precios', icon: CurrencyDollarIcon, description: 'Muestra tus planes y precios.', renderer: PricingBlock, editor: PricingEditor, theme: { bg: 'bg-emerald-50', icon: 'text-emerald-600' }, variants: [/* ... */] },
  footer: { name: 'Pie de Página', icon: CodeBracketIcon, description: 'Sección final con copyright y enlaces.', renderer: FooterBlock, editor: FooterEditor, theme: { bg: 'bg-slate-50', icon: 'text-slate-600' }, variants: [/* ... */] },
};

export type BlockType = keyof typeof BLOCKS;