'use client';
import React, { useRef, JSX } from 'react';
import { Editable } from './TextBlock';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';
import { BlockComponentProps } from './index';

// --- Interfaces de Datos ---
export interface HeroData {
  variant: 'default' | 'leftImage' | 'darkMinimal';
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

// --- Lógica mínima para colores personalizados (solo hex) ---
const getCustomTextStyle = (colorValue?: string) =>
  colorValue?.startsWith('[#') ? { color: colorValue.slice(1, -1) } : undefined;

const getCustomBgStyle = (colorValue?: string) =>
  colorValue?.startsWith('[#') ? { backgroundColor: colorValue.slice(1, -1) } : undefined;

// --- Componente de Bloque (Visual + Edición Inline) ---
export function HeroBlock({ data, isEditing, onUpdate }: BlockComponentProps<HeroData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'leftImage':
      return <HeroLeftImage {...props} />;
    case 'darkMinimal':
      return <HeroDarkMinimal {...props} />;
    default:
      return <HeroDefault {...props} />;
  }
}

// --- Variantes ---
const HeroDefault = ({ data, isEditing, onUpdate }: BlockComponentProps<HeroData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyle = getCustomBgStyle(data.backgroundColor);
  const titleStyle = getCustomTextStyle(data.titleColor);
  const subtitleStyle = getCustomTextStyle(data.subtitleColor);

  const handleUpdate = (key: keyof HeroData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn('text-center bg-white', { 'py-24 px-8': isDesktop, 'py-20 px-6': isTablet, 'py-16 px-4': isMobile })}
      style={bgStyle}
    >
      <Editable
        tagName="h1"
        value={data.title}
        onUpdate={(v) => handleUpdate('title', v)}
        isEditing={isEditing}
        className={cn('font-bold', { 'text-5xl mb-6': isDesktop, 'text-4xl mb-4': isTablet, 'text-3xl mb-3': isMobile })}
        style={titleStyle}
      />
      <Editable
        tagName="p"
        value={data.subtitle}
        onUpdate={(v) => handleUpdate('subtitle', v)}
        isEditing={isEditing}
        className={cn('max-w-3xl mx-auto', { 'text-xl mb-10': isDesktop, 'text-lg mb-8': isTablet, 'text-base mb-6': isMobile })}
        style={subtitleStyle}
      />
      <Editable
        tagName="a"
        value={data.buttonText}
        onUpdate={(v) => handleUpdate('buttonText', v)}
        isEditing={isEditing}
        className={cn('inline-block bg-gray-800 text-white font-bold rounded', { 'px-8 py-4 text-lg': isDesktop, 'px-7 py-3 text-base': isTablet, 'px-6 py-2.5 text-sm': isMobile })}
      />
    </div>
  );
};

