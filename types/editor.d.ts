import { BlockData } from '@/app/components/editor/blocks';

export interface EditorBlock {
    id: number;
    type: keyof typeof import('@/app/components/editor/blocks').BLOCKS;
    data: BlockData;
}
