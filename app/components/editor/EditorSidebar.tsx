'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
// Agregamos iconos para Páginas: FileText, Home, MoreVertical, Trash, Copy
import { LayoutTemplate, Grid, Plus, Search, ChevronDown, Palette, Type, MousePointer2, Check, FileText, Home, MoreVertical, Trash2, Copy } from 'lucide-react';
import { BLOCKS, BlockType } from '@/app/components/editor/blocks';
import { PREDEFINED_TEMPLATES, TEMPLATE_CATEGORIES } from '@/app/lib/templates-data';
import { COLOR_PALETTES, FONT_PAIRS } from '@/app/lib/design-system';

// --- MOCK DATA DE PÁGINAS (Simulación) ---
const MOCK_PAGES = [
    { id: '1', name: 'Inicio', slug: '/', isHome: true },
    { id: '2', name: 'Nosotros', slug: '/nosotros', isHome: false },
    { id: '3', name: 'Servicios', slug: '/servicios', isHome: false },
    { id: '4', name: 'Contacto', slug: '/contacto', isHome: false },
];

// ... (SidebarTemplatePreview se mantiene igual) ...
const SidebarTemplatePreview = ({ type }: { type: string }) => {
    // ... código anterior ...
    return <div className="w-full h-20 bg-slate-100 rounded border border-slate-200"></div>; // Placeholder corto
};

interface EditorSidebarProps {
    isOpen: boolean;
    onAddBlock: (type: BlockType) => void;
    onApplyTemplate: (templateKey: string) => void;
    onUpdateTheme?: (type: 'color' | 'font', value: string) => void;
    // Nuevas props para páginas
    activePageId?: string;
    onSelectPage?: (pageId: string) => void;
}

