// app/(dashboard)/progress/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getHabits, getHabitLogs } from '@/lib/supabase/queries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { HeatMap } from '@/components/progress/HeatMap';
import { PlateauCurve } from '@/components/progress/PlateauCurve';
import { getLast30Days, formatDate } from '@/lib/utils/dateHelpers';
import type { Habit, HabitLog } from '@/types/habit';

export default function ProgressPage() {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [allLogs, setAllLogs] = useState<{ [habitId: string]: HabitLog[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadProgressData();
        }
    }, [user]);

    const loadProgressData = async () => {
        if (!user) return;

        try {
            const habitsData = await getHabits(user.id);
            setHabits(habitsData);

            // Load logs for each habit
            const logsPromises = habitsData.map(async (habit) => {
                const logs = await getHabitLogs(habit.id);
                return { habitId: habit.id, logs };
            });

            const logsResults = await Promise.all(logsPromises);
            const logsMap = logsResults.reduce((acc, { habitId, logs }) => {
                acc[habitId] = logs;
                return acc;
            }, {} as { [habitId: string]: HabitLog[] });

            setAllLogs(logsMap);
        } catch (error) {
            console.error('Error loading progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        const last30Days = getLast30Days();

        return last30Days.map(date => {
            const dateString = formatDate(date);
            let completed = 0;
            let total = habits.length;

            habits.forEach(habit => {
                const logs = allLogs[habit.id] || [];
                const log = logs.find(l => l.log_date === dateString);
                if (log?.completed) {
                    completed++;
                }
            });

            return {
                date: dateString,
                completed,
                total,
                percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        });
    };

    const getTotalStats = () => {
        let totalCompletions = 0;
        let totalDays = 0;
        let longestStreak = 0;

        habits.forEach(habit => {
            const logs = allLogs[habit.id] || [];
            totalCompletions += logs.filter(l => l.completed).length;
            totalDays += logs.length;
            if (habit.longest_streak > longestStreak) {
                longestStreak = habit.longest_streak;
            }
        });

        return {
            totalCompletions,
            totalDays,
            longestStreak,
            completionRate: totalDays > 0 ? Math.round((totalCompletions / totalDays) * 100) : 0,
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Chargement de vos statistiques...</p>
                </div>
            </div>
        );
    }

    const stats = getTotalStats();
    const chartData = getChartData();

    return (
        <div className="container-custom py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Votre progression 📊
                    </h1>
                    <p className="text-lg text-gray-600">
                        Visualisez votre parcours et célébrez vos victoires quotidiennes
                    </p>
                </div>

                {habits.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="text-6xl mb-4">📈</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucune donnée de progression
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Créez vos premières habitudes et commencez à les tracker pour voir votre progression
                        </p>
                        <a
                            href="/habits/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                        >
                            Créer une habitude
                        </a>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Overall Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm mb-2">Total complétions</p>
                                        <p className="text-4xl font-bold text-primary">{stats.totalCompletions}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm mb-2">Taux de réussite</p>
                                        <p className="text-4xl font-bold text-green-600">{stats.completionRate}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm mb-2">Record de streak</p>
                                        <p className="text-4xl font-bold text-yellow-600">{stats.longestStreak}</p>
                                        <p className="text-xs text-gray-500 mt-1">jours</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm mb-2">Habitudes actives</p>
                                        <p className="text-4xl font-bold text-purple-600">{habits.length}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progress Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Taux de completion (30 derniers jours)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProgressChart data={chartData} />
                            </CardContent>
                        </Card>

                        {/* Plateau Curve */}
                        <PlateauCurve />

                        {/* Heat Maps */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Calendrier d'activité (90 derniers jours)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {habits.map(habit => (
                                        <HeatMap
                                            key={habit.id}
                                            logs={allLogs[habit.id] || []}
                                            habitName={habit.name}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Insights */}
                        <Card>
                            <CardHeader>
                                <CardTitle>💡 Insights & Conseils</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.completionRate >= 80 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <p className="text-sm text-green-900">
                                                <strong>🎉 Excellent travail !</strong> Vous maintenez un taux de réussite de {stats.completionRate}%.
                                                Vous êtes en train de construire des habitudes solides. Continuez comme ça !
                                            </p>
                                        </div>
                                    )}
                                    {stats.completionRate >= 50 && stats.completionRate < 80 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="text-sm text-yellow-900">
                                                <strong>💪 Bon progrès !</strong> Vous êtes à {stats.completionRate}% de réussite.
                                                Pensez à la règle des 2 minutes : commencez petit et augmentez progressivement.
                                            </p>
                                        </div>
                                    )}
                                    {stats.completionRate < 50 && (
                                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                            <p className="text-sm text-primary-900">
                                                <strong>🎯 Conseils :</strong> Vous êtes à {stats.completionRate}% de réussite.
                                                Concentrez-vous sur une ou deux habitudes à la fois. Rendez-les plus faciles (loi 3)
                                                et plus évidentes (loi 1).
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            Rappel : Les gains de 1%
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            Si vous vous améliorez de 1% chaque jour pendant un an, vous serez 37 fois meilleur
                                            à la fin de l'année. Les petites améliorations s'accumulent avec le temps.
                                            <strong> Concentrez-vous sur le système, pas sur les objectifs.</strong>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}