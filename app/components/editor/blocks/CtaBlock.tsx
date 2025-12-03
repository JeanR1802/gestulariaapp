'use client';
import React, { JSX } from 'react';
import { Editable } from './TextBlock';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';
import { BlockComponentProps } from './index';

// --- Interfaces de Datos ---
export interface CtaData {
  variant: 'dark' | 'light' | 'split';
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl?: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
}

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff', 'text-black': '#000000',
    'text-slate-50': '#f8fafc', 'text-slate-100': '#f1f5f9', 'text-slate-200': '#e2e8f0',
    'text-slate-300': '#cbd5e1', 'text-slate-400': '#94a3b8', 'text-slate-500': '#64748b',
    'text-slate-600': '#475569', 'text-slate-700': '#334155', 'text-slate-800': '#1e293b',
    'text-slate-900': '#0f172a', 'text-blue-600': '#2563eb', 'text-blue-500': '#3b82f6',
  };
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } };
  }
  const finalClass = colorValue || defaultClass;
  return { className: finalClass, style: { color: colorMap[finalClass] || '#1e293b' } };
};

const getBackgroundStyles = (
  colorValue: string | undefined,
  defaultClass = 'bg-white'
) => {
  const bgMap: Record<string, string> = {
    'bg-white': '#ffffff', 'bg-black': '#000000',
    'bg-slate-50': '#f8fafc', 'bg-slate-100': '#f1f5f9', 'bg-slate-200': '#e2e8f0',
    'bg-slate-300': '#cbd5e1', 'bg-slate-400': '#94a3b8', 'bg-slate-500': '#64748b',
    'bg-slate-600': '#475569', 'bg-slate-700': '#334155', 'bg-slate-800': '#1e293b',
    'bg-slate-900': '#0f172a', 'bg-blue-600': '#2563eb', 'bg-blue-500': '#3b82f6',
  };
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  const finalClass = colorValue || defaultClass;
  return { className: finalClass, style: { backgroundColor: bgMap[finalClass] || '#ffffff' } };
};

const getButtonStyles = (
  bgColor: string | undefined,
  textColor: string | undefined,
  defaultBg: string,
  defaultText: string
) => {
  const isCustomBg = bgColor?.startsWith('[#');
  const isCustomText = textColor?.startsWith('[#');
  const style: React.CSSProperties = {};
  
  // Mapear clases Tailwind comunes a sus valores hex
  const bgMap: Record<string, string> = {
    'bg-blue-600': '#2563eb',
    'bg-blue-500': '#3b82f6',
    'bg-white': '#ffffff',
    'bg-slate-800': '#1e293b',
    'bg-slate-900': '#0f172a',
    'bg-black': '#000000',
  };
  const textMap: Record<string, string> = {
    'text-white': '#ffffff',
    'text-slate-800': '#1e293b',
    'text-slate-900': '#0f172a',
    'text-blue-600': '#2563eb',
    'text-black': '#000000',
  };
  
  // SIEMPRE aplicar inline styles para que se vean en el editor
  if (isCustomBg && bgColor) {
    style.backgroundColor = bgColor.slice(1, -1);
  } else {
    const bgClass = bgColor || defaultBg;
    style.backgroundColor = bgMap[bgClass] || '#2563eb';
  }
  
  if (isCustomText && textColor) {
    style.color = textColor.slice(1, -1);
  } else {
    const textClass = textColor || defaultText;
    style.color = textMap[textClass] || '#ffffff';
  }

  return {
    className: cn(
      !isCustomBg ? bgColor || defaultBg : '',
      !isCustomText ? textColor || defaultText : ''
    ),
    style: style,
  };
};

// --- Componente "Director" con edición inline ---
export function CtaBlock({ data, isEditing, onUpdate }: BlockComponentProps<CtaData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'light':
      return <CtaLight {...props} />;
    case 'split':
      return <CtaSplit {...props} />;
    default:
      return <CtaDark {...props} />;
  }
}

// --- Componentes Internos para Cada Variante ---
const CtaDark = ({ data, isEditing, onUpdate }: BlockComponentProps<CtaData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-800');
  const titleStyles = getStyles(data.titleColor, 'text-white');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-300');
  const buttonStyles = getButtonStyles(
    data.buttonBgColor,
    data.buttonTextColor,
    'bg-blue-600',
    'text-white'
  );

  const handleUpdate = (key: keyof CtaData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn(
        'text-center',
        { 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-10 px-4': isMobile },
        bgStyles.className
      )}
      style={bgStyles.style}
    >
      <Editable
        tagName="h2"
        value={data.title}
        onUpdate={(v) => handleUpdate('title', v)}
        isEditing={isEditing}
        className={cn(
          'font-bold',
          { 'text-4xl mb-4': isDesktop, 'text-3xl mb-3': isTablet, 'text-2xl mb-2': isMobile },
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
          'max-w-2xl mx-auto',
          { 'text-lg mb-8': isDesktop || isTablet, 'text-base mb-6': isMobile },
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
          'inline-block rounded-md font-semibold',
          { 'px-6 py-3': isDesktop || isTablet, 'px-5 py-2.5 text-sm': isMobile },
          buttonStyles.className
        )}
        style={buttonStyles.style}
      />
    </div>
  );
};

