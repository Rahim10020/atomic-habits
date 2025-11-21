
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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Chargement de votre dashboard...</p>
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
        <div className="container-custom py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Bonjour ! 👋
                        </h1>
                        {identity && (
                            <p className="text-lg text-gray-600">
                                <strong className="text-primary">{identity.who_you_want_to_be}</strong>
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">
                            {formatDateForDisplay(new Date(), 'long')}
                        </p>
                        <p className="text-3xl font-bold text-primary mt-1">
                            {completionRate}%
                        </p>
                        <p className="text-sm text-gray-600">
                            {totalCompleted}/{totalForToday} habitudes
                        </p>
                    </div>
                </div>

                {/* Welcome message on first visit */}
                {habits.length === 0 && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-primary-900 mb-2">
                            🎉 Bienvenue sur votre Dashboard !
                        </h2>
                        <p className="text-primary-800 mb-4">
                            Voici votre espace personnel pour suivre et construire vos habitudes.
                            Commencez par créer votre première habitude en utilisant les 4 lois d'Atomic Habits.
                        </p>
                        <a
                            href="/habits/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Créer ma première habitude
                        </a>
                    </div>
                )}
            </div>

            {/* Streaks display */}
            {habits.length > 0 && (
                <div className="mb-8">
                    <StreakDisplay habits={habits} />
                </div>
            )}

            {/* Daily routines */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📅 Vos systèmes du jour
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
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                        <span>💡</span>
                        Conseil du jour
                    </h3>
                    <p className="text-yellow-800">
                        {completionRate === 0 && "Commencez par la version 2 minutes de vos habitudes. C'est plus facile de maintenir une habitude quand on commence petit !"}
                        {completionRate > 0 && completionRate < 50 && "Excellent début ! Continuez, chaque petite victoire compte. Ne brisez pas la chaîne ! 🔥"}
                        {completionRate >= 50 && completionRate < 100 && "Vous êtes sur la bonne voie ! Finissez fort aujourd'hui pour renforcer vos habitudes. 💪"}
                    </p>
                </div>
            )}
        </div>
    );
}