// app/(dashboard)/bad-habits/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getBadHabits, createBadHabit, deleteBadHabit } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { INVERSION_LAWS } from '@/lib/constants/fourLaws';
import type { BadHabit, BadHabitFormData } from '@/types/badHabit';

export default function BadHabitsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [badHabits, setBadHabits] = useState<BadHabit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<BadHabitFormData>({
        name: '',
        cue: '',
        craving: '',
        response: '',
        reward: '',
        make_invisible: '',
        make_unattractive: '',
        make_difficult: '',
        make_unsatisfying: '',
    });

    useEffect(() => {
        if (user) {
            loadBadHabits();
        }
    }, [user]);

    const loadBadHabits = async () => {
        if (!user) return;
        try {
            const data = await getBadHabits(user.id);
            setBadHabits(data);
        } catch (error) {
            console.error('Error loading bad habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await createBadHabit(user.id, formData);
            setFormData({
                name: '',
                cue: '',
                craving: '',
                response: '',
                reward: '',
                make_invisible: '',
                make_unattractive: '',
                make_difficult: '',
                make_unsatisfying: '',
            });
            setShowForm(false);
            await loadBadHabits();
        } catch (error) {
            console.error('Error creating bad habit:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette analyse ?')) return;

        try {
            await deleteBadHabit(id);
            setBadHabits(badHabits.filter(h => h.id !== id));
        } catch (error) {
            console.error('Error deleting bad habit:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Mauvaises habitudes 🚫
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Analysez vos mauvaises habitudes pour mieux les comprendre et les éliminer.
                        Utilisez l'inversion des 4 lois pour les briser.
                    </p>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Annuler' : 'Analyser une mauvaise habitude'}
                    </Button>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Analyser une mauvaise habitude</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Nom de la mauvaise habitude"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Consulter mon téléphone au réveil"
                                    required
                                />

                                {/* Breaking down the habit loop */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-red-900 mb-4">
                                        Décomposer la boucle de l'habitude
                                    </h3>
                                    <div className="space-y-4">
                                        <Textarea
                                            label="1. Signal (Cue)"
                                            value={formData.cue}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, cue: e.target.value })}
                                            placeholder="Qu'est-ce qui déclenche cette habitude ? Ex: Je me réveille"
                                            rows={2}
                                            required
                                        />
                                        <Textarea
                                            label="2. Envie (Craving)"
                                            value={formData.craving}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, craving: e.target.value })}
                                            placeholder="Que désirez-vous vraiment ? Ex: Me distraire, éviter l'ennui"
                                            rows={2}
                                            required
                                        />
                                        <Textarea
                                            label="3. Réponse (Response)"
                                            value={formData.response}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, response: e.target.value })}
                                            placeholder="Que faites-vous ? Ex: Je prends mon téléphone et scroll"
                                            rows={2}
                                            required
                                        />
                                        <Textarea
                                            label="4. Récompense (Reward)"
                                            value={formData.reward}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, reward: e.target.value })}
                                            placeholder="Quel besoin est satisfait ? Ex: Stimulation mentale immédiate"
                                            rows={2}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Inversion of 4 laws */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-900 mb-4">
                                        Comment briser cette habitude ?
                                    </h3>
                                    <div className="space-y-4">
                                        <Textarea
                                            label={`1. ${INVERSION_LAWS.makeItInvisible.title}`}
                                            value={formData.make_invisible}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, make_invisible: e.target.value })}
                                            placeholder="Ex: Mettre mon téléphone dans une autre pièce la nuit"
                                            helperText={INVERSION_LAWS.makeItInvisible.tip}
                                            rows={2}
                                        />
                                        <Textarea
                                            label={`2. ${INVERSION_LAWS.makeItUnattractive.title}`}
                                            value={formData.make_unattractive}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, make_unattractive: e.target.value })}
                                            placeholder="Ex: Penser au temps perdu et à l'anxiété que ça crée"
                                            helperText={INVERSION_LAWS.makeItUnattractive.tip}
                                            rows={2}
                                        />
                                        <Textarea
                                            label={`3. ${INVERSION_LAWS.makeItDifficult.title}`}
                                            value={formData.make_difficult}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, make_difficult: e.target.value })}
                                            placeholder="Ex: Désinstaller les apps distrayantes"
                                            helperText={INVERSION_LAWS.makeItDifficult.tip}
                                            rows={2}
                                        />
                                        <Textarea
                                            label={`4. ${INVERSION_LAWS.makeItUnsatisfying.title}`}
                                            value={formData.make_unsatisfying}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, make_unsatisfying: e.target.value })}
                                            placeholder="Ex: Demander à quelqu'un de me tenir responsable"
                                            helperText={INVERSION_LAWS.makeItUnsatisfying.tip}
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit">
                                        Enregistrer l'analyse
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* List of bad habits */}
                {badHabits.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Vos analyses ({badHabits.length})
                        </h2>
                        {badHabits.map((habit) => (
                            <Card key={habit.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">🚫 {habit.name}</CardTitle>
                                        <button
                                            onClick={() => handleDelete(habit.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Loop breakdown */}
                                        <div className="bg-red-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-red-900 mb-3">
                                                La boucle de l'habitude
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="font-medium text-red-800">Signal :</span>
                                                    <p className="text-gray-700 mt-1">{habit.cue}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-red-800">Envie :</span>
                                                    <p className="text-gray-700 mt-1">{habit.craving}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-red-800">Réponse :</span>
                                                    <p className="text-gray-700 mt-1">{habit.response}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-red-800">Récompense :</span>
                                                    <p className="text-gray-700 mt-1">{habit.reward}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Breaking strategies */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-900 mb-3">
                                                Stratégies pour briser l'habitude
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                {habit.make_invisible && (
                                                    <div>
                                                        <span className="font-medium text-green-800">Rendre invisible :</span>
                                                        <p className="text-gray-700 mt-1">{habit.make_invisible}</p>
                                                    </div>
                                                )}
                                                {habit.make_unattractive && (
                                                    <div>
                                                        <span className="font-medium text-green-800">Rendre peu attirante :</span>
                                                        <p className="text-gray-700 mt-1">{habit.make_unattractive}</p>
                                                    </div>
                                                )}
                                                {habit.make_difficult && (
                                                    <div>
                                                        <span className="font-medium text-green-800">Rendre difficile :</span>
                                                        <p className="text-gray-700 mt-1">{habit.make_difficult}</p>
                                                    </div>
                                                )}
                                                {habit.make_unsatisfying && (
                                                    <div>
                                                        <span className="font-medium text-green-800">Rendre insatisfaisante :</span>
                                                        <p className="text-gray-700 mt-1">{habit.make_unsatisfying}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : !showForm && (
                    <Card className="text-center py-12">
                        <div className="text-6xl mb-4">🧠</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucune mauvaise habitude analysée
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Commencez par analyser une mauvaise habitude pour mieux la comprendre et la briser
                        </p>
                        <Button onClick={() => setShowForm(true)}>
                            Analyser une mauvaise habitude
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}