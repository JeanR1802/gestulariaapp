// FAQ Block type definitions
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  title: string;
  variant?: 'accordion' | 'list';
  backgroundColor?: string;
  titleColor?: string;
  questionColor?: string;
  answerColor?: string;
  items?: FaqItem[];
}
