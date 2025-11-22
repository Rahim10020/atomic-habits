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
                'flex items-center gap-3 p-3 rounded-md border transition-all duration-150',
                isCompleted
                    ? 'bg-success/5 border-success/20'
                    : canComplete
                        ? 'bg-card border-border hover:border-gray-300'
                        : 'bg-secondary border-border opacity-60'
            )}
        >
            <Checkbox
                checked={isCompleted}
                onChange={handleToggle}
                disabled={!canComplete || isToggling}
            />

            <div className="flex-1 min-w-0">
                <h4 className={cn(
                    'text-sm font-medium text-foreground truncate',
                    isCompleted && 'line-through text-muted-foreground'
                )}>
                    {habit.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {habit.time_of_day} • {habit.location}
                </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Streak indicator */}
                {habit.current_streak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary rounded text-xs">
                        <span className="font-medium text-foreground">
                            {habit.current_streak}
                        </span>
                        <span className="text-muted-foreground">j</span>
                    </div>
                )}

                {/* Two minute version tooltip */}
                <div className="group relative">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-foreground text-background text-xs rounded shadow-md z-10">
                        <strong>Version 2 min :</strong>
                        <p className="mt-0.5 opacity-90">{habit.two_minute_version}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
