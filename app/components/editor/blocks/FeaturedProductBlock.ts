// Featured Product Block type definitions
export interface FeaturedProductData {
  title: string;
  description?: string;
  price: string;
  tag?: string;
  imageUrl?: string;
  rating?: number;
  buttonText?: string;
  variant?: 'background' | 'card' | 'minimal';
  backgroundColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}
