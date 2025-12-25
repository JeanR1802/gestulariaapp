'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, LayoutTemplate, Grid, ChevronDown, Plus, Palette, Type, Check, FileText, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOCKS, BlockType } from '@/app/components/editor/blocks';
import { PREDEFINED_TEMPLATES, TEMPLATE_CATEGORIES } from '@/app/lib/templates-data';
import { COLOR_PALETTES, FONT_PAIRS } from '@/app/lib/design-system';

// Mock Pages (idealmente vendrían por props)
const MOCK_PAGES = [
    { id: '1', name: 'Inicio', slug: '/', isHome: true },
    { id: '2', name: 'Nosotros', slug: '/nosotros', isHome: false },
    { id: '3', name: 'Contacto', slug: '/contacto', isHome: false },
];

// ... (El componente MobileTemplatePreview se mantiene igual que en el código anterior) ...
const MobileTemplatePreview = ({ type }: { type: string }) => {
    /* ... código de preview ... */
    switch (type) {
        case 'fashion': return <div className="w-full h-20 bg-rose-50 border border-rose-100 flex flex-col gap-1 p-2 rounded-lg overflow-hidden"><div className="w-full h-1.5 bg-rose-200 mb-1 rounded-full"></div><div className="flex-1 bg-white border border-rose-100 rounded-sm"></div></div>;
        case 'food': return <div className="w-full h-20 bg-orange-50 border border-orange-100 flex flex-col gap-1 p-2 rounded-lg"><div className="w-1/2 h-1.5 bg-orange-200 rounded-full"></div><div className="flex gap-1 h-full"><div className="w-2/3 bg-white border border-orange-100 rounded-sm"></div><div className="w-1/3 bg-orange-200 rounded-full opacity-50"></div></div></div>;
        case 'tech': return <div className="w-full h-20 bg-slate-900 border border-slate-700 flex flex-col gap-1 p-2 rounded-lg"><div className="w-full h-1.5 bg-blue-500 mb-1 rounded-full"></div><div className="grid grid-cols-2 gap-1 h-full"><div className="bg-slate-800 rounded-sm"></div><div className="bg-slate-800 rounded-sm"></div></div></div>;
        case 'services': return <div className="w-full h-20 bg-blue-50 border border-blue-100 flex flex-col gap-1 p-2 rounded-lg"><div className="w-1/3 h-1.5 bg-blue-200 mb-1 rounded-full"></div><div className="flex-1 bg-white border border-blue-100 rounded-sm"></div></div>;
        default: return <div className="w-full h-20 bg-slate-100 rounded-lg border border-slate-200"></div>;
    }
};

interface MobileAddComponentPanelProps {
    onClose: () => void;
    onSelectBlock: (type: BlockType) => void;
    onApplyTemplate: (templateKey: string) => void;
    onUpdateTheme?: (type: 'color' | 'font', value: string) => void;
}

