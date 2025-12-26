'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
    LayoutTemplate, Grid, Plus, Search, ChevronRight, ArrowLeft, X,
    Palette, Type, FileText, Home, Box, ShoppingBag, MessageSquare,
    ShieldCheck, Zap, HelpCircle, Image as ImageIcon, MoreVertical, Check
} from 'lucide-react';
import { BLOCKS, BlockType, Block } from '@/app/components/editor/blocks';
import { PREDEFINED_TEMPLATES, TEMPLATE_CATEGORIES } from '@/app/lib/templates-data';
import { COLOR_PALETTES, FONT_PAIRS } from '@/app/lib/design-system';
import { BLOCK_VARIANTS } from '@/app/lib/block-variants';

// --- CONFIGURACIÓN DE CARPETAS ---
const BLOCK_FOLDERS = [
    { id: 'hero_group', name: 'Portadas (Hero)', icon: LayoutTemplate, blockTypes: ['hero', 'hero_decision', 'hero_video', 'hero_split', 'hero_whatsapp', 'hero_countdown'] },
    { id: 'commerce_group', name: 'Comercio', icon: ShoppingBag, blockTypes: ['catalog', 'pricing', 'featured_product'] },
    { id: 'trust_group', name: 'Confianza', icon: ShieldCheck, blockTypes: ['testimonials', 'benefits', 'logos'] },
    { id: 'cta_group', name: 'Conversión', icon: Zap, blockTypes: ['cta_banner', 'countdown', 'newsletter'] },
    { id: 'info_group', name: 'Información', icon: HelpCircle, blockTypes: ['faq', 'steps', 'text_rich'] },
    { id: 'structure_group', name: 'Estructura', icon: Box, blockTypes: ['header', 'footer'] },
    { id: 'media_group', name: 'Multimedia', icon: ImageIcon, blockTypes: ['gallery', 'video_player'] }
];

const DEFAULT_PAGES = [
    { id: '1', name: 'Inicio', slug: '/', isHome: true },
    { id: '2', name: 'Tienda', slug: '/shop', isHome: false },
    { id: '3', name: 'Contacto', slug: '/contact', isHome: false },
];

const SidebarTemplatePreview = ({ type }: { type: string }) => {
    switch (type) {
        case 'fashion': return <div className="w-full h-full bg-rose-50 border border-rose-100 flex flex-col gap-1 p-2"><div className="w-full h-1.5 bg-rose-200 mb-1 rounded-full"></div><div className="flex-1 bg-white border border-rose-100 rounded-sm"></div></div>;
        case 'food': return <div className="w-full h-full bg-orange-50 border border-orange-100 flex flex-col gap-1 p-2"><div className="w-1/2 h-1.5 bg-orange-200 rounded-full"></div><div className="flex gap-1 h-full"><div className="w-2/3 bg-white border border-orange-100 rounded-sm"></div></div></div>;
        case 'tech': return <div className="w-full h-full bg-slate-900 border border-slate-700 flex flex-col gap-1 p-2"><div className="w-full h-1.5 bg-blue-500 mb-1 rounded-full"></div><div className="grid grid-cols-2 gap-1 h-full"><div className="bg-slate-800 rounded-sm"></div><div className="bg-slate-800 rounded-sm"></div></div></div>;
        default: return <div className="w-full h-full bg-slate-100 flex items-center justify-center"><LayoutTemplate className="w-6 h-6 text-slate-300" /></div>;
    }
};

interface EditorSidebarProps {
    isOpen: boolean;
    onAddBlock: (type: BlockType, initialData?: any) => void;
    onApplyTemplate: (templateKey: string) => void;
    onUpdateTheme?: (type: 'color' | 'font', value: string) => void;
    activePageId?: string;
    onSelectPage?: (pageId: string) => void;
    editingBlock?: Block | null;
    onCloseEditor?: () => void;
    onUpdateBlock?: (blockId: number, key: string, value: any) => void;
}

