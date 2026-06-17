// Team Block type definitions
export interface TeamMember {
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
}

export interface TeamData {
  title: string;
  subtitle?: string;
  variant?: 'list' | 'grid';
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  nameColor?: string;
  roleColor?: string;
  members?: TeamMember[];
}
