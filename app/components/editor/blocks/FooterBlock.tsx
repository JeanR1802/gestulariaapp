'use client';
import React, { useRef, JSX } from 'react';
import { useEditable } from 'use-editable';
import { InputField } from './InputField';
import { cn } from '@/lib/utils';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { BlockComponentProps } from './index';

// --- Interfaces de Datos ---
interface SocialLink { platform: string; url: string; }
interface LinkColumn { title: string; links: string[]; }

export interface FooterData {
  variant: 'simple' | 'multiColumn' | 'minimal';
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  copyrightText: string;
  socialLinks: SocialLink[];
  columns: LinkColumn[];
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

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-slate-800') => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

// --- Componente "Director" ---
export function FooterBlock({ data, isEditing, onUpdate }: BlockComponentProps<FooterData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'multiColumn':
      return <FooterMultiColumn {...props} />;
    case 'minimal':
      return <FooterMinimal {...props} />;
    default:
      return <FooterSimple {...props} />;
  }
}

// --- Componentes Visuales ---
const FooterSimple = ({ data, isEditing, onUpdate }: BlockComponentProps<FooterData>) => {
  const bgStyles = getBackgroundStyles(data.backgroundColor);
  const textStyles = getStyles(data.textColor, 'text-slate-400');
  const linkStyles = getStyles(data.linkColor, 'text-slate-300');

  const handleUpdate = (key: keyof FooterData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <footer className={cn('py-8 px-4', bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Editable
          tagName="p"
          value={data.copyrightText}
          onUpdate={(v) => handleUpdate('copyrightText', v)}
          isEditing={isEditing}
          className={cn('text-sm', textStyles.className)}
          style={textStyles.style}
        />
        <div className="flex gap-4">
          {(data.socialLinks || []).map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={cn('hover:text-white transition-colors', linkStyles.className)}
              style={linkStyles.style}
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

const FooterMultiColumn = ({ data, isEditing, onUpdate }: BlockComponentProps<FooterData>) => {
  const bgStyles = getBackgroundStyles(data.backgroundColor);
  const textStyles = getStyles(data.textColor, 'text-slate-400');
  const linkStyles = getStyles(data.linkColor, 'text-slate-300');

  const handleUpdate = (key: keyof FooterData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <footer className={cn('py-16 px-4', bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {(data.columns || []).map((column, index) => (
            <div key={index}>
              <h3 className={cn('font-semibold mb-4', textStyles.className)} style={textStyles.style}>
                {column.title}
              </h3>
              <ul className="space-y-2">
                {(column.links || []).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className={cn('hover:text-white transition-colors', linkStyles.className)} style={linkStyles.style}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Editable
            tagName="p"
            value={data.copyrightText}
            onUpdate={(v) => handleUpdate('copyrightText', v)}
            isEditing={isEditing}
            className={cn('text-sm', textStyles.className)}
            style={textStyles.style}
          />
        </div>
      </div>
    </footer>
  );
};

const FooterMinimal = ({ data, isEditing, onUpdate }: BlockComponentProps<FooterData>) => {
  const bgStyles = getBackgroundStyles(data.backgroundColor);
  const textStyles = getStyles(data.textColor, 'text-slate-400');

  const handleUpdate = (key: keyof FooterData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <footer className={cn('py-6 px-4', bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-7xl mx-auto text-center">
        <Editable
          tagName="p"
          value={data.copyrightText}
          onUpdate={(v) => handleUpdate('copyrightText', v)}
          isEditing={isEditing}
          className={cn('text-sm', textStyles.className)}
          style={textStyles.style}
        />
      </div>
    </footer>
  );
};

// --- Editor de CONTENIDO (SEPARADO) ---
export function FooterContentEditor({ data, updateData }: { data: FooterData; updateData: (key: keyof FooterData, value: string | SocialLink[] | LinkColumn[]) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Texto de Copyright" value={data.copyrightText} onChange={(e) => updateData('copyrightText', e.target.value)} />
      <div className="text-xs text-center text-slate-400 p-2 bg-slate-50 rounded-md">
        La edición de enlaces y columnas se añadirá en una futura actualización.
      </div>
    </div>
  );
}

// --- Editor de ESTILO (SEPARADO) ---
export function FooterStyleEditor({ data, updateData }: { data: FooterData; updateData: (key: keyof FooterData, value: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ColorPalette label="Fondo" selectedColor={data.backgroundColor || ''} onChange={(color) => updateData('backgroundColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Texto" selectedColor={data.textColor || ''} onChange={(color) => updateData('textColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <ColorPalette label="Enlaces" selectedColor={data.linkColor || ''} onChange={(color) => updateData('linkColor', color)} />
      </div>
    </div>
  );
}
