// app/components/editor/blocks/index.tsx (REFACTORIZADO CON CATEGORÍAS)
'use client';
import React from 'react';
import {
  ViewfinderCircleIcon,
  PhotoIcon,
  QueueListIcon,
  RectangleGroupIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  ChatBubbleBottomCenterTextIcon,
  CodeBracketIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid'; // <-- Asegurar que nanoid está disponible

// Importaciones de bloques y sus tipos de datos
import { HeaderBlock, HeaderContentEditor, HeaderStyleEditor, HeaderData } from './HeaderBlock';
import HeaderPresentational from '../../blocks/HeaderPresentational';
import { HeroBlock, HeroContentEditor, HeroStyleEditor, HeroData } from './HeroBlock';
import HeroPresentational from '../../blocks/HeroPresentational';
import { TextBlock, TextContentEditor, TextStyleEditor, TextData } from './TextBlock';
import TextPresentational from '../../blocks/TextPresentational';
import { ImageBlock, ImageContentEditor, ImageStyleEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsContentEditor, CardsStyleEditor, CardsData } from './CardsBlock';
import CardsPresentational from '../../blocks/CardsPresentational';
import { CtaBlock, CtaContentEditor, CtaStyleEditor, CtaData } from './CtaBlock';
import { PricingBlock, PricingContentEditor, PricingStyleEditor, PricingData } from './PricingBlock';
import { FooterBlock, FooterContentEditor, FooterStyleEditor, FooterData } from './FooterBlock';
import FooterPresentational from '../../blocks/FooterPresentational';
import { TestimonialBlock, TestimonialContentEditor, TestimonialStyleEditor, TestimonialData } from './TestimonialBlock';
import { FaqBlock, FaqContentEditor, FaqStyleEditor, FaqData } from './FaqBlock';
import { TeamBlock, TeamContentEditor, TeamStyleEditor, TeamData } from './TeamBlock';
import { CatalogBlock, CatalogContentEditor, CatalogStyleEditor, CatalogData } from './CatalogBlock';
import CatalogPresentational from '../../blocks/CatalogPresentational';
import { FeaturedProductBlock, FeaturedProductContentEditor, FeaturedProductStyleEditor, FeaturedProductData } from './FeaturedProductBlock';
import { StackBlock, StackContentEditor, StackStyleEditor, StackData } from './StackBlock';
import { BannerBlock, BannerData, BannerContentEditor, BannerStyleEditor } from './BannerBlock';
import { GalleryBlock, GalleryContentEditor, GalleryStyleEditor, GalleryData } from './GalleryBlock';
import { StackElement } from './CustomStackElements'; // <-- NUEVA IMPORTACIÓN

// Presentational components (shared renderer for live site and editor preview)
import * as Presentational from '../../blocks/TestImportIndex';

// Importaciones de todas las vistas previas de variantes
import { HeaderVariantDefault, HeaderVariantCentered, HeaderVariantButtonPreview, HeaderVariantSticky } from './Header/HeaderPreviews';
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
import { StackPreviewDefault } from './Stack/StackPreviews';
import { BannerPreviewDefault, BannerPreviewInfo, BannerPreviewSuccess, BannerPreviewPromo } from './Banner/BannerPreviews';
import { GalleryPreviewGrid, GalleryPreviewCarousel, GalleryPreviewFeatured } from './Gallery/GalleryPreviews';

// --- TIPOS GENÉRICOS Y DE CONFIGURACIÓN ---

// Unión de todos los tipos de datos de los bloques
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | PricingData | FooterData | TestimonialData | FaqData | TeamData | CatalogData | FeaturedProductData | StackData | BannerData | GalleryData;

// Props que recibirá cada componente de renderizado de bloque (ej: TextBlock, HeaderBlock)
export interface BlockComponentProps<T extends BlockData> {
  data: T;
  isEditing?: boolean;
  onUpdate?: (key: string, value: unknown) => void;
}

// Tipado para un componente de renderizado de bloque
export type BlockRendererComponent<T extends BlockData> = React.FC<BlockComponentProps<T>>;

// Configuración para un solo tipo de bloque
export interface BlockConfig<T extends BlockData> {
  name: string;
  icon: React.ElementType;
  description: string;
  category: 'Estructura' | 'Principal' | 'Contenido' | 'Comercio' | 'Interacción'; // <--- PROPIEDAD AÑADIDA
  renderer: BlockRendererComponent<T>;
  editor: React.FC<{ data: T; updateData: (key: keyof T, value: T[keyof T]) => void }>;
  styleEditor?: React.FC<{ data: T; updateData: (key: keyof T, value: T[keyof T]) => void }>;
  theme: { bg: string; icon: string };
  variants: {
    name: string;
    description: string;
    preview: React.FC<{ data: T }>;
    defaultData: T;
  }[];
}

// Mapeo de tipos por clave para evitar incompatibilidades genéricas
export type BlocksConfig = {
  header: BlockConfig<HeaderData>;
  hero: BlockConfig<HeroData>;
  featuredProduct: BlockConfig<FeaturedProductData>;
  catalog: BlockConfig<CatalogData>;
  team: BlockConfig<TeamData>;
  testimonial: BlockConfig<TestimonialData>;
  faq: BlockConfig<FaqData>;
  text: BlockConfig<TextData>;
  image: BlockConfig<ImageData>;
  gallery: BlockConfig<GalleryData>;
  cards: BlockConfig<CardsData>;
  cta: BlockConfig<CtaData>;
  pricing: BlockConfig<PricingData>;
  footer: BlockConfig<FooterData>;
  stack: BlockConfig<StackData>;
  banner: BlockConfig<BannerData>;
};

// --- OBJETO DE CONFIGURACIÓN DE BLOQUES ---

export const BLOCKS: BlocksConfig = {
  header: {
    name: 'Encabezado',
    icon: QueueListIcon,
    description: 'Barra de navegación principal.',
    category: 'Estructura',
    renderer: HeaderPresentational,
    editor: HeaderContentEditor,
    styleEditor: HeaderStyleEditor,
    theme: { bg: 'bg-sky-50', icon: 'text-sky-600' },
    variants: [
        { name: 'Estándar', description: 'Logo a la izquierda, enlaces a la derecha.', preview: HeaderVariantDefault, defaultData: { variant: 'default', logoText: 'MiLogo', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto', backgroundColor: 'bg-white', logoColor: 'text-slate-800', linkColor: 'text-slate-600', buttonText: '', buttonBgColor: '', buttonTextColor: '' } as HeaderData },
        { name: 'Centrado', description: 'Logo y enlaces centrados.', preview: HeaderVariantCentered, defaultData: { variant: 'centered', logoText: 'MiLogo', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto', backgroundColor: 'bg-white', logoColor: 'text-slate-800', linkColor: 'text-slate-600', buttonText: '', buttonBgColor: '', buttonTextColor: '' } as HeaderData },
        { name: 'Con Botón', description: 'Ideal para dirigir a una acción clave.', preview: HeaderVariantButtonPreview, defaultData: { variant: 'withButton', logoText: 'MiLogo', link1: 'Producto', link2: 'Precios', buttonText: 'Registrarse', backgroundColor: 'bg-white', logoColor: 'text-slate-800', linkColor: 'text-slate-600', buttonBgColor: 'bg-blue-600', buttonTextColor: 'text-white' } as HeaderData },
        { name: 'Sticky', description: 'Barra fija al hacer scroll; fondo semitransparente.', preview: HeaderVariantSticky, defaultData: { variant: 'sticky', logoText: 'MiLogo', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto', buttonText: 'Empezar', backgroundColor: 'bg-white/90', logoColor: 'text-slate-800', linkColor: 'text-slate-600', buttonBgColor: 'bg-blue-600', buttonTextColor: 'text-white' } as HeaderData },
        { 
            name: 'Personalizado (Avanzado)', 
            description: 'Define tu propio layout con sub-elementos.', 
            preview: HeaderVariantDefault, 
            defaultData: { 
                variant: 'custom', 
                logoText: 'MiLogo', 
                link1: '', 
                link2: '', 
                link3: '', 
                buttonText: '', 
                backgroundColor: 'bg-white', 
                logoColor: 'text-slate-800', 
                linkColor: 'text-slate-600', 
                buttonBgColor: 'bg-blue-600', 
                buttonTextColor: 'text-white', 
                customElements: [
                    { id: nanoid(), type: 'logo', data: { content: 'MiLogo' } as StackElement['data'] }, 
                    { id: nanoid(), type: 'link', data: { content: 'Inicio' } as StackElement['data'] }, 
                    { id: nanoid(), type: 'actions', data: { buttonText: 'Acción', buttonLink: '#' } as StackElement['data'] }
                ] 
            } as HeaderData 
        }, // NUEVA VARIANTE
    ]
  } as BlockConfig<HeaderData>,
  hero: {
    name: 'Héroe',
    icon: ViewfinderCircleIcon,
    description: 'Sección principal llamativa.',
    category: 'Principal',
    renderer: HeroPresentational,
    editor: HeroContentEditor,
    styleEditor: HeroStyleEditor,
    theme: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
    variants: [
        { name: 'Centrado Clásico', description: 'Título, subtítulo y botón centrados.', preview: HeroPreviewDefault, defaultData: { variant: 'default', title: 'Título Principal Impactante', subtitle: 'Describe tu propuesta de valor de forma clara y concisa.', buttonText: 'Llamada a la Acción', backgroundColor: 'bg-slate-100', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', buttonBgColor: 'bg-blue-600', buttonTextColor: 'text-white' } as HeroData },
        { name: 'Izquierda con Imagen', description: 'Texto a la izquierda, imagen a la derecha.', preview: HeroPreviewLeftImage, defaultData: { variant: 'leftImage', title: 'Título Descriptivo', subtitle: 'Complementa tu mensaje con una imagen poderosa.', buttonText: 'Ver Más', imageUrl: '', backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', buttonBgColor: 'bg-blue-600', buttonTextColor: 'text-white' } as HeroData },
        { name: 'Mínimo Oscuro', description: 'Diseño elegante sobre un fondo oscuro.', preview: HeroPreviewDarkMinimal, defaultData: { variant: 'darkMinimal', title: 'Menos es Más', buttonText: 'Explorar', backgroundColor: 'bg-slate-900', titleColor: 'text-white', subtitle: '', subtitleColor: 'text-slate-300', buttonBgColor: 'bg-white', buttonTextColor: 'text-slate-800' } as HeroData },
    ]
  } as BlockConfig<HeroData>,
  featuredProduct: {
    name: 'Producto Destacado',
    icon: StarIcon,
    description: 'Destaca un producto con una sección especial.',
    category: 'Principal',
    renderer: Presentational.FeaturedProductPresentational,
    editor: FeaturedProductContentEditor,
    styleEditor: FeaturedProductStyleEditor,
    theme: { bg: 'bg-amber-50', icon: 'text-amber-600' },
    variants: [
        { name: 'Imagen a la Izquierda', description: 'Un diseño clásico con imagen y detalles.', preview: FeaturedProductPreviewImageLeft, defaultData: { variant: 'imageLeft', imageUrl: '', tag: 'Más Vendido', title: 'Nombre del Producto Increíble', description: 'Describe por qué este producto es esencial. Habla de sus beneficios y características únicas.', price: '$99.99', rating: 5, buttonText: 'Añadir al Carrito', backgroundColor: 'bg-white', tagColor: 'text-blue-600', titleColor: 'text-slate-800', descriptionColor: 'text-slate-600', priceColor: 'text-slate-900', buttonBgColor: 'bg-slate-900', buttonTextColor: 'text-white' } as FeaturedProductData },
        { name: 'Imagen de Fondo', description: 'Un diseño inmersivo y moderno.', preview: FeaturedProductPreviewBackground, defaultData: { variant: 'background', imageUrl: '', tag: 'Exclusivo Online', title: 'Producto de Edición Limitada', description: 'Una experiencia premium. Atrapa la atención de tus clientes con este diseño audaz.', price: '$149.99', rating: 5, buttonText: 'Comprar Ahora', backgroundColor: 'bg-black', tagColor: 'text-blue-400', titleColor: 'text-white', descriptionColor: 'text-slate-200', priceColor: 'text-white', buttonBgColor: 'bg-white', buttonTextColor: 'text-slate-900' } as FeaturedProductData },
    ]
  } as BlockConfig<FeaturedProductData>,
  catalog: {
    name: 'Catálogo',
    icon: ShoppingBagIcon,
    description: 'Muestra una cuadrícula de productos.',
    category: 'Comercio',
    renderer: CatalogPresentational,
    editor: CatalogContentEditor,
    styleEditor: CatalogStyleEditor,
    theme: { bg: 'bg-green-50', icon: 'text-green-600' },
    variants: [
        { name: 'Cuadrícula Detallada', description: 'Muestra productos con imagen, título, precio y descripción.', preview: CatalogPreviewGrid, defaultData: { variant: 'grid', title: 'Nuestros Productos', subtitle: 'Explora nuestra colección.', products: [{ name: 'Producto 1', price: '$19.99', description: 'Breve descripción.', buttonText: 'Añadir al carrito' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', cardColor: 'bg-white', productNameColor: 'text-slate-900', productPriceColor: 'text-blue-600', productDescriptionColor: 'text-slate-600', buttonBgColor: 'bg-slate-800', buttonTextColor: 'text-white' } as CatalogData },
        { name: 'Cuadrícula Mínima', description: 'Diseño limpio solo con imagen, título y precio.', preview: CatalogPreviewMinimalGrid, defaultData: { variant: 'minimalGrid', title: 'Colección Minimalista', subtitle: 'Productos seleccionados por su diseño.', products: [{ name: 'Producto A', price: '$49' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', cardColor: 'bg-white', productNameColor: 'text-slate-800', productPriceColor: 'text-slate-600', productDescriptionColor: '', buttonBgColor: '', buttonTextColor: '' } as CatalogData },
        { name: 'Carrusel de Productos', description: 'Ideal para mostrar una selección destacada en una sola fila.', preview: CatalogPreviewCarousel, defaultData: { variant: 'carousel', title: 'Novedades', subtitle: 'Descubre los últimos lanzamientos.', products: [{ name: 'Producto X', price: '$99' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', cardColor: 'bg-white', productNameColor: 'text-slate-800', productPriceColor: 'text-slate-600', productDescriptionColor: '', buttonBgColor: '', buttonTextColor: '' } as CatalogData },
    ]
  } as BlockConfig<CatalogData>,
  team: {
    name: 'Equipo',
    icon: UserGroupIcon,
    description: 'Presenta a los miembros de tu equipo.',
    category: 'Interacción',
    renderer: Presentational.TeamPresentational,
    editor: TeamContentEditor,
    styleEditor: TeamStyleEditor,
    theme: { bg: 'bg-pink-50', icon: 'text-pink-600' },
    variants: [
        { name: 'Cuadrícula', description: 'Muestra a los miembros en una cuadrícula con foto.', preview: TeamPreviewGrid, defaultData: { variant: 'grid', title: 'Nuestro Equipo', subtitle: 'Conoce a las personas que hacen esto posible.', members: [{ name: 'Juan Pérez', role: 'CEO', imageUrl: '' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', nameColor: 'text-slate-900', roleColor: 'text-slate-500' } as TeamData },
        { name: 'Lista', description: 'Presenta a los miembros en un formato de lista vertical.', preview: TeamPreviewList, defaultData: { variant: 'list', title: 'Expertos a tu Servicio', subtitle: 'El equipo detrás de nuestro éxito.', members: [{ name: 'Carlos Rivas', role: 'Desarrollador' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', nameColor: 'text-slate-900', roleColor: 'text-slate-500' } as TeamData },
    ]
  } as BlockConfig<TeamData>,
  testimonial: {
    name: 'Testimonios',
    icon: UserCircleIcon,
    description: 'Muestra reseñas de tus clientes.',
    category: 'Interacción',
    renderer: Presentational.TestimonialPresentational,
    editor: TestimonialContentEditor,
    styleEditor: TestimonialStyleEditor,
    theme: { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
    variants: [
        { name: 'Cita Simple', description: 'Un testimonio centrado y sin imagen.', preview: TestimonialPreviewDefault, defaultData: { variant: 'single', testimonials: [{ quote: 'Este servicio ha transformado mi negocio.', author: 'Cliente Satisfecho', role: 'CEO de Ejemplo Corp' }], title: '', backgroundColor: 'bg-slate-50', cardColor: '', titleColor: '', quoteColor: 'text-slate-700', authorColor: 'text-slate-900', roleColor: 'text-slate-500' } as TestimonialData },
        { name: 'Cita con Imagen', description: 'Un testimonio con la foto del autor.', preview: TestimonialPreviewWithImage, defaultData: { variant: 'singleWithImage', testimonials: [{ quote: '¡Increíble! Superó todas mis expectativas.', author: 'Ana López', role: 'Emprendedora', imageUrl: '' }], title: '', backgroundColor: 'bg-white', cardColor: '', titleColor: '', quoteColor: 'text-slate-700', authorColor: 'text-slate-900', roleColor: 'text-slate-500' } as TestimonialData },
        { name: 'Cuadrícula', description: 'Muestra múltiples testimonios en una cuadrícula.', preview: TestimonialPreviewGrid, defaultData: { variant: 'grid', title: 'Lo que dicen nuestros clientes', testimonials: [{ quote: 'El mejor soporte que he recibido.', author: 'Miguel Castro', role: 'Gerente' }], backgroundColor: 'bg-white', cardColor: 'bg-slate-50', titleColor: 'text-slate-800', quoteColor: 'text-slate-700', authorColor: 'text-slate-900', roleColor: 'text-slate-500' } as TestimonialData },
    ]
  } as BlockConfig<TestimonialData>,
  faq: {
    name: 'Preguntas Frecuentes',
    icon: QuestionMarkCircleIcon,
    description: 'Responde las dudas de tus visitantes.',
    category: 'Interacción',
    renderer: Presentational.FaqPresentational,
    editor: FaqContentEditor,
    styleEditor: FaqStyleEditor,
    theme: { bg: 'bg-teal-50', icon: 'text-teal-600' },
    variants: [
        { name: 'Lista', description: 'Muestra las preguntas y respuestas en una lista simple.', preview: FaqPreviewList, defaultData: { variant: 'list', title: 'Preguntas Frecuentes', items: [{ question: '¿Cuál es el costo?', answer: 'El costo varía según el plan.' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', questionColor: 'text-slate-900', answerColor: 'text-slate-600', iconColor: '' } as FaqData },
        { name: 'Acordeón', description: 'Las respuestas se revelan al hacer clic en la pregunta.', preview: FaqPreviewAccordion, defaultData: { variant: 'accordion', title: '¿Tienes Dudas?', items: [{ question: '¿Ofrecen soporte?', answer: 'Sí, ofrecemos soporte 24/7.' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', questionColor: 'text-slate-900', answerColor: 'text-slate-600', iconColor: 'text-slate-500' } as FaqData },
    ]
  } as BlockConfig<FaqData>,
  text: {
    name: 'Texto',
    icon: ChatBubbleBottomCenterTextIcon,
    description: 'Párrafo de texto simple.',
    category: 'Contenido',
    renderer: TextPresentational,
    editor: TextContentEditor,
    styleEditor: TextStyleEditor,
    theme: { bg: 'bg-gray-50', icon: 'text-gray-600' },
    variants: [
        { name: 'Párrafo Estándar', description: 'Un bloque de texto simple y limpio.', preview: TextPreviewDefault, defaultData: { variant: 'default', content: 'Este es un párrafo de texto. Puedes usarlo para describir tu producto, servicio o historia.', backgroundColor: 'bg-white', textColor: 'text-slate-700' } as TextData },
        { name: 'Cita Destacada', description: 'Resalta una frase o cita importante.', preview: TextPreviewQuote, defaultData: { variant: 'quote', content: 'Una frase inspiradora o un dato clave que quieras destacar.', backgroundColor: 'bg-white', textColor: 'text-slate-700' } as TextData },
        { name: 'Texto Resaltado', description: 'Ideal para notas o avisos importantes.', preview: TextPreviewHighlighted, defaultData: { variant: 'highlighted', content: 'Usa este bloque para mensajes importantes que no deben pasarse por alto.', backgroundColor: 'bg-yellow-100/60', textColor: 'text-yellow-800' } as TextData },
    ]
  } as BlockConfig<TextData>,
  image: {
    name: 'Imagen',
    icon: PhotoIcon,
    description: 'Una sola imagen con pie de foto.',
    category: 'Contenido',
    renderer: Presentational.ImagePresentational,
    editor: ImageContentEditor,
    styleEditor: ImageStyleEditor,
    theme: { bg: 'bg-fuchsia-50', icon: 'text-fuchsia-600' },
    variants: [
        { name: 'Imagen Simple', description: 'Una imagen centrada con un pie de foto opcional.', preview: ImagePreviewDefault, defaultData: { variant: 'default', imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen', alt: 'Descripción de la imagen', caption: 'Pie de foto opcional' } as ImageData },
        { name: 'Con Borde y Sombra', description: 'Destaca tu imagen con un borde sutil y sombra.', preview: ImagePreviewBordered, defaultData: { variant: 'bordered', imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen', alt: 'Descripción de la imagen', caption: 'Imagen con estilo' } as ImageData },
        { name: 'Ancho Completo', description: 'La imagen ocupa todo el ancho de la página.', preview: ImagePreviewFullWidth, defaultData: { variant: 'fullwidth', imageUrl: 'https://placehold.co/1200x600/e2e8f0/64748b?text=Imagen+Ancho+Completo', alt: 'Descripción de la imagen', caption: '' } as ImageData },
    ]
  } as BlockConfig<ImageData>,
  gallery: {
    name: 'Galería',
    icon: PhotoIcon,
    description: 'Muestra una colección de imágenes.',
    category: 'Contenido',
    renderer: Presentational.GalleryPresentational,
    editor: GalleryContentEditor,
    styleEditor: GalleryStyleEditor,
    theme: { bg: 'bg-purple-50', icon: 'text-purple-600' },
    variants: [
        { name: 'Rejilla (Grid)', description: 'Una cuadrícula simple de imágenes.', preview: GalleryPreviewGrid, defaultData: { variant: 'grid', images: [{}, {}, {}, {}], spacing: 'md', lightbox: true } as GalleryData },
        { name: 'Carrusel', description: 'Un carrusel horizontal de imágenes.', preview: GalleryPreviewCarousel, defaultData: { variant: 'carousel', images: [{}, {}, {}, {}, {}], spacing: 'md', lightbox: true } as GalleryData },
        { name: 'Destacado', description: 'Una imagen grande y varias miniaturas.', preview: GalleryPreviewFeatured, defaultData: { variant: 'featured', images: [{}, {}, {}], spacing: 'md', lightbox: true } as GalleryData },
    ]
  } as BlockConfig<GalleryData>,
  cards: {
    name: 'Tarjetas',
    icon: RectangleGroupIcon,
    description: 'Grupo de tarjetas de servicio.',
    category: 'Contenido',
    renderer: CardsPresentational,
    editor: CardsContentEditor,
    styleEditor: CardsStyleEditor,
    theme: { bg: 'bg-orange-50', icon: 'text-orange-600' },
    variants: [
        { name: 'Tres Columnas', description: 'Muestra 3 características o servicios con íconos.', preview: CardsPreviewDefault, defaultData: { variant: 'default', title: 'Nuestras Características', cards: [{ icon: '🚀', title: 'Característica 1', description: 'Descripción.' }, { icon: '✨', title: 'Característica 2', description: 'Descripción.' }, { icon: '💡', title: 'Característica 3', description: 'Descripción.' }], backgroundColor: 'bg-slate-50', titleColor: 'text-slate-800', cardBackgroundColor: 'bg-white', cardTitleColor: 'text-slate-900', cardDescriptionColor: 'text-slate-600' } as CardsData },
        { name: 'Lista Vertical', description: 'Enumera características o beneficios en formato de lista.', preview: CardsPreviewList, defaultData: { variant: 'list', title: '¿Por qué elegirnos?', cards: [{ icon: '✅', title: 'Beneficio 1', description: 'Explicación del beneficio.' }, { icon: '✅', title: 'Beneficio 2', description: 'Explicación del beneficio.' }], backgroundColor: 'bg-white', titleColor: 'text-slate-800', cardBackgroundColor: '', cardTitleColor: 'text-slate-900', cardDescriptionColor: 'text-slate-600' } as CardsData },
        { name: 'Imagen Superior', description: 'Tarjetas con una imagen destacada en la parte superior.', preview: CardsPreviewImageTop, defaultData: { variant: 'imageTop', title: 'Nuestros Servicios', cards: [{ title: 'Servicio A', description: 'Descripción.', imageUrl: '' }, { title: 'Servicio B', description: 'Descripción.', imageUrl: '' }], backgroundColor: 'bg-slate-50', titleColor: 'text-slate-800', cardBackgroundColor: 'bg-white', cardTitleColor: 'text-slate-900', cardDescriptionColor: 'text-slate-600' } as CardsData },
    ]
  } as BlockConfig<CardsData>,
  cta: {
    name: 'Llamada a la Acción',
    icon: MegaphoneIcon,
    description: 'Invita a los usuarios a actuar.',
    category: 'Interacción',
    renderer: Presentational.CtaPresentational,
    editor: CtaContentEditor,
    styleEditor: CtaStyleEditor,
    theme: { bg: 'bg-lime-50', icon: 'text-lime-600' },
    variants: [
        { name: 'Banner Oscuro', description: 'Un banner llamativo con fondo oscuro.', preview: CtaPreviewDark, defaultData: { variant: 'dark', title: '¿Listo para empezar?', subtitle: 'Únete a nosotros hoy y descubre el potencial.', buttonText: 'Crear Cuenta', backgroundColor: 'bg-slate-800', titleColor: 'text-white', subtitleColor: 'text-slate-300', buttonBgColor: 'bg-white', buttonTextColor: 'text-slate-800' } as CtaData },
        { name: 'Banner Claro', description: 'Un diseño limpio y claro para atraer la atención.', preview: CtaPreviewLight, defaultData: { variant: 'light', title: 'Impulsa tu Negocio', subtitle: 'Descubre cómo nuestras herramientas pueden ayudarte a crecer.', buttonText: 'Saber Más', backgroundColor: 'bg-slate-100', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', buttonBgColor: 'bg-blue-600', buttonTextColor: 'text-white' } as CtaData },
        { name: 'Dividido con Imagen', description: 'Combina un mensaje potente con una imagen.', preview: CtaPreviewSplit, defaultData: { variant: 'split', title: 'Transforma tu Flujo de Trabajo', subtitle: 'Ahorra tiempo y aumenta tu productividad.', buttonText: 'Ver Demo', imageUrl: '', backgroundColor: 'bg-white', titleColor: 'text-slate-800', subtitleColor: 'text-slate-600', buttonBgColor: 'bg-blue-600', buttonTextColor: 'text-white' } as CtaData },
    ]
  } as BlockConfig<CtaData>,
  pricing: {
    name: 'Precios',
    icon: CurrencyDollarIcon,
    description: 'Muestra tus planes y precios.',
    category: 'Comercio',
    renderer: Presentational.PricingPresentational,
    editor: PricingContentEditor,
    styleEditor: PricingStyleEditor,
    theme: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    variants: [
        {
            name: 'Columnas',
            description: 'El diseño clásico para comparar planes.',
            preview: PricingPreviewColumns,
            defaultData: {
                variant: 'columns',
                title: 'Nuestros Planes',
                subtitle: 'Elige la opción que mejor se adapte a ti.',
                plans: [],
                backgroundColor: 'bg-white',
                titleColor: 'text-slate-800',
                subtitleColor: 'text-slate-600',
                cardColor: 'bg-white',
                featuredCardColor: 'bg-slate-800',
                planNameColor: 'text-slate-900',
                priceColor: 'text-slate-900',
                frequencyColor: 'text-slate-500',
                featureTextColor: 'text-slate-600',
                buttonBgColor: 'bg-blue-600',
                buttonTextColor: 'text-white',
                featuredButtonBgColor: 'bg-white',
                featuredButtonTextColor: 'text-blue-600'
            } as PricingData
        },
        {
            name: 'Lista Detallada',
            description: 'Un formato ideal para planes con muchas características.',
            preview: PricingPreviewList,
            defaultData: {
                variant: 'list',
                title: 'Planes y Precios',
                subtitle: 'Compara nuestras opciones.',
                plans: [],
                backgroundColor: 'bg-white',
                titleColor: 'text-slate-800',
                subtitleColor: 'text-slate-600',
                cardColor: 'bg-white',
                featuredCardColor: 'bg-slate-800',
                planNameColor: 'text-slate-900',
                priceColor: 'text-slate-900',
                frequencyColor: 'text-slate-500',
                featureTextColor: 'text-slate-600',
                buttonBgColor: 'bg-blue-600',
                buttonTextColor: 'text-white',
                featuredButtonBgColor: 'bg-white',
                featuredButtonTextColor: 'text-blue-600'
            } as PricingData
        },
        {
            name: 'Simple',
            description: 'Un diseño más simple y directo para mostrar precios.',
            preview: PricingPreviewSimple,
            defaultData: {
                variant: 'simple',
                title: 'Precios Sencillos',
                subtitle: 'Sin sorpresas, solo lo que necesitas.',
                plans: [],
                backgroundColor: 'bg-white',
                titleColor: 'text-slate-800',
                subtitleColor: 'text-slate-600',
                cardColor: 'bg-white',
                featuredCardColor: 'bg-slate-800',
                planNameColor: 'text-slate-900',
                priceColor: 'text-slate-900',
                frequencyColor: 'text-slate-500',
                featureTextColor: 'text-slate-600',
                buttonBgColor: 'bg-blue-600',
                buttonTextColor: 'text-white',
                featuredButtonBgColor: 'bg-white',
                featuredButtonTextColor: 'text-blue-600'
            } as PricingData
        },
    ]
  } as BlockConfig<PricingData>,
  footer: {
    name: 'Pie de Página',
    icon: CodeBracketIcon,
    description: 'Sección final con copyright y enlaces.',
    category: 'Estructura',
    renderer: FooterPresentational,
    editor: FooterContentEditor,
    styleEditor: FooterStyleEditor,
    theme: { bg: 'bg-slate-50', icon: 'text-slate-600' },
    variants: [
        { name: 'Simple', description: 'Copyright y enlaces a redes sociales.', preview: FooterPreviewSimple, defaultData: { variant: 'simple', copyrightText: `© ${new Date().getFullYear()} Mi Empresa.`, socialLinks: [{ platform: 'Facebook', url: '#' }, { platform: 'Twitter', url: '#' }], backgroundColor: 'bg-slate-800', textColor: 'text-slate-400', linkColor: 'text-slate-300' } as FooterData },
        { name: 'Multicolumna', description: 'Organiza enlaces en varias columnas.', preview: FooterPreviewMultiColumn, defaultData: { variant: 'multiColumn', copyrightText: `© ${new Date().getFullYear()} Mi Empresa.`, columns: [{ title: 'Producto', links: ['Precios', 'Funciones'] }, { title: 'Compañía', links: ['Sobre nosotros', 'Contacto'] }], backgroundColor: 'bg-slate-800', textColor: 'text-slate-400', linkColor: 'text-slate-300' } as FooterData },
        { name: 'Mínimo', description: 'Solo el texto de copyright.', preview: FooterPreviewMinimal, defaultData: { variant: 'minimal', copyrightText: `© ${new Date().getFullYear()} Mi Empresa.`, backgroundColor: 'bg-white', textColor: 'text-slate-500', linkColor: '' } as FooterData },
    ]
  } as BlockConfig<FooterData>,
  stack: {
    name: 'Contenido Flexible',
    icon: RectangleGroupIcon,
    description: 'Agrupa títulos, párrafos, imágenes y botones en un solo bloque apilable y ordenable.',
    category: 'Contenido',
    renderer: Presentational.StackPresentational,
    editor: StackContentEditor,
    styleEditor: StackStyleEditor,
    theme: { bg: 'bg-slate-50', icon: 'text-slate-700' },
    variants: [
      {
        name: 'Stack Básico',
        description: 'Crea secciones únicas apilando distintos tipos de contenido.',
        preview: StackPreviewDefault,
        defaultData: {
          variant: 'default',
          elements: [],
          backgroundColor: '',
        } as StackData,
      },
    ],
  } as BlockConfig<StackData>,
  banner: {
    name: 'Banner',
    icon: MegaphoneIcon,
    description: 'Sección destacada con imagen, color y texto.',
    category: 'Interacción',
    renderer: Presentational.BannerPresentational,
    editor: BannerContentEditor,
    styleEditor: BannerStyleEditor,
    theme: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    variants: [
      {
        name: 'Informativo',
        description: 'Banner para avisos o información general.',
        preview: BannerPreviewInfo,
        defaultData: {
          variant: 'info',
          text: '¡Bienvenido a tu nuevo sitio!',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
        } as BannerData,
      },
      {
        name: 'Éxito',
        description: 'Banner para mensajes de éxito o confirmación.',
        preview: BannerPreviewSuccess,
        defaultData: {
          variant: 'success',
          text: '¡Operación realizada con éxito!',
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
        } as BannerData,
      },
      {
        name: 'Promoción',
        description: 'Banner para promociones o anuncios destacados.',
        preview: BannerPreviewPromo,
        defaultData: {
          variant: 'promo',
          text: '¡Aprovecha nuestra oferta especial!',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-900',
          buttonText: 'Ver más',
        } as BannerData,
      },
    ],
  } as BlockConfig<BannerData>,
};

export type BlockType = keyof typeof BLOCKS;

export interface Block {
    id: number;
    type: BlockType;
    data: BlockData;
}