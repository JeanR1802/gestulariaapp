// Stub: BlockRenderer neutralized (blocks architecture removed during cleanup)
import React, { forwardRef } from 'react';

export interface EditorBlockRendererProps {
  block?: any;
  isEditing?: boolean;
  isHighlighted?: boolean;
  isMobileEdit?: boolean;
  onUpdate?: (key: string, value: unknown) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const BlockRenderer = forwardRef<HTMLDivElement, EditorBlockRendererProps>((props, ref) => (
  <div ref={ref}></div>
));

BlockRenderer.displayName = 'BlockRenderer';

export default BlockRenderer;