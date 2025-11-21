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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Bienvenue dans Atomic Habits 🎉
                        </h1>
                        <p className="text-gray-600">
                            Commençons par définir votre identité et vos valeurs
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
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
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
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-green-600"
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Excellent travail ! 🎊
                            </h2>
                            <p className="text-lg text-gray-600 mb-2">
                                Votre identité : <strong>{identity}</strong>
                            </p>
                            <p className="text-gray-600">
                                Maintenant, évaluons vos habitudes actuelles...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}