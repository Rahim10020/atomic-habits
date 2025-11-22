'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getHabits, getHabitLogsByDate, toggleHabitLog, getIdentity } from '@/lib/supabase/queries';
import { DailyRoutine } from '@/components/dashboard/DailyRoutine';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { getDailyHabitStatus } from '@/lib/utils/habitHelpers';
import { getTodayString, formatDateForDisplay } from '@/lib/utils/dateHelpers';
import type { Habit, HabitLog, DailyHabitStatus } from '@/types/habit';
import type { Identity } from '@/types/identity';

export default function DashboardPage() {
    const { user } = useAuth();
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const today = getTodayString();

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;

        try {
            const [identityData, habitsData, logsData] = await Promise.all([
                getIdentity(user.id),
                getHabits(user.id),
                getHabitLogsByDate(user.id, today),
            ]);

            setIdentity(identityData);
            setHabits(habitsData);
            setLogs(logsData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleHabit = async (habitId: string, completed: boolean) => {
        if (!user) return;

        try {
            const updatedLog = await toggleHabitLog(user.id, habitId, today, completed);

            // Update logs state
            setLogs(prevLogs => {
                const existingIndex = prevLogs.findIndex(log => log.habit_id === habitId);
                if (existingIndex >= 0) {
                    const newLogs = [...prevLogs];
                    newLogs[existingIndex] = updatedLog;
                    return newLogs;
                }
                return [...prevLogs, updatedLog];
            });

            // Reload habits to update streaks
            const updatedHabits = await getHabits(user.id);
            setHabits(updatedHabits);
        } catch (error) {
            console.error('Error toggling habit:', error);
        }
    };

    const getHabitStatuses = (): {
        morning: DailyHabitStatus[];
        evening: DailyHabitStatus[];
        anytime: DailyHabitStatus[];
    } => {
        const statuses = habits.map(habit => getDailyHabitStatus(habit, logs));

        return {
            morning: statuses.filter(s => s.habit.routine_type === 'morning'),
            evening: statuses.filter(s => s.habit.routine_type === 'evening'),
            anytime: statuses.filter(s => s.habit.routine_type === 'anytime'),
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-foreground border-t-transparent"></div>
                    <p className="mt-3 text-sm text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    const { morning, evening, anytime } = getHabitStatuses();
    const totalCompleted = logs.filter(log => log.completed).length;
    const totalForToday = habits.filter(habit =>
        getDailyHabitStatus(habit, logs).canComplete
    ).length;
    const completionRate = totalForToday > 0
        ? Math.round((totalCompleted / totalForToday) * 100)
        : 0;

    return (
        <div className="container-custom py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground mb-1">
                            Dashboard
                        </h1>
                        {identity && (
                            <p className="text-sm text-muted-foreground">
                                {identity.who_you_want_to_be}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                            {formatDateForDisplay(new Date(), 'long')}
                        </p>
                        <p className="text-2xl font-semibold text-foreground mt-1">
                            {completionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {totalCompleted}/{totalForToday} habitudes
                        </p>
                    </div>
                </div>

                {/* Welcome message on first visit */}
                {habits.length === 0 && (
                    <div className="bg-secondary border border-border rounded-lg p-4 mb-4">
                        <h2 className="text-sm font-semibold text-foreground mb-1">
                            Bienvenue sur votre Dashboard
                        </h2>
                        <p className="text-sm text-muted-foreground mb-3">
                            Commencez par créer votre première habitude.
                        </p>
                        <a
                            href="/habits/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Créer ma première habitude
                        </a>
                    </div>
                )}
            </div>

            {/* Streaks display */}
            {habits.length > 0 && (
                <div className="mb-6">
                    <StreakDisplay habits={habits} />
                </div>
            )}

            {/* Daily routines */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                    Vos habitudes du jour
                </h2>
                <DailyRoutine
                    morningHabits={morning}
                    eveningHabits={evening}
                    anytimeHabits={anytime}
                    onToggleHabit={handleToggleHabit}
                />
            </div>

            {/* Quick tips */}
            {habits.length > 0 && completionRate < 100 && (
                <div className="mt-6 bg-secondary border border-border rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                        Conseil
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {completionRate === 0 && "Commencez par la version 2 minutes de vos habitudes."}
                        {completionRate > 0 && completionRate < 50 && "Continuez, chaque petite victoire compte."}
                        {completionRate >= 50 && completionRate < 100 && "Vous êtes sur la bonne voie !"}
                    </p>
                </div>
            )}
        </div>
    );
}
