// components/ui/Checkbox.tsx

'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    label,
    disabled = false,
    className,
}) => {
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleChange = () => {
        if (disabled) return;

        setIsAnimating(true);
        onChange(!checked);

        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <label
            className={cn(
                'inline-flex items-center cursor-pointer',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={cn(
                        'w-5 h-5 rounded border transition-all duration-150',
                        'flex items-center justify-center',
                        checked
                            ? 'bg-foreground border-foreground'
                            : 'bg-background border-border hover:border-gray-400',
                        isAnimating && 'animate-bounce-in',
                        disabled && 'cursor-not-allowed'
                    )}
                >
                    {checked && (
                        <svg
                            className="w-3 h-3 text-background"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </div>
            </div>
            {label && (
                <span className="ml-2 text-sm text-foreground">{label}</span>
            )}
        </label>
    );
};
