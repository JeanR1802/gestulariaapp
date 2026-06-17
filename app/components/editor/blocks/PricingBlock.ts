// Pricing Block type definitions
export interface PricingPlan {
  name: string;
  price: number;
  frequency?: string;
  features?: string[];
  featured?: boolean;
  buttonText?: string;
}

export interface PricingData {
  title: string;
  subtitle?: string;
  variant?: 'simple' | 'featured' | 'table' | 'list';
  backgroundColor?: string;
  titleColor?: string;
  plans?: PricingPlan[];
  featuredCardColor?: string;
}
