'use client';
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
// Agregamos ArrowLeft para el botón "Atrás"
import { 
    LayoutTemplate, Grid, Plus, Search, ChevronRight, ArrowLeft, 
    Palette, Type, MousePointer2, Check, FileText, Home, MoreVertical, 
    Image as ImageIcon, Box, ShoppingBag, MessageSquare
} from 'lucide-react';
import { BLOCKS, BlockType } from '@/app/components/editor/blocks';
import { PREDEFINED_TEMPLATES, TEMPLATE_CATEGORIES } from '@/app/lib/templates-data';
import { COLOR_PALETTES, FONT_PAIRS } from '@/app/lib/design-system';
import { BLOCK_VARIANTS, BlockVariant } from '@/app/lib/block-variants';

// --- DEFINICIÓN DE "CARPETAS" (GRUPOS DE BLOQUES) ---
// Esto define qué botones salen en el Nivel 1
const BLOCK_FOLDERS = [
    { 
        id: 'hero', 
        name: 'Portadas (Hero)', 
        icon: LayoutTemplate, 
        // Incluye TODOS los blockTypes relacionados con Hero
        blockTypes: ['hero', 'hero_decision'],
        count: BLOCK_VARIANTS.filter(v => ['hero', 'hero_decision'].includes(v.blockType)).length 
    },
    { 
        id: 'header', 
        name: 'Encabezados', 
        icon: Box, 
        blockTypes: ['header'],
        count: BLOCK_VARIANTS.filter(v => v.blockType === 'header').length 
    },
    { 
        id: 'product', 
        name: 'Productos', 
        icon: ShoppingBag, 
        blockTypes: ['catalog', 'featuredProduct'],
        count: BLOCK_VARIANTS.filter(v => ['catalog', 'featuredProduct'].includes(v.blockType)).length 
    },
    { 
        id: 'text', 
        name: 'Texto y Títulos', 
        icon: Type, 
        blockTypes: ['text'],
        count: BLOCK_VARIANTS.filter(v => v.blockType === 'text').length
    },
    { 
        id: 'image', 
        name: 'Galerías', 
        icon: ImageIcon, 
        blockTypes: ['image', 'gallery'],
        count: BLOCK_VARIANTS.filter(v => ['image', 'gallery'].includes(v.blockType)).length
    },
    { 
        id: 'form', 
        name: 'Formularios', 
        icon: MessageSquare, 
        blockTypes: ['form'],
        count: 0 
    },
];

// ... (SidebarTemplatePreview se mantiene igual) ...
const SidebarTemplatePreview = ({ type }: { type: string }) => {
   // ... (tu código anterior)
   return <div className="w-full h-full bg-slate-100"></div>; 
};

interface EditorSidebarProps {
    isOpen: boolean;
    onAddBlock: (type: BlockType, initialData?: any) => void;
    onApplyTemplate: (templateKey: string) => void;
    onUpdateTheme?: (type: 'color' | 'font', value: string) => void;
    activePageId?: string;
    onSelectPage?: (pageId: string) => void;
}

