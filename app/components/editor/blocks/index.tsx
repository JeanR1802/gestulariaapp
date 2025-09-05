// Archivo: app/components/editor/blocks/index.tsx (VERSIÓN COMPLETA Y FINAL)
import React from 'react';

// Importaciones de componentes principales (renderer y editor)
import { HeaderBlock, HeaderEditor, HeaderData } from './HeaderBlock';
import { HeroBlock, HeroEditor, HeroData } from './HeroBlock';
import { TextBlock, TextEditor, TextData } from './TextBlock';
import { ImageBlock, ImageEditor, ImageData } from './ImageBlock';
import { CardsBlock, CardsEditor, CardsData } from './CardsBlock';
import { CtaBlock, CtaEditor, CtaData } from './CtaBlock';
import { FooterBlock, FooterEditor, FooterData } from './FooterBlock';

// Importaciones de TODOS los componentes de previsualización para la bandeja
import { HeaderVariantDefault, HeaderVariantCentered, HeaderVariantButtonPreview } from './Header/HeaderPreviews';
import { HeroPreviewDefault, HeroPreviewLeftImage, HeroPreviewDarkMinimal } from './Hero/HeroPreviews';
import { TextPreviewDefault, TextPreviewQuote, TextPreviewHighlighted } from './Text/TextPreviews';
import { ImagePreviewDefault, ImagePreviewBordered, ImagePreviewFullWidth } from './Image/ImagePreviews';
import { CardsPreviewDefault, CardsPreviewList, CardsPreviewImageTop } from './Cards/CardsPreviews';
import { CtaPreviewDark, CtaPreviewLight, CtaPreviewSplit } from './Cta/CtaPreviews';
import { FooterPreviewSimple, FooterPreviewMultiColumn, FooterPreviewMinimal } from './Footer/FooterPreviews';

// Re-exporta los tipos de datos para que otros archivos puedan usarlos
export type { HeaderData, HeroData, TextData, ImageData, CardsData, CtaData, FooterData };
export type BlockData = HeaderData | HeroData | TextData | ImageData | CardsData | CtaData | FooterData;