export function MobileAddComponentPanel({ onClose, onSelectBlock, onApplyTemplate, onUpdateTheme }: MobileAddComponentPanelProps) {
    const [activeTab, setActiveTab] = useState<'pages' | 'templates' | 'components' | 'styles'>('pages');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    
    // Estados locales para feedback visual
    const [activePalette, setActivePalette] = useState('ocean');
    const [activeFont, setActiveFont] = useState('modern');

    useEffect(() => { requestAnimationFrame(() => setIsVisible(true)); }, []);
    const handleClose = () => { setIsVisible(false); setTimeout(onClose, 300); };

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

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:hidden">
            <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0")} onClick={handleClose} />
            
            <div className={cn("relative w-full h-[85vh] bg-[#F9FAFB] rounded-t-[2rem] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform", isVisible ? "translate-y-0" : "translate-y-full")}>
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1" onClick={handleClose}><div className="w-12 h-1.5 bg-slate-300 rounded-full"></div></div>

                {/* Header */}
                <div className="px-5 pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">
                        {activeTab === 'pages' ? 'Páginas' : activeTab === 'templates' ? 'Diseños' : activeTab === 'components' ? 'Bloques' : 'Personalizar'}
                    </h2>
                    <button onClick={handleClose} className="p-2 bg-slate-200 rounded-full text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                {/* TABS */}
                <div className="px-5 pb-4">
                    <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button onClick={() => setActiveTab('pages')} className={cn("py-2.5 text-[10px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all", activeTab === 'pages' ? "bg-blue-600 text-white shadow-md" : "text-slate-500")}>
                            <FileText className="w-4 h-4" /> Páginas
                        </button>
                        <button onClick={() => { setActiveTab('templates'); setSelectedCategory('Todos'); }} className={cn("py-2.5 text-[10px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all", activeTab === 'templates' ? "bg-blue-600 text-white shadow-md" : "text-slate-500")}>
                            <LayoutTemplate className="w-4 h-4" /> Diseños
                        </button>
                        <button onClick={() => { setActiveTab('components'); setSelectedCategory('Todos'); }} className={cn("py-2.5 text-[10px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all", activeTab === 'components' ? "bg-blue-600 text-white shadow-md" : "text-slate-500")}>
                            <Grid className="w-4 h-4" /> Bloques
                        </button>
                        <button onClick={() => setActiveTab('styles')} className={cn("py-2.5 text-[10px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all", activeTab === 'styles' ? "bg-blue-600 text-white shadow-md" : "text-slate-500")}>
                            <Palette className="w-4 h-4" /> Estilos
                        </button>
                    </div>
                </div>

                {/* FILTROS (No visible en estilos ni páginas) */}
                {activeTab !== 'styles' && activeTab !== 'pages' && (
                    <div className="px-5 pb-3 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Buscar..." className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="relative w-1/3">
                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-500"><ChevronDown className="w-4 h-4" /></div>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full h-full appearance-none pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                                {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* CONTENIDO MÓVIL SCROLLABLE */}
                <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-4 no-scrollbar">
                    
                    {/* PAGINAS (MOVIL) */}
                    {activeTab === 'pages' && (
                        <div className="space-y-3">
                            {MOCK_PAGES.map((page) => (
                                <div key={page.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm active:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", page.isHome ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500")}>
                                            {page.isHome ? <Home className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{page.name}</p>
                                            <p className="text-xs text-slate-400">{page.slug}</p>
                                        </div>
                                    </div>
                                    {/* Botón de acción simple */}
                                    <button className="text-blue-600 text-xs font-bold px-3 py-1 bg-blue-50 rounded-lg">Editar</button>
                                </div>
                            ))}
                            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg mt-4">
                                <Plus className="w-4 h-4" /> Crear Página
                            </button>
                        </div>
                    )}

                    {/* PLANTILLAS */}
                    {activeTab === 'templates' && (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredTemplates.map(([key, template]) => (
                                <button key={key} onClick={() => onApplyTemplate(key)} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm active:scale-95 transition-transform text-left flex flex-col">
                                    <div className="p-2 bg-slate-50 border-b border-slate-100"><MobileTemplatePreview type={template.type} /></div>
                                    <div className="p-3"><span className="font-bold text-sm text-slate-800 block truncate">{template.name}</span><span className="text-[10px] font-bold text-slate-400 uppercase">{template.category}</span></div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* BLOQUES */}
                    {activeTab === 'components' && (
                        <div className="space-y-6">
                            {blockCategories.filter(cat => cat !== 'Todos' && (selectedCategory === 'Todos' || selectedCategory === cat)).map(cat => {
                                // @ts-ignore
                                const blocks = categorizedBlocks[cat] || [];
                                const searchBlocks = blocks.filter((b: any) => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                if (searchBlocks.length === 0) return null;
                                return (
                                    <div key={cat}>
                                        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">{cat}</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {searchBlocks.map((blockInfo: any) => {
                                                const Icon = blockInfo.icon;
                                                return (
                                                    <button key={blockInfo.key} onClick={() => onSelectBlock(blockInfo.key as BlockType)} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm active:bg-blue-50 active:border-blue-300 transition-colors">
                                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", blockInfo.theme?.bg || 'bg-slate-100')}>{Icon && <Icon className={cn("w-5 h-5", blockInfo.theme?.icon || 'text-slate-500')} />}</div>
                                                        <div className="text-left"><p className="font-bold text-sm text-slate-800">{blockInfo.name}</p><p className="text-xs text-slate-500 line-clamp-1">{blockInfo.description}</p></div>
                                                        <Plus className="w-5 h-5 text-blue-500 ml-auto" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* ESTILOS (MÓVIL) */}
                    {activeTab === 'styles' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Colores</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {COLOR_PALETTES.map((palette) => (
                                        <button key={palette.id} onClick={() => { setActivePalette(palette.id); if(onUpdateTheme) onUpdateTheme('color', palette.id); }} className={cn("p-4 rounded-xl border flex items-center justify-between transition-all bg-white", activePalette === palette.id ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50" : "border-slate-200 active:bg-slate-50")}>
                                            <div className="flex items-center gap-3"><div className="flex -space-x-2">{palette.colors.map((c, i) => (<div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }}></div>))}</div><span className="font-bold text-sm text-slate-700">{palette.name}</span></div>
                                            {activePalette === palette.id && <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Fuentes</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {FONT_PAIRS.map((font) => (
                                        <button key={font.id} onClick={() => { setActiveFont(font.id); if(onUpdateTheme) onUpdateTheme('font', font.id); }} className={cn("p-4 rounded-xl border flex items-center justify-between transition-all bg-white text-left", activeFont === font.id ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50" : "border-slate-200 active:bg-slate-50")}>
                                            <div><p className="text-xl leading-none text-slate-900 mb-1" style={{ fontFamily: font.title === 'Inter' ? 'sans-serif' : 'serif' }}>Aa</p><p className="text-xs font-bold text-slate-500">{font.name}</p></div>
                                            <div className="text-right"><span className="text-[10px] text-slate-400 font-mono block">{font.title}</span><span className="text-[10px] text-slate-400 font-mono block">{font.body}</span></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}