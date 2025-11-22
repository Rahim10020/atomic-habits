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
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                    Qui voulez-vous devenir ?
                </h2>
                <p className="text-sm text-muted-foreground">
                    Définissez l&apos;identité que vous voulez construire.
                </p>
            </div>

            <div className="space-y-4">
                <Textarea
                    label="Votre identité cible"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder="Je suis une personne qui..."
                    rows={3}
                    helperText="Décrivez qui vous voulez devenir"
                />

                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                        Suggestions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-2.5 py-1 bg-secondary text-foreground rounded text-xs transition-colors duration-150 border border-border hover:bg-gray-200"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-secondary border border-border rounded p-3">
                    <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Conseil :</strong> Ne dites pas &quot;Je veux perdre du poids&quot;,
                        mais &quot;Je suis une personne en bonne santé&quot;.
                    </p>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        onClick={onNext}
                        disabled={!canProceed}
                    >
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
