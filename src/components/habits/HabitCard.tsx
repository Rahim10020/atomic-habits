'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Habit, DailyHabitStatus } from '@/types/habit';

interface HabitCardProps {
    habitStatus: DailyHabitStatus;
    onToggle: (habitId: string, completed: boolean) => void;
    onEdit?: (habit: Habit) => void;
    onDelete?: (habitId: string) => void;
    showDetails?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
    habitStatus,
    onToggle,
    onEdit,
    onDelete,
    showDetails = false,
}) => {
    const { habit, isCompleted, canComplete } = habitStatus;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        if (canComplete) {
            onToggle(habit.id, !isCompleted);
        }
    };

    return (
        <div
            className={cn(
                'bg-white rounded-lg border shadow-sm transition-all duration-200',
                isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200',
                !canComplete && 'opacity-60'
            )}
        >
            <div className="p-4">
                <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                        onClick={handleToggle}
                        disabled={!canComplete}
                        className={cn(
                            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                            isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400',
                            !canComplete && 'cursor-not-allowed'
                        )}
                        aria-label={isCompleted ? 'Marquer comme non fait' : 'Marquer comme fait'}
                    >
                        {isCompleted && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    {/* Habit Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className={cn(
                            'font-medium text-gray-900 truncate',
                            isCompleted && 'line-through text-gray-500'
                        )}>
                            {habit.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                            {habit.time_of_day} - {habit.location}
                        </p>
                    </div>

                    {/* Streak Badge */}
                    {habit.current_streak > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            <span>=%</span>
                            <span>{habit.current_streak}</span>
                        </div>
                    )}

                    {/* Expand Button */}
                    {showDetails && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={isExpanded ? 'Réduire' : 'Développer'}
                        >
                            <svg
                                className={cn('w-5 h-5 transition-transform', isExpanded && 'rotate-180')}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Expanded Details */}
                {isExpanded && showDetails && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {/* Two Minute Version */}
                        <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Version 2 minutes</span>
                            <p className="text-sm text-gray-700">{habit.two_minute_version}</p>
                        </div>

                        {/* Cue */}
                        <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Signal</span>
                            <p className="text-sm text-gray-700">{habit.cue}</p>
                        </div>

                        {/* Identity Reason */}
                        <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Raison identitaire</span>
                            <p className="text-sm text-gray-700 italic">&quot;{habit.identity_reason}&quot;</p>
                        </div>

                        {/* Habit Stacking */}
                        {habit.habit_stacking && (
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase">Empilement d&apos;habitudes</span>
                                <p className="text-sm text-gray-700">{habit.habit_stacking}</p>
                            </div>
                        )}

                        {/* Immediate Reward */}
                        {habit.immediate_reward && (
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase">Récompense immédiate</span>
                                <p className="text-sm text-gray-700">{habit.immediate_reward}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(habit)}
                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                    Modifier
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(habit.id)}
                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitCard;
