// Reemplaza el contenido de app/components/editor/blocks/TeamBlock.tsx
'use client';
import React from 'react';
import { InputField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

// --- Interfaces de Datos ---
interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

export interface TeamData {
  variant: 'grid' | 'list';
  title: string;
  subtitle: string;
  members: TeamMember[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  nameColor: string;
  roleColor: string;
}

// --- Componente "Director" ---
export function TeamBlock({ data }: { data: TeamData }) {
  switch (data.variant) {
    case 'list':
      return <TeamList data={data} />;
    default:
      return <TeamGrid data={data} />;
  }
}

// --- Helpers de Estilos ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } as React.CSSProperties };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } as React.CSSProperties };
  }
  return { className: colorValue || defaultClass, style: {} };
};

// --- Componentes Visuales ---
const TeamGrid = ({ data }: { data: TeamData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.nameColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  return (
    <div className={cn(
      { "py-16 px-8": isDesktop, "py-12 px-6": isTablet, "py-8 px-4": isMobile },
      bg.className
    )} style={bg.style}>
      <div className={cn("mx-auto text-center", {
        "max-w-6xl": isDesktop,
        "max-w-4xl": isTablet,
        "max-w-full": isMobile
      })}>
        <h2 className={cn("font-bold", {
          "text-4xl mb-4": isDesktop,
          "text-3xl mb-3": isTablet,
          "text-2xl mb-2": isMobile
        }, titleStyles.className)} style={titleStyles.style}>
          {data.title}
        </h2>
        <p className={cn("mx-auto", {
          "text-xl max-w-3xl mb-12": isDesktop,
          "text-lg max-w-2xl mb-10": isTablet,
          "text-base mb-8": isMobile
        }, subtitleStyles.className)} style={subtitleStyles.style}>
          {data.subtitle}
        </p>
        <div className={cn("grid gap-8", {
          "grid-cols-2 md:grid-cols-4": isDesktop,
          "grid-cols-2 md:grid-cols-3": isTablet,
          "grid-cols-2": isMobile
        })}>
          {(data.members || []).map((member, index) => (
            <div key={index}>
              <img
                className="rounded-full object-cover w-32 h-32 mx-auto mb-4 shadow-md"
                src={member.imageUrl || 'https://placehold.co/200x200/e2e8f0/64748b?text=Foto'}
                alt={member.name}
              />
              <h3 className={cn("font-semibold", {
                "text-xl": isDesktop,
                "text-lg": isTablet,
                "text-base": isMobile
              }, nameStyles.className)} style={nameStyles.style}>
                {member.name}
              </h3>
              <p className={cn({
                "text-base": isDesktop || isTablet,
                "text-sm": isMobile
              }, roleStyles.className)} style={roleStyles.style}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamList = ({ data }: { data: TeamData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.nameColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  return (
    <div className={cn(
      { "py-16 px-8": isDesktop, "py-12 px-6": isTablet, "py-8 px-4": isMobile },
      bg.className
    )} style={bg.style}>
      <div className={cn("mx-auto", {
        "max-w-4xl": isDesktop,
        "max-w-3xl": isTablet,
        "max-w-full": isMobile
      })}>
        <div className="text-center">
          <h2 className={cn("font-bold", {
            "text-4xl mb-4": isDesktop,
            "text-3xl mb-3": isTablet,
            "text-2xl mb-2": isMobile
          }, titleStyles.className)} style={titleStyles.style}>
            {data.title}
          </h2>
          <p className={cn("mx-auto", {
            "text-xl max-w-3xl mb-12": isDesktop,
            "text-lg max-w-2xl mb-10": isTablet,
            "text-base mb-8": isMobile
          }, subtitleStyles.className)} style={subtitleStyles.style}>
            {data.subtitle}
          </p>
        </div>
        <div className="space-y-8">
          {(data.members || []).map((member, index) => (
            <div key={index} className="flex items-center gap-6">
              <img
                className="rounded-full object-cover w-20 h-20 shadow-sm"
                src={member.imageUrl || 'https://placehold.co/100x100/e2e8f0/64748b?text=Foto'}
                alt={member.name}
              />
              <div>
                <h3 className={cn("font-semibold", {
                  "text-2xl": isDesktop,
                  "text-xl": isTablet,
                  "text-lg": isMobile
                }, nameStyles.className)} style={nameStyles.style}>
                  {member.name}
                </h3>
                <p className={cn({
                  "text-lg": isDesktop,
                  "text-base": isTablet || isMobile
                }, roleStyles.className)} style={roleStyles.style}>
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Editor de CONTENIDO ---
export function TeamContentEditor({
  data,
  updateData
}: {
  data: TeamData;
  updateData: (key: keyof TeamData, value: string | TeamMember[]) => void;
}) {
  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...(data.members || [])];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateData('members', newMembers);
  };

  const addMember = () => {
    const newMembers = [...(data.members || []), { name: '', role: '', imageUrl: '' }];
    updateData('members', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = (data.members || []).filter((_, i) => i !== index);
    updateData('members', newMembers);
  };

  return (
    <div className="space-y-4">
      <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      <InputField label="Subtítulo de la Sección" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />

      {(data.members || []).map((member, index) => (
        <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50 relative">
          <button
            onClick={() => removeMember(index)}
            className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600"
            title="Eliminar miembro"
          >
            <XMarkIcon className="w-4 h-4 mx-auto" />
          </button>
          <h4 className="font-medium text-sm text-slate-700">Miembro {index + 1}</h4>
          <InputField label="URL de la Imagen" value={member.imageUrl} onChange={(e) => handleMemberChange(index, 'imageUrl', e.target.value)} />
          <InputField label="Nombre" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} />
          <InputField label="Cargo" value={member.role} onChange={(e) => handleMemberChange(index, 'role', e.target.value)} />
        </div>
      ))}

      <button
        onClick={addMember}
        className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Añadir Miembro
      </button>
    </div>
  );
}

// --- Editor de ESTILO ---
export function TeamStyleEditor({
  data,
  updateData
}: {
  data: TeamData;
  updateData: (key: keyof TeamData, value: string) => void;
}) {
  // Helper para extraer el color hexadecimal si es personalizado
  const getCustomColor = (color: string | undefined) => {
    if (color && color.startsWith('[#') && color.endsWith(']')) {
      return color.slice(2, -1);
    }
    return '';
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <input
          type="color"
          aria-label="Color personalizado de fondo"
          value={getCustomColor(data.backgroundColor) || '#ffffff'}
          onChange={e => updateData('backgroundColor', `[${e.target.value}]`)}
          style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
        <input
          type="color"
          aria-label="Color personalizado de título"
          value={getCustomColor(data.titleColor) || '#000000'}
          onChange={e => updateData('titleColor', `[${e.target.value}]`)}
          style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
        <input
          type="color"
          aria-label="Color personalizado de subtítulo"
          value={getCustomColor(data.subtitleColor) || '#666666'}
          onChange={e => updateData('subtitleColor', `[${e.target.value}]`)}
          style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color de Nombres" selectedColor={data.nameColor} onChange={(color) => updateData('nameColor', color)} />
        <input
          type="color"
          aria-label="Color personalizado de nombres"
          value={getCustomColor(data.nameColor) || '#111111'}
          onChange={e => updateData('nameColor', `[${e.target.value}]`)}
          style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color de Cargos" selectedColor={data.roleColor} onChange={(color) => updateData('roleColor', color)} />
        <input
          type="color"
          aria-label="Color personalizado de cargos"
          value={getCustomColor(data.roleColor) || '#888888'}
          onChange={e => updateData('roleColor', `[${e.target.value}]`)}
          style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0 }}
        />
      </div>
    </div>
  );
}