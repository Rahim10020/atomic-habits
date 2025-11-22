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
        'Croissance',
        'Créativité',
        'Discipline',
        'Authenticité',
        'Générosité',
        'Excellence',
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
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                    Quelles sont vos valeurs ?
                </h2>
                <p className="text-sm text-muted-foreground">
                    Identifiez 3 à 5 valeurs importantes pour vous.
                </p>
            </div>

            <div className="space-y-4">
                {/* Input for new value */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Ajouter une valeur..."
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                    />
                    <Button onClick={handleAddValue} disabled={!newValue.trim()} variant="secondary">
                        Ajouter
                    </Button>
                </div>

                {/* Suggested values */}
                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                        Suggestions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {suggestedValues.map((value, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(value)}
                                disabled={values.includes(value)}
                                className={`px-2.5 py-1 rounded text-xs transition-colors duration-150 border ${values.includes(value)
                                    ? 'bg-foreground text-background border-foreground cursor-default'
                                    : 'bg-secondary text-foreground border-border hover:bg-gray-200'
                                    }`}
                            >
                                {value}
                                {values.includes(value) && (
                                    <svg
                                        className="w-3 h-3 inline-block ml-1"
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
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                            Vos valeurs ({values.length})
                        </p>
                        <div className="space-y-1.5">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-secondary border border-border rounded px-3 py-2"
                                >
                                    <span className="text-sm text-foreground">{value}</span>
                                    <button
                                        onClick={() => handleRemoveValue(index)}
                                        className="text-muted-foreground hover:text-error transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
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

                <div className="flex justify-between pt-2">
                    <Button onClick={onBack} variant="ghost">
                        <svg
                            className="w-4 h-4 mr-1.5"
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
                    <Button onClick={onNext} disabled={!canProceed}>
                        Continuer
                        <svg
                            className="w-4 h-4 ml-1.5"
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
