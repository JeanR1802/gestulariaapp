'use client';
import React, { useState, useRef, useEffect } from 'react';
import { BlockData, BLOCKS, BlockType } from '../blocks';
import { PaintBrushIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// --- Interfaces ---
type PanelType = 'content' | 'style' | null;

interface PopoverPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface ToolbarButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

interface FloatingToolbarProps {
  block: { id: number; type: string; data: BlockData };
  onUpdate: (key: string, value: unknown) => void; 
  onClose: () => void;
}

// Interfaces para definir la estructura de un bloque con editores
interface BlockConfig {
    name: string;
    editor: React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }>;
    styleEditor?: React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }>;
}

// Type guard para verificar si un block config tiene styleEditor
function hasStyleEditor(blockConfig: BlockConfig): blockConfig is BlockConfig & { 
    styleEditor: React.FC<{ data: BlockData; updateData: (key: string, value: unknown) => void }> 
} {
    return blockConfig.styleEditor !== undefined;
}

// --- Componente de Botón con Tooltip ---
const ToolbarButton = ({ label, isActive, onClick, children, className }: ToolbarButtonProps) => (
    <div className="relative group">
        <button 
            onClick={onClick}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110",
                isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
                className
            )}
        >
            {children}
        </button>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
        </div>
    </div>
);

// --- Panel Desplegable ---
const PopoverPanel = ({ title, onClose, children }: PopoverPanelProps) => {
    return (
        <div
            className="absolute right-full top-0 mr-3 bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col animate-fadeIn"
            style={{
                maxWidth: '36rem', // 576px, mucho más ancho
                minWidth: '320px',
                width: '100%',
                zIndex: 1000,
                height: '70vh',
                maxHeight: '70vh',
                overflow: 'hidden'
            }}
        >
            <div className="p-3 border-b flex-shrink-0 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-700">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><XMarkIcon className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(70vh - 56px)' }}>
                {children}
            </div>
        </div>
    );
};

// --- Barra de Herramientas Principal ---
export function FloatingToolbar({ block, onUpdate, onClose }: FloatingToolbarProps) {
    const [activePanel, setActivePanel] = useState<PanelType>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    
    const [position, setPosition] = useState(() => ({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth - 80
    }));

    useEffect(() => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement && e.target.closest('button')) return;
            
            toolbar.style.transition = 'none';
            const startX = e.clientX - position.left;
            const startY = e.clientY - position.top;

            const handleMouseMove = (moveEvent: MouseEvent) => {
                let newLeft = moveEvent.clientX - startX;
                let newTop = moveEvent.clientY - startY;

                const rect = toolbar.getBoundingClientRect();
                newLeft = Math.max(20, Math.min(window.innerWidth - rect.width - 20, newLeft));
                newTop = Math.max(20, Math.min(window.innerHeight - rect.height - 20, newTop));

                setPosition({ left: newLeft, top: newTop });
            };

            const handleMouseUp = () => {
                toolbar.style.transition = 'top 0.2s ease, left 0.2s ease';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        toolbar.addEventListener('mousedown', handleMouseDown);
        return () => toolbar.removeEventListener('mousedown', handleMouseDown);
    }, [position]);

    const blockConfig = BLOCKS[block.type as BlockType] as BlockConfig;

    const ContentEditorComponent = blockConfig.editor;
    const StyleEditorComponent = hasStyleEditor(blockConfig) ? blockConfig.styleEditor : undefined;

    return (
        <div 
            ref={toolbarRef}
            className="fixed z-40 flex flex-col items-center gap-2 p-2 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg cursor-grab"
            style={{ top: `${position.top}px`, left: `${position.left}px`, transition: 'top 0.2s ease, left 0.2s ease' }}
        >
            <ToolbarButton 
                label="Contenido"
                isActive={activePanel === 'content'}
                onClick={() => setActivePanel(activePanel === 'content' ? null : 'content')}
            >
                <PencilIcon className="w-5 h-5" />
            </ToolbarButton>
            
            {StyleEditorComponent && (
                <ToolbarButton 
                    label="Estilo"
                    isActive={activePanel === 'style'}
                    onClick={() => setActivePanel(activePanel === 'style' ? null : 'style')}
                >
                    <PaintBrushIcon className="w-5 h-5" />
                </ToolbarButton>
            )}

            <div className="w-6 h-px bg-slate-600 my-1" />

            <ToolbarButton 
                label="Cerrar Edición"
                isActive={false}
                onClick={onClose}
                className="bg-slate-700 text-slate-300 hover:bg-red-500 hover:text-white"
            >
                <XMarkIcon className="w-5 h-5" />
            </ToolbarButton>
            
            {activePanel === 'content' && ContentEditorComponent && (
                <PopoverPanel title={`Editando Contenido: ${blockConfig.name}`} onClose={() => setActivePanel(null)}>
                    <ContentEditorComponent data={block.data} updateData={onUpdate} />
                </PopoverPanel>
            )}

            {activePanel === 'style' && StyleEditorComponent && (
                <PopoverPanel title={`Editando Estilo: ${blockConfig.name}`} onClose={() => setActivePanel(null)}>
                    <StyleEditorComponent data={block.data} updateData={onUpdate} />
                </PopoverPanel>
            )}
        </div>
    );
}