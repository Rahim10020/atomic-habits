// app/habit-scorecard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getScorecardItems, createScorecardItem, deleteScorecardItem } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HabitRating } from '@/components/scorecard/HabitRating';
import { Card } from '@/components/ui/Card';
import type { ScorecardItem, RatingType } from '@/types/scorecard';

export default function HabitScorecardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [items, setItems] = useState<ScorecardItem[]>([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [newRating, setNewRating] = useState<RatingType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            loadScorecardItems();
        }
    }, [user]);

    const loadScorecardItems = async () => {
        if (!user) return;
        try {
            const data = await getScorecardItems(user.id);
            setItems(data);
        } catch (error) {
            console.error('Error loading scorecard items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        if (!user || !newHabitName.trim() || !newRating) return;

        setSaving(true);
        try {
            const newItem = await createScorecardItem(user.id, {
                habit_name: newHabitName.trim(),
                rating: newRating,
            });
            setItems([...items, newItem]);
            setNewHabitName('');
            setNewRating(null);
        } catch (error) {
            console.error('Error creating scorecard item:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        try {
            await deleteScorecardItem(id);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting scorecard item:', error);
        }
    };

    const handleContinue = () => {
        router.push('/dashboard');
    };

    const canAddItem = newHabitName.trim() && newRating;
    const canContinue = items.length >= 3;

    const getRatingColor = (rating: RatingType) => {
        const colors = {
            positive: 'bg-green-100 text-green-800 border-green-200',
            negative: 'bg-red-100 text-red-800 border-red-200',
            neutral: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[rating];
    };

    const getRatingSymbol = (rating: RatingType) => {
        return rating === 'positive' ? '+' : rating === 'negative' ? '−' : '=';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Habit Scorecard 📋
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Avant de créer de nouvelles habitudes, prenons conscience de vos habitudes actuelles.
                            Listez-les et évaluez-les : sont-elles positives, négatives ou neutres ?
                        </p>
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <p className="text-sm text-primary-900">
                                <strong>💡 Astuce :</strong> Soyez honnête avec vous-même.
                                L'objectif n'est pas de juger, mais de prendre conscience. Ajoutez au moins 3 habitudes.
                            </p>
                        </div>
                    </div>

                    {/* Add new habit */}
                    <Card className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Ajouter une habitude
                        </h3>
                        <div className="space-y-4">
                            <Input
                                placeholder="Ex: Faire du sport le matin, Regarder Netflix le soir, Boire du café..."
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && canAddItem && handleAddItem()}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Comment évaluez-vous cette habitude ?
                                </p>
                                <HabitRating rating={newRating} onChange={setNewRating} />
                            </div>
                            <Button
                                onClick={handleAddItem}
                                disabled={!canAddItem || saving}
                                fullWidth
                            >
                                {saving ? 'Ajout...' : 'Ajouter l\'habitude'}
                            </Button>
                        </div>
                    </Card>

                    {/* List of habits */}
                    {items.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Vos habitudes ({items.length})
                            </h3>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${getRatingColor(item.rating)}`}>
                                                {getRatingSymbol(item.rating)}
                                            </div>
                                            <span className="text-gray-900 font-medium">
                                                {item.habit_name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                                            title="Supprimer"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Continue button */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <div>
                            {!canContinue && (
                                <p className="text-sm text-gray-500">
                                    Ajoutez au moins {3 - items.length} habitude(s) de plus pour continuer
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            size="lg"
                        >
                            Continuer vers le Dashboard
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}