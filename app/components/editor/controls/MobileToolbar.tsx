
'use client';

import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface MobileToolbarProps {
  isEditing: boolean;
  onToggleEditing: (editing: boolean) => void;
}

export function MobileToolbar({ isEditing, onToggleEditing }: MobileToolbarProps) {
  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-lg border border-teal-100">
        <button
          onClick={() => onToggleEditing(false)}
          title="Previsualizar"
          className={cn(
            'p-2 rounded-full transition-colors',
            !isEditing ? 'bg-teal-600 text-white' : 'text-teal-600 hover:bg-teal-50'
          )}
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggleEditing(true)}
          title="Editar"
          className={cn(
            'p-2 rounded-full transition-colors',
            isEditing ? 'bg-teal-600 text-white' : 'text-teal-600 hover:bg-teal-50'
          )}
        >
          <PencilIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
