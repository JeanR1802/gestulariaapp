// app/components/editor/blocks/InputField.tsx (MODIFIED)
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface InputFieldProps {
    label?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    style?: React.CSSProperties;
}

export const InputField = ({ label, value, onChange, className, style }: InputFieldProps) => {
    if (label) {
        return (
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={label}>{label}</Label>
                <Input 
                    id={label} 
                    type="text" 
                    value={value || ''} 
                    onChange={onChange} 
                    className={cn("w-full", className)}
                    style={style}
                />
            </div>
        );
    }
    return (
        <Input 
            type="text" 
            value={value || ''} 
            onChange={onChange} 
            className={cn("w-full", className)}
            style={style}
        />
    );
};

interface TextareaFieldProps {
    label?: string;
    value: string;
    rows?: number;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyPress?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
    className?: string;
    style?: React.CSSProperties;
}

export const TextareaField = ({ label, value, rows = 3, onChange, onKeyPress, className, style }: TextareaFieldProps) => {
    if (label) {
        return (
            <div className="grid w-full gap-1.5">
                <Label htmlFor={label}>{label}</Label>
                <Textarea 
                    id={label}
                    value={value || ''} 
                    onChange={onChange} 
                    rows={rows} 
                    className={cn("w-full", className)}
                    onKeyPress={onKeyPress}
                    style={style}
                />
            </div>
        );
    }
    return (
        <Textarea 
            value={value || ''} 
            onChange={onChange} 
            rows={rows} 
            className={cn("w-full", className)}
            onKeyPress={onKeyPress}
            style={style}
        />
    );
};