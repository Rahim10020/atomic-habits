'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getIdentity, createIdentity, updateIdentity } from '@/lib/supabase/queries';
import type { Identity, IdentityFormData } from '@/types/identity';

interface UseIdentityReturn {
    identity: Identity | null;
    loading: boolean;
    error: string | null;
    saveIdentity: (data: IdentityFormData) => Promise<Identity>;
    refreshIdentity: () => Promise<void>;
}

export const useIdentity = (): UseIdentityReturn => {
    const { user } = useAuth();
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshIdentity = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getIdentity(user.id);
            setIdentity(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'identité';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            refreshIdentity();
        }
    }, [user, refreshIdentity]);

    const saveIdentity = async (data: IdentityFormData): Promise<Identity> => {
        if (!user) throw new Error('Utilisateur non connecté');

        try {
            let savedIdentity: Identity;

            if (identity) {
                // Update existing identity
                savedIdentity = await updateIdentity(user.id, data);
            } else {
                // Create new identity
                savedIdentity = await createIdentity(user.id, data);
            }

            setIdentity(savedIdentity);
            return savedIdentity;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
            setError(message);
            throw err;
        }
    };

    return {
        identity,
        loading,
        error,
        saveIdentity,
        refreshIdentity,
    };
};

export default useIdentity;
