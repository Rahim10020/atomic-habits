// components/onboarding/ValuesStep.tsx

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ValuesStepProps {
    values: string[];
    setValues: (values: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const ValuesStep: React.FC<ValuesStepProps> = ({
    values,
    setValues,
    onNext,
    onBack,
}) => {
    const [newValue, setNewValue] = useState('');

    const suggestedValues = [
        'Santé',
        'Famille',
        'Croissance personnelle',
        'Créativité',
        'Discipline',
        'Authenticité',
        'Générosité',
        'Excellence',
        'Simplicité',
        'Courage',
    ];

    const handleAddValue = () => {
        if (newValue.trim() && !values.includes(newValue.trim())) {
            setValues([...values, newValue.trim()]);
            setNewValue('');
        }
    };

    const handleRemoveValue = (index: number) => {
        setValues(values.filter((_, i) => i !== index));
    };

    const handleSuggestionClick = (value: string) => {
        if (!values.includes(value)) {
            setValues([...values, value]);
        }
    };

    const canProceed = values.length >= 1;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Quelles sont vos valeurs ? 💎
                </h2>
                <p className="text-lg text-gray-600">
                    Vos valeurs fondamentales guident vos actions. Identifiez 3 à 5 valeurs
                    qui sont importantes pour vous et qui correspondent à l'identité que vous voulez construire.
                </p>
            </div>

            <div className="space-y-6">
                {/* Input for new value */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Ajouter une valeur..."
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                    />
                    <Button onClick={handleAddValue} disabled={!newValue.trim()}>
                        Ajouter
                    </Button>
                </div>

                {/* Suggested values */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                        💡 Valeurs suggérées
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedValues.map((value, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(value)}
                                disabled={values.includes(value)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 border ${values.includes(value)
                                    ? 'bg-primary text-white border-primary cursor-default'
                                    : 'bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary border-gray-200 hover:border-primary'
                                    }`}
                            >
                                {value}
                                {values.includes(value) && (
                                    <svg
                                        className="w-4 h-4 inline-block ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected values */}
                {values.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            ✨ Vos valeurs ({values.length})
                        </p>
                        <div className="space-y-2">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg px-4 py-3"
                                >
                                    <span className="text-gray-900 font-medium">{value}</span>
                                    <button
                                        onClick={() => handleRemoveValue(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
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
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <p className="text-sm text-primary-900">
                        <strong>💡 Conseil :</strong> Choisissez des valeurs qui résonnent vraiment
                        avec vous. Vos habitudes devraient renforcer ces valeurs au quotidien.
                    </p>
                </div>

                <div className="flex justify-between pt-4">
                    <Button onClick={onBack} variant="ghost" size="lg">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 17l-5-5m0 0l5-5m-5 5h12"
                            />
                        </svg>
                        Retour
                    </Button>
                    <Button onClick={onNext} disabled={!canProceed} size="lg">
                        Continuer
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
    );
};