'use client';

import { cn } from '@/lib/utils';
import type { Habit } from '@/types/habit';

interface TwoMinuteVersionProps {
    habit: Habit;
    className?: string;
}

export const TwoMinuteVersion: React.FC<TwoMinuteVersionProps> = ({
    habit,
    className,
}) => {
    return (
        <div className={cn('bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100', className)}>
            <div className="flex items-start gap-3">
                {/* Timer Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Version 2 minutes
                    </h4>
                    <p className="text-sm text-blue-700">
                        {habit.two_minute_version}
                    </p>

                    {/* Tip */}
                    <div className="mt-3 p-2 bg-white/50 rounded text-xs text-blue-600">
                        <strong>Astuce :</strong> Commencez par cette version simplifiée pour créer l&apos;habitude.
                        Une fois que c&apos;est automatique, vous pourrez augmenter progressivement.
                    </div>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: '20%' }} // 2 minutes out of potential 10 minutes = 20%
                    />
                </div>
                <span className="text-xs text-blue-600 font-medium">2 min</span>
            </div>
        </div>
    );
};

// Component showing comparison between full habit and 2-minute version
interface TwoMinuteComparisonProps {
    fullHabit: string;
    twoMinuteVersion: string;
}

export const TwoMinuteComparison: React.FC<TwoMinuteComparisonProps> = ({
    fullHabit,
    twoMinuteVersion,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Full Habit */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Habitude complète</span>
                </div>
                <p className="text-gray-700">{fullHabit}</p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center py-2 bg-white">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            {/* Two Minute Version */}
            <div className="p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-600">Version 2 minutes</span>
                </div>
                <p className="text-blue-900 font-medium">{twoMinuteVersion}</p>
            </div>
        </div>
    );
};

export default TwoMinuteVersion;
