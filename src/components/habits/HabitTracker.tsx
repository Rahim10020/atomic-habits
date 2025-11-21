// components/habits/HabitTracker.tsx

'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { fireConfetti } from '@/components/confetti/ConfettiEffect';
import type { DailyHabitStatus } from '@/types/habit';
import { cn } from '@/lib/utils/cn';

interface HabitTrackerProps {
    habitStatus: DailyHabitStatus;
    onToggle: (habitId: string, completed: boolean) => Promise<void>;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
    habitStatus,
    onToggle,
}) => {
    const [isToggling, setIsToggling] = useState(false);
    const { habit, isCompleted, canComplete } = habitStatus;

    const handleToggle = async (checked: boolean) => {
        if (!canComplete || isToggling) return;

        setIsToggling(true);
        try {
            await onToggle(habit.id, checked);
            if (checked) {
                fireConfetti();
            }
        } catch (error) {
            console.error('Error toggling habit:', error);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div
            className={cn(
                'flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200',
                isCompleted
                    ? 'bg-green-50 border-green-200'
                    : canComplete
                        ? 'bg-white border-gray-200 hover:border-primary-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
            )}
        >
            <Checkbox
                checked={isCompleted}
                onChange={handleToggle}
                disabled={!canComplete || isToggling}
            />

            <div className="flex-1">
                <h4 className={cn(
                    'font-medium text-gray-900',
                    isCompleted && 'line-through text-gray-500'
                )}>
                    {habit.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                    {habit.time_of_day} • {habit.location}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Streak indicator */}
                {habit.current_streak > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-primary-50 rounded-full">
                        <span className="text-lg">🔥</span>
                        <span className="text-sm font-bold text-primary">
                            {habit.current_streak}
                        </span>
                    </div>
                )}

                {/* Two minute version tooltip */}
                <div className="group relative">
                    <button className="text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                        <strong>Version 2 minutes :</strong>
                        <p className="mt-1">{habit.two_minute_version}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};