// app/components/editor/blocks/InputField.tsx (ACTUALIZADO)
import React, { ChangeEvent, KeyboardEvent } from 'react';

// Importamos los nuevos componentes profesionales desde la carpeta 'ui' que creó Shadcn
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Componente para un campo de texto de una línea
export const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <Input 
            id={label} 
            type="text" 
            value={value || ''} 
            onChange={onChange} 
            className="w-full"
        />
    </div>
);

// Componente para un área de texto de múltiples líneas
// Ahora acepta la propiedad onKeyPress
export const TextareaField = ({ label, value, rows = 3, onChange, onKeyPress }: { label: string, value: string, rows?: number, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, onKeyPress?: (e: KeyboardEvent<HTMLTextAreaElement>) => void }) => (
    <div className="grid w-full gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <Textarea 
            id={label}
            value={value || ''} 
            onChange={onChange} 
            rows={rows} 
            className="w-full"
            onKeyPress={onKeyPress}
        />
    </div>
);