// Define el registro de bloques completo con todas las variantes
export const BLOCKS = {
  header: {
    name: 'Encabezado', icon: '🔝', description: 'Barra de navegación principal.', renderer: HeaderBlock, editor: HeaderEditor,
    variants: [
      { name: 'Clásico', description: 'Logo a la izquierda, enlaces a la derecha.', preview: HeaderVariantDefault, defaultData: { variant: 'default', logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData },
      { name: 'Centrado', description: 'Logo y enlaces centrados.', preview: HeaderVariantCentered, defaultData: { variant: 'centered', logoText: 'Mi Negocio', link1: 'Inicio', link2: 'Servicios', link3: 'Contacto' } as HeaderData },
      { name: 'Con Botón CTA', description: 'Ideal para dirigir a una acción principal.', preview: HeaderVariantButtonPreview, defaultData: { variant: 'withButton', logoText: 'Mi Negocio', link1: 'Producto', link2: 'Precios', link3: '', buttonText: 'Registrarse' } as HeaderData }
    ]
  },
  hero: {
    name: 'Héroe', icon: '🎯', description: 'Sección principal llamativa.', renderer: HeroBlock, editor: HeroEditor,
    variants: [
      { name: 'Centrado Clásico', description: 'Ideal para mensajes directos.', preview: HeroPreviewDefault, defaultData: { variant: 'default', title: 'Tu Título Principal', subtitle: 'Un subtítulo atractivo que describe tu propuesta de valor.', buttonText: 'Comenzar', backgroundColor: 'bg-slate-100' } as HeroData },
      { name: 'Izquierda con Imagen', description: 'Combina texto con un elemento visual.', preview: HeroPreviewLeftImage, defaultData: { variant: 'leftImage', title: 'Describe tu Producto', subtitle: 'Atrae a tus clientes con una descripción clara y una imagen de apoyo.', buttonText: 'Ver Más', backgroundColor: 'bg-white', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tu+Imagen' } as HeroData },
      { name: 'Mínimo Oscuro', description: 'Un diseño elegante y moderno.', preview: HeroPreviewDarkMinimal, defaultData: { variant: 'darkMinimal', title: 'Un Mensaje Impactante', subtitle: '', buttonText: 'Descubrir', backgroundColor: 'bg-slate-900' } as HeroData }
    ]
  },
  text: {
    name: 'Texto', icon: '📝', description: 'Párrafo de texto simple.', renderer: TextBlock, editor: TextEditor,
    variants: [
      { name: 'Párrafo Estándar', description: 'Un bloque de texto simple y legible.', preview: TextPreviewDefault, defaultData: { variant: 'default', content: 'Escribe aquí tu contenido. Este es el estilo de párrafo estándar.' } as TextData },
      { name: 'Cita Destacada', description: 'Ideal para resaltar testimonios o frases.', preview: TextPreviewQuote, defaultData: { variant: 'quote', content: 'Esta es una cita para resaltar una idea importante.' } as TextData },
      { name: 'Texto Resaltado', description: 'Un párrafo con fondo para llamar la atención.', preview: TextPreviewHighlighted, defaultData: { variant: 'highlighted', content: 'Usa este bloque para notas importantes o advertencias.' } as TextData }
    ]
  },
  image: {
    name: 'Imagen', icon: '🖼️', description: 'Una sola imagen con pie de foto.', renderer: ImageBlock, editor: ImageEditor,
    variants: [
      { name: 'Imagen Simple', description: 'Una imagen centrada con pie de foto.', preview: ImagePreviewDefault, defaultData: { variant: 'default', imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Pie de foto opcional.' } as ImageData },
      { name: 'Borde y Sombra', description: 'Destaca la imagen con un marco y sombra.', preview: ImagePreviewBordered, defaultData: { variant: 'bordered', imageUrl: 'https://placehold.co/800x450/e2e8f0/64748b?text=Tu+Imagen', alt: 'Descripción de la imagen', caption: 'Un estilo más elegante.' } as ImageData },
      { name: 'Ancho Completo', description: 'La imagen ocupa todo el ancho disponible.', preview: ImagePreviewFullWidth, defaultData: { variant: 'fullwidth', imageUrl: 'https://placehold.co/1200x400/e2e8f0/64748b?text=Imagen+Panorámica', alt: 'Descripción de la imagen', caption: 'Perfecta para banners.' } as ImageData }
    ]
  },
  cards: {
    name: 'Tarjetas', icon: '🎴', description: 'Grupo de tarjetas de servicio.', renderer: CardsBlock, editor: CardsEditor,
    variants: [
      { name: 'Tres Columnas', description: 'Muestra características en columnas.', preview: CardsPreviewDefault, defaultData: { variant: 'default', title: 'Nuestros Servicios', cards: [ { icon: '🚀', title: 'Servicio 1', description: 'Descripción breve.' }, { icon: '✨', title: 'Servicio 2', description: 'Descripción breve.' }, { icon: '💎', title: 'Servicio 3', description: 'Descripción breve.' } ] } as CardsData },
      { name: 'Lista Vertical', description: 'Ideal para descripciones más largas.', preview: CardsPreviewList, defaultData: { variant: 'list', title: 'Nuestro Proceso', cards: [ { icon: '1️⃣', title: 'Paso Uno', description: 'Descripción detallada del primer paso del proceso.' }, { icon: '2️⃣', title: 'Paso Dos', description: 'Descripción detallada del segundo paso.' }, { icon: '3️⃣', title: 'Paso Tres', description: 'Descripción detallada del tercer y último paso.' } ] } as CardsData },
      { name: 'Imagen Superior', description: 'Un diseño visual con imágenes destacadas.', preview: CardsPreviewImageTop, defaultData: { variant: 'imageTop', title: 'Nuestros Productos', cards: [ { imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Producto+A', title: 'Producto A', description: 'Descripción del producto A.' }, { imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Producto+B', title: 'Producto B', description: 'Descripción del producto B.' }, { imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Producto+C', title: 'Producto C', description: 'Descripción del producto C.' } ] } as CardsData }
    ]
  },
  cta: {
    name: 'Llamada a la Acción', icon: '📢', description: 'Invita a los usuarios a actuar.', renderer: CtaBlock, editor: CtaEditor,
    variants: [
      { name: 'Banner Oscuro', description: 'Un banner con fondo oscuro para resaltar.', preview: CtaPreviewDark, defaultData: { variant: 'dark', title: '¿Listo para empezar?', subtitle: 'Únete a miles de clientes satisfechos.', buttonText: 'Contactar Ahora', backgroundColor: 'bg-slate-800' } as CtaData },
      { name: 'Banner Claro', description: 'Un diseño limpio con fondo claro.', preview: CtaPreviewLight, defaultData: { variant: 'light', title: 'Prueba Nuestra Plataforma', subtitle: 'Descubre todo lo que puedes hacer.', buttonText: 'Comenzar Gratis', backgroundColor: 'bg-slate-100' } as CtaData },
      { name: 'Dividido con Imagen', description: 'Texto a un lado e imagen al otro.', preview: CtaPreviewSplit, defaultData: { variant: 'split', title: 'Lleva tu Negocio al Siguiente Nivel', subtitle: 'Nuestras herramientas te ayudarán a crecer.', buttonText: 'Saber Más', backgroundColor: 'bg-white', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen' } as CtaData }
    ]
  },
  footer: {
    name: 'Pie de Página', icon: '🦶', description: 'Sección final con copyright y enlaces.', renderer: FooterBlock, editor: FooterEditor,
    variants: [
      { name: 'Simple', description: 'Copyright y redes sociales.', preview: FooterPreviewSimple, defaultData: { variant: 'simple', copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, socialLinks: [{ platform: 'Twitter', url: '' }, { platform: 'Instagram', url: '' }] } as FooterData },
      { name: 'Multicolumna', description: 'Organiza enlaces en varias columnas.', preview: FooterPreviewMultiColumn, defaultData: { variant: 'multiColumn', copyrightText: `© ${new Date().getFullYear()} Mi Negocio.`, columns: [ { title: 'Producto', links: ['Características', 'Precios', 'FAQ'] }, { title: 'Compañía', links: ['Sobre nosotros', 'Contacto', 'Blog'] } ] } as FooterData },
      { name: 'Mínimo Centrado', description: 'Un pie de página discreto y centrado.', preview: FooterPreviewMinimal, defaultData: { variant: 'minimal', copyrightText: `© ${new Date().getFullYear()} Mi Negocio. Todos los derechos reservados.` } as FooterData }
    ]
  },
};

export type BlockType = keyof typeof BLOCKS;