import React from 'react';
import { BLOCKS, BlockType, BlockData } from '@/app/components/editor/blocks';

interface AddBlockPanelProps {
    blockType: BlockType | null;
    onAddBlock: (type: BlockType, data: BlockData) => void;
    onClose: () => void;
}

export function AddBlockPanel({ blockType, onAddBlock, onClose }: AddBlockPanelProps) {
    if (!blockType) return null;
    const blockConfig = BLOCKS[blockType];
    const Icon = blockConfig.icon;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${blockConfig.theme.bg}`}><Icon className={`w-6 h-6 ${blockConfig.theme.icon}`} /></div>
                        <h3 className="text-lg font-semibold text-slate-800">Elige un diseño de {blockConfig.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                    {blockConfig.variants.map((variant, index) => {
                        const PreviewComponent = variant.preview as React.FC<{ data: BlockData }>;
                        return (
                            <div key={index} onClick={() => onAddBlock(blockType, variant.defaultData)} className="border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all">
                                <div className="p-4 bg-slate-50 flex items-center justify-center h-48"><PreviewComponent data={variant.defaultData} /></div>
                                <div className="p-3"><h4 className="font-semibold text-sm">{variant.name}</h4><p className="text-xs text-slate-500">{variant.description}</p></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
