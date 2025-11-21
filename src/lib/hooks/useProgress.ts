'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getHabits, getHabitLogs } from '@/lib/supabase/queries';
import type { Habit, HabitLog } from '@/types/habit';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, eachDayOfInterval, subDays } from 'date-fns';

interface ProgressStats {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
}

interface HabitProgress {
    habit: Habit;
    completionRate: number;
    totalCompleted: number;
    totalDays: number;
}

interface ChartDataPoint {
    date: string;
    completed: number;
    total: number;
    rate: number;
}

interface UseProgressReturn {
    stats: ProgressStats;
    habitProgress: HabitProgress[];
    chartData: ChartDataPoint[];
    loading: boolean;
    error: string | null;
    refreshProgress: () => Promise<void>;
}

export const useProgress = (): UseProgressReturn => {
    const { user } = useAuth();
    const [stats, setStats] = useState<ProgressStats>({
        daily: 0,
        weekly: 0,
        monthly: 0,
        allTime: 0,
    });
    const [habitProgress, setHabitProgress] = useState<HabitProgress[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProgress = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            const habits = await getHabits(user.id);
            const today = new Date();
            const todayStr = format(today, 'yyyy-MM-dd');
            const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
            const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');

            // Get logs for all habits
            const allLogs: HabitLog[] = [];
            const habitProgressData: HabitProgress[] = [];

            for (const habit of habits) {
                const logs = await getHabitLogs(habit.id);
                allLogs.push(...logs);

                const completedLogs = logs.filter((l) => l.completed);
                const daysSinceCreation = Math.max(
                    1,
                    Math.ceil(
                        (today.getTime() - new Date(habit.created_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                    )
                );

                habitProgressData.push({
                    habit,
                    completionRate: daysSinceCreation > 0
                        ? Math.round((completedLogs.length / daysSinceCreation) * 100)
                        : 0,
                    totalCompleted: completedLogs.length,
                    totalDays: daysSinceCreation,
                });
            }

            setHabitProgress(habitProgressData);

            // Calculate stats
            const totalHabits = habits.length || 1;

            // Daily
            const dailyCompleted = allLogs.filter(
                (l) => l.log_date === todayStr && l.completed
            ).length;
            const dailyRate = Math.round((dailyCompleted / totalHabits) * 100);

            // Weekly
            const weeklyLogs = allLogs.filter(
                (l) => l.log_date >= weekStart && l.log_date <= weekEnd && l.completed
            );
            const weekDays = 7;
            const weeklyRate = Math.round(
                (weeklyLogs.length / (totalHabits * weekDays)) * 100
            );

            // Monthly
            const monthlyLogs = allLogs.filter(
                (l) => l.log_date >= monthStart && l.log_date <= monthEnd && l.completed
            );
            const monthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const monthlyRate = Math.round(
                (monthlyLogs.length / (totalHabits * monthDays)) * 100
            );

            // All time
            const allTimeCompleted = allLogs.filter((l) => l.completed).length;
            const allTimeTotal = allLogs.length || 1;
            const allTimeRate = Math.round((allTimeCompleted / allTimeTotal) * 100);

            setStats({
                daily: dailyRate,
                weekly: weeklyRate,
                monthly: monthlyRate,
                allTime: allTimeRate,
            });

            // Generate chart data for last 30 days
            const last30Days = eachDayOfInterval({
                start: subDays(today, 29),
                end: today,
            });

            const chartDataPoints: ChartDataPoint[] = last30Days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayLogs = allLogs.filter((l) => l.log_date === dateStr);
                const completed = dayLogs.filter((l) => l.completed).length;
                const total = habits.length;
                const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

                return {
                    date: format(day, 'dd/MM'),
                    completed,
                    total,
                    rate,
                };
            });

            setChartData(chartDataPoints);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du calcul des progrès';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            refreshProgress();
        }
    }, [user, refreshProgress]);

    return {
        stats,
        habitProgress,
        chartData,
        loading,
        error,
        refreshProgress,
    };
};

export default useProgress;
