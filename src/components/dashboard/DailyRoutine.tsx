// components/dashboard/DailyRoutine.tsx

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { HabitTracker } from '@/components/habits/HabitTracker';
import type { DailyHabitStatus } from '@/types/habit';

interface DailyRoutineProps {
    morningHabits: DailyHabitStatus[];
    eveningHabits: DailyHabitStatus[];
    anytimeHabits: DailyHabitStatus[];
    onToggleHabit: (habitId: string, completed: boolean) => Promise<void>;
}

export const DailyRoutine: React.FC<DailyRoutineProps> = ({
    morningHabits,
    eveningHabits,
    anytimeHabits,
    onToggleHabit,
}) => {
    const renderRoutineSection = (
        title: string,
        icon: string,
        habits: DailyHabitStatus[]
    ) => {
        if (habits.length === 0) return null;

        const completedCount = habits.filter(h => h.isCompleted).length;
        const percentage = habits.length > 0
            ? Math.round((completedCount / habits.length) * 100)
            : 0;

        return (
            <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{icon}</span>
                            {title}
                        </CardTitle>
                        <div className="text-sm text-gray-500">
                            {completedCount}/{habits.length} complétées
                            <span className="ml-2 font-semibold text-primary">
                                {percentage}%
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {habits.map((habitStatus) => (
                            <HabitTracker
                                key={habitStatus.habit.id}
                                habitStatus={habitStatus}
                                onToggle={onToggleHabit}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {renderRoutineSection('Routine du matin', '🌅', morningHabits)}
            {renderRoutineSection('Routine du soir', '🌙', eveningHabits)}
            {renderRoutineSection('À tout moment', '⏰', anytimeHabits)}

            {morningHabits.length === 0 &&
                eveningHabits.length === 0 &&
                anytimeHabits.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucune habitude pour aujourd'hui
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Créez votre première habitude pour commencer votre transformation !
                        </p>
                        <a
                            href="/habits/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Créer une habitude
                        </a>
                    </Card>
                )}
        </div>
    );
};