'use client';

import { cn } from '@/lib/utils';
import type { Habit } from '@/types/habit';
import type { Identity } from '@/types/identity';

interface SystemsOverviewProps {
    identity: Identity | null;
    habits: Habit[];
    completionRate: number;
    className?: string;
}

export const SystemsOverview: React.FC<SystemsOverviewProps> = ({
    identity,
    habits,
    completionRate,
    className,
}) => {
    // Group habits by routine type
    const habitsByRoutine = {
        morning: habits.filter((h) => h.routine_type === 'morning'),
        evening: habits.filter((h) => h.routine_type === 'evening'),
        anytime: habits.filter((h) => h.routine_type === 'anytime'),
    };

    // Calculate system health score
    const systemHealth = calculateSystemHealth(habits, completionRate);

    return (
        <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <h3 className="text-lg font-semibold">Vue d&apos;ensemble du système</h3>
                <p className="text-sm text-indigo-100 mt-1">
                    Votre système d&apos;habitudes basé sur l&apos;identité
                </p>
            </div>

            {/* Identity Section */}
            {identity && (
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-indigo-600 uppercase">Identité cible</span>
                            <p className="text-gray-900 font-medium mt-1">{identity.who_you_want_to_be}</p>
                            {identity.core_values.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {identity.core_values.map((value, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-white text-indigo-600 text-xs rounded-full border border-indigo-200"
                                        >
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* System Health Score */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Santé du système</span>
                    <span className={cn(
                        'text-sm font-bold',
                        systemHealth >= 80 ? 'text-green-600' :
                        systemHealth >= 60 ? 'text-yellow-600' :
                        systemHealth >= 40 ? 'text-orange-600' : 'text-red-600'
                    )}>
                        {systemHealth}%
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500',
                            systemHealth >= 80 ? 'bg-green-500' :
                            systemHealth >= 60 ? 'bg-yellow-500' :
                            systemHealth >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        )}
                        style={{ width: `${systemHealth}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {getHealthMessage(systemHealth)}
                </p>
            </div>

            {/* Routines Overview */}
            <div className="p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Routines</h4>

                {/* Morning Routine */}
                <RoutineSection
                    title="Routine matinale"
                    icon="<"
                    habits={habitsByRoutine.morning}
                    color="yellow"
                />

                {/* Evening Routine */}
                <RoutineSection
                    title="Routine du soir"
                    icon="<"
                    habits={habitsByRoutine.evening}
                    color="purple"
                />

                {/* Anytime Habits */}
                <RoutineSection
                    title="À tout moment"
                    icon="ð"
                    habits={habitsByRoutine.anytime}
                    color="blue"
                />
            </div>

            {/* Stats Summary */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{habits.length}</div>
                        <div className="text-xs text-gray-500">Habitudes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                        <div className="text-xs text-gray-500">Complétion</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">
                            {habits.reduce((sum, h) => sum + h.current_streak, 0)}
                        </div>
                        <div className="text-xs text-gray-500">Séries totales</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Routine Section Component
interface RoutineSectionProps {
    title: string;
    icon: string;
    habits: Habit[];
    color: 'yellow' | 'purple' | 'blue';
}

const RoutineSection: React.FC<RoutineSectionProps> = ({
    title,
    icon,
    habits,
    color,
}) => {
    const colorClasses = {
        yellow: 'bg-yellow-50 border-yellow-200',
        purple: 'bg-purple-50 border-purple-200',
        blue: 'bg-blue-50 border-blue-200',
    };

    if (habits.length === 0) {
        return (
            <div className={cn('p-3 rounded-lg border', colorClasses[color], 'opacity-50')}>
                <div className="flex items-center gap-2">
                    <span>{icon}</span>
                    <span className="text-sm text-gray-500">{title}</span>
                    <span className="text-xs text-gray-400 ml-auto">Aucune habitude</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('p-3 rounded-lg border', colorClasses[color])}>
            <div className="flex items-center gap-2 mb-2">
                <span>{icon}</span>
                <span className="text-sm font-medium text-gray-700">{title}</span>
                <span className="text-xs text-gray-500 ml-auto">{habits.length} habitude(s)</span>
            </div>
            <div className="space-y-1">
                {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center gap-2 text-sm">
                        <div className={cn(
                            'w-2 h-2 rounded-full',
                            habit.current_streak > 0 ? 'bg-green-500' : 'bg-gray-300'
                        )} />
                        <span className="text-gray-600 truncate">{habit.name}</span>
                        {habit.current_streak > 0 && (
                            <span className="text-xs text-orange-500 ml-auto">
                                =% {habit.current_streak}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper functions
function calculateSystemHealth(habits: Habit[], completionRate: number): number {
    if (habits.length === 0) return 0;

    // Factors for system health:
    // 1. Number of habits (max 10 points for 5+ habits)
    const habitScore = Math.min(habits.length * 2, 10);

    // 2. Completion rate (max 50 points)
    const completionScore = completionRate * 0.5;

    // 3. Average streak (max 20 points)
    const avgStreak = habits.reduce((sum, h) => sum + h.current_streak, 0) / habits.length;
    const streakScore = Math.min(avgStreak * 2, 20);

    // 4. Routine coverage (max 20 points)
    const hasAllRoutines = [
        habits.some(h => h.routine_type === 'morning'),
        habits.some(h => h.routine_type === 'evening'),
        habits.some(h => h.routine_type === 'anytime'),
    ].filter(Boolean).length;
    const routineScore = (hasAllRoutines / 3) * 20;

    return Math.round(habitScore + completionScore + streakScore + routineScore);
}

function getHealthMessage(score: number): string {
    if (score >= 80) return 'Excellent ! Votre système est solide et bien établi.';
    if (score >= 60) return 'Bon travail ! Continuez à renforcer vos habitudes.';
    if (score >= 40) return 'En progression. Focalisez-vous sur la constance.';
    return 'Début du parcours. Commencez petit et soyez régulier.';
}

export default SystemsOverview;
