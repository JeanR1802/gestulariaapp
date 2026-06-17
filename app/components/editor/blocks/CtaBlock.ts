// CTA Block type definitions
export interface CtaData {
  title: string;
  subtitle?: string;
  buttonText?: string;
  variant?: 'split' | 'light' | 'dark';
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  imageUrl?: string;
}
