'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutTemplate, Grid, Plus, ArrowLeft, X,
    Box, ShoppingBag, ShieldCheck, Zap, HelpCircle, Image as ImageIcon
} from 'lucide-react';
import { BLOCKS, BlockType, Block } from '@/app/components/editor/blocks';
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
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

    const currentFolderVariants = useMemo(() => {
        if (!activeFolderId) return [];
        const folder = BLOCK_FOLDERS.find(f => f.id === activeFolderId);
        if (!folder) return [];
        return BLOCK_VARIANTS.filter(v => folder.blockTypes.includes(v.blockType));
    }, [activeFolderId]);

    const renderEditorPanel = () => {
        if (!editingBlock) return null;
        const BlockConfig = BLOCKS[editingBlock.type];
        if (!BlockConfig) return <div className="p-8 text-center text-slate-400 text-xs">Error: Bloque no encontrado.</div>;
        const EditorComponent = BlockConfig.editor;

        return (
            <div className="flex flex-col h-full bg-white">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onCloseEditor} className="border rounded p-2 -ml-2 hover:bg-gray-100">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div><h3 className="text-sm font-semibold">Editar {BlockConfig.name}</h3></div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                    {EditorComponent ? (
                        <EditorComponent data={editingBlock.data} updateData={(key: string, value: any) => onUpdateBlock && onUpdateBlock(editingBlock.id, key, value)} />
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">Sin opciones editables.</div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                    <button className="w-full py-2.5 text-red-600 text-xs font-semibold border border-red-200 rounded hover:bg-red-50 flex items-center justify-center gap-2">
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
            "hidden md:flex h-full z-30 bg-gray-50 border-r border-gray-300 transition-all duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full absolute"
        )}>
            
            {/* PANEL ÚNICO */}
            <div className={cn(
                "bg-gray-50 flex flex-col h-full overflow-hidden relative transition-all duration-300",
                isEditingMode ? "w-[360px] bg-white" : "w-[320px]"
            )}>
                
                {isEditingMode ? renderEditorPanel() : (
                    <>
                        <div className="px-5 pt-6 pb-4 shrink-0 bg-gray-50 z-10 border-b border-gray-300">
                            {activeFolderId ? (
                                <div>
                                    <button onClick={() => setActiveFolderId(null)} className="flex items-center gap-1 text-gray-700 text-xs font-semibold mb-3">
                                        <ArrowLeft className="w-3 h-3" /> Volver
                                    </button>
                                    <h2 className="text-xl font-semibold">{BLOCK_FOLDERS.find(f => f.id === activeFolderId)?.name}</h2>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-semibold">Bloques</h2>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-6">
                            {!activeFolderId && (
                                <div className="grid grid-cols-2 gap-3">
                                    {BLOCK_FOLDERS.map((folder) => {
                                        const count = BLOCK_VARIANTS.filter(v => folder.blockTypes.includes(v.blockType)).length;
                                        return (
                                            <button key={folder.id} onClick={() => setActiveFolderId(folder.id)} className="flex flex-col items-center justify-center p-4 rounded border border-gray-300 bg-white">
                                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center mb-2"><folder.icon className="w-5 h-5" /></div>
                                                <span className="text-xs font-semibold text-center leading-tight">{folder.name}</span>
                                                <span className="text-[10px] text-gray-600 mt-1">{count} estilos</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {activeFolderId && (
                                <div className="grid grid-cols-1 gap-4">
                                    {currentFolderVariants.length > 0 ? currentFolderVariants.map((variant) => (
                                        <button key={variant.id} onClick={() => onAddBlock(variant.blockType, variant.initialData)} className="group relative w-full rounded border border-gray-300 bg-white text-left">
                                            <div className="w-full aspect-[2/1] bg-gray-50 border-b border-gray-300 overflow-hidden relative">
                                                <div className="absolute inset-0 flex items-center justify-center">{variant.preview}</div>
                                            </div>
                                            <div className="p-3 flex justify-between items-center">
                                                <span className="font-semibold text-xs">{variant.name}</span>
                                                <Plus className="w-4 h-4" />
                                            </div>
                                        </button>
                                    )) : <div className="text-center py-10 text-xs">No hay variantes disponibles.</div>}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}