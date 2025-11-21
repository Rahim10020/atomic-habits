// components/scorecard/HabitRating.tsx

'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { RatingType } from '@/types/scorecard';
import { SCORECARD_RATINGS } from '@/lib/constants/fourLaws';

interface HabitRatingProps {
    rating: RatingType | null;
    onChange: (rating: RatingType) => void;
}

export const HabitRating: React.FC<HabitRatingProps> = ({ rating, onChange }) => {
    return (
        <div className="flex gap-2">
            {SCORECARD_RATINGS.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value as RatingType)}
                    className={cn(
                        'flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                        'border-2 text-sm',
                        rating === option.value
                            ? 'border-gray-900 shadow-md scale-105'
                            : 'border-gray-300 hover:border-gray-400'
                    )}
                    style={{
                        backgroundColor: rating === option.value ? option.color + '20' : 'white',
                        color: rating === option.value ? option.color : '#6B7280',
                    }}
                >
                    <div className="text-2xl mb-1">{option.symbol}</div>
                    <div className="text-xs">
                        {option.value === 'positive' && 'Positive'}
                        {option.value === 'negative' && 'Négative'}
                        {option.value === 'neutral' && 'Neutre'}
                    </div>
                </button>
            ))}
        </div>
    );
};