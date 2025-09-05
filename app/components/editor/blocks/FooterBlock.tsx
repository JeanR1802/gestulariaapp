// Archivo: app/components/editor/blocks/FooterBlock.tsx (CÓDIGO FINAL Y COMPLETO)
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

// --- Interfaces de Datos Actualizadas ---
interface SocialLink {
  platform: string;
  url: string;
}

interface FooterColumn {
    title: string;
    links: string[];
}

export interface FooterData {
    variant: 'simple' | 'multiColumn' | 'minimal';
    copyrightText: string;
    backgroundColor: string;
    textColor: string;
    socialLinks?: SocialLink[];
    columns?: FooterColumn[];
}

// --- Componente "Director" ---
export function FooterBlock({ data }: { data: FooterData }) {
  switch (data.variant) {
    case 'multiColumn':
      return <FooterMultiColumn data={data} />;
    case 'minimal':
      return <FooterMinimal data={data} />;
    case 'simple':
    default:
      return <FooterSimple data={data} />;
  }
}

// --- Componentes Internos para Cada Variante ---
const FooterSimple = ({ data }: { data: FooterData }) => (
    <footer className={`${data.backgroundColor || 'bg-slate-800'} ${data.textColor || 'text-slate-400'} text-sm text-center p-8`}>
        <p className="mb-4">{data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}</p>
        <div className="flex justify-center space-x-4">
        {(data.socialLinks || []).map((link, index) => (
            link.url && <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">{link.platform}</a>
        ))}
        </div>
    </footer>
);

const FooterMultiColumn = ({ data }: { data: FooterData }) => (
    <footer className={`${data.backgroundColor || 'bg-slate-800'} ${data.textColor || 'text-slate-400'} text-sm p-8`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
            {(data.columns || []).map((col, index) => (
                <div key={index}>
                    <h4 className="font-semibold text-white mb-3">{col.title}</h4>
                    <ul className="space-y-2">
                        {(col.links || []).map((link, linkIndex) => (
                            <li key={linkIndex}><a href="#" className="hover:text-white">{link}</a></li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        <div className="mt-8 border-t border-slate-700 pt-4 text-center">
            <p>{data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}</p>
        </div>
    </footer>
);

const FooterMinimal = ({ data }: { data: FooterData }) => (
    <footer className={`${data.backgroundColor || 'bg-white'} ${data.textColor || 'text-slate-500'} text-xs text-center p-4`}>
        <p>{data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}</p>
    </footer>
);

// --- Editor de Campos Condicional ---
export function FooterEditor({ data, updateData }: { data: FooterData, updateData: (key: keyof FooterData, value: string | SocialLink[] | FooterColumn[]) => void }) {
    
  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...(data.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateData('socialLinks', newLinks);
  };

  const handleColumnChange = (index: number, field: 'title' | 'links', value: string) => {
    const newColumns = [...(data.columns || [])];
    if (field === 'links') {
        newColumns[index] = { ...newColumns[index], links: value.split('\n') };
    } else {
        newColumns[index] = { ...newColumns[index], [field]: value };
    }
    updateData('columns', newColumns);
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <InputField label="Texto de Copyright" value={data.copyrightText} onChange={(e) => updateData('copyrightText', e.target.value)} />
      </div>
      
      {data.variant === 'simple' && (
        <>
            <h4 className="font-medium text-sm text-slate-600 pt-2 border-t border-slate-200">Redes Sociales</h4>
            {(data.socialLinks || []).map((link, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
                <InputField label={`Plataforma ${index + 1}`} value={link.platform} onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} />
                <InputField label={`URL ${index + 1}`} value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} />
                </div>
            ))}
        </>
      )}

      {data.variant === 'multiColumn' && (
        <>
            <h4 className="font-medium text-sm text-slate-600 pt-2 border-t border-slate-200">Columnas de Enlaces</h4>
            {(data.columns || []).map((col, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
                    <InputField label={`Título Columna ${index + 1}`} value={col.title} onChange={(e) => handleColumnChange(index, 'title', e.target.value)} />
                    <TextareaField label={`Enlaces (uno por línea)`} value={(col.links || []).join('\n')} rows={4} onChange={(e) => handleColumnChange(index, 'links', e.target.value)} />
                </div>
            ))}
        </>
      )}

      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <TextColorPalette label="Color del Texto" selectedColor={data.textColor} onChange={(color) => updateData('textColor', color)} />
      </div>
    </div>
  );
}