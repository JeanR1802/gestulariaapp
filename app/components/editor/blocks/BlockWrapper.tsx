'use client';
import React, { useState, MouseEvent, useEffect } from 'react';

const MoveUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>;
const MoveDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 9 7 7 7-7"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
const SmallEditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;

interface BlockWrapperProps {
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  blockId: number;
  onToggleMobileToolbar: (blockId: number | null) => void;
  isMobileToolbarVisible: boolean;
}

export const BlockWrapper = ({ children, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, blockId, onToggleMobileToolbar, isMobileToolbarVisible }: BlockWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const showDesktopToolbar = !isMobile && (isHovered || isEditing);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      onToggleMobileToolbar(blockId);
    } else if (!isEditing) {
      onEdit();
    }
  };

  const handleAction = (e: MouseEvent, action?: () => void) => {
    e.stopPropagation();
    if (action) action();
    onToggleMobileToolbar(null);
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      className={`relative rounded-md transition-all ${isEditing ? 'ring-2 ring-blue-500' : isMobile ? '' : 'hover:ring-1 hover:ring-slate-300'}`}
      onClick={handleClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {showDesktopToolbar && (
        <div className="absolute top-[-14px] right-2 z-10 flex">
          {onMoveUp && <button onClick={(e) => handleAction(e, onMoveUp)} className="p-1.5 bg-white border border-slate-300 rounded-l-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"><MoveUpIcon /></button>}
          {onMoveDown && <button onClick={(e) => handleAction(e, onMoveDown)} className={`p-1.5 bg-white border-y border-r border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 ${!onMoveUp ? 'rounded-l-md' : ''}`}><MoveDownIcon /></button>}
          <button onClick={(e) => handleAction(e, onDelete)} className="p-1.5 bg-white border-y border-r border-slate-300 rounded-r-md text-red-600 hover:text-red-800 hover:bg-red-50"><TrashIcon /></button>
        </div>
      )}
      {isMobile && isMobileToolbarVisible && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex bg-white border border-slate-300 rounded-lg shadow-lg divide-x divide-slate-300">
          <button onClick={handleEditClick} className="p-2 flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 rounded-l-lg"><SmallEditIcon /> Editar</button>
          {onMoveUp && <button onClick={(e) => handleAction(e, onMoveUp)} className="p-2 text-slate-600 hover:bg-slate-50"><MoveUpIcon /></button>}
          {onMoveDown && <button onClick={(e) => handleAction(e, onMoveDown)} className="p-2 text-slate-600 hover:bg-slate-50"><MoveDownIcon /></button>}
          <button onClick={(e) => handleAction(e, onDelete)} className="p-2 text-red-600 hover:bg-red-50 rounded-r-lg"><TrashIcon /></button>
        </div>
      )}
      {children}
    </div>
  );
};