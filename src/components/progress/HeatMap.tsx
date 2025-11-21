// components/progress/HeatMap.tsx

'use client';

import React from 'react';
import { formatDate, getLast90Days, formatDateForDisplay, areDatesEqual } from '@/lib/utils/dateHelpers';
import { COLORS } from '@/lib/constants/colors';
import type { HabitLog } from '@/types/habit';

interface HeatMapProps {
    logs: HabitLog[];
    habitName: string;
}

export const HeatMap: React.FC<HeatMapProps> = ({ logs, habitName }) => {
    const last90Days = getLast90Days();

    const getIntensity = (date: Date): number => {
        const dateString = formatDate(date);
        const log = logs.find(log => areDatesEqual(log.log_date, dateString));
        return log?.completed ? 4 : 0;
    };

    const getColor = (intensity: number): string => {
        switch (intensity) {
            case 0: return COLORS.streakHeat[0];
            case 1: return COLORS.streakHeat[1];
            case 2: return COLORS.streakHeat[2];
            case 3: return COLORS.streakHeat[3];
            case 4: return COLORS.streakHeat[4];
            default: return COLORS.streakHeat[0];
        }
    };

    // Group by weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    last90Days.forEach((date, index) => {
        currentWeek.push(date);
        if (date.getDay() === 6 || index === last90Days.length - 1) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }
    });

    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{habitName}</h4>
            <div className="overflow-x-auto">
                <div className="inline-flex gap-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((date, dayIndex) => {
                                const intensity = getIntensity(date);
                                return (
                                    <div
                                        key={dayIndex}
                                        className="w-3 h-3 rounded-sm transition-colors hover:ring-2 hover:ring-primary cursor-pointer"
                                        style={{ backgroundColor: getColor(intensity) }}
                                        title={`${formatDateForDisplay(date, 'long')} - ${intensity > 0 ? 'Complété' : 'Non complété'}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <span>Moins</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getColor(level) }}
                    />
                ))}
                <span>Plus</span>
            </div>
        </div>
    );
};