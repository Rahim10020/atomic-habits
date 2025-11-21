// components/onboarding/IdentityStep.tsx

'use client';

import React from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface IdentityStepProps {
    identity: string;
    setIdentity: (value: string) => void;
    onNext: () => void;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
    identity,
    setIdentity,
    onNext,
}) => {
    const suggestions = [
        'Je suis une personne en bonne santé',
        'Je suis quelqu\'un de discipliné',
        'Je suis un écrivain',
        'Je suis un athlète',
        'Je suis un leader',
        'Je suis quelqu\'un de productif',
    ];

    const handleSuggestionClick = (suggestion: string) => {
        setIdentity(suggestion);
    };

    const canProceed = identity.trim().length > 0;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Qui voulez-vous devenir ? 🎯
                </h2>
                <p className="text-lg text-gray-600">
                    Selon Atomic Habits, la manière la plus efficace de changer vos habitudes
                    est de changer votre identité. Commençons par définir qui vous voulez devenir.
                </p>
            </div>

            <div className="space-y-6">
                <Textarea
                    label="Votre identité cible"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder="Je suis une personne qui..."
                    rows={4}
                    helperText="Décrivez qui vous voulez devenir, pas ce que vous voulez accomplir"
                />

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                        💡 Suggestions d'identité
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary rounded-lg text-sm transition-colors duration-200 border border-gray-200 hover:border-primary"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <p className="text-sm text-primary-900">
                        <strong>💡 Conseil :</strong> Ne dites pas "Je veux perdre du poids",
                        mais "Je suis une personne en bonne santé". Ne dites pas "Je veux écrire un livre",
                        mais "Je suis un écrivain".
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={onNext}
                        disabled={!canProceed}
                        size="lg"
                    >
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