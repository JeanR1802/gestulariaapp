'use client';
import React, { useState, useEffect } from 'react';
import { Block, BLOCKS, BlockData } from '../blocks';
import { PreviewRenderer } from '../PreviewRenderer';
import { PaintBrushIcon, PencilIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// --- Tipos y Props ---
type PanelType = 'content' | 'style';

interface InlineEditorPanelProps {
  block: Block;
  onDataChange: (newData: BlockData) => void;
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

// --- Hook para Media Query ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);
  return matches;
};

// --- Componentes de UI del Panel ---
const PanelHeader: React.FC<{ title: string; onClose: () => void; isMobile?: boolean }> = ({ title, onClose, isMobile }) => (
  <div className={cn("p-3 border-b flex justify-between items-center bg-slate-50 flex-shrink-0", isMobile ? "rounded-t-2xl" : "rounded-t-lg")}>
    {isMobile && <div className="w-4"></div>} 
    <h3 className="font-semibold text-sm text-slate-800">Editando: {title}</h3>
    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors"><XMarkIcon className="w-5 h-5" /></button>
  </div>
);

const PanelActions: React.FC<{ onMoveUp?: () => void; onMoveDown?: () => void; onDelete: () => void; }> = ({ onMoveUp, onMoveDown, onDelete }) => (
  <div className="p-2 border-b flex items-center justify-center gap-2 flex-shrink-0">
    {onMoveUp && <button onClick={onMoveUp} className="p-2 rounded-md hover:bg-slate-200 transition-colors"><ArrowUpIcon className="w-5 h-5 text-gray-700" /></button>}
    {onMoveDown && <button onClick={onMoveDown} className="p-2 rounded-md hover:bg-slate-200 transition-colors"><ArrowDownIcon className="w-5 h-5 text-gray-700" /></button>}
    <button onClick={onDelete} className="p-2 rounded-md hover:bg-red-500 group transition-colors"><TrashIcon className="w-5 h-5 text-gray-700 group-hover:text-white" /></button>
  </div>
);

const PanelTabs: React.FC<{ activeTab: PanelType; setActiveTab: (tab: PanelType) => void; hasStyleEditor: boolean; }> = ({ activeTab, setActiveTab, hasStyleEditor }) => (
  <div className="border-b flex flex-shrink-0">
    <button onClick={() => setActiveTab('content')} className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors", activeTab === 'content' ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" : "text-slate-600 hover:bg-slate-100")}>
      <PencilIcon className="w-4 h-4" /> Contenido
    </button>
    {hasStyleEditor && (
      <button onClick={() => setActiveTab('style')} className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors", activeTab === 'style' ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" : "text-slate-600 hover:bg-slate-100")}>
        <PaintBrushIcon className="w-4 h-4" /> Estilo
      </button>
    )}
  </div>
);

const PanelContent: React.FC<{ activeTab: PanelType; contentComponent: React.ReactNode; styleComponent?: React.ReactNode; }> = ({ activeTab, contentComponent, styleComponent }) => (
  <div className="p-4 space-y-4 overflow-y-auto">
    <div style={{ display: activeTab === 'content' ? 'block' : 'none' }}>{contentComponent}</div>
    {styleComponent && <div style={{ display: activeTab === 'style' ? 'block' : 'none' }}>{styleComponent}</div>}
  </div>
);

// --- Componente Principal del Panel ---
// --- Componente Principal del Panel ---
function InlineEditorPanelImpl({ block, onDataChange, onClose, onDelete, onMoveUp, onMoveDown }: InlineEditorPanelProps) {
    const [activeTab, setActiveTab] = useState<PanelType>('content');
    const [localData, setLocalData] = useState<BlockData>(block.data);

    // Sincronizar el estado local con el padre cuando cambia el bloque editado
    useEffect(() => {
        setLocalData(block.data);
    }, [block.id]);

    // Sincronizar los cambios locales con el padre para la previsualización
    useEffect(() => {
        onDataChange(localData);
    }, [localData, onDataChange]);

    const handleLocalUpdate = (key: string, value: unknown) => {
        setLocalData(currentData => ({ ...currentData, [key]: value }));
    };

    const isMobile = useMediaQuery('(max-width: 799px)'); // lg breakpoint for this component

    const blockConfig = BLOCKS[block.type] as BlockConfig;
    const ContentEditorComponent = blockConfig.editor;
    const StyleEditorComponent = blockConfig.styleEditor;

    const content = <ContentEditorComponent data={localData} updateData={handleLocalUpdate} />;
    const styleContent = StyleEditorComponent ? <StyleEditorComponent data={localData} updateData={handleLocalUpdate} /> : undefined;

    const previewBlock = { ...block, data: localData };

    const preview = (
        <div className={cn("w-full flex items-center justify-center bg-slate-100 p-4 rounded-lg overflow-hidden")}>
            <div className="w-full bg-white shadow-sm rounded-md">
                <PreviewRenderer block={previewBlock} />
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[1001] bg-white flex flex-col">
                <div className="p-2 flex justify-end items-center border-b bg-slate-50 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center"
                    >
                        <CheckIcon className="w-6 h-6" />
                    </button>
                </div>
    
                <div className="w-full h-full flex flex-col overflow-hidden">
                    <div className="overflow-y-auto" style={{ flexBasis: '50%' }}>
                        {preview}
                    </div>
    
                    <div className="flex-1 flex flex-col overflow-hidden border-t">
                        <PanelTabs activeTab={activeTab} setActiveTab={setActiveTab} hasStyleEditor={!!StyleEditorComponent} />
                        <PanelContent activeTab={activeTab} contentComponent={content} styleComponent={styleContent} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-6xl h-[calc(100vh-4rem)] bg-white rounded-xl shadow-2xl border border-slate-200 grid grid-cols-3" onClick={e => e.stopPropagation()}>
                <div className="col-span-2 h-full overflow-auto p-4">
                    {preview}
                </div>
                <div className="col-span-1 h-full grid grid-rows-[auto_auto_auto_1fr] border-l border-slate-200 overflow-hidden">
                    <PanelHeader title={blockConfig.name} onClose={onClose} />
                    <PanelActions onMoveUp={onMoveUp} onMoveDown={onMoveDown} onDelete={onDelete} />
                    <PanelTabs activeTab={activeTab} setActiveTab={setActiveTab} hasStyleEditor={!!StyleEditorComponent} />
                    <PanelContent activeTab={activeTab} contentComponent={content} styleComponent={styleContent} />
                </div>
            </div>
        </div>
    );
}

export const InlineEditorPanel = React.memo(InlineEditorPanelImpl, (prevProps, nextProps) => {
    // Prevenir re-render si las props no han cambiado de forma relevante.
    // Solo re-renderizar si el ID del bloque cambia.
    return prevProps.block.id === nextProps.block.id && 
           prevProps.onDataChange === nextProps.onDataChange;
});