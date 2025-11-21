// app/(dashboard)/habits/new/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { createHabit } from '@/lib/supabase/queries';
import { HabitForm } from '@/components/habits/HabitForm';
import type { HabitFormData } from '@/types/habit';

export default function NewHabitPage() {
    const router = useRouter();
    const { user } = useAuth();

    const handleSubmit = async (formData: HabitFormData) => {
        if (!user) return;

        try {
            await createHabit(user.id, formData);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating habit:', error);
            throw error;
        }
    };

    return (
        <div className="container-custom py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Créer une nouvelle habitude 🎯
                    </h1>
                    <p className="text-lg text-gray-600">
                        Utilisez les 4 lois d'Atomic Habits pour construire une habitude qui dure.
                        Prenez le temps de bien remplir chaque section.
                    </p>
                </div>

                {/* Guide message */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">
                        📖 Comment ça marche ?
                    </h3>
                    <ul className="space-y-2 text-sm text-primary-800">
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold mt-0.5">1.</span>
                            <span><strong>Reliez l'habitude à votre identité</strong> - pas à un objectif</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold mt-0.5">2.</span>
                            <span><strong>Soyez très spécifique</strong> - quand, où, comment</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold mt-0.5">3.</span>
                            <span><strong>Appliquez les 4 lois</strong> - chaque loi renforce l'habitude</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold mt-0.5">4.</span>
                            <span><strong>Commencez petit</strong> - la version 2 minutes est cruciale</span>
                        </li>
                    </ul>
                </div>

                {/* Form */}
                <HabitForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}