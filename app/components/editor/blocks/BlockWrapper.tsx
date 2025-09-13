// app/components/editor/blocks/BlockWrapper.tsx (REFACTORED para toolbar position)
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Block, BLOCKS } from './index';
import { PencilSquareIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import type { BlockType } from './index';
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
  const [elementStyle, setElementStyle] = useState<{
    keys: { text?: string; bg?: string; btnBg?: string; btnText?: string };
    anchor: { top: number; left: number };
  } | null>(null);
  // Estado para el botón flotante de estilos y el panel lateral
  const [showStyleButton, setShowStyleButton] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [styleBtnY, setStyleBtnY] = useState(window.innerHeight / 2 - 40); // posición vertical inicial
  const [draggingBtn, setDraggingBtn] = useState(false);
  const dragBtnOffset = useRef(0);
  const [panelX, setPanelX] = useState(window.innerWidth - 380); // posición inicial derecha
  const [draggingPanel, setDraggingPanel] = useState(false);
  const dragPanelOffset = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag & drop para el botón flotante de estilos
  useEffect(() => {
    if (!draggingBtn) return;
    const onMove = (e: MouseEvent) => {
      const clientY = e.clientY;
      let newY = clientY - dragBtnOffset.current;
      newY = Math.max(40, Math.min(newY, window.innerHeight - 80));
      setStyleBtnY(newY);
    };
    const onUp = () => setDraggingBtn(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingBtn]);

  // Drag & drop para el panel lateral
  useEffect(() => {
    if (!draggingPanel) return;
    const onMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      let newX = clientX - dragPanelOffset.current;
      newX = Math.max(0, Math.min(newX, window.innerWidth - 320));
      setPanelX(newX);
    };
    const onUp = () => setDraggingPanel(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingPanel]);

  // --- Handlers para el panel de estilos de elemento ---
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
  const closeElementStyle = () => setElementStyle(null);

  // --- Edit Mode ---
  // El bloque siempre se ve normal, solo aparecen los controles flotantes
  return (
    <div ref={containerRef} className="relative my-4">
      {/* Barra de acciones flotante arriba a la derecha (desktop) */}
      {!isMobile && (
        <div className="absolute top-2 right-2 z-40 flex flex-row gap-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 px-2 py-1">
          {onMoveUp && (
            <button title="Mover Arriba" onClick={onMoveUp} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
              <ArrowUpIcon className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {onMoveDown && (
            <button title="Mover Abajo" onClick={onMoveDown} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
              <ArrowDownIcon className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <button title="Editar" onClick={() => setShowStyleButton(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100">
            <PencilSquareIcon className="w-5 h-5 text-blue-600" />
          </button>
          <button title="Eliminar Bloque" onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100">
            <TrashIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}
      {/* Botón flotante de estilos (movible) */}
      {!isMobile && showStyleButton && !panelOpen && (
        <button
          className="fixed right-0 z-50 bg-blue-600 text-white px-4 py-2 rounded-l-lg shadow-lg flex items-center gap-2 hover:bg-blue-700 transition cursor-move"
          style={{ top: styleBtnY, transform: 'translateY(0)' }}
          onClick={() => setPanelOpen(true)}
          onMouseDown={e => {
            setDraggingBtn(true);
            dragBtnOffset.current = e.clientY - styleBtnY;
          }}
        >
          <PaintBrushIcon className="w-5 h-5" />
          Estilos
        </button>
      )}
      {/* Panel lateral de edición (movible) */}
      {!isMobile && panelOpen && (
        <div
          ref={panelRef}
          className="fixed top-0 z-50 h-full bg-white border-l border-slate-200 shadow-2xl w-[360px] max-w-full flex flex-col animate-fadeIn"
          style={{ left: panelX, minHeight: '320px', maxHeight: '100vh', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', backdropFilter: 'blur(8px)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Barra de arrastre y salir */}
          <div
            className="w-full cursor-ew-resize py-2 px-4 bg-blue-50 border-b border-slate-100 flex items-center justify-between select-none"
            style={{ cursor: 'grab' }}
            onMouseDown={e => {
              setDraggingPanel(true);
              dragPanelOffset.current = e.clientX - panelX;
            }}
          >
            <div className="flex items-center gap-2">
              <PaintBrushIcon className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-base text-slate-700 truncate max-w-[180px]">{BLOCKS[block.type]?.name || 'Bloque'}</span>
            </div>
            <button onClick={() => { setPanelOpen(false); setShowStyleButton(false); }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
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
};