// app/components/editor/blocks/BlockWrapper.tsx (REFACTORED for toolbar position)
'use client';
import React, { useState } from 'react';
import { Block } from './index';
import { PencilSquareIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';

interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (key: string, value: unknown) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  block: Block;
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
  // reference unused props to satisfy linter
  void onUpdate;
  void block;

  // --- Edit Mode ---
  if (isEditing) {
    return (
      <div className="relative my-4">
        {/* Toolbar is now outside and above the block */}
        {!isMobile && (
            <div className="absolute bottom-full left-0 w-full flex justify-center mb-2">
                <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-200">
                    {onMoveUp && <button title="Mover Arriba" onClick={onMoveUp} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowUpIcon className="w-5 h-5 text-gray-700" /></button>}
                    {onMoveDown && <button title="Mover Abajo" onClick={onMoveDown} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowDownIcon className="w-5 h-5 text-gray-700" /></button>}
                    <button title="Eliminar Bloque" onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 group/trash"><TrashIcon className="w-5 h-5 text-red-500 group-hover/trash:text-red-600" /></button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button title="Finalizar Edición" onClick={onClose} className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700"><XMarkIcon className="w-5 h-5" /></button>
                </div>
            </div>
        )}
        
        {/* The block itself with an editing ring */}
        <div className="ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-100 rounded-lg">
            {children}
        </div>

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
                    {/* Placeholder for Mobile Style Controls */}
                    <div className="py-4 border-t">
                        <p className="text-center text-sm text-slate-500">Controles de estilo aparecerán aquí.</p>
                    </div>
                    <button onClick={onClose} className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">Hecho</button>
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