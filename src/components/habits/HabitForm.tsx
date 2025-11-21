// components/habits/HabitForm.tsx

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FREQUENCY_OPTIONS, ROUTINE_OPTIONS, DAYS_OF_WEEK, FOUR_LAWS } from '@/lib/constants/fourLaws';
import { get2MinuteVersionSuggestion } from '@/lib/utils/habitHelpers';
import type { HabitFormData, FrequencyType, RoutineType } from '@/types/habit';

interface HabitFormProps {
    onSubmit: (data: HabitFormData) => Promise<void>;
    initialData?: Partial<HabitFormData>;
    isEdit?: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({
    onSubmit,
    initialData,
    isEdit = false,
}) => {
    const [formData, setFormData] = useState<HabitFormData>({
        name: initialData?.name || '',
        identity_reason: initialData?.identity_reason || '',
        action: initialData?.action || '',
        time_of_day: initialData?.time_of_day || '',
        location: initialData?.location || '',
        two_minute_version: initialData?.two_minute_version || '',
        cue: initialData?.cue || '',
        context: initialData?.context || '',
        habit_stacking: initialData?.habit_stacking || '',
        temptation_bundling: initialData?.temptation_bundling || '',
        emotional_why: initialData?.emotional_why || '',
        anticipated_reward: initialData?.anticipated_reward || '',
        friction_reducers: initialData?.friction_reducers || [],
        friction_adders_for_bad: initialData?.friction_adders_for_bad || [],
        immediate_reward: initialData?.immediate_reward || '',
        frequency: initialData?.frequency || 'daily',
        target_days: initialData?.target_days || [],
        routine_type: initialData?.routine_type || 'anytime',
    });

    const [currentSection, setCurrentSection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [frictionInput, setFrictionInput] = useState('');

    const updateField = (field: keyof HabitFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addFrictionReducer = () => {
        if (frictionInput.trim()) {
            updateField('friction_reducers', [...(formData.friction_reducers || []), frictionInput.trim()]);
            setFrictionInput('');
        }
    };

    const removeFrictionReducer = (index: number) => {
        updateField('friction_reducers', formData.friction_reducers?.filter((_, i) => i !== index) || []);
    };

    const toggleTargetDay = (day: number) => {
        const days = formData.target_days || [];
        if (days.includes(day)) {
            updateField('target_days', days.filter(d => d !== day));
        } else {
            updateField('target_days', [...days, day].sort());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const canProceed = (section: number): boolean => {
        switch (section) {
            case 1:
                return !!(formData.name && formData.identity_reason);
            case 2:
                return !!(formData.action && formData.time_of_day && formData.location && formData.two_minute_version);
            case 3:
                return !!formData.cue;
            case 4:
                return true; // Optional
            case 5:
                return !!formData.two_minute_version;
            case 6:
                return true; // Optional
            default:
                return true;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Info & Identity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                        </span>
                        Identité & Nom de l'habitude
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        label="Nom de l'habitude"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Ex: Faire 20 minutes de méditation"
                        required
                    />
                    <Textarea
                        label="Raison identitaire"
                        value={formData.identity_reason}
                        onChange={(e) => updateField('identity_reason', e.target.value)}
                        placeholder="Parce que je suis quelqu'un qui..."
                        helperText="Reliez cette habitude à votre identité, pas à un objectif"
                        rows={3}
                        required
                    />
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                        <p className="text-sm text-primary-900">
                            <strong>💡 Conseil :</strong> Les habitudes basées sur l'identité sont plus durables.
                            Au lieu de "Je veux faire du sport", dites "Je suis une personne active".
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Implementation Intention */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            2
                        </span>
                        Intention d'implémentation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        label="Action précise"
                        value={formData.action}
                        onChange={(e) => updateField('action', e.target.value)}
                        placeholder="Ex: Méditer assis sur mon coussin"
                        helperText="Soyez très spécifique"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Moment de la journée"
                            value={formData.time_of_day}
                            onChange={(e) => updateField('time_of_day', e.target.value)}
                            placeholder="Ex: 7h00 du matin"
                            required
                        />
                        <Input
                            label="Lieu"
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                            placeholder="Ex: Dans mon salon"
                            required
                        />
                    </div>
                    <Select
                        label="Type de routine"
                        value={formData.routine_type}
                        onChange={(e) => updateField('routine_type', e.target.value as RoutineType)}
                        options={ROUTINE_OPTIONS}
                    />
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-900">
                            <strong>📝 Format :</strong> "Je vais [ACTION] à [MOMENT] dans [LIEU]"
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Law 1 - Make it Obvious */}
            <Card className="border-2 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                        </span>
                        {FOUR_LAWS.makeItObvious.title} - {FOUR_LAWS.makeItObvious.description}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        label="Signal déclencheur"
                        value={formData.cue}
                        onChange={(e) => updateField('cue', e.target.value)}
                        placeholder="Ex: Après avoir bu mon café du matin"
                        helperText="Quel est le signal qui va déclencher cette habitude ?"
                        rows={2}
                        required
                    />
                    <Textarea
                        label="Contexte (optionnel)"
                        value={formData.context}
                        onChange={(e) => updateField('context', e.target.value)}
                        placeholder="Ex: Mon coussin de méditation est visible près de la fenêtre"
                        rows={2}
                    />
                    <Textarea
                        label="Habit Stacking (optionnel)"
                        value={formData.habit_stacking}
                        onChange={(e) => updateField('habit_stacking', e.target.value)}
                        placeholder="Après [habitude existante], je vais [nouvelle habitude]"
                        helperText="Accrochez cette habitude à une habitude existante"
                        rows={2}
                    />
                </CardContent>
            </Card>

            {/* Section 4: Law 2 - Make it Attractive */}
            <Card className="border-2 border-green-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            2
                        </span>
                        {FOUR_LAWS.makeItAttractive.title} - {FOUR_LAWS.makeItAttractive.description}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        label="Temptation Bundling (optionnel)"
                        value={formData.temptation_bundling}
                        onChange={(e) => updateField('temptation_bundling', e.target.value)}
                        placeholder="Ex: Je peux écouter mon podcast préféré pendant"
                        helperText="Associez l'habitude à quelque chose que vous aimez"
                        rows={2}
                    />
                    <Textarea
                        label="Pourquoi émotionnel (optionnel)"
                        value={formData.emotional_why}
                        onChange={(e) => updateField('emotional_why', e.target.value)}
                        placeholder="Ex: Je me sens calme et centré après"
                        rows={2}
                    />
                    <Textarea
                        label="Récompense anticipée (optionnel)"
                        value={formData.anticipated_reward}
                        onChange={(e) => updateField('anticipated_reward', e.target.value)}
                        placeholder="Ex: Je me sentirai moins stressé toute la journée"
                        rows={2}
                    />
                </CardContent>
            </Card>

            {/* Section 5: Law 3 - Make it Easy */}
            <Card className="border-2 border-yellow-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            3
                        </span>
                        {FOUR_LAWS.makeItEasy.title} - {FOUR_LAWS.makeItEasy.description}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        label="Version 2 minutes"
                        value={formData.two_minute_version}
                        onChange={(e) => updateField('two_minute_version', e.target.value)}
                        placeholder={get2MinuteVersionSuggestion(formData.name)}
                        helperText="Quelle est la version la plus simple de cette habitude ?"
                        rows={2}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comment réduire la friction ?
                        </label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={frictionInput}
                                onChange={(e) => setFrictionInput(e.target.value)}
                                placeholder="Ex: Préparer mes affaires la veille"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFrictionReducer())}
                            />
                            <Button type="button" onClick={addFrictionReducer}>
                                Ajouter
                            </Button>
                        </div>
                        {formData.friction_reducers && formData.friction_reducers.length > 0 && (
                            <div className="space-y-2">
                                {formData.friction_reducers.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                                        <span className="flex-1 text-sm">{item}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFrictionReducer(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Law 4 - Make it Satisfying */}
            <Card className="border-2 border-purple-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            4
                        </span>
                        {FOUR_LAWS.makeItSatisfying.title} - {FOUR_LAWS.makeItSatisfying.description}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        label="Récompense immédiate (optionnel)"
                        value={formData.immediate_reward}
                        onChange={(e) => updateField('immediate_reward', e.target.value)}
                        placeholder="Ex: Je coche ma case et je me félicite"
                        helperText="Comment vous récompenser immédiatement ?"
                        rows={2}
                    />
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-900">
                            <strong>📊 Tracking automatique :</strong> L'application va automatiquement suivre vos streaks
                            et vous donner des feedback visuels satisfaisants (confettis, graphiques, etc.)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Frequency */}
            <Card>
                <CardHeader>
                    <CardTitle>Fréquence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select
                        label="À quelle fréquence ?"
                        value={formData.frequency}
                        onChange={(e) => updateField('frequency', e.target.value as FrequencyType)}
                        options={FREQUENCY_OPTIONS}
                    />
                    {(formData.frequency === 'weekly' || formData.frequency === 'custom') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jours de la semaine
                            </label>
                            <div className="grid grid-cols-7 gap-2">
                                {DAYS_OF_WEEK.map((day) => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleTargetDay(day.value)}
                                        className={`
                      p-3 rounded-lg border-2 text-sm font-medium transition-all
                      ${(formData.target_days || []).includes(day.value)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                                            }
                    `}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submit button */}
            <div className="flex justify-end gap-4 pt-6">
                <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                >
                    {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer l\'habitude'}
                </Button>
            </div>
        </form>
    );
};