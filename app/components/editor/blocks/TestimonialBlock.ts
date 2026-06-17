// Testimonial Block type definitions
export interface Testimonial {
  quote: string;
  author: string;
  imageUrl?: string;
  role?: string;
}

export interface TestimonialData {
  title?: string;
  variant?: 'grid' | 'carousel' | 'featured';
  testimonials?: Testimonial[];
}
