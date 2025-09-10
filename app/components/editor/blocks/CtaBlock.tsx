'use client';
import React, { useRef, JSX } from 'react';
import { useEditable } from 'use-editable';
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

// --- Helper Component for Inline Editing ---
const Editable = ({
  tagName,
  value,
  onUpdate,
  isEditing,
  className,
  style,
}: {
  tagName: keyof JSX.IntrinsicElements;
  value: string;
  onUpdate: (newValue: string) => void;
  isEditing?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLElement>(null);
  useEditable(
    ref,
    (newValue) => onUpdate(newValue.replace(/<[^>]*>?/gm, '')),
    { disabled: !isEditing }
  );

  return React.createElement(
    tagName,
    {
      ref: ref,
      className: cn(className, {
        'outline-dashed outline-1 outline-gray-400 focus:outline-blue-500': isEditing,
      }),
      style: style,
    },
    value
  );
};

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getBackgroundStyles = (
  colorValue: string | undefined,
  defaultClass = 'bg-white'
) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
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
