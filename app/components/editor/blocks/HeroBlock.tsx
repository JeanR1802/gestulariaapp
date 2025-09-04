import React, { ChangeEvent } from 'react';
import { InputField } from './InputField';
import { HeaderData as HeaderDataType } from './Header/HeaderVariantDefault'; // Importamos la interfaz desde una de las variantes

// Exportamos la interfaz para que el registro y otros componentes la puedan usar
export type HeaderData = HeaderDataType;

// El formulario de edición es el mismo para todas las variantes del Header
export function HeaderEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField 
        label="Texto del Logo" 
        value={data.logoText} 
        onChange={(e) => updateData('logoText', e.target.value)} 
      />
      <InputField 
        label="Enlace 1" 
        value={data.link1} 
        onChange={(e) => updateData('link1', e.target.value)} 
      />
      <InputField 
        label="Enlace 2" 
        value={data.link2} 
        onChange={(e) => updateData('link2', e.target.value)} 
      />
      <InputField 
        label="Enlace 3" 
        value={data.link3} 
        onChange={(e) => updateData('link3', e.target.value)} 
      />
    </div>
  );
}