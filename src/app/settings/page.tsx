'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { success, error } = useToast();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
            success('Déconnexion réussie');
            router.push('/auth/login');
        } catch (err) {
            error('Erreur lors de la déconnexion');
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>

                {/* Account Section */}
                <section className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Compte</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">ID utilisateur</label>
                            <p className="text-gray-500 text-sm font-mono">{user.id}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Membre depuis</label>
                            <p className="text-gray-900">
                                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Rappels quotidiens</p>
                                <p className="text-sm text-gray-500">Recevoir un rappel pour compléter vos habitudes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Célébration des séries</p>
                                <p className="text-sm text-gray-500">Notifications pour les nouvelles séries atteintes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Apparence</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Thème</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                                <option value="system">Système</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Langue</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Data Section */}
                <section className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Données</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                            Exporter mes données
                        </button>
                        <button className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            Réinitialiser mes habitudes
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white rounded-lg border border-red-200 mb-6">
                    <div className="p-4 border-b border-red-200 bg-red-50">
                        <h2 className="text-lg font-semibold text-red-900">Zone de danger</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <button
                            onClick={handleSignOut}
                            disabled={isLoggingOut}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Supprimer mon compte
                        </button>
                    </div>
                </section>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Supprimer le compte ?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* App Info */}
                <div className="text-center text-sm text-gray-500">
                    <p>Atomic Habits v0.1.0</p>
                    <p className="mt-1">Basé sur le livre de James Clear</p>
                </div>
            </div>
        </div>
    );
}
