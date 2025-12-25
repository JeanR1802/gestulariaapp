import { Block } from "@/app/components/editor/blocks";

export const TEMPLATE_CATEGORIES = ['Todos', 'Moda', 'Comida', 'Tech', 'Servicios', 'Portafolio'];

export const PREDEFINED_TEMPLATES: Record<string, { name: string; type: string; category: string; blocks: Block[] }> = {
    fashion_minimal: {
        name: 'Moda Minimal',
        type: 'fashion',
        category: 'Moda',
        blocks: [
            { id: 1, type: 'header', data: { title: 'MODA', align: 'center' } },
            { id: 2, type: 'hero', data: { title: 'Nueva Colección', subtitle: 'Elegancia pura.', align: 'center', height: 'large' } },
            { id: 3, type: 'gallery', data: { title: 'Lookbook 2025' } },
            { id: 4, type: 'footer', data: { text: '© 2025 Moda Inc.' } }
        ]
    },
    food_burger: {
        name: 'Burger House',
        type: 'food',
        category: 'Comida',
        blocks: [
            { id: 1, type: 'header', data: { title: 'Burger House', align: 'left' } },
            { id: 2, type: 'hero', data: { title: 'Hamburguesas Reales', subtitle: '100% Carne Angus.', align: 'left' } },
            { id: 3, type: 'featured', data: { productName: 'La Bestia', price: '$12.99' } },
            { id: 4, type: 'footer', data: { text: 'Delivery 24/7' } }
        ]
    },
    tech_saas: {
        name: 'SaaS Startup',
        type: 'tech',
        category: 'Tech',
        blocks: [
            { id: 1, type: 'header', data: { title: 'SoftCorp', align: 'right' } },
            { id: 2, type: 'hero', data: { title: 'Automatiza todo', subtitle: 'IA para tu negocio.', align: 'center' } },
            { id: 3, type: 'pricing', data: { title: 'Precios' } },
            { id: 4, type: 'footer', data: { text: 'Contacto' } }
        ]
    }
    // Aquí puedes agregar 20 o 50 más sin ensuciar el editor
};