// Gallery Block type definitions
export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface GalleryData {
  images?: GalleryImage[];
  variant?: 'carousel' | 'featured' | 'grid';
  spacing?: 'sm' | 'md' | 'lg' | undefined;
  lightbox?: boolean;
}
