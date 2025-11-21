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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total stats */}
            <Card className="bg-gradient-to-br from-primary to-primary-600 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-primary-100 text-sm font-medium mb-1">
                            Total des streaks actifs
                        </p>
                        <p className="text-4xl font-bold">{totalStreak} jours</p>
                    </div>
                    <div className="text-6xl">🔥</div>
                </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-yellow-100 text-sm font-medium mb-1">
                            Record personnel
                        </p>
                        <p className="text-4xl font-bold">{longestStreak} jours</p>
                    </div>
                    <div className="text-6xl">🏆</div>
                </div>
            </Card>

            {/* Top streaks */}
            {topStreaks.length > 0 && (
                <Card className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🌟 Vos meilleures séries
                    </h3>
                    <div className="space-y-3">
                        {topStreaks.map((habit, index) => (
                            <div
                                key={habit.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                    ${index === 1 ? 'bg-gray-300 text-gray-700' : ''}
                    ${index === 2 ? 'bg-orange-400 text-orange-900' : ''}
                  `}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{habit.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {getMotivationalMessage(habit.current_streak)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                        {habit.current_streak}
                                    </p>
                                    <p className="text-sm text-gray-500">jours</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};