export function EditorSidebar({ isOpen, onAddBlock, onApplyTemplate, onUpdateTheme, activePageId = '1', onSelectPage }: EditorSidebarProps) {
    // Agregamos 'pages' a los tabs
    const [activeTab, setActiveTab] = useState<'pages' | 'templates' | 'components' | 'styles'>('pages'); // Pages por defecto ahora
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados locales
    const [activePalette, setActivePalette] = useState('ocean');
    const [activeFont, setActiveFont] = useState('modern');
    const [pages, setPages] = useState(MOCK_PAGES); // Estado local de páginas para simular añadir

    // ... (Lógica de categorías y filtros se mantiene igual) ...
    const blockCategories = ['Todos', 'Estructura', 'Principal', 'Contenido', 'Comercio', 'Interacción'];
    const currentCategories = activeTab === 'templates' ? TEMPLATE_CATEGORIES : blockCategories;
    
    const categorizedBlocks = React.useMemo(() => {
        return Object.entries(BLOCKS).reduce((acc, [key, blockInfo]) => {
            // @ts-ignore
            const cat = blockInfo.category || 'General';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ key, ...blockInfo });
            return acc;
        }, {} as Record<string, any[]>);
    }, []);

    const filteredTemplates = Object.entries(PREDEFINED_TEMPLATES).filter(([_, t]) => {
        const matchesCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddPage = () => {
        const newPage = { id: Date.now().toString(), name: 'Nueva Página', slug: '/nueva', isHome: false };
        setPages([...pages, newPage]);
    };

    return (
        <aside className={cn(
            "h-full z-30 transition-all duration-300 transform shadow-xl flex bg-[#F9FAFB] border-r border-slate-200", 
            isOpen ? "-translate-x-full absolute" : "translate-x-0 relative hidden md:flex" 
        )}>
            
            {/* 1. BARRA DE ACTIVIDAD (NAVEGACIÓN) */}
            <div className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-4 z-20 shrink-0">
                {/* TABS REORGANIZADOS: Estructura -> Diseño -> Bloques -> Estilo */}
                <NavButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={FileText} label="Páginas" />
                <div className="w-8 h-px bg-slate-100 my-1"></div>
                <NavButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={LayoutTemplate} label="Diseños" />
                <NavButton active={activeTab === 'components'} onClick={() => setActiveTab('components')} icon={Grid} label="Bloques" />
                <NavButton active={activeTab === 'styles'} onClick={() => setActiveTab('styles')} icon={Palette} label="Estilos" />
            </div>

            {/* 2. PANEL DE CONTENIDO */}
            <div className="w-[320px] bg-[#F9FAFB] flex flex-col h-full overflow-hidden">
                
                {/* HEADER */}
                <div className="px-5 pt-6 pb-2 shrink-0 bg-[#F9FAFB] z-10">
                    <div className="mb-4">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {activeTab === 'pages' ? 'Estructura' : activeTab === 'templates' ? 'Galería' : activeTab === 'components' ? 'Elementos' : 'Estilo Global'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            {activeTab === 'pages' ? 'Administra las páginas de tu sitio.'
                             : activeTab === 'templates' ? 'Elige una base visual.' 
                             : activeTab === 'components' ? 'Arrastra bloques a tu sitio.' 
                             : 'Personaliza tu marca.'}
                        </p>
                    </div>

                    {/* BUSCADOR (Solo para Templates y Componentes) */}
                    {(activeTab === 'templates' || activeTab === 'components') && (
                        /* ... (Mismo código de buscador que tenías antes) ... */
                        <div className="flex gap-2 items-center mb-2">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input type="text" placeholder="Buscar..." className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400"><ChevronDown className="w-3 h-3" /></div>
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="appearance-none pl-3 pr-7 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                                    {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* CONTENIDO */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-2 space-y-6">
                    
                    {/* --- NUEVO: GESTOR DE PÁGINAS --- */}
                    {activeTab === 'pages' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            
                            {/* LISTA DE PÁGINAS */}
                            <div className="space-y-2">
                                {pages.map((page) => (
                                    <div 
                                        key={page.id}
                                        onClick={() => onSelectPage && onSelectPage(page.id)}
                                        className={cn(
                                            "group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                            activePageId === page.id 
                                                ? "bg-white border-blue-500 ring-1 ring-blue-500 shadow-md z-10" 
                                                : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                page.isHome ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {page.isHome ? <Home className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className={cn("text-sm font-bold", activePageId === page.id ? "text-slate-900" : "text-slate-600")}>
                                                    {page.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-mono">
                                                    {page.slug}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Acciones (Solo visibles en hover o activo) */}
                                        <div className={cn("flex items-center opacity-0 group-hover:opacity-100 transition-opacity", activePageId === page.id && "opacity-100")}>
                                            <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-blue-600" title="Configurar">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* BOTÓN AÑADIR PÁGINA */}
                            <button 
                                onClick={handleAddPage}
                                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-bold text-xs hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Nueva Página
                            </button>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mt-4">
                                <h4 className="text-xs font-bold text-blue-800 mb-1">Estructura del Sitio</h4>
                                <p className="text-[10px] text-blue-600 leading-relaxed">
                                    Define la jerarquía de tu web. La página con el icono de casa será tu portada.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- PLANTILLAS --- */}
                    {activeTab === 'templates' && (
                        /* ... (Mismo código anterior para grid de plantillas) ... */
                        <div className="grid gap-5">
                            {filteredTemplates.map(([key, template]) => (
                                <div key={key} onClick={() => onApplyTemplate(key)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all relative">
                                    <div className="p-3 bg-slate-50/50 border-b border-slate-100"><div className="w-full h-20 bg-slate-200 rounded"></div></div> {/* Placeholder preview */}
                                    <div className="p-3 flex justify-between items-center">
                                        <div><span className="font-bold text-sm text-slate-800 block">{template.name}</span><span className="text-[10px] font-bold text-slate-400">{template.category}</span></div>
                                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- COMPONENTES --- */}
                    {activeTab === 'components' && (
                        /* ... (Mismo código anterior para lista de bloques) ... */
                        <div className="space-y-6">
                            {blockCategories.filter(cat => cat !== 'Todos' && (selectedCategory === 'Todos' || selectedCategory === cat)).map(cat => {
                                // @ts-ignore
                                const blocks = categorizedBlocks[cat] || [];
                                const searchBlocks = blocks.filter((b: any) => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                if (searchBlocks.length === 0) return null;
                                return (
                                    <div key={cat}>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">{cat}</h3>
                                        <div className="space-y-2">
                                            {searchBlocks.map((blockInfo: any) => {
                                                const Icon = blockInfo.icon;
                                                return (
                                                    <button key={blockInfo.key} onClick={() => onAddBlock(blockInfo.key as BlockType)} className="w-full p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-center gap-3">
                                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-50", blockInfo.theme?.bg)}>{Icon && <Icon className="w-4 h-4" />}</div>
                                                        <p className="font-bold text-xs text-slate-700">{blockInfo.name}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* --- ESTILOS --- */}
                    {activeTab === 'styles' && (
                        /* ... (Mismo código anterior para estilos) ... */
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Colores</h3>
                                <div className="grid gap-2">{COLOR_PALETTES.map(p => <button key={p.id} className="w-full p-2 border rounded-lg bg-white text-xs font-bold text-left">{p.name}</button>)}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

// Botón de navegación (sin cambios)
const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={cn("w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group relative", active ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")} title={label}>
        <Icon className={cn("w-5 h-5", active ? "stroke-2" : "stroke-1.5")} />
    </button>
);