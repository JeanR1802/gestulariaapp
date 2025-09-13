// app/components/editor/blocks/BlockWrapper.tsx (REFACTORED for toolbar position)
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Block, BLOCKS } from './index';
import { PencilSquareIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import type { BlockType, BlocksConfig } from './index';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

// --- Element Style Panel ---
function getValue<T extends object>(obj: T, key: string | undefined): string {
  return key && (obj as Record<string, unknown>)[key] as string || '';
}

const ElementStylePanel = <T extends object>({
  keys,
  values,
  onChange,
  onClose,
  anchor
}: {
  keys: { text?: string; bg?: string; btnBg?: string; btnText?: string };
  values: T;
  onChange: (key: keyof T & string, value: string) => void;
  onClose: () => void;
  anchor: { top: number; left: number };
}) => {
  return (
    <div
      className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-3 space-y-2"
      style={{ top: anchor.top, left: anchor.left, width: 260 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-slate-600">Estilo del elemento</div>
        <button onClick={onClose} className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center">
          <XMarkIcon className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      {keys.text && (
        <TextColorPalette
          label="Texto"
          selectedColor={getValue(values, keys.text)}
          onChange={(c: string) => onChange(keys.text as keyof T & string, c)}
        />
      )}
      {keys.bg && (
        <ColorPalette
          label="Fondo"
          selectedColor={getValue(values, keys.bg)}
          onChange={(c: string) => onChange(keys.bg as keyof T & string, c)}
        />
      )}
      {(keys.btnBg || keys.btnText) && (
        <ButtonColorPalette
          label="Botón"
          selectedBgColor={getValue(values, keys.btnBg)}
          selectedTextColor={getValue(values, keys.btnText)}
          onChange={(bg: string, text: string) => {
            if (keys.btnBg) onChange(keys.btnBg as keyof T & string, bg);
            if (keys.btnText) onChange(keys.btnText as keyof T & string, text);
          }}
        />
      )}
    </div>
  );
};

interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (key: string, value: unknown) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  block: Block & { type: BlockType };
}

export const BlockWrapper = ({ 
    children, 
    isEditing, 
    onEdit,
    onClose,
    onDelete,
    onUpdate,
    onMoveUp,
    onMoveDown,
    block 
}: BlockWrapperProps) => {
  const { isMobile } = usePreviewMode();
  const [showActionsMobile, setShowActionsMobile] = useState(false);
  const [showBlockStyle, setShowBlockStyle] = useState(false);
  const [elementStyle, setElementStyle] = useState<{
    keys: { text?: string; bg?: string; btnBg?: string; btnText?: string };
    anchor: { top: number; left: number };
  } | null>(null);
  const [placeToolbarBelow, setPlaceToolbarBelow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isEditing) return;
    const el = containerRef.current;
    if (!el) return;
    const recalc = () => {
      const rect = el.getBoundingClientRect();
      const threshold = 96; // altura aproximada del header
      setPlaceToolbarBelow(rect.top - threshold < 0);
    };
    recalc();
    window.addEventListener('scroll', recalc, true);
    window.addEventListener('resize', recalc);
    return () => {
      window.removeEventListener('scroll', recalc, true);
      window.removeEventListener('resize', recalc);
    };
  }, [isEditing]);

  const closeElementStyle = () => setElementStyle(null);

  const handleElementClick = (e: React.MouseEvent) => {
    if (!isEditing) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const el = target.closest('[data-style-text], [data-style-bg], [data-style-btn-bg], [data-style-btn-text]') as HTMLElement | null;
    if (!el) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const keys = {
      text: el.dataset.styleText,
      bg: el.dataset.styleBg,
      btnBg: el.dataset.styleBtnBg,
      btnText: el.dataset.styleBtnText,
    };
    const anchor = { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX };
    setElementStyle({ keys, anchor });
  };

  // --- Edit Mode ---
  if (isEditing) {
    return (
      <div ref={containerRef} className="relative my-4">
        {/* Toolbar is now outside and above the block */}
        {!isMobile && (
            <div className={`absolute ${placeToolbarBelow ? 'top-full' : 'bottom-full'} left-0 w-full flex justify-center mb-2 z-50`}>
                <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200">
                    {onMoveUp && <button title="Mover Arriba" onClick={onMoveUp} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowUpIcon className="w-5 h-5 text-gray-700" /></button>}
                    {onMoveDown && <button title="Mover Abajo" onClick={onMoveDown} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowDownIcon className="w-5 h-5 text-gray-700" /></button>}
                    <button title="Estilo del Bloque" onClick={() => setShowBlockStyle((v) => !v)} className="h-8 px-3 flex items-center gap-1 rounded-full hover:bg-slate-100"><PaintBrushIcon className="w-5 h-5 text-gray-700" /><span className="text-sm">Estilo</span></button>
                    <button title="Eliminar Bloque" onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 group/trash"><TrashIcon className="w-5 h-5 text-red-500 group-hover/trash:text-red-600" /></button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button title="Finalizar Edición" onClick={onClose} className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700"><XMarkIcon className="w-5 h-5" /></button>
                </div>
            </div>
        )}

        {/* Block Style Panel (Desktop) */}
        {!isMobile && showBlockStyle && (
          <div
            className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-white/90 border-l border-slate-200 rounded-l-2xl shadow-2xl w-[360px] max-w-full flex flex-col animate-fadeIn"
            style={{
              maxHeight: '90vh',
              minHeight: '320px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/80 rounded-tl-2xl sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <PaintBrushIcon className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-base text-slate-700 truncate max-w-[180px]">{BLOCKS[block.type]?.name || 'Bloque'}</span>
              </div>
              <button onClick={() => setShowBlockStyle(false)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {(() => {
                // Type-safe: get the style editor and its correct data type
                const StyleEditor = BLOCKS[block.type]?.styleEditor as React.FC<{ data: typeof block.data; updateData: (key: string, value: unknown) => void }> | undefined;
                if (!StyleEditor) return <div className="text-sm text-slate-500">Este bloque no tiene editor de estilo.</div>;
                return <StyleEditor data={block.data} updateData={onUpdate} />;
              })()}
            </div>
          </div>
        )}
        
        {/* The block itself with an editing ring */}
        <div className="ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-100 rounded-lg" onClick={handleElementClick}>
            {children}
        </div>

        {/* Element Style Panel */}
        {elementStyle && (
          <ElementStylePanel
            keys={elementStyle.keys}
            values={block.data}
            onChange={(key, val) => onUpdate(key, val)}
            onClose={closeElementStyle}
            anchor={elementStyle.anchor}
          />
        )}

        {/* Bottom Sheet for Mobile */}
        {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg rounded-t-2xl border-t">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-800">Editando Bloque</h3>
                        <div className="flex items-center gap-2">
                            {onMoveUp && <button title="Mover Arriba" onClick={onMoveUp} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"><ArrowUpIcon className="w-5 h-5 text-gray-700" /></button>}
                            {onMoveDown && <button title="Mover Abajo" onClick={onMoveDown} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"><ArrowDownIcon className="w-5 h-5 text-gray-700" /></button>}
                            <button title="Eliminar Bloque" onClick={onDelete} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 group/trash"><TrashIcon className="w-5 h-5 text-red-500" /></button>
                        </div>
                    </div>
                    {/* Block Style Editor (Mobile) */}
                    <div className="py-2 border-t">
                      {(() => {
                        const StyleEditor = BLOCKS[block.type]?.styleEditor as React.FC<{ data: typeof block.data; updateData: (key: string, value: unknown) => void }> | undefined;
                        if (!StyleEditor) return <p className="text-center text-sm text-slate-500">Este bloque no tiene editor de estilo.</p>;
                        return <StyleEditor data={block.data} updateData={onUpdate} />;
                      })()}
                    </div>
                    <button
                      onClick={() => {
                        // Forzar blur en el elemento editable antes de cerrar
                        const active = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
                        if (active) active.blur();
                        onClose();
                      }}
                      className="w-full mt-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"
                    >
                      Hecho
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- Normal Mode ---
  return (
    <div
      className="relative rounded-lg transition-all group"
      onClick={(e) => {
        if (isMobile) {
          e.stopPropagation();
          setShowActionsMobile(true);
        } else {
          onEdit();
        }
      }}
    >
      {/* Desktop: Overlay with Edit and Move buttons on hover */}
      {!isMobile && (
        <div className="absolute inset-0 bg-sky-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
          <div className="bg-white/95 text-gray-800 font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            {onMoveUp && (
              <button
                title="Mover arriba"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp && onMoveUp();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <ArrowUpIcon className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <button
              title="Editar"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 px-3 flex items-center gap-1 rounded-full hover:bg-slate-100"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar
            </button>
            {onMoveDown && (
              <button
                title="Mover abajo"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown && onMoveDown();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <ArrowDownIcon className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile: Tap to show actions */}
      {isMobile && showActionsMobile && (
        <div
          className="absolute inset-0 bg-sky-900/10 z-10 rounded-lg flex items-center justify-center backdrop-blur-[2px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/95 text-gray-800 font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            {onMoveUp && (
              <button
                title="Mover arriba"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp && onMoveUp();
                  setShowActionsMobile(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <ArrowUpIcon className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <button
              title="Editar"
              onClick={(e) => {
                e.stopPropagation();
                setShowActionsMobile(false);
                onEdit();
              }}
              className="h-8 px-3 flex items-center gap-1 rounded-full hover:bg-slate-100"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Editar
            </button>
            {onMoveDown && (
              <button
                title="Mover abajo"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown && onMoveDown();
                  setShowActionsMobile(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                <ArrowDownIcon className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <button
              title="Cerrar"
              onClick={(e) => {
                e.stopPropagation();
                setShowActionsMobile(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              <XMarkIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};