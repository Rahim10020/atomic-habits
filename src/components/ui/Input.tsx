// components/ui/Input.tsx

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className,
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground mb-1.5"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-150',
                    'bg-background text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent',
                    'disabled:bg-secondary disabled:cursor-not-allowed',
                    error
                        ? 'border-error focus:ring-error'
                        : 'border-border hover:border-gray-400',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-error">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
};
