// Minimal stub for editor blocks registry to keep imports working
export type BlockType = string;
export type BlockData = any;
export interface Block { id: number; type: BlockType; data: BlockData }
export interface BlockConfig {
  name?: string;
  description?: string;
  icon?: any;
  category?: string;
  component?: any;
  initialData?: any;
}

// Empty registry: populate later when rebuilding editor architecture
export const BLOCKS: Record<string, BlockConfig> = {};

export default BLOCKS;
