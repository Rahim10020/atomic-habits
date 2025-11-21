'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format, eachDayOfInterval, subDays, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { HabitLog } from '@/types/habit';

interface HabitChainProps {
    habitName: string;
    logs: HabitLog[];
    daysToShow?: number;
    showLabels?: boolean;
}

export const HabitChain: React.FC<HabitChainProps> = ({
    habitName,
    logs,
    daysToShow = 30,
    showLabels = true,
}) => {
    const today = new Date();

    // Generate array of days
    const days = useMemo(() => {
        return eachDayOfInterval({
            start: subDays(today, daysToShow - 1),
            end: today,
        });
    }, [today, daysToShow]);

    // Create a map of completed dates
    const completedDates = useMemo(() => {
        const dateSet = new Set<string>();
        logs.forEach((log) => {
            if (log.completed) {
                dateSet.add(log.log_date);
            }
        });
        return dateSet;
    }, [logs]);

    // Calculate current streak
    const currentStreak = useMemo(() => {
        let streak = 0;
        const sortedDays = [...days].reverse();

        for (const day of sortedDays) {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (completedDates.has(dateStr)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }, [days, completedDates]);

    // Calculate longest streak
    const longestStreak = useMemo(() => {
        let longest = 0;
        let current = 0;

        days.forEach((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            if (completedDates.has(dateStr)) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
        });

        return longest;
    }, [days, completedDates]);

    // Group days by week for better display
    const weeks = useMemo(() => {
        const result: Date[][] = [];
        let currentWeek: Date[] = [];

        days.forEach((day) => {
            if (currentWeek.length === 7) {
                result.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        });

        if (currentWeek.length > 0) {
            result.push(currentWeek);
        }

        return result;
    }, [days]);

    const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{habitName}</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-orange-500">=%</span>
                        <span className="font-medium">{currentStreak}</span>
                        <span className="text-gray-500">actuel</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-purple-500"><Æ</span>
                        <span className="font-medium">{longestStreak}</span>
                        <span className="text-gray-500">record</span>
                    </div>
                </div>
            </div>

            {/* Day labels */}
            {showLabels && (
                <div className="flex gap-1 mb-1 ml-8">
                    {weekDays.map((day, i) => (
                        <div
                            key={i}
                            className="w-4 h-4 text-xs text-gray-400 flex items-center justify-center"
                        >
                            {day}
                        </div>
                    ))}
                </div>
            )}

            {/* Chain Grid */}
            <div className="flex flex-col gap-1">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex items-center gap-1">
                        {/* Week label */}
                        {showLabels && (
                            <div className="w-6 text-xs text-gray-400 text-right pr-1">
                                {weekIndex === 0 || weekIndex === weeks.length - 1
                                    ? format(week[0], 'dd', { locale: fr })
                                    : ''}
                            </div>
                        )}

                        {/* Days in week */}
                        {week.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const isCompleted = completedDates.has(dateStr);
                            const isToday = dateStr === format(today, 'yyyy-MM-dd');

                            return (
                                <div
                                    key={dateStr}
                                    className={cn(
                                        'w-4 h-4 rounded-sm transition-colors',
                                        isCompleted
                                            ? 'bg-green-500'
                                            : 'bg-gray-100',
                                        isToday && 'ring-2 ring-blue-500 ring-offset-1'
                                    )}
                                    title={`${format(day, 'dd MMMM yyyy', { locale: fr })} - ${
                                        isCompleted ? 'Complété' : 'Non complété'
                                    }`}
                                />
                            );
                        })}

                        {/* Pad remaining days in last week */}
                        {week.length < 7 &&
                            Array.from({ length: 7 - week.length }).map((_, i) => (
                                <div key={`pad-${i}`} className="w-4 h-4" />
                            ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100" />
                    <span>Non fait</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span>Complété</span>
                </div>
            </div>
        </div>
    );
};

export default HabitChain;
