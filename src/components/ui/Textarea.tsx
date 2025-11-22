// components/ui/Textarea.tsx

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    className,
    id,
    ...props
}) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-foreground mb-1.5"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-150 resize-none',
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
