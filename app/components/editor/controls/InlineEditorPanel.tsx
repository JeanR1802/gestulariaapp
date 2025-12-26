'use client';
import React, { useState, useEffect } from 'react';
import { Block, BLOCKS, BlockData } from '../blocks';
import { PreviewRenderer } from '../PreviewRenderer';
import { PaintBrushIcon, PencilIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/solid';
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
  <div className={cn("p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0", isMobile ? "rounded-t-2xl" : "rounded-t-lg")}>
    {isMobile && <div className="w-4"></div>} 
    <h3 className="font-semibold text-sm text-slate-800">Editando: {title}</h3>
    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors"><XMarkIcon className="w-5 h-5" /></button>
  </div>
);

const PanelActions: React.FC<{ onMoveUp?: () => void; onMoveDown?: () => void; onDelete: () => void; }> = ({ onMoveUp, onMoveDown, onDelete }) => (
  <div className="p-2 border-b border-slate-200 flex items-center justify-center gap-2 flex-shrink-0 bg-white">
    {onMoveUp && <button onClick={onMoveUp} className="p-2 rounded-md hover:bg-slate-200 transition-colors"><ArrowUpIcon className="w-5 h-5 text-slate-700" /></button>}
    {onMoveDown && <button onClick={onMoveDown} className="p-2 rounded-md hover:bg-slate-200 transition-colors"><ArrowDownIcon className="w-5 h-5 text-slate-700" /></button>}
    <button onClick={onDelete} className="p-2 rounded-md hover:bg-red-500 group transition-colors"><TrashIcon className="w-5 h-5 text-slate-700 group-hover:text-white" /></button>
  </div>
);

const PanelTabs: React.FC<{ activeTab: PanelType; setActiveTab: (tab: PanelType) => void; hasStyleEditor: boolean; }> = ({ activeTab, setActiveTab, hasStyleEditor }) => (
  <div className="border-b border-slate-200 flex flex-shrink-0 bg-white">
    <button onClick={() => setActiveTab('content')} className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors", activeTab === 'content' ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" : "text-slate-600 hover:bg-slate-100 bg-white")}>
      <PencilIcon className="w-4 h-4" /> Contenido
    </button>
    {hasStyleEditor && (
      <button onClick={() => setActiveTab('style')} className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors", activeTab === 'style' ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" : "text-slate-600 hover:bg-slate-100 bg-white")}>
        <PaintBrushIcon className="w-4 h-4" /> Estilo
      </button>
    )}
  </div>
);

const PanelContent: React.FC<{ activeTab: PanelType; contentComponent: React.ReactNode; styleComponent?: React.ReactNode; }> = ({ activeTab, contentComponent, styleComponent }) => (
  <div className="p-4 space-y-4 bg-white" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
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
        setLocalData((currentData: any) => ({ ...currentData, [key]: value }));
    };

    const isMobile = useMediaQuery('(max-width: 799px)'); // lg breakpoint for this component

    const blockConfig = BLOCKS[block.type] as BlockConfig;
    const ContentEditorComponent = blockConfig.editor;
    const StyleEditorComponent = blockConfig.styleEditor;

    const content = <ContentEditorComponent data={localData} updateData={handleLocalUpdate} />;
    const styleContent = StyleEditorComponent ? <StyleEditorComponent data={localData} updateData={handleLocalUpdate} /> : undefined;

    const previewBlock = { ...block, data: localData };

    const preview = (
        <div className={cn("w-full h-full flex items-start justify-center")}>
            <div className="w-full max-w-4xl mx-auto" style={{ 
                transform: 'scale(0.85)', 
                transformOrigin: 'top center',
                backgroundColor: '#ffffff'
            }}>
                <PreviewRenderer block={previewBlock} />
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[1001] bg-white flex flex-col" style={{ colorScheme: 'light', color: '#0f172a' }}>
                <div className="p-2 flex justify-between items-center border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-slate-800">Editando: {blockConfig.name}</h3>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center"
                    >
                        <CheckIcon className="w-6 h-6" />
                    </button>
                </div>
    
                <div className="w-full" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
                    {/* Preview del bloque - Solo el bloque, escalado para verse completo */}
                    <div style={{ 
                        flex: '1 1 55%', 
                        overflow: 'auto', 
                        backgroundColor: '#f1f5f9', 
                        padding: '1rem',
                        minHeight: '0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>
                        <div style={{ 
                            width: '100%',
                            maxWidth: '500px',
                            transform: 'scale(0.75)',
                            transformOrigin: 'top center',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <PreviewRenderer block={previewBlock} />
                        </div>
                    </div>
    
                    {/* Panel de edición - Tabs y contenido */}
                    <div style={{ 
                        flex: '0 0 45%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderTop: '2px solid #e2e8f0', 
                        backgroundColor: '#ffffff' 
                    }}>
                        <PanelTabs activeTab={activeTab} setActiveTab={setActiveTab} hasStyleEditor={!!StyleEditorComponent} />
                        <div style={{ flex: '1 1 auto', overflow: 'auto', minHeight: '0' }}>
                            <PanelContent activeTab={activeTab} contentComponent={content} styleComponent={styleContent} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="light w-full max-w-6xl h-[calc(100vh-4rem)] bg-white rounded-xl shadow-2xl border border-slate-200 grid grid-cols-3" onClick={e => e.stopPropagation()} style={{ colorScheme: 'light' }}>
                {/* Preview del bloque - Solo el bloque */}
                <div className="col-span-2 h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-start justify-center">
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        transform: 'scale(0.9)',
                        transformOrigin: 'top center',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <PreviewRenderer block={previewBlock} />
                    </div>
                </div>
                <div className="col-span-1 h-full grid grid-rows-[auto_auto_auto_1fr] border-l border-slate-200 overflow-hidden bg-white">
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