'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ScorecardItem, ScorecardFormData, RatingType } from '@/types/scorecard';

interface HabitScorecardProps {
    items: ScorecardItem[];
    onAdd: (data: ScorecardFormData) => Promise<void>;
    onUpdate: (id: string, data: Partial<ScorecardFormData>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    loading?: boolean;
}

export const HabitScorecard: React.FC<HabitScorecardProps> = ({
    items,
    onAdd,
    onUpdate,
    onDelete,
    loading = false,
}) => {
    const [newHabit, setNewHabit] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddItem = async (rating: RatingType) => {
        if (!newHabit.trim()) return;

        setIsAdding(true);
        try {
            await onAdd({
                habit_name: newHabit.trim(),
                rating,
            });
            setNewHabit('');
        } finally {
            setIsAdding(false);
        }
    };

    const handleRatingChange = async (id: string, rating: RatingType) => {
        await onUpdate(id, { rating });
    };

    const getRatingColor = (rating: RatingType) => {
        switch (rating) {
            case 'positive':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'negative':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'neutral':
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getRatingSymbol = (rating: RatingType) => {
        switch (rating) {
            case 'positive':
                return '+';
            case 'negative':
                return '-';
            case 'neutral':
                return '=';
        }
    };

    // Group items by rating
    const groupedItems = {
        positive: items.filter((i) => i.rating === 'positive'),
        neutral: items.filter((i) => i.rating === 'neutral'),
        negative: items.filter((i) => i.rating === 'negative'),
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Carte de pointage des habitudes</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Notez vos habitudes actuelles comme positives, négatives ou neutres
                </p>
            </div>

            {/* Add new habit */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="Ajouter une habitude..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isAdding}
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleAddItem('positive')}
                            disabled={!newHabit.trim() || isAdding}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Positive"
                        >
                            +
                        </button>
                        <button
                            onClick={() => handleAddItem('neutral')}
                            disabled={!newHabit.trim() || isAdding}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Neutre"
                        >
                            =
                        </button>
                        <button
                            onClick={() => handleAddItem('negative')}
                            disabled={!newHabit.trim() || isAdding}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Négative"
                        >
                            -
                        </button>
                    </div>
                </div>
            </div>

            {/* Items list */}
            {loading ? (
                <div className="p-8 text-center text-gray-500">Chargement...</div>
            ) : items.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    Aucune habitude enregistrée. Commencez par ajouter vos habitudes quotidiennes.
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {/* Positive habits */}
                    {groupedItems.positive.length > 0 && (
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">+</span>
                                Habitudes positives ({groupedItems.positive.length})
                            </h4>
                            <div className="space-y-2">
                                {groupedItems.positive.map((item) => (
                                    <ScorecardItemRow
                                        key={item.id}
                                        item={item}
                                        onRatingChange={handleRatingChange}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Neutral habits */}
                    {groupedItems.neutral.length > 0 && (
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs">=</span>
                                Habitudes neutres ({groupedItems.neutral.length})
                            </h4>
                            <div className="space-y-2">
                                {groupedItems.neutral.map((item) => (
                                    <ScorecardItemRow
                                        key={item.id}
                                        item={item}
                                        onRatingChange={handleRatingChange}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Negative habits */}
                    {groupedItems.negative.length > 0 && (
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs">-</span>
                                Habitudes négatives ({groupedItems.negative.length})
                            </h4>
                            <div className="space-y-2">
                                {groupedItems.negative.map((item) => (
                                    <ScorecardItemRow
                                        key={item.id}
                                        item={item}
                                        onRatingChange={handleRatingChange}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Summary */}
            {items.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total: {items.length} habitudes</span>
                        <div className="flex gap-4">
                            <span className="text-green-600">+{groupedItems.positive.length}</span>
                            <span className="text-gray-600">={groupedItems.neutral.length}</span>
                            <span className="text-red-600">-{groupedItems.negative.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Individual scorecard item row
interface ScorecardItemRowProps {
    item: ScorecardItem;
    onRatingChange: (id: string, rating: RatingType) => void;
    onDelete: (id: string) => void;
}

const ScorecardItemRow: React.FC<ScorecardItemRowProps> = ({
    item,
    onRatingChange,
    onDelete,
}) => {
    return (
        <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="flex-1 text-sm text-gray-700">{item.habit_name}</span>

            {/* Rating buttons */}
            <div className="flex gap-1">
                <button
                    onClick={() => onRatingChange(item.id, 'positive')}
                    className={cn(
                        'w-6 h-6 rounded text-xs font-medium transition-colors',
                        item.rating === 'positive'
                            ? 'bg-green-500 text-white'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                    )}
                >
                    +
                </button>
                <button
                    onClick={() => onRatingChange(item.id, 'neutral')}
                    className={cn(
                        'w-6 h-6 rounded text-xs font-medium transition-colors',
                        item.rating === 'neutral'
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                >
                    =
                </button>
                <button
                    onClick={() => onRatingChange(item.id, 'negative')}
                    className={cn(
                        'w-6 h-6 rounded text-xs font-medium transition-colors',
                        item.rating === 'negative'
                            ? 'bg-red-500 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                    )}
                >
                    -
                </button>
            </div>

            {/* Delete button */}
            <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Supprimer"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default HabitScorecard;