const HeroLeftImage = ({ data, isEditing, onUpdate }: BlockComponentProps<HeroData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyle = getCustomBgStyle(data.backgroundColor);
  const titleStyle = getCustomTextStyle(data.titleColor);
  const subtitleStyle = getCustomTextStyle(data.subtitleColor);

  const handleUpdate = (key: keyof HeroData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn('bg-white', { 'py-24 px-8': isDesktop, 'py-20 px-6': isTablet, 'py-16 px-4': isMobile })}
      style={bgStyle}
    >
      <div
        className={cn('mx-auto grid items-center', {
          'max-w-6xl gap-16 grid-cols-2': isDesktop,
          'max-w-4xl gap-12 grid-cols-2': isTablet,
          'max-w-full gap-8 grid-cols-1': isMobile,
        })}
      >
        <div className={cn({ 'text-left': isDesktop || isTablet, 'text-center': isMobile })}>
          <Editable
            tagName="h1"
            value={data.title}
            onUpdate={(v) => handleUpdate('title', v)}
            isEditing={isEditing}
            className={cn('font-bold', { 'text-5xl mb-6': isDesktop, 'text-4xl mb-4': isTablet, 'text-3xl mb-3': isMobile })}
            style={titleStyle}
          />
          <Editable
            tagName="p"
            value={data.subtitle}
            onUpdate={(v) => handleUpdate('subtitle', v)}
            isEditing={isEditing}
            className={cn({ 'text-xl mb-10': isDesktop, 'text-lg mb-8': isTablet, 'text-base mb-6': isMobile })}
            style={subtitleStyle}
          />
          <Editable
            tagName="a"
            value={data.buttonText}
            onUpdate={(v) => handleUpdate('buttonText', v)}
            isEditing={isEditing}
            className={cn('inline-block bg-gray-800 text-white font-bold rounded', { 'px-8 py-4 text-lg': isDesktop, 'px-7 py-3 text-base': isTablet, 'px-6 py-2.5 text-sm': isMobile })}
          />
        </div>
        <div className="w-full">
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center border border-gray-400">
            Imagen Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroDarkMinimal = ({ data, isEditing, onUpdate }: BlockComponentProps<HeroData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyle = getCustomBgStyle(data.backgroundColor);
  const titleStyle = getCustomTextStyle(data.titleColor);

  const handleUpdate = (key: keyof HeroData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn('text-center bg-white', { 'py-32 px-8': isDesktop, 'py-28 px-6': isTablet, 'py-24 px-4': isMobile })}
      style={bgStyle}
    >
      <Editable
        tagName="h1"
        value={data.title}
        onUpdate={(v) => handleUpdate('title', v)}
        isEditing={isEditing}
        className={cn('font-bold', { 'text-6xl mb-12': isDesktop, 'text-5xl mb-10': isTablet, 'text-4xl mb-8': isMobile })}
        style={titleStyle}
      />
      <Editable
        tagName="a"
        value={data.buttonText}
        onUpdate={(v) => handleUpdate('buttonText', v)}
        isEditing={isEditing}
        className={cn('inline-block bg-gray-800 text-white font-bold rounded', { 'px-10 py-5 text-xl': isDesktop, 'px-8 py-4 text-lg': isTablet, 'px-7 py-3 text-base': isMobile })}
      />
    </div>
  );
};

// --- Editor de CONTENIDO ---
export function HeroContentEditor({
  data,
  updateData,
}: {
  data: HeroData;
  updateData: (key: keyof HeroData, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <InputField
        label="Título Principal"
        value={data.title}
        onChange={(e) => updateData('title', e.target.value)}
      />
      {data.variant !== 'darkMinimal' && (
        <TextareaField
          label="Subtítulo"
          value={data.subtitle}
          rows={3}
          onChange={(e) => updateData('subtitle', e.target.value)}
        />
      )}
      <InputField
        label="Texto del Botón"
        value={data.buttonText}
        onChange={(e) => updateData('buttonText', e.target.value)}
      />
      {data.variant === 'leftImage' && (
        <InputField
          label="URL de la Imagen"
          value={data.imageUrl || ''}
          onChange={(e) => updateData('imageUrl', e.target.value)}
        />
      )}
    </div>
  );
}

// --- Editor de ESTILO ---
export function HeroStyleEditor({
  data,
  updateData,
}: {
  data: HeroData;
  updateData: (key: keyof HeroData, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ColorPalette
          label="Fondo"
          selectedColor={data.backgroundColor || ''}
          onChange={(color) => updateData('backgroundColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette
          label="Título"
          selectedColor={data.titleColor || ''}
          onChange={(color) => updateData('titleColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette
          label="Subtítulo"
          selectedColor={data.subtitleColor || ''}
          onChange={(color) => updateData('subtitleColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <ColorPalette
          label="Botón fondo"
          selectedColor={data.buttonBgColor || ''}
          onChange={(color) => updateData('buttonBgColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette
          label="Botón texto"
          selectedColor={data.buttonTextColor || ''}
          onChange={(color) => updateData('buttonTextColor', color)}
        />
      </div>
    </div>
  );
}
