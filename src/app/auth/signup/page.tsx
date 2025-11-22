// app/auth/signup/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        try {
            await signUp(email, password);
            setSuccess(true);
            setTimeout(() => {
                router.push('/onboarding');
            }, 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-sm w-full text-center">
                    <div className="bg-card rounded-lg border border-border p-6">
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
                            Compte créé
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Redirection vers l&apos;onboarding...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-sm w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-2">
                        Créer un compte
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Commencez à transformer vos habitudes
                    </p>
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            helperText="Au moins 6 caractères"
                            required
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error px-3 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-muted-foreground text-sm">
                            Déjà un compte ?{' '}
                            <Link
                                href="/auth/login"
                                className="text-foreground font-medium hover:underline"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
