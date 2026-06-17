// Stack Block type definitions
export interface StackElement {
  type: 'paragraph' | 'heading' | 'image' | 'button' | 'spacer';
  data: Record<string, any>;
}

export interface StackData {
  elements?: StackElement[];
  backgroundColor?: string;
}
