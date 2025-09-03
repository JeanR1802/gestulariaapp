'use client';
import React, { useState, MouseEvent } from 'react';

// --- Iconos ---
const MoveUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>;
const MoveDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 9 7 7 7-7"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;

// --- Definición de Props ---
interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

// --- Componente ---
export const BlockWrapper = ({ children, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: BlockWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const showToolbar = isHovered || isEditing;

  const handleAction = (e: MouseEvent, action?: () => void) => {
    e.stopPropagation();
    if (action) action();
  };

  return (
    <div
      className={`relative rounded-md transition-all ${isEditing ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-300'}`}
      onClick={() => !isEditing && onEdit()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showToolbar && (
        <div className="absolute top-[-14px] right-2 z-10 flex">
          {onMoveUp && <button onClick={(e) => handleAction(e, onMoveUp)} className="p-1.5 bg-white border border-slate-300 rounded-l-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"><MoveUpIcon /></button>}
          {onMoveDown && <button onClick={(e) => handleAction(e, onMoveDown)} className={`p-1.5 bg-white border-y border-r border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 ${!onMoveUp ? 'rounded-l-md' : ''}`}><MoveDownIcon /></button>}
          <button onClick={(e) => handleAction(e, onDelete)} className="p-1.5 bg-white border-y border-r border-slate-300 rounded-r-md text-red-600 hover:text-red-800 hover:bg-red-50"><TrashIcon /></button>
        </div>
      )}
      {children}
    </div>
  );
};