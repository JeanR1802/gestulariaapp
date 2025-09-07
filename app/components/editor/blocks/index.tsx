// app/components/editor/blocks/index.tsx
'use client';
import React from 'react';

import {
  ViewfinderCircleIcon, PhotoIcon, QueueListIcon, RectangleGroupIcon, MegaphoneIcon,
  CurrencyDollarIcon, ChatBubbleBottomCenterTextIcon, CodeBracketIcon, UserCircleIcon,
  QuestionMarkCircleIcon, UserGroupIcon, ShoppingBagIcon
} from '@heroicons/react/24/outline';

// Importaciones de todos los componentes de bloques
import { HeaderBlock, HeaderEditor, HeaderData } from './HeaderBlock';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
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

// Importaciones de todas las vistas previas
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


export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, PricingData, FooterData, TestimonialData, FaqData, TeamData, CatalogData };
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | PricingData | FooterData | TestimonialData | FaqData | TeamData | CatalogData;

export const BLOCKS = {
  header: {
    name: 'Encabezado', 
    icon: QueueListIcon, 
    description: 'Barra de navegación principal.', 
    renderer: HeaderBlock, 
    editor: HeaderEditor,
    theme: { bg: 'bg-sky-50', icon: 'text-sky-600' },
    variants: [
      { name: 'Clásico', description: 'Logo a la izquierda, enlaces a la derecha.', preview: HeaderVariantDefault, defaultData: { variant: 'default', logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData },
      { name: 'Centrado', description: 'Logo y enlaces centrados.', preview: HeaderVariantCentered, defaultData: { variant: 'centered', logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData },
      { name: 'Con Botón CTA', description: 'Ideal para dirigir a una acción principal.', preview: HeaderVariantButtonPreview, defaultData: { variant: 'withButton', logoText: 'Mi Negocio', link1: 'Producto', link2: 'Precios', link3: '', buttonText: 'Registrarse' } as HeaderData }
    ]
  },
  hero: {
    name: 'Héroe', 
    icon: ViewfinderCircleIcon, 
    description: 'Sección principal llamativa.', 
    renderer: HeroBlock, 
    editor: HeroEditor,
    theme: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
    variants: [
      { name: 'Centrado Clásico', description: 'Ideal para mensajes directos.', preview: HeroPreviewDefault, defaultData: { variant: 'default', title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo que describe tu propuesta de valor.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData },
      { name: 'Izquierda con Imagen', description: 'Combina texto con un elemento visual.', preview: HeroPreviewLeftImage, defaultData: { variant: 'leftImage', title: 'Describe tu Producto', subtitle: 'Atrae a tus clientes con una descripción clara y una imagen de apoyo.', buttonText: 'Ver Más', backgroundColor: 'bg-white', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tu+Imagen' } as HeroData },
      { name: 'Mínimo Oscuro', description: 'Un diseño elegante y moderno.', preview: HeroPreviewDarkMinimal, defaultData: { variant: 'darkMinimal', title: 'Un Mensaje Impactante', subtitle: '', buttonText: 'Descubrir', backgroundColor: 'bg-slate-900' } as HeroData }
    ]
  },
  catalog: {
    name: 'Catálogo',
    icon: ShoppingBagIcon,
    description: 'Muestra una cuadrícula de productos.',
    renderer: CatalogBlock,
    editor: CatalogEditor,
    theme: { bg: 'bg-green-50', icon: 'text-green-600' },
    variants: [
        { 
          name: 'Cuadrícula Clásica', 
          description: 'El diseño estándar con botón y descripción.', 
          preview: CatalogPreviewGrid, 
          defaultData: { /* ... */ } as CatalogData 
        },
        { 
          name: 'Cuadrícula Minimalista', 
          description: 'Un diseño limpio centrado en la imagen.', 
          preview: CatalogPreviewMinimalGrid, 
          defaultData: { /* ... */ } as CatalogData 
        },
        // --- NUEVA VARIANTE DE CARRUSEL ---
        {
          name: 'Carrusel Horizontal',
          description: 'Una fila de productos que se desliza.',
          preview: CatalogPreviewCarousel,
          defaultData: {
            variant: 'carousel',
            title: 'Novedades',
            subtitle: 'Lo último en llegar a nuestra tienda.',
            products: [
              { name: 'Producto Deslizable 1', price: '$49.00', description: '', imageUrl: '', buttonText: '' },
              { name: 'Producto Deslizable 2', price: '$59.00', description: '', imageUrl: '', buttonText: '' },
              { name: 'Producto Deslizable 3', price: '$39.00', description: '', imageUrl: '', buttonText: '' },
            ]
          } as CatalogData
        }
    ]
  },
  team: {
    name: 'Equipo',
    icon: UserGroupIcon,
    description: 'Presenta a los miembros de tu equipo.',
    renderer: TeamBlock,
    editor: TeamEditor,
    theme: { bg: 'bg-pink-50', icon: 'text-pink-600' },
    variants: [
        { name: 'Cuadrícula', description: 'Ideal para mostrar fotos en una grilla.', preview: TeamPreviewGrid, defaultData: { variant: 'grid', title: 'Nuestro Equipo', subtitle: 'Conoce a las personas que hacen esto posible.', members: [ { name: 'Juan Pérez', role: 'Desarrollador', imageUrl: '' }, { name: 'María García', role: 'Diseñadora', imageUrl: '' } ] } as TeamData },
        { name: 'Lista', description: 'Un formato limpio para listar miembros.', preview: TeamPreviewList, defaultData: { variant: 'list', title: 'Colaboradores', subtitle: 'El talento detrás de nuestro éxito.', members: [ { name: 'Carlos Sánchez', role: 'Marketing', imageUrl: '' }, { name: 'Laura Gómez', role: 'Soporte', imageUrl: '' } ] } as TeamData },
    ]
  },
  testimonial: {
    name: 'Testimonios',
    icon: UserCircleIcon,
    description: 'Muestra reseñas de tus clientes.',
    renderer: TestimonialBlock,
    editor: TestimonialEditor,
    theme: { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
    variants: [
        { name: 'Cita Simple', description: 'Un solo testimonio centrado.', preview: TestimonialPreviewDefault, defaultData: { variant: 'single', testimonials: [{ quote: 'Este producto cambió mi forma de trabajar. ¡Totalmente recomendado!', author: 'Ana Pérez', role: 'CEO de Empresa' }] } as TestimonialData },
        { name: 'Cita con Imagen', description: 'Testimonio centrado con foto del autor.', preview: TestimonialPreviewWithImage, defaultData: { variant: 'singleWithImage', testimonials: [{ quote: 'Increíble servicio al cliente y una plataforma muy fácil de usar.', author: 'Juan García', role: 'Director de Marketing' }] } as TestimonialData },
        { name: 'Cuadrícula', description: 'Muestra varios testimonios en una cuadrícula.', preview: TestimonialPreviewGrid, defaultData: { variant: 'grid', title: 'Lo que dicen nuestros clientes', testimonials: [ { quote: 'Una herramienta indispensable para nuestro equipo.', author: 'Sofía López', role: 'Jefa de Proyecto' }, { quote: 'Los resultados hablan por sí solos. ¡Un 10/10!', author: 'Carlos Martínez', role: 'Fundador de Startup' } ] } as TestimonialData }
    ]
  },
  faq: {
    name: 'Preguntas Frecuentes',
    icon: QuestionMarkCircleIcon,
    description: 'Responde las dudas de tus visitantes.',
    renderer: FaqBlock,
    editor: FaqEditor,
    theme: { bg: 'bg-teal-50', icon: 'text-teal-600' },
    variants: [
        { name: 'Lista', description: 'Formato simple de pregunta y respuesta.', preview: FaqPreviewList, defaultData: { variant: 'list', title: 'Preguntas Frecuentes', backgroundColor: 'bg-white', items: [ { question: '¿Cuál es la primera pregunta?', answer: 'Esta es la respuesta a la primera pregunta.' }, { question: '¿Y la segunda?', answer: 'Aquí tienes la detallada respuesta a la segunda pregunta.' } ] } as FaqData },
        { name: 'Acordeón', description: 'Las respuestas se ocultan y muestran al hacer clic.', preview: FaqPreviewAccordion, defaultData: { variant: 'accordion', title: '¿Tienes Dudas?', backgroundColor: 'bg-white', items: [ { question: '¿Cómo funciona el acordeón?', answer: 'Al hacer clic en la pregunta, la respuesta aparece suavemente debajo.' }, { question: '¿Es fácil de usar?', answer: '¡Sí! Está diseñado para ser intuitivo tanto para ti como para tus visitantes.' } ] } as FaqData }
    ]
  },
  text: {
    name: 'Texto', 
    icon: ChatBubbleBottomCenterTextIcon, 
    description: 'Párrafo de texto simple.', 
    renderer: TextBlock, 
    editor: TextEditor,
    theme: { bg: 'bg-gray-50', icon: 'text-gray-600' },
    variants: [
      { name: 'Párrafo Estándar', description: 'Un bloque de texto simple y legible.', preview: TextPreviewDefault, defaultData: { variant: 'default', content: 'Escribe aquí tu contenido. Este es el estilo de párrafo estándar.' } as TextData },
      { name: 'Cita Destacada', description: 'Ideal para resaltar testimonios o frases.', preview: TextPreviewQuote, defaultData: { variant: 'quote', content: 'Esta es una cita para resaltar una idea importante.' } as TextData },
      { name: 'Texto Resaltado', description: 'Un párrafo con fondo para llamar la atención.', preview: TextPreviewHighlighted, defaultData: { variant: 'highlighted', content: 'Usa este bloque para notas importantes o advertencias.' } as TextData }
    ]
  },
  image: {
    name: 'Imagen', 
    icon: PhotoIcon, 
    description: 'Una sola imagen con pie de foto.', 
    renderer: ImageBlock, 
    editor: ImageEditor,
    theme: { bg: 'bg-fuchsia-50', icon: 'text-fuchsia-600' },
    variants: [
      { name: 'Imagen Simple', description: 'Una imagen centrada con pie de foto.', preview: ImagePreviewDefault, defaultData: { variant: 'default', imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Pie de foto opcional.' } as ImageData },
      { name: 'Borde y Sombra', description: 'Destaca la imagen con un marco y sombra.', preview: ImagePreviewBordered, defaultData: { variant: 'bordered', imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Un estilo más elegante.' } as ImageData },
      { name: 'Ancho Completo', description: 'La imagen ocupa todo el ancho disponible.', preview: ImagePreviewFullWidth, defaultData: { variant: 'fullwidth', imageUrl: 'https://placehold.co/1200x400/e2e8f0/64748b?text=Imagen+Panorámica', alt: 'Descripción de la imagen', caption: 'Perfecta para banners.' } as ImageData }
    ]
  },
  cards: {
    name: 'Tarjetas', 
    icon: RectangleGroupIcon, 
    description: 'Grupo de tarjetas de servicio.', 
    renderer: CardsBlock, 
    editor: CardsEditor,
    theme: { bg: 'bg-orange-50', icon: 'text-orange-600' },
    variants: [
      { name: 'Tres Columnas', description: 'Muestra características en columnas.', preview: CardsPreviewDefault, defaultData: { variant: 'default', title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] } as CardsData },
      { name: 'Lista Vertical', description: 'Ideal para descripciones más largas.', preview: CardsPreviewList, defaultData: { variant: 'list', title: 'Nuestro Proceso', cards: [ { icon: '1️⃣', title: 'Paso Uno', description: 'Descripción detallada del primer paso del proceso.' }, { icon: '2️⃣', title: 'Paso Dos', description: 'Descripción detallada del segundo paso.' }, { icon: '3️⃣', title: 'Paso Tres', description: 'Descripción detallada del tercer y último paso.' } ] } as CardsData },
      { name: 'Imagen Superior', description: 'Un diseño visual con imágenes destacadas.', preview: CardsPreviewImageTop, defaultData: { variant: 'imageTop', title: 'Nuestros Productos', cards: [ { imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Producto+A', title: 'Producto A', description: 'Descripción del producto A.' }, { imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Producto+B', title: 'Producto B', description: 'Descripción del producto B.' }, { imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Producto+C', title: 'Producto C', description: 'Descripción del producto C.' } ] } as CardsData }
    ]
  },
  cta: {
    name: 'Llamada a la Acción', 
    icon: MegaphoneIcon, 
    description: 'Invita a los usuarios a actuar.', 
    renderer: CtaBlock, 
    editor: CtaEditor,
    theme: { bg: 'bg-lime-50', icon: 'text-lime-600' },
    variants: [
      { name: 'Banner Oscuro', description: 'Un banner con fondo oscuro para resaltar.', preview: CtaPreviewDark, defaultData: { variant: 'dark', title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData },
      { name: 'Banner Claro', description: 'Un diseño limpio con fondo claro.', preview: CtaPreviewLight, defaultData: { variant: 'light', title: 'Prueba Nuestra Plataforma', subtitle: 'Descubre todo lo que puedes hacer.', buttonText: 'Comenzar Gratis', backgroundColor: 'bg-slate-100' } as CtaData },
      { name: 'Dividido con Imagen', description: 'Texto a un lado e imagen al otro.', preview: CtaPreviewSplit, defaultData: { variant: 'split', title: 'Lleva tu Negocio al Siguiente Nivel', subtitle: 'Nuestras herramientas te ayudarán a crecer.', buttonText: 'Saber Más', backgroundColor: 'bg-white', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen' } as CtaData }
    ]
  },
  pricing: {
    name: 'Precios', 
    icon: CurrencyDollarIcon, 
    description: 'Muestra tus planes y precios.', 
    renderer: PricingBlock, 
    editor: PricingEditor,
    theme: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    variants: [
      { 
        name: 'Columnas Comparativas', 
        description: 'Ideal para comparar 2-3 planes.', 
        preview: PricingPreviewColumns, 
        defaultData: { 
          variant: 'columns', title: 'Nuestros Planes', subtitle: 'Elige el plan que mejor se adapte a tus necesidades.',
          backgroundColor: 'bg-white', highlightColor: 'border-blue-600',
          plans: [
            { name: 'Básico', price: '10', frequency: '/mes', description: 'Para empezar.', features: ['Característica 1', 'Característica 2'], buttonText: 'Elegir Plan', highlighted: false },
            { name: 'Popular', price: '25', frequency: '/mes', description: 'El más elegido.', features: ['Todo lo del Básico', 'Característica 3', 'Característica 4'], buttonText: 'Elegir Plan', highlighted: true },
            { name: 'Pro', price: '50', frequency: '/mes', description: 'Para expertos.', features: ['Todo lo del Popular', 'Soporte VIP'], buttonText: 'Elegir Plan', highlighted: false },
          ] 
        } as PricingData 
      },
      { 
        name: 'Lista Detallada', 
        description: 'Cuando cada plan tiene muchas características.', 
        preview: PricingPreviewList, 
        defaultData: { 
          variant: 'list', title: 'Planes Disponibles', subtitle: 'Soluciones para todos los tamaños.',
          backgroundColor: 'bg-white', highlightColor: 'border-blue-600',
           plans: [
            { name: 'Plan Inicial', price: '15', frequency: '/mes', description: 'Perfecto para proyectos personales y pequeños.', features: [], buttonText: 'Suscribirse', highlighted: false },
            { name: 'Plan Crecimiento', price: '45', frequency: '/mes', description: 'Herramientas potentes para hacer crecer tu negocio.', features: [], buttonText: 'Suscribirse', highlighted: true },
          ] 
        } as PricingData 
      },
      { 
        name: 'Simple', 
        description: 'Un diseño limpio y directo para dos opciones.', 
        preview: PricingPreviewSimple, 
        defaultData: { 
          variant: 'simple', title: 'Elige tu Plan', subtitle: 'Precios simples y transparentes.',
          backgroundColor: 'bg-white', highlightColor: 'border-blue-600',
           plans: [
            { name: 'Mensual', price: '20', frequency: '/mes', description: 'Flexibilidad total, cancela cuando quieras.', features: [], buttonText: 'Comprar', highlighted: false },
            { name: 'Anual', price: '200', frequency: '/año', description: 'Ahorra un 20% con el plan anual.', features: [], buttonText: 'Comprar', highlighted: true },
          ] 
        } as PricingData 
      }
    ]
  },
  footer: {
    name: 'Pie de Página', 
    icon: CodeBracketIcon, 
    description: 'Sección final con copyright y enlaces.', 
    renderer: FooterBlock, 
    editor: FooterEditor,
    theme: { bg: 'bg-slate-50', icon: 'text-slate-600' },
    variants: [
      { name: 'Simple', description: 'Copyright y redes sociales.', preview: FooterPreviewSimple, defaultData: { variant: 'simple', copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] } as FooterData },
      { name: 'Multicolumna', description: 'Organiza enlaces en varias columnas.', preview: FooterPreviewMultiColumn, defaultData: { variant: 'multiColumn', copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, columns: [ { title: 'Producto', links: ['Características', 'Precios', 'FAQ'] }, { title: 'Compañía', links: ['Sobre nosotros', 'Contacto', 'Blog'] } ] } as FooterData },
      { name: 'Mínimo Centrado', description: 'Un pie de página discreto y centrado.', preview: FooterPreviewMinimal, defaultData: { variant: 'minimal', copyrightText: `© ${new Date().getFullYear()} Mi Negacio. Todos los derechos reservados.` } as FooterData }
    ]
  },
};

export type BlockType = keyof typeof BLOCKS;