export function EditorSidebar({ 
    isOpen, onAddBlock, onApplyTemplate, onUpdateTheme, 
    activePageId = '1', onSelectPage,
    editingBlock, onCloseEditor, onUpdateBlock 
}: EditorSidebarProps) {
    
    const isEditingMode = !!editingBlock;
    const [activeTab, setActiveTab] = useState<'components' | 'pages' | 'templates' | 'styles'>('components');
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [activePalette, setActivePalette] = useState('ocean');
    const [activeFont, setActiveFont] = useState('modern');
    const [pages, setPages] = useState(DEFAULT_PAGES);

    const currentFolderVariants = useMemo(() => {
        if (!activeFolderId) return [];
        const folder = BLOCK_FOLDERS.find(f => f.id === activeFolderId);
        if (!folder) return [];
        return BLOCK_VARIANTS.filter(v => folder.blockTypes.includes(v.blockType));
    }, [activeFolderId]);

    const filteredTemplates = Object.entries(PREDEFINED_TEMPLATES).filter(([_, t]) => {
        const matchesCat = selectedCategory === 'Todos' || t.category === selectedCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const renderEditorPanel = () => {
        if (!editingBlock) return null;
        const BlockConfig = BLOCKS[editingBlock.type];
        if (!BlockConfig) return <div className="p-8 text-center text-slate-400 text-xs">Error: Bloque no encontrado.</div>;
        const EditorComponent = BlockConfig.editor;

        return (
            <div className="flex flex-col h-full bg-white animate-in slide-in-from-left-5 duration-300">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onCloseEditor} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div><h3 className="text-sm font-black text-slate-900">Editar {BlockConfig.name}</h3></div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    {EditorComponent ? (
                        <EditorComponent data={editingBlock.data} updateData={(key: string, value: any) => onUpdateBlock && onUpdateBlock(editingBlock.id, key, value)} />
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">Sin opciones editables.</div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
                    <button className="w-full py-2.5 text-red-500 text-xs font-bold border border-red-200 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2 transition-colors">
                         <X className="w-3 h-3" /> Eliminar Bloque
                    </button>
                </div>
            </div>
        );
    };

    return (
        // AQUÍ ESTÁ EL CAMBIO IMPORTANTE: "hidden md:flex"
        // Esto oculta el sidebar en móviles (hidden) y lo muestra en escritorio (md:flex)
        <aside className={cn(
            "hidden md:flex h-full z-30 bg-[#F9FAFB] border-r border-slate-200 transition-all duration-300 shadow-xl", 
            isOpen ? "translate-x-0" : "-translate-x-full absolute" 
        )}>
            
            {/* 1. BARRA DE ICONOS */}
            <div className={cn(
                "w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-4 z-20 shrink-0 transition-all duration-300",
                isEditingMode ? "w-0 opacity-0 overflow-hidden border-none px-0" : "w-[72px] opacity-100"
            )}>
                <NavButton active={activeTab === 'pages'} onClick={() => { setActiveTab('pages'); setActiveFolderId(null); }} icon={FileText} label="Páginas" />
                <div className="w-8 h-px bg-slate-100 my-1"></div>
                <NavButton active={activeTab === 'templates'} onClick={() => { setActiveTab('templates'); setActiveFolderId(null); }} icon={LayoutTemplate} label="Diseños" />
                <NavButton active={activeTab === 'components'} onClick={() => setActiveTab('components')} icon={Grid} label="Bloques" />
                <NavButton active={activeTab === 'styles'} onClick={() => { setActiveTab('styles'); setActiveFolderId(null); }} icon={Palette} label="Estilos" />
            </div>

            {/* 2. PANEL DESLIZANTE */}
            <div className={cn(
                "bg-[#F9FAFB] flex flex-col h-full overflow-hidden relative transition-all duration-300",
                isEditingMode ? "w-[360px] bg-white" : "w-[320px]"
            )}>
                
                {isEditingMode ? renderEditorPanel() : (
                    <>
                        <div className="px-5 pt-6 pb-4 shrink-0 bg-[#F9FAFB] z-10">
                             {activeTab === 'components' && activeFolderId ? (
                                <div className="animate-in slide-in-from-right-4 duration-200">
                                    <button onClick={() => setActiveFolderId(null)} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold mb-3 transition-colors group">
                                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Volver
                                    </button>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{BLOCK_FOLDERS.find(f => f.id === activeFolderId)?.name}</h2>
                                </div>
                             ) : (
                                <div className="animate-in slide-in-from-left-4 duration-200">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                        {activeTab === 'pages' ? 'Estructura' : activeTab === 'templates' ? 'Galería' : activeTab === 'components' ? 'Biblioteca' : 'Estilo Global'}
                                    </h2>
                                </div>
                             )}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-0 space-y-6">
                            {activeTab === 'components' && (
                                <div>
                                    {!activeFolderId && (
                                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                            {BLOCK_FOLDERS.map((folder) => {
                                                const count = BLOCK_VARIANTS.filter(v => folder.blockTypes.includes(v.blockType)).length;
                                                return (
                                                    <button key={folder.id} onClick={() => setActiveFolderId(folder.id)} className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all group aspect-[4/3]">
                                                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mb-2 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"><folder.icon className="w-5 h-5" /></div>
                                                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 text-center leading-tight">{folder.name}</span>
                                                        <span className="text-[10px] text-slate-400 mt-1">{count} estilos</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {activeFolderId && (
                                        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                            {currentFolderVariants.length > 0 ? currentFolderVariants.map((variant) => (
                                                <button key={variant.id} onClick={() => onAddBlock(variant.blockType, variant.initialData)} className="group relative w-full rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 hover:shadow-lg transition-all overflow-hidden text-left">
                                                    <div className="w-full aspect-[2/1] bg-slate-50 border-b border-slate-100 group-hover:bg-white transition-colors overflow-hidden relative">
                                                        <div className="absolute inset-0 flex items-center justify-center transform scale-90">{variant.preview}</div>
                                                    </div>
                                                    <div className="p-3 flex justify-between items-center"><span className="font-bold text-xs text-slate-800 group-hover:text-blue-700">{variant.name}</span><Plus className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" /></div>
                                                </button>
                                            )) : <div className="text-center py-10 opacity-50 text-xs">No hay variantes disponibles.</div>}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === 'pages' && (
                                <div className="space-y-3 animate-in fade-in">
                                    <div className="space-y-2">{pages.map((page) => (<div key={page.id} onClick={() => onSelectPage && onSelectPage(page.id)} className={cn("group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-sm", activePageId === page.id ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-slate-200 hover:border-blue-300")}><div className="flex items-center gap-3"><div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", page.isHome ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-500")}>{page.isHome ? <Home className="w-4 h-4" /> : <FileText className="w-4 h-4" />}</div><div><p className={cn("text-xs font-bold", activePageId === page.id ? "text-slate-900" : "text-slate-700")}>{page.name}</p><p className="text-[10px] text-slate-400 font-mono">{page.slug}</p></div></div><button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"><MoreVertical className="w-3.5 h-3.5" /></button></div>))}</div>
                                    <button className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-bold text-xs hover:border-blue-400 hover:text-blue-600 hover:bg-white transition-all"><Plus className="w-3.5 h-3.5" /> Añadir Página</button>
                                </div>
                            )}

                            {activeTab === 'templates' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" placeholder="Buscar diseño..." className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                                    <div className="grid gap-4">{filteredTemplates.map(([key, template]) => (<div key={key} onClick={() => onApplyTemplate(key)} className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all relative"><div className="aspect-video bg-slate-50 border-b border-slate-100 group-hover:opacity-90 transition-opacity"><SidebarTemplatePreview type={template.type} /></div><div className="p-3 flex justify-between items-center"><div><span className="font-bold text-xs text-slate-800 block">{template.name}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{template.category}</span></div><div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Plus className="w-3.5 h-3.5" /></div></div></div>))}</div>
                                </div>
                            )}

                            {activeTab === 'styles' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="space-y-3"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Palette className="w-3 h-3" /> Colores</h3><div className="grid gap-2">{COLOR_PALETTES.map((palette) => (<button key={palette.id} onClick={() => { setActivePalette(palette.id); if(onUpdateTheme) onUpdateTheme('color', palette.id); }} className={cn("w-full p-2 rounded-lg border flex items-center gap-3 transition-all bg-white hover:border-blue-300", activePalette === palette.id ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200")}><div className="flex -space-x-1">{palette.colors.map((c, i) => <div key={i} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }}></div>)}</div><span className="text-xs font-bold text-slate-700">{palette.name}</span>{activePalette === palette.id && <Check className="w-3 h-3 text-blue-500 ml-auto" />}</button>))}</div></div>
                                    <div className="space-y-3"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Type className="w-3 h-3" /> Tipografía</h3><div className="grid gap-2">{FONT_PAIRS.map((font) => (<button key={font.id} onClick={() => { setActiveFont(font.id); if(onUpdateTheme) onUpdateTheme('font', font.id); }} className={cn("w-full p-3 rounded-lg border text-left transition-all bg-white hover:border-blue-300 flex justify-between items-center", activeFont === font.id ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200")}><div><p className="text-sm leading-none text-slate-900 mb-0.5" style={{ fontFamily: font.title === 'Inter' ? 'sans-serif' : 'serif' }}>Aa</p><p className="text-[10px] text-slate-500 font-bold">{font.name}</p></div>{activeFont === font.id && <Check className="w-3 h-3 text-blue-500" />}</button>))}</div></div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={cn("w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group relative", active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")} title={label}>
        <Icon className={cn("w-5 h-5", active ? "stroke-2" : "stroke-1.5")} />
    </button>
);