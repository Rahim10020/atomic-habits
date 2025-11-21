'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getHabits, getHabitLogs } from '@/lib/supabase/queries';
import type { Habit, HabitLog } from '@/types/habit';
import { format, subDays, differenceInDays } from 'date-fns';

interface StreakInfo {
    habitId: string;
    habitName: string;
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string | null;
    isActiveToday: boolean;
}

interface UseStreakReturn {
    streaks: StreakInfo[];
    totalCurrentStreak: number;
    bestStreak: StreakInfo | null;
    loading: boolean;
    error: string | null;
    refreshStreaks: () => Promise<void>;
}

export const useStreak = (): UseStreakReturn => {
    const { user } = useAuth();
    const [streaks, setStreaks] = useState<StreakInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calculateStreak = (logs: HabitLog[]): { current: number; longest: number; lastDate: string | null } => {
        if (logs.length === 0) {
            return { current: 0, longest: 0, lastDate: null };
        }

        // Sort logs by date descending
        const sortedLogs = logs
            .filter((l) => l.completed)
            .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

        if (sortedLogs.length === 0) {
            return { current: 0, longest: 0, lastDate: null };
        }

        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const lastDate = sortedLogs[0]?.log_date || null;

        // Check if streak is active (completed today or yesterday)
        const mostRecentLog = sortedLogs[0]?.log_date;
        const isStreakActive = mostRecentLog === today || mostRecentLog === yesterday;

        if (isStreakActive) {
            // Calculate current streak
            let expectedDate = mostRecentLog === today ? today : yesterday;

            for (const log of sortedLogs) {
                if (log.log_date === expectedDate) {
                    currentStreak++;
                    expectedDate = format(subDays(new Date(expectedDate), 1), 'yyyy-MM-dd');
                } else if (log.log_date < expectedDate) {
                    break;
                }
            }
        }

        // Calculate longest streak
        const dateSet = new Set(sortedLogs.map((l) => l.log_date));
        const sortedDates = Array.from(dateSet).sort();

        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = new Date(sortedDates[i - 1]);
                const currDate = new Date(sortedDates[i]);
                const diff = differenceInDays(currDate, prevDate);

                if (diff === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        }

        return { current: currentStreak, longest: longestStreak, lastDate };
    };

    const refreshStreaks = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            const habits = await getHabits(user.id);
            const today = format(new Date(), 'yyyy-MM-dd');

            const streakData: StreakInfo[] = await Promise.all(
                habits.map(async (habit: Habit) => {
                    const logs = await getHabitLogs(habit.id);
                    const { current, longest, lastDate } = calculateStreak(logs);

                    return {
                        habitId: habit.id,
                        habitName: habit.name,
                        currentStreak: current,
                        longestStreak: Math.max(longest, habit.longest_streak),
                        lastCompletedDate: lastDate,
                        isActiveToday: logs.some(
                            (l) => l.log_date === today && l.completed
                        ),
                    };
                })
            );

            setStreaks(streakData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du calcul des séries';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            refreshStreaks();
        }
    }, [user, refreshStreaks]);

    // Calculate total current streak (average of all habits)
    const totalCurrentStreak =
        streaks.length > 0
            ? Math.round(
                  streaks.reduce((sum, s) => sum + s.currentStreak, 0) / streaks.length
              )
            : 0;

    // Find best streak
    const bestStreak =
        streaks.length > 0
            ? streaks.reduce((best, current) =>
                  current.longestStreak > (best?.longestStreak || 0) ? current : best
              , streaks[0])
            : null;

    return {
        streaks,
        totalCurrentStreak,
        bestStreak,
        loading,
        error,
        refreshStreaks,
    };
};

export default useStreak;