export function EditorSidebar({ isOpen, onAddBlock, onApplyTemplate, onUpdateTheme, activePageId = '1', onSelectPage }: EditorSidebarProps) {
    const [activeTab, setActiveTab] = useState<'pages' | 'templates' | 'components' | 'styles'>('components');
    const [searchTerm, setSearchTerm] = useState('');
    
    // ESTADOS PARA NAVEGACIÓN POR CARPETAS (Drill-down)
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null); // null = viendo carpetas
    
    // Estados visuales locales
    const [activePalette, setActivePalette] = useState('ocean');
    const [activeFont, setActiveFont] = useState('modern');

    // Filtrar plantillas (lógica anterior)
    const filteredTemplates = Object.entries(PREDEFINED_TEMPLATES).filter(([_, t]) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtrar Variantes dentro de la carpeta activa
    const currentFolderVariants = useMemo(() => {
        if (!activeFolderId) return [];
        const folder = BLOCK_FOLDERS.find(f => f.id === activeFolderId);
        if (!folder) return [];
        // Filtra por TODOS los blockTypes de la carpeta
        return BLOCK_VARIANTS.filter(v => folder.blockTypes.includes(v.blockType));
    }, [activeFolderId]);

    return (
        <aside className={cn(
            "h-full z-30 transition-all duration-300 transform shadow-xl flex bg-[#F9FAFB] border-r border-slate-200", 
            isOpen ? "-translate-x-full absolute" : "translate-x-0 relative hidden md:flex" 
        )}>
            
            {/* 1. BARRA DE ACTIVIDAD (NAVEGACIÓN) */}
            <div className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-4 z-20 shrink-0">
                <NavButton active={activeTab === 'pages'} onClick={() => { setActiveTab('pages'); setActiveFolderId(null); }} icon={FileText} label="Páginas" />
                <div className="w-8 h-px bg-slate-100 my-1"></div>
                <NavButton active={activeTab === 'templates'} onClick={() => { setActiveTab('templates'); setActiveFolderId(null); }} icon={LayoutTemplate} label="Diseños" />
                <NavButton active={activeTab === 'components'} onClick={() => setActiveTab('components')} icon={Grid} label="Bloques" />
                <NavButton active={activeTab === 'styles'} onClick={() => { setActiveTab('styles'); setActiveFolderId(null); }} icon={Palette} label="Estilos" />
            </div>

            {/* 2. PANEL DE CONTENIDO */}
            <div className="w-[320px] bg-[#F9FAFB] flex flex-col h-full overflow-hidden relative">
                
                {/* HEADER COMÚN */}
                <div className="px-5 pt-6 pb-2 shrink-0 bg-[#F9FAFB] z-10 border-b border-transparent">
                    
                    {/* Caso Especial: Header cuando estamos DENTRO de una carpeta de bloques */}
                    {activeTab === 'components' && activeFolderId ? (
                        <div className="animate-in slide-in-from-right-10 duration-200">
                            <button 
                                onClick={() => setActiveFolderId(null)} 
                                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold mb-3 transition-colors group"
                            >
                                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Volver a Bloques
                            </button>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {BLOCK_FOLDERS.find(f => f.id === activeFolderId)?.name}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Selecciona una variante.</p>
                        </div>
                    ) : (
                        // Header Normal
                        <div className="animate-in slide-in-from-left-10 duration-200">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {activeTab === 'pages' ? 'Estructura' : activeTab === 'templates' ? 'Galería' : activeTab === 'components' ? 'Biblioteca' : 'Estilo Global'}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                {activeTab === 'components' ? 'Explora por categorías.' : 'Configuración general.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* CONTENIDO SCROLLABLE */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-4 space-y-6">
                    
                    {/* --- VISTA: BLOQUES (SISTEMA DE CARPETAS) --- */}
                    {activeTab === 'components' && (
                        <div className="relative">
                            
                            {/* NIVEL 1: LAS CARPETAS (Grid de Categorías) */}
                            {!activeFolderId && (
                                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-left-8 duration-300">
                                    {BLOCK_FOLDERS.map((folder) => (
                                        <button 
                                            key={folder.id}
                                            onClick={() => setActiveFolderId(folder.id)}
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all group aspect-[4/3]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mb-2 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <folder.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">{folder.name}</span>
                                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">{folder.count} estilos</span>
                                        </button>
                                    ))}
                                    {/* Carpeta "Todos" o búsqueda global futura */}
                                </div>
                            )}

                            {/* NIVEL 2: EL CONTENIDO (Grid de Previews) */}
                            {activeFolderId && (
                                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-8 duration-300">
                                    {currentFolderVariants.length > 0 ? currentFolderVariants.map((variant) => (
                                        <button 
                                            key={variant.id} 
                                            onClick={() => onAddBlock(variant.blockType, variant.initialData)}
                                            className="group relative rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 hover:shadow-xl transition-all overflow-hidden text-left"
                                        >
                                            {/* Preview Area */}
                                            <div className="w-full aspect-[2/1] bg-slate-50 border-b border-slate-100 group-hover:bg-white transition-colors">
                                                {variant.preview}
                                            </div>
                                            
                                            {/* Info Area */}
                                            <div className="p-3 flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-xs text-slate-800 block group-hover:text-blue-700">{variant.name}</span>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <Plus className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </button>
                                    )) : (
                                        <div className="text-center py-10 opacity-50">
                                            <p className="text-xs">Próximamente más variantes.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- OTROS TABS (Se mantienen igual) --- */}
                    
                    {activeTab === 'pages' && (
                        /* ... (Mismo código de Páginas) ... */
                        <div className="space-y-2">
                             {/* ... map pages ... */}
                             <div className="text-center p-4 bg-slate-100 rounded-lg text-xs text-slate-500">Gestor de Páginas</div>
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        /* ... (Mismo código de Templates) ... */
                        <div className="grid gap-4">
                             {filteredTemplates.map(([k, t]) => (
                                 <div key={k} className="h-24 bg-white border rounded-xl flex items-center justify-center text-xs font-bold">{t.name}</div>
                             ))}
                        </div>
                    )}

                    {activeTab === 'styles' && (
                        /* ... (Mismo código de Estilos) ... */
                         <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase text-slate-400">Paletas</h3>
                            <div className="grid gap-2">{COLOR_PALETTES.map(p => <div key={p.id} className="p-2 border rounded bg-white text-xs">{p.name}</div>)}</div>
                         </div>
                    )}

                </div>
            </div>
        </aside>
    );
}

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={cn("w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group relative", active ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")} title={label}>
        <Icon className={cn("w-5 h-5", active ? "stroke-2" : "stroke-1.5")} />
    </button>
);