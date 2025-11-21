'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitLog,
    getHabitLogsByDate,
} from '@/lib/supabase/queries';
import type { Habit, HabitFormData, HabitLog, DailyHabitStatus } from '@/types/habit';

interface UseHabitsReturn {
    habits: Habit[];
    loading: boolean;
    error: string | null;
    todayLogs: HabitLog[];
    dailyStatus: DailyHabitStatus[];
    addHabit: (data: HabitFormData) => Promise<Habit>;
    editHabit: (id: string, data: Partial<HabitFormData>) => Promise<Habit>;
    removeHabit: (id: string) => Promise<void>;
    toggleCompletion: (habitId: string, date: string, completed: boolean) => Promise<HabitLog>;
    refreshHabits: () => Promise<void>;
    refreshTodayLogs: () => Promise<void>;
}

export const useHabits = (): UseHabitsReturn => {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const today = new Date().toISOString().split('T')[0];

    const refreshHabits = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getHabits(user.id);
            setHabits(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du chargement des habitudes';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const refreshTodayLogs = useCallback(async () => {
        if (!user) return;

        try {
            const logs = await getHabitLogsByDate(user.id, today);
            setTodayLogs(logs);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du chargement des logs';
            setError(message);
        }
    }, [user, today]);

    useEffect(() => {
        if (user) {
            refreshHabits();
            refreshTodayLogs();
        }
    }, [user, refreshHabits, refreshTodayLogs]);

    const addHabit = async (data: HabitFormData): Promise<Habit> => {
        if (!user) throw new Error('Utilisateur non connecté');

        const newHabit = await createHabit(user.id, data);
        setHabits((prev) => [...prev, newHabit]);
        return newHabit;
    };

    const editHabit = async (id: string, data: Partial<HabitFormData>): Promise<Habit> => {
        const updatedHabit = await updateHabit(id, data);
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? updatedHabit : h))
        );
        return updatedHabit;
    };

    const removeHabit = async (id: string): Promise<void> => {
        await deleteHabit(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const toggleCompletion = async (
        habitId: string,
        date: string,
        completed: boolean
    ): Promise<HabitLog> => {
        if (!user) throw new Error('Utilisateur non connecté');

        const log = await toggleHabitLog(user.id, habitId, date, completed);

        if (date === today) {
            setTodayLogs((prev) => {
                const existing = prev.find((l) => l.habit_id === habitId);
                if (existing) {
                    return prev.map((l) => (l.habit_id === habitId ? log : l));
                }
                return [...prev, log];
            });
        }

        // Update streak in habits
        if (completed) {
            setHabits((prev) =>
                prev.map((h) => {
                    if (h.id === habitId) {
                        const newStreak = h.current_streak + 1;
                        return {
                            ...h,
                            current_streak: newStreak,
                            longest_streak: Math.max(h.longest_streak, newStreak),
                        };
                    }
                    return h;
                })
            );
        }

        return log;
    };

    // Calculate daily status for each habit
    const dailyStatus: DailyHabitStatus[] = habits.map((habit) => {
        const log = todayLogs.find((l) => l.habit_id === habit.id);
        const dayOfWeek = new Date().getDay();
        const canComplete = !habit.target_days || habit.target_days.includes(dayOfWeek);

        return {
            habit,
            isCompleted: log?.completed ?? false,
            canComplete,
            log,
        };
    });

    return {
        habits,
        loading,
        error,
        todayLogs,
        dailyStatus,
        addHabit,
        editHabit,
        removeHabit,
        toggleCompletion,
        refreshHabits,
        refreshTodayLogs,
    };
};

export default useHabits;
