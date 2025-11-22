// app/onboarding/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { createIdentity } from '@/lib/supabase/queries';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { IdentityStep } from '@/components/onboarding/IdentityStep';
import { ValuesStep } from '@/components/onboarding/ValuesStep';

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [identity, setIdentity] = useState('');
    const [values, setValues] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const steps = ['Identité', 'Valeurs', 'Terminé'];

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            await createIdentity(user.id, {
                who_you_want_to_be: identity,
                core_values: values,
            });

            // Show success step
            setCurrentStep(3);

            // Redirect to habit scorecard after 2 seconds
            setTimeout(() => {
                router.push('/habit-scorecard');
            }, 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-xl mx-auto">
                <div className="bg-card rounded-lg border border-border p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-semibold text-foreground mb-1">
                            Bienvenue
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Définissons votre identité et vos valeurs
                        </p>
                    </div>

                    {/* Progress bar */}
                    <ProgressBar
                        currentStep={currentStep}
                        totalSteps={3}
                        steps={steps}
                    />

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 bg-error/10 border border-error/20 text-error px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Steps */}
                    {currentStep === 1 && (
                        <IdentityStep
                            identity={identity}
                            setIdentity={setIdentity}
                            onNext={handleNext}
                        />
                    )}

                    {currentStep === 2 && (
                        <ValuesStep
                            values={values}
                            setValues={setValues}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}

                    {currentStep === 3 && (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-6 h-6 text-success"
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
                            </div>
                            <h2 className="text-lg font-semibold text-foreground mb-2">
                                Configuration terminée
                            </h2>
                            <p className="text-sm text-muted-foreground mb-1">
                                Votre identité : <strong className="text-foreground">{identity}</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Évaluons vos habitudes actuelles...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
