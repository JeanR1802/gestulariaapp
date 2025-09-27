'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Block } from './index';
import { PencilIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

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
    // Asegurarse de que addEventListener y removeEventListener existan
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback para navegadores más antiguos
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);
  return matches;
};

// --- Tipos de Props para los componentes internos ---
interface ToolbarProps {
  onEdit?: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

interface BlockWrapperProps extends ToolbarProps {
  children: React.ReactNode;
  isEditing: boolean;
  isMobileEdit?: boolean;
  block: Block;
}

// --- Componente de Toolbar para Desktop ---
const DesktopToolbar: React.FC<ToolbarProps> = ({ onEdit, onDelete, onMoveUp, onMoveDown }) => (
  <div className="absolute -top-5 right-2 z-10 flex items-center gap-1 p-1 bg-white rounded-full shadow-md border border-slate-200 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
    {onMoveUp && <button title="Mover Arriba" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowUpIcon className="w-5 h-5 text-gray-600" /></button>}
    {onMoveDown && <button title="Mover Abajo" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowDownIcon className="w-5 h-5 text-gray-600" /></button>}
    {onEdit && <button title="Editar" onClick={(e) => { e.stopPropagation(); onEdit(); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100"><PencilIcon className="w-5 h-5 text-blue-600" /></button>}
    <button title="Eliminar" onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100"><TrashIcon className="w-5 h-5 text-red-500" /></button>
  </div>
);

// --- Componente de Menú para Móvil ---
const MobileMenu: React.FC<ToolbarProps> = ({ onEdit, onDelete, onMoveUp, onMoveDown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAction = (action: (() => void) | undefined) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (action) action();
    setIsOpen(false);
  };

  return (
    <div className="absolute top-2 right-2 z-10" ref={menuRef}>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(v => !v); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-slate-200 backdrop-blur-sm">
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-700" />
      </button>
      {isOpen && (
        <div className="absolute top-11 right-0 bg-white rounded-lg shadow-xl border border-slate-200 w-48 py-1 animate-fade-in-fast">
          {onEdit && <button onClick={handleAction(onEdit)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"><PencilIcon className="w-4 h-4" /> Editar</button>}
          {onMoveUp && <button onClick={handleAction(onMoveUp)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> Mover Arriba</button>}
          {onMoveDown && <button onClick={handleAction(onMoveDown)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"><ArrowDownIcon className="w-4 h-4" /> Mover Abajo</button>}
          <div className="h-px bg-slate-100 my-1"></div>
          <button onClick={handleAction(onDelete)} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><TrashIcon className="w-4 h-4" /> Eliminar</button>
        </div>
      )}
    </div>
  );
};

// --- Componente Principal del Wrapper ---
export const BlockWrapper = ({ 
    children, 
    isEditing,
    isMobileEdit,
    onEdit,
    onDelete,
    onMoveUp, 
    onMoveDown,
}: BlockWrapperProps) => {
  const isMobile = useMediaQuery('(max-width: 799px)');

  // En modo de edición, el panel se encarga de todo. El wrapper solo dibuja un anillo.
  if (isEditing) {
    return (
      <div className="relative">
        <div className="ring-2 ring-blue-500 ring-offset-2 rounded-lg">
          {children}
        </div>
      </div>
    );
  }

  // En modo normal, el wrapper gestiona el hover/click para mostrar controles.
  return (
    <div className="relative group rounded-lg">
      {children}
      {isMobile ? (
        isMobileEdit ? <MobileMenu onEdit={onEdit} onDelete={onDelete} onMoveUp={onMoveUp} onMoveDown={onMoveDown} /> : null
      ) : (
        <>
          <div 
            className="absolute inset-0 rounded-lg cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 ring-2 ring-transparent group-hover:ring-blue-400"
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }}
          />
          <DesktopToolbar onEdit={onEdit} onDelete={onDelete} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        </>
      )}
    </div>
  );
};