// components/onboarding/ProgressBar.tsx

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentStep,
    totalSteps,
    steps,
}) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-6">
            {/* Progress bar */}
            <div className="relative h-1 bg-secondary rounded-full overflow-hidden mb-4">
                <div
                    className="absolute h-full bg-foreground transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center flex-1"
                        >
                            <div
                                className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200',
                                    isCompleted && 'bg-foreground text-background',
                                    isCurrent && 'bg-foreground text-background',
                                    !isCompleted && !isCurrent && 'bg-secondary text-muted-foreground'
                                )}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="w-3 h-3"
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
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <span
                                className={cn(
                                    'text-xs mt-1.5 text-center transition-colors duration-200',
                                    (isCompleted || isCurrent) ? 'text-foreground font-medium' : 'text-muted-foreground'
                                )}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
