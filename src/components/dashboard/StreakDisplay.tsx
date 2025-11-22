// components/dashboard/StreakDisplay.tsx

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { Habit } from '@/types/habit';
import { getMotivationalMessage } from '@/lib/utils/habitHelpers';

interface StreakDisplayProps {
    habits: Habit[];
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ habits }) => {
    const sortedByStreak = [...habits].sort((a, b) => b.current_streak - a.current_streak);
    const topStreaks = sortedByStreak.slice(0, 3);

    const totalStreak = habits.reduce((sum, h) => sum + h.current_streak, 0);
    const longestStreak = Math.max(...habits.map(h => h.longest_streak), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total stats */}
            <Card className="bg-foreground text-background">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-background/70 text-xs font-medium mb-1">
                            Total des streaks actifs
                        </p>
                        <p className="text-3xl font-semibold">{totalStreak} jours</p>
                    </div>
                    <div className="text-4xl opacity-80">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                </div>
            </Card>

            <Card className="bg-secondary">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs font-medium mb-1">
                            Record personnel
                        </p>
                        <p className="text-3xl font-semibold text-foreground">{longestStreak} jours</p>
                    </div>
                    <div className="text-4xl text-muted-foreground">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
                        </svg>
                    </div>
                </div>
            </Card>

            {/* Top streaks */}
            {topStreaks.length > 0 && (
                <Card className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                        Meilleures séries
                    </h3>
                    <div className="space-y-2">
                        {topStreaks.map((habit, index) => (
                            <div
                                key={habit.id}
                                className="flex items-center justify-between p-3 bg-secondary rounded-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold
                                        ${index === 0 ? 'bg-foreground text-background' : ''}
                                        ${index === 1 ? 'bg-gray-300 text-gray-700' : ''}
                                        ${index === 2 ? 'bg-gray-200 text-gray-600' : ''}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{habit.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {getMotivationalMessage(habit.current_streak)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-semibold text-foreground">
                                        {habit.current_streak}
                                    </p>
                                    <p className="text-xs text-muted-foreground">jours</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};
