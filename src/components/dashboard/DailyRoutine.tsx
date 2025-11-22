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
        habits: DailyHabitStatus[]
    ) => {
        if (habits.length === 0) return null;

        const completedCount = habits.filter(h => h.isCompleted).length;
        const percentage = habits.length > 0
            ? Math.round((completedCount / habits.length) * 100)
            : 0;

        return (
            <Card hover>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {completedCount}/{habits.length}
                            <span className="ml-2 font-medium text-foreground">
                                {percentage}%
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
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
        <div className="space-y-4">
            {renderRoutineSection('Routine du matin', morningHabits)}
            {renderRoutineSection('Routine du soir', eveningHabits)}
            {renderRoutineSection('À tout moment', anytimeHabits)}

            {morningHabits.length === 0 &&
                eveningHabits.length === 0 &&
                anytimeHabits.length === 0 && (
                    <Card className="text-center py-10">
                        <div className="mb-4">
                            <svg className="w-12 h-12 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                            Aucune habitude pour aujourd&apos;hui
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Créez votre première habitude pour commencer
                        </p>
                        <a
                            href="/habits/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Créer une habitude
                        </a>
                    </Card>
                )}
        </div>
    );
};
