// components/ui/Button.tsx

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-foreground text-background hover:bg-gray-700 focus-visible:ring-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-gray-200 focus-visible:ring-gray-300',
        ghost: 'bg-transparent text-foreground hover:bg-secondary focus-visible:ring-gray-300',
        danger: 'bg-error text-white hover:bg-error/90 focus-visible:ring-error',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
