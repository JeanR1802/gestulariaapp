'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BLOCKS, BlockType, BlockData } from '@/app/components/editor/blocks';
import { BlockRenderer } from '@/app/components/editor/BlockRenderer';

// CORRECCIÓN: La definición de Block ahora permite la propiedad opcional 'variant' en 'data'.
interface Block { id: number; type: string; data: BlockData & { variant?: string }; }
interface Tenant { name: string; slug: string; pages: { slug: string; content: string; }[]; }
interface EditPanelProps { block: Block | undefined; onUpdate: (updates: Partial<Block>) => void; onClose: () => void; }

// --- Iconos (sin cambios) ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default function VisualEditor({ params }: { params: { id: string } }) {
  // ... (Toda la lógica de useState, useEffects, loadTenant, saveTenant, etc. se mantiene igual)
}

function EditPanel({ block, onUpdate, onClose }: EditPanelProps) {
    if (!block) return null;
    const blockConfig = BLOCKS[block.type as BlockType];
    if (!blockConfig) return null;

    const updateData = (key: string, value: unknown) => {
        onUpdate({ data: { ...block.data, [key]: value } });
    };

    const renderEditorContent = () => {
        const EditorComponent = blockConfig.editor;
        switch(block.type) {
            case 'header': return <EditorComponent data={block.data} updateData={updateData} />;
            case 'hero': return <EditorComponent data={block.data} updateData={updateData} />;
            case 'text': return <EditorComponent data={block.data} updateData={updateData} />;
            case 'image': return <EditorComponent data={block.data} updateData={updateData} />;
            case 'cards': return <EditorComponent data={block.data} updateData={updateData} />;
            case 'cta': return <EditorComponent data={block.data} updateData={updateData} />;
            case 'footer': return <EditorComponent data={block.data} updateData={updateData} />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <EditIcon/>
                        <h3 className="text-lg font-semibold text-slate-800">Editar {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">×</button>
                </div>
            </div>
            <div className="p-4 space-y-5 overflow-y-auto flex-1">
                {'variants' in blockConfig && blockConfig.variants && (
                    <div className="space-y-2 pb-4 border-b border-slate-200">
                        <label className="block text-sm font-medium text-slate-700">Diseño</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(blockConfig.variants).map(variantKey => (
                                <button
                                    key={variantKey}
                                    onClick={() => updateData('variant', variantKey)}
                                    className={`px-3 py-1 text-sm rounded-full ${block.data.variant === variantKey ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                                >
                                    {blockConfig.variants![variantKey].name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {renderEditorContent()}
            </div>
        </div>
    );
}