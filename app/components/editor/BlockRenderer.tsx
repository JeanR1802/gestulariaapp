'use client';
import React, { forwardRef } from 'react';
import { BLOCKS, Block, BlockComponentProps, BlockData, BlockConfig } from './blocks';
import { BlockWrapper } from './blocks/BlockWrapper';

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

  const config = BLOCKS[block.type] as BlockConfig | undefined;
  if (!config) return null;

  const Component = (config.renderer || config.component) as React.FC<BlockComponentProps<BlockData>>;

  // Wrap the renderer in a div so the editor can attach refs and highlight styles.
  return (
    <BlockWrapper
      ref={ref}
      block={block}
      isEditing={isEditing}
      isHighlighted={isHighlighted}
      isMobileEdit={isMobileEdit}
      onEdit={onEdit}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onClose={onClose}
      onUpdate={onUpdate}
    >
      <Component data={block.data as BlockData} isEditing={isEditing} onUpdate={onUpdate} />
    </BlockWrapper>
  );
});

BlockRenderer.displayName = 'BlockRenderer';

export default BlockRenderer;