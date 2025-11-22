// app/auth/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.push('/dashboard');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la connexion';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-sm w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-2">
                        Connexion
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Connectez-vous pour continuer
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
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-muted-foreground text-sm">
                            Pas encore de compte ?{' '}
                            <Link
                                href="/auth/signup"
                                className="text-foreground font-medium hover:underline"
                            >
                                S&apos;inscrire
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
