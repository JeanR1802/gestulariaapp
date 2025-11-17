'use client';
import React, { forwardRef } from 'react';
import { BLOCKS, Block, BlockComponentProps, BlockData } from './blocks';

export interface EditorBlockRendererProps {
  block: Block;
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

// Shared BlockRenderer used in the visual editor (client) and by server rendering tools.
export const BlockRenderer = forwardRef<HTMLDivElement, EditorBlockRendererProps>((props, ref) => {
  const { block, isEditing = false, isHighlighted = false, isMobileEdit = false, onUpdate, onDelete, onEdit, onClose, onMoveUp, onMoveDown } = props;
  if (!block) return null;

  const config = BLOCKS[block.type] as BlockConfig<BlockData> | undefined;
  if (!config) return null;

  const Component = config.renderer as React.FC<BlockComponentProps<BlockData>>;

  // Wrap the renderer in a div so the editor can attach refs and highlight styles.
  return (
    <div ref={ref} data-block-id={String(block.id)} className={isHighlighted ? 'ring-2 ring-blue-300 rounded-lg' : undefined}>
      <Component data={block.data as BlockData} isEditing={isEditing} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} onClose={onClose} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
    </div>
  );
});

export default BlockRenderer;