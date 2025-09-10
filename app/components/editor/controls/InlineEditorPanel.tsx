
'use client';
import React, { useState } from 'react';
import { Block, BLOCKS, BlockData } from '../blocks';
import { PaintBrushIcon, PencilIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type PanelType = 'content' | 'style';

interface InlineEditorPanelProps {
  block: Block;
  onUpdate: (key: string, value: unknown) => void;
  onClose: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

interface BlockConfig {
    name: string;
    editor: React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }>;
    styleEditor?: React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }>;
}

function hasStyleEditor(blockConfig: BlockConfig): blockConfig is BlockConfig & { styleEditor: React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> } {
    return blockConfig.styleEditor !== undefined;
}

export function InlineEditorPanel({ block, onUpdate, onClose, onDelete, onMoveUp, onMoveDown }: InlineEditorPanelProps) {
    const [activeTab, setActiveTab] = useState<PanelType>('content');
    const blockConfig = BLOCKS[block.type] as BlockConfig;

    const ContentEditorComponent = blockConfig.editor;
    const StyleEditorComponent = hasStyleEditor(blockConfig) ? blockConfig.styleEditor : undefined;

    return (
        <div className="absolute top-0 right-full mr-4 w-96 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col z-30" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-3 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-800">Editando: {blockConfig.name}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><XMarkIcon className="w-5 h-5" /></button>
            </div>

            {/* Block Controls */}
            <div className="p-2 border-b flex items-center justify-center gap-2">
                {onMoveUp && <button onClick={onMoveUp} className="p-2 bg-slate-100 rounded-md hover:bg-slate-200"><ArrowUpIcon className="w-5 h-5 text-gray-700" /></button>}
                {onMoveDown && <button onClick={onMoveDown} className="p-2 bg-slate-100 rounded-md hover:bg-slate-200"><ArrowDownIcon className="w-5 h-5 text-gray-700" /></button>}
                <button onClick={onDelete} className="p-2 bg-slate-100 rounded-md hover:bg-red-500 group"><TrashIcon className="w-5 h-5 text-gray-700 group-hover:text-white" /></button>
            </div>

            {/* Tabs */}
            <div className="border-b flex">
                <button 
                    onClick={() => setActiveTab('content')}
                    className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2", activeTab === 'content' ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" : "text-slate-600 hover:bg-slate-100")}
                >
                    <PencilIcon className="w-5 h-5" />
                    Contenido
                </button>
                {StyleEditorComponent && (
                    <button 
                        onClick={() => setActiveTab('style')}
                        className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2", activeTab === 'style' ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" : "text-slate-600 hover:bg-slate-100")}
                    >
                        <PaintBrushIcon className="w-5 h-5" />
                        Estilo
                    </button>
                )}
            </div>

            {/* Editor Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
                {activeTab === 'content' && ContentEditorComponent && (
                    <ContentEditorComponent data={block.data} updateData={onUpdate} />
                )}
                {activeTab === 'style' && StyleEditorComponent && (
                    <StyleEditorComponent data={block.data} updateData={onUpdate} />
                )}
            </div>
        </div>
    );
}
