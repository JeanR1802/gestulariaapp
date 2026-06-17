// Stub: EditorSidebar neutralized (blocks architecture removed during cleanup)
import React from 'react';

interface EditorSidebarProps {
  isOpen?: boolean;
  onAddBlock?: (type: any, initialData?: any) => void;
  onApplyTemplate?: (templateKey: string) => void;
  onUpdateTheme?: (type: string, value: string) => void;
  activePageId?: string;
  onSelectPage?: (pageId: string) => void;
  editingBlock?: any;
  onCloseEditor?: () => void;
  onUpdateBlock?: (blockId: number, key: string, value: any) => void;
}

export function EditorSidebar(props: EditorSidebarProps) {
  return <aside className="w-[320px] border-r border-gray-300"></aside>;
}
