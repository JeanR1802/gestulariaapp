// CORRECCIÓN: Se elimina 'ChangeEvent' porque no se utiliza.
import React from 'react';
import { InputField } from './InputField';

// --- 1. Definimos la forma de los datos para este bloque ---
interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterData {
  copyrightText: string;
  socialLinks: SocialLink[];
}

// --- 2. Creamos el componente visual (cómo se ve en la página) ---
export function FooterBlock({ data }: { data: FooterData }) {
  return (
    <footer className="bg-slate-800 text-slate-400 text-sm text-center p-8 rounded-md">
      <p className="mb-4">{data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}</p>
      <div className="flex justify-center space-x-4">
        {(data.socialLinks || []).map((link, index) => (
          link.url && <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">{link.platform}</a>
        ))}
      </div>
    </footer>
  );
}

// --- 3. Creamos el formulario para editar el bloque ---
// CORRECCIÓN: Se tipa estrictamente 'updateData' para eliminar el error de 'any'.
export function FooterEditor({ data, updateData }: { data: FooterData, updateData: (key: keyof FooterData, value: string | SocialLink[]) => void }) {
  
  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...(data.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateData('socialLinks', newLinks);
  };

  return (
    <div className="space-y-4">
      <InputField 
        label="Texto de Copyright" 
        value={data.copyrightText} 
        onChange={(e) => updateData('copyrightText', e.target.value)} 
      />
      
      <h4 className="font-medium text-slate-600 pt-2 border-t border-slate-200">Redes Sociales</h4>
      
      {(data.socialLinks || []).map((link, index) => (
        <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
          <InputField 
            label={`Plataforma ${index + 1} (ej. Twitter)`} 
            value={link.platform} 
            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} 
          />
          <InputField 
            label={`URL ${index + 1}`} 
            value={link.url} 
            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} 
          />
        </div>
      ))}
    </div>
  );
}