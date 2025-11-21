
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getIdentity } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (loading) return;

      if (!user) {
        // User not authenticated, redirect to login
        router.push('/auth/login');
        return;
      }

      // User authenticated, check if they have completed onboarding
      const identity = await getIdentity(user.id);

      if (!identity) {
        // No identity, redirect to onboarding
        router.push('/onboarding');
      } else {
        // Has identity, redirect to dashboard
        router.push('/dashboard');
      }
    };

    checkUserStatus();
  }, [user, loading, router]);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Atomic Habits
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Construisez de meilleures habitudes, un petit pas à la fois
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/auth/login')} size="lg">
            Se connecter
          </Button>
          <Button
            onClick={() => router.push('/auth/signup')}
            variant="secondary"
            size="lg"
          >
            S'inscrire
          </Button>
        </div>
      </div>
    </div>
  );
}