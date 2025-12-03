'use client';
import React, { useRef, JSX } from 'react';
import { Editable } from './TextBlock';
import { InputField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { BlockComponentProps } from './index';

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

// --- Helpers de Estilos ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff', 'text-slate-600': '#475569', 'text-slate-700': '#334155',
    'text-slate-800': '#1e293b', 'text-slate-900': '#0f172a', 'text-blue-600': '#2563eb',
  };
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } as React.CSSProperties };
  }
  const finalClass = colorValue || defaultClass;
  return { className: finalClass, style: { color: colorMap[finalClass] || '#334155' } as React.CSSProperties };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  const bgMap: Record<string, string> = {
    'bg-white': '#ffffff', 'bg-slate-50': '#f8fafc', 'bg-slate-100': '#f1f5f9',
    'bg-blue-600': '#2563eb',
  };
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } as React.CSSProperties };
  }
  const finalClass = colorValue || defaultClass;
  return { className: finalClass, style: { backgroundColor: bgMap[finalClass] || '#ffffff' } as React.CSSProperties };
};

// --- Utilidades de actualización inmutable ---
function updateMemberArray(members: TeamMember[] = [], index: number, field: keyof TeamMember, value: string): TeamMember[] {
  const next = [...members];
  next[index] = { ...next[index], [field]: value } as TeamMember;
  return next;
}

// --- Componente "Director" ---
export function TeamBlock({ data, isEditing, onUpdate }: BlockComponentProps<TeamData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'list':
      return <TeamList {...props} />;
    default:
      return <TeamGrid {...props} />;
  }
}

// --- Componentes Visuales ---
const TeamGrid = ({ data, isEditing, onUpdate }: BlockComponentProps<TeamData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.nameColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  const handleUpdate = (key: keyof TeamData, value: string | TeamMember[]) => { if (onUpdate) onUpdate(key as string, value); };
  const handleMember = (idx: number, field: keyof TeamMember, value: string) => handleUpdate('members', updateMemberArray(data.members, idx, field, value));

  return (
    <div className={cn({ 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-8 px-4': isMobile }, bg.className)} style={bg.style}>
      <div className={cn('mx-auto text-center', { 'max-w-6xl': isDesktop, 'max-w-4xl': isTablet, 'max-w-full': isMobile })}>
        <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdate('title', v)} isEditing={isEditing} className={cn('font-bold', { 'text-4xl mb-4': isDesktop, 'text-3xl mb-3': isTablet, 'text-2xl mb-2': isMobile }, titleStyles.className)} style={titleStyles.style} />
        <Editable tagName="p" value={data.subtitle} onUpdate={(v) => handleUpdate('subtitle', v)} isEditing={isEditing} className={cn('mx-auto', { 'text-xl max-w-3xl mb-12': isDesktop, 'text-lg max-w-2xl mb-10': isTablet, 'text-base mb-8': isMobile }, subtitleStyles.className)} style={subtitleStyles.style} />
        <div className={cn('grid gap-8', { 'grid-cols-2 md:grid-cols-4': isDesktop, 'grid-cols-2 md:grid-cols-3': isTablet, 'grid-cols-2': isMobile })}>
          {(data.members || []).map((member, index) => (
            <div key={index}>
              <img className="rounded-full object-cover w-32 h-32 mx-auto mb-4 shadow-md" src={member.imageUrl || 'https://placehold.co/200x200/e2e8f0/64748b?text=Foto'} alt={member.name} />
              <Editable tagName="h3" value={member.name} onUpdate={(v) => handleMember(index, 'name', v)} isEditing={isEditing} className={cn('font-semibold', { 'text-xl': isDesktop, 'text-lg': isTablet, 'text-base': isMobile }, nameStyles.className)} style={nameStyles.style} />
              <Editable tagName="p" value={member.role} onUpdate={(v) => handleMember(index, 'role', v)} isEditing={isEditing} className={cn({ 'text-base': isDesktop || isTablet, 'text-sm': isMobile }, roleStyles.className)} style={roleStyles.style} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamList = ({ data, isEditing, onUpdate }: BlockComponentProps<TeamData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.nameColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  const handleUpdate = (key: keyof TeamData, value: string | TeamMember[]) => { if (onUpdate) onUpdate(key as string, value); };
  const handleMember = (idx: number, field: keyof TeamMember, value: string) => handleUpdate('members', updateMemberArray(data.members, idx, field, value));

  return (
    <div className={cn({ 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-8 px-4': isMobile }, bg.className)} style={bg.style}>
      <div className={cn('mx-auto', { 'max-w-4xl': isDesktop, 'max-w-3xl': isTablet, 'max-w-full': isMobile })}>
        <div className="text-center">
          <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdate('title', v)} isEditing={isEditing} className={cn('font-bold', { 'text-4xl mb-4': isDesktop, 'text-3xl mb-3': isTablet, 'text-2xl mb-2': isMobile }, titleStyles.className)} style={titleStyles.style} />
          <Editable tagName="p" value={data.subtitle} onUpdate={(v) => handleUpdate('subtitle', v)} isEditing={isEditing} className={cn('mx-auto', { 'text-xl max-w-3xl mb-12': isDesktop, 'text-lg max-w-2xl mb-10': isTablet, 'text-base mb-8': isMobile }, subtitleStyles.className)} style={subtitleStyles.style} />
        </div>
        <div className="space-y-8">
          {(data.members || []).map((member, index) => (
            <div key={index} className="flex items-center gap-6">
              <img className="rounded-full object-cover w-20 h-20 shadow-sm" src={member.imageUrl || 'https://placehold.co/100x100/e2e8f0/64748b?text=Foto'} alt={member.name} />
              <div>
                <Editable tagName="h3" value={member.name} onUpdate={(v) => handleMember(index, 'name', v)} isEditing={isEditing} className={cn('font-semibold', { 'text-2xl': isDesktop, 'text-xl': isTablet, 'text-lg': isMobile }, nameStyles.className)} style={nameStyles.style} />
                <Editable tagName="p" value={member.role} onUpdate={(v) => handleMember(index, 'role', v)} isEditing={isEditing} className={cn({ 'text-lg': isDesktop, 'text-base': isTablet || isMobile }, roleStyles.className)} style={roleStyles.style} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Editor de CONTENIDO ---
export function TeamContentEditor({ data, updateData }: { data: TeamData; updateData: (key: keyof TeamData, value: string | TeamMember[]) => void; }) {
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
          <button onClick={() => removeMember(index)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600" title="Eliminar miembro">
            <XMarkIcon className="w-4 h-4 mx-auto" />
          </button>
          <h4 className="font-medium text-sm text-slate-700">Miembro {index + 1}</h4>
          <InputField label="URL de la Imagen" value={member.imageUrl} onChange={(e) => handleMemberChange(index, 'imageUrl', e.target.value)} />
          <InputField label="Nombre" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} />
          <InputField label="Cargo" value={member.role} onChange={(e) => handleMemberChange(index, 'role', e.target.value)} />
        </div>
      ))}

      <button onClick={addMember} className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2">
        <PlusIcon className="w-5 h-5" />
        Añadir Miembro
      </button>
    </div>
  );
}

// --- Editor de ESTILO ---
export function TeamStyleEditor({ data, updateData }: { data: TeamData; updateData: (key: keyof TeamData, value: string) => void; }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color de Nombres" selectedColor={data.nameColor} onChange={(color) => updateData('nameColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color de Cargos" selectedColor={data.roleColor} onChange={(color) => updateData('roleColor', color)} />
      </div>
    </div>
  );
}
