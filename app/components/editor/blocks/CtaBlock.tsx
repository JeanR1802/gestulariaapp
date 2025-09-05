import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

export interface CtaData {
  variant: 'dark' | 'light' | 'split';
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonLink?: string;
  imageUrl?: string;
}

export function CtaBlock({ data }: { data: CtaData }) {
  // ... (switch para las variantes)
}
// ... (Componentes de variantes)

export function CtaEditor({ data, updateData }: { data: CtaData, updateData: (key: keyof CtaData, value: any) => void }) {
  // ... (editor con todas las paletas de colores)
}