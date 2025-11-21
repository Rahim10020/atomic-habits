
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressProps {
    value: number; // 0-100
    max?: number;
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'success' | 'warning' | 'error';
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    className,
    showLabel = false,
    size = 'md',
    color = 'primary',
}) => {
    const percentage = Math.min((value / max) * 100, 100);

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const colors = {
        primary: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
    };

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
            <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        colors[color]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};