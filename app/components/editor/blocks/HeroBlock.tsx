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

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getBackgroundStyles = (
  colorValue: string | undefined,
  defaultClass = 'bg-slate-100'
) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getButtonStyles = (
  bgColor: string | undefined,
  textColor: string | undefined,
  defaultBg: string = 'bg-blue-600',
  defaultText: string = 'text-white'
) => {
  const isCustomBg = bgColor?.startsWith('[#');
  const isCustomText = textColor?.startsWith('[#');
  const style: React.CSSProperties = {};
  if (isCustomBg && bgColor) style.backgroundColor = bgColor.slice(1, -1);
  if (isCustomText && textColor) style.color = textColor.slice(1, -1);

  return {
    className: cn(
      !isCustomBg ? bgColor || defaultBg : '',
      !isCustomText ? textColor || defaultText : ''
    ),
    style: style,
  };
};

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
  const bg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  const handleUpdate = (key: keyof HeroData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn(
        'text-center',
        { 'py-24 px-8': isDesktop, 'py-20 px-6': isTablet, 'py-16 px-4': isMobile },
        bg.className
      )}
      style={bg.style}
    >
      <Editable
        tagName="h1"
        value={data.title}
        onUpdate={(v) => handleUpdate('title', v)}
        isEditing={isEditing}
        className={cn(
          `font-bold`,
          { 'text-5xl mb-6': isDesktop, 'text-4xl mb-4': isTablet, 'text-3xl mb-3': isMobile },
          titleStyles.className
        )}
        style={titleStyles.style}
      />
      <Editable
        tagName="p"
        value={data.subtitle}
        onUpdate={(v) => handleUpdate('subtitle', v)}
        isEditing={isEditing}
        className={cn(
          `max-w-3xl mx-auto`,
          { 'text-xl mb-10': isDesktop, 'text-lg mb-8': isTablet, 'text-base mb-6': isMobile },
          subtitleStyles.className
        )}
        style={subtitleStyles.style}
      />
      <Editable
        tagName="a"
        value={data.buttonText}
        onUpdate={(v) => handleUpdate('buttonText', v)}
        isEditing={isEditing}
        className={cn(
          `inline-block rounded-md font-semibold transition-transform hover:scale-105`,
          { 'px-8 py-4 text-lg': isDesktop, 'px-7 py-3 text-base': isTablet, 'px-6 py-2.5 text-sm': isMobile },
          buttonStyles.className
        )}
        style={buttonStyles.style}
      />
    </div>
  );
};

const HeroLeftImage = ({ data, isEditing, onUpdate }: BlockComponentProps<HeroData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  const handleUpdate = (key: keyof HeroData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn(
        { 'py-24 px-8': isDesktop, 'py-20 px-6': isTablet, 'py-16 px-4': isMobile },
        bg.className
      )}
      style={bg.style}
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
            className={cn(
              `font-bold`,
              { 'text-5xl mb-6': isDesktop, 'text-4xl mb-4': isTablet, 'text-3xl mb-3': isMobile },
              titleStyles.className
            )}
            style={titleStyles.style}
          />
          <Editable
            tagName="p"
            value={data.subtitle}
            onUpdate={(v) => handleUpdate('subtitle', v)}
            isEditing={isEditing}
            className={cn(
              { 'text-xl mb-10': isDesktop, 'text-lg mb-8': isTablet, 'text-base mb-6': isMobile },
              subtitleStyles.className
            )}
            style={subtitleStyles.style}
          />
          <Editable
            tagName="a"
            value={data.buttonText}
            onUpdate={(v) => handleUpdate('buttonText', v)}
            isEditing={isEditing}
            className={cn(
              `inline-block rounded-md font-semibold transition-transform hover:scale-105`,
              { 'px-8 py-4 text-lg': isDesktop, 'px-7 py-3 text-base': isTablet, 'px-6 py-2.5 text-sm': isMobile },
              buttonStyles.className
            )}
            style={buttonStyles.style}
          />
        </div>
        <div className="rounded-lg overflow-hidden bg-slate-100">
          <img
            src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}
            alt={data.title}
            className="w-full h-full object-cover aspect-video"
          />
        </div>
      </div>
    </div>
  );
};

const HeroDarkMinimal = ({ data, isEditing, onUpdate }: BlockComponentProps<HeroData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-slate-900');
  const titleStyles = getStyles(data.titleColor, 'text-white');
  const buttonStyles = getButtonStyles(
    data.buttonBgColor,
    data.buttonTextColor,
    'bg-white',
    'text-slate-800'
  );

  const handleUpdate = (key: keyof HeroData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn(
        'text-center',
        { 'py-32 px-8': isDesktop, 'py-28 px-6': isTablet, 'py-24 px-4': isMobile },
        bg.className
      )}
      style={bg.style}
    >
      <Editable
        tagName="h1"
        value={data.title}
        onUpdate={(v) => handleUpdate('title', v)}
        isEditing={isEditing}
        className={cn(
          `font-bold`,
          { 'text-6xl mb-12': isDesktop, 'text-5xl mb-10': isTablet, 'text-4xl mb-8': isMobile },
          titleStyles.className
        )}
        style={titleStyles.style}
      />
      <Editable
        tagName="a"
        value={data.buttonText}
        onUpdate={(v) => handleUpdate('buttonText', v)}
        isEditing={isEditing}
        className={cn(
          `inline-block rounded-md font-semibold transition-transform hover:scale-105`,
          { 'px-10 py-5 text-xl': isDesktop, 'px-8 py-4 text-lg': isTablet, 'px-7 py-3 text-base': isMobile },
          buttonStyles.className
        )}
        style={buttonStyles.style}
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
