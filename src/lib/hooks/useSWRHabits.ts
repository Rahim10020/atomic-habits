'use client';

import useSWR, { mutate } from 'swr';
import { useAuth } from '@/lib/context/AuthContext';
import {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitLog,
    getHabitLogsByDate,
} from '@/lib/supabase/queries';
import type { Habit, HabitFormData, HabitLog } from '@/types/habit';

// Fetcher functions
const habitsFetcher = async (userId: string) => {
    return getHabits(userId);
};

const todayLogsFetcher = async ([userId, date]: [string, string]) => {
    return getHabitLogsByDate(userId, date);
};

// Hook for habits with SWR
export const useSWRHabits = () => {
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];

    // Fetch habits
    const {
        data: habits = [],
        error: habitsError,
        isLoading: habitsLoading,
        mutate: mutateHabits,
    } = useSWR(
        user ? `habits-${user.id}` : null,
        () => user ? habitsFetcher(user.id) : [],
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 5000,
        }
    );

    // Fetch today's logs
    const {
        data: todayLogs = [],
        error: logsError,
        isLoading: logsLoading,
        mutate: mutateLogs,
    } = useSWR(
        user ? [`todayLogs-${user.id}`, user.id, today] : null,
        () => user ? todayLogsFetcher([user.id, today]) : [],
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    // Add habit
    const addHabit = async (data: HabitFormData): Promise<Habit> => {
        if (!user) throw new Error('Utilisateur non connecté');

        const newHabit = await createHabit(user.id, data);

        // Optimistically update
        await mutateHabits(
            (currentHabits) => [...(currentHabits || []), newHabit],
            { revalidate: false }
        );

        return newHabit;
    };

    // Edit habit
    const editHabit = async (id: string, data: Partial<HabitFormData>): Promise<Habit> => {
        const updatedHabit = await updateHabit(id, data);

        // Optimistically update
        await mutateHabits(
            (currentHabits) =>
                currentHabits?.map((h) => (h.id === id ? updatedHabit : h)) || [],
            { revalidate: false }
        );

        return updatedHabit;
    };

    // Remove habit
    const removeHabit = async (id: string): Promise<void> => {
        await deleteHabit(id);

        // Optimistically update
        await mutateHabits(
            (currentHabits) => currentHabits?.filter((h) => h.id !== id) || [],
            { revalidate: false }
        );
    };

    // Toggle completion
    const toggleCompletion = async (
        habitId: string,
        date: string,
        completed: boolean
    ): Promise<HabitLog> => {
        if (!user) throw new Error('Utilisateur non connecté');

        const log = await toggleHabitLog(user.id, habitId, date, completed);

        // Update today's logs
        if (date === today) {
            await mutateLogs(
                (currentLogs) => {
                    const existing = currentLogs?.find((l) => l.habit_id === habitId);
                    if (existing) {
                        return currentLogs?.map((l) => (l.habit_id === habitId ? log : l)) || [];
                    }
                    return [...(currentLogs || []), log];
                },
                { revalidate: false }
            );
        }

        // Update streak in habits
        if (completed) {
            await mutateHabits(
                (currentHabits) =>
                    currentHabits?.map((h) => {
                        if (h.id === habitId) {
                            const newStreak = h.current_streak + 1;
                            return {
                                ...h,
                                current_streak: newStreak,
                                longest_streak: Math.max(h.longest_streak, newStreak),
                            };
                        }
                        return h;
                    }) || [],
                { revalidate: false }
            );
        }

        return log;
    };

    // Refresh all data
    const refresh = async () => {
        await Promise.all([mutateHabits(), mutateLogs()]);
    };

    // Calculate daily status
    const dailyStatus = habits.map((habit) => {
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
        todayLogs,
        dailyStatus,
        loading: habitsLoading || logsLoading,
        error: habitsError || logsError,
        addHabit,
        editHabit,
        removeHabit,
        toggleCompletion,
        refresh,
    };
};

// Global mutate helper
export const invalidateHabits = (userId: string) => {
    mutate(`habits-${userId}`);
};

export default useSWRHabits;
