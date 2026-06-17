// Image Block type definitions
export interface ImageData {
  imageUrl: string;
  alt?: string;
  caption?: string;
  variant?: 'fullwidth' | 'contained';
}
