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
        <div className="mb-8">
            {/* Progress bar */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                    className="absolute h-full bg-primary transition-all duration-500 ease-out rounded-full"
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
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                                    isCompleted && 'bg-primary text-white',
                                    isCurrent && 'bg-primary text-white ring-4 ring-primary-100',
                                    !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500'
                                )}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="w-5 h-5"
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
                                    'text-xs mt-2 text-center transition-colors duration-300',
                                    (isCompleted || isCurrent) ? 'text-gray-900 font-medium' : 'text-gray-500'
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