const CtaLight = ({ data, isEditing, onUpdate }: BlockComponentProps<CtaData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-100');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(
    data.buttonBgColor,
    data.buttonTextColor,
    'bg-blue-600',
    'text-white'
  );

  const handleUpdate = (key: keyof CtaData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn(
        'text-center',
        { 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-10 px-4': isMobile },
        bgStyles.className
      )}
      style={bgStyles.style}
    >
      <Editable
        tagName="h2"
        value={data.title}
        onUpdate={(v) => handleUpdate('title', v)}
        isEditing={isEditing}
        className={cn(
          'font-bold',
          { 'text-4xl mb-4': isDesktop, 'text-3xl mb-3': isTablet, 'text-2xl mb-2': isMobile },
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
          'max-w-2xl mx-auto',
          { 'text-lg mb-8': isDesktop || isTablet, 'text-base mb-6': isMobile },
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
          'inline-block rounded-md font-semibold',
          { 'px-6 py-3': isDesktop || isTablet, 'px-5 py-2.5 text-sm': isMobile },
          buttonStyles.className
        )}
        style={buttonStyles.style}
      />
    </div>
  );
};

const CtaSplit = ({ data, isEditing, onUpdate }: BlockComponentProps<CtaData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(
    data.buttonBgColor,
    data.buttonTextColor,
    'bg-blue-600',
    'text-white'
  );

  const handleUpdate = (key: keyof CtaData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <div
      className={cn(
        'grid',
        { 'grid-cols-2 items-center': isDesktop || isTablet, 'grid-cols-1': isMobile },
        bgStyles.className
      )}
      style={bgStyles.style}
    >
      <div className={cn({ 'p-16': isDesktop, 'p-12': isTablet, 'p-8 text-center': isMobile })}>
        <Editable
          tagName="h2"
          value={data.title}
          onUpdate={(v) => handleUpdate('title', v)}
          isEditing={isEditing}
          className={cn(
            'font-bold',
            { 'text-4xl mb-4': isDesktop, 'text-3xl mb-3': isTablet, 'text-2xl mb-2': isMobile },
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
            { 'text-lg mb-8': isDesktop || isTablet, 'text-base mb-6': isMobile },
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
            'inline-block rounded-md font-semibold',
            { 'px-6 py-3': isDesktop || isTablet, 'px-5 py-2.5 text-sm': isMobile },
            buttonStyles.className
          )}
          style={buttonStyles.style}
        />
      </div>
      {!isMobile && (
        <div className="h-full">
          <img
            src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

// --- Editor de CONTENIDO (SEPARADO) ---
export function CtaContentEditor({ data, updateData }: { data: CtaData; updateData: (key: keyof CtaData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Título" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      <TextareaField label="Subtítulo" value={data.subtitle} rows={3} onChange={(e) => updateData('subtitle', e.target.value)} />
      <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
      {data.variant === 'split' && (
        <InputField label="URL de Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />
      )}
    </div>
  );
}

// --- Editor de ESTILO (SEPARADO) ---
export function CtaStyleEditor({ data, updateData }: { data: CtaData; updateData: (key: keyof CtaData, value: string) => void }) {
  return (
    <div className="space-y-3 p-4 max-w-xl mx-auto">
      <ColorPalette
        label="Fondo"
        selectedColor={data.backgroundColor || ''}
        onChange={(color) => updateData('backgroundColor', color)}
      />
      <TextColorPalette
        label="Título"
        selectedColor={data.titleColor || ''}
        onChange={(color) => updateData('titleColor', color)}
      />
      <TextColorPalette
        label="Subtítulo"
        selectedColor={data.subtitleColor || ''}
        onChange={(color) => updateData('subtitleColor', color)}
      />
      <ButtonColorPalette
        label="Botón"
        selectedBgColor={data.buttonBgColor || ''}
        selectedTextColor={data.buttonTextColor || ''}
        onChange={(bg, text) => {
          updateData('buttonBgColor', bg);
          updateData('buttonTextColor', text);
        }}
      />
    </div>
  );
}
