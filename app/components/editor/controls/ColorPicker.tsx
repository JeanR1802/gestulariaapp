// app/components/editor/controls/ColorPicker.tsx
'use client';
import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label, className }) => {
  const [internal, setInternal] = React.useState(color || '#ffffff');

  React.useEffect(() => {
    setInternal(color || '#ffffff');
  }, [color]);

  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>}
      <HexColorPicker color={internal} onChange={c => { setInternal(c); onChange(c); }} className="w-full" />
      <input
        type="text"
        value={internal}
        onChange={e => {
          setInternal(e.target.value);
          onChange(e.target.value);
        }}
        className="mt-2 w-full px-2 py-1 border rounded text-xs text-slate-700 bg-slate-50"
        maxLength={7}
        pattern="#?[0-9A-Fa-f]{6}"
        aria-label="Código de color hexadecimal"
      />
    </div>
  );
};
