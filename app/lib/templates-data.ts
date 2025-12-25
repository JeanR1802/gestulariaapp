import { Block } from "@/app/components/editor/blocks";

export const TEMPLATE_CATEGORIES = ['Todos', 'Moda', 'Comida', 'Tech', 'Servicios', 'Portafolio'];

export const PREDEFINED_TEMPLATES: Record<string, { name: string; type: string; category: string; blocks: Block[] }> = {
    fashion_minimal: {
        name: 'Moda Minimal',
        type: 'fashion',
        category: 'Moda',
        blocks: [
            { id: 1, type: 'header', data: { title: 'MODA', align: 'center', variant: 'transparent' } },
            { id: 2, type: 'hero', data: { title: 'Nueva Colección', subtitle: 'Elegancia pura para esta temporada.', align: 'center', height: 'large', overlayOpacity: 20 } },
            { id: 3, type: 'gallery', data: { title: 'Lookbook 2025', columns: 3 } },
            { id: 4, type: 'text', data: { content: 'Descubre la calidad de nuestros materiales.', align: 'center' } },
            { id: 5, type: 'footer', data: { text: '© 2025 Moda Inc.', backgroundColor: '#000000', textColor: '#ffffff' } }
        ]
    },
    food_burger: {
        name: 'Burger House',
        type: 'food',
        category: 'Comida',
        blocks: [
            { id: 1, type: 'header', data: { title: 'Burger House', align: 'left', backgroundColor: '#ff9800' } },
            { id: 2, type: 'hero', data: { title: 'Hamburguesas Reales', subtitle: '100% Carne Angus a la parrilla.', align: 'left', height: 'medium' } },
            { id: 3, type: 'featured', data: { productName: 'La Bestia', price: '$12.99', description: 'Doble carne, doble queso.' } },
            { id: 4, type: 'cta', data: { title: 'Pide a Domicilio', buttonText: 'Ordenar Ahora', buttonUrl: '#' } },
            { id: 5, type: 'footer', data: { text: 'Delivery 24/7 - Llámanos', backgroundColor: '#333333' } }
        ]
    },
    tech_saas: {
        name: 'SaaS Startup',
        type: 'tech',
        category: 'Tech',
        blocks: [
            { id: 1, type: 'header', data: { title: 'SoftCorp', align: 'right', variant: 'sticky' } },
            { id: 2, type: 'hero', data: { title: 'Automatiza todo', subtitle: 'IA avanzada para escalar tu negocio.', align: 'center', height: 'large' } },
            { id: 3, type: 'stack', data: { title: 'Tecnologías que usamos' } },
            { id: 4, type: 'pricing', data: { title: 'Planes Mensuales', price: '$29' } },
            { id: 5, type: 'footer', data: { text: 'Contacto: hello@novatech.com' } }
        ]
    },
    services_agency: {
        name: 'Agencia Creativa',
        type: 'services',
        category: 'Servicios',
        blocks: [
            { id: 1, type: 'header', data: { title: 'Studio', align: 'left' } },
            { id: 2, type: 'hero', data: { title: 'Creamos Marcas', subtitle: 'Diseño estratégico para líderes.', align: 'left' } },
            { id: 3, type: 'text', data: { content: 'Nuestros servicios incluyen branding, web y marketing.', align: 'left' } },
            { id: 4, type: 'team', data: { title: 'Nuestro Equipo' } },
            { id: 5, type: 'footer', data: { text: 'Hablemos de tu proyecto.' } }
        ]
    }
};