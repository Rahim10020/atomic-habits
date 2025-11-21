'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useToast } from '@/components/ui/Toast';
import { useSWRHabits } from '@/lib/hooks/useSWRHabits';
import { useIdentity } from '@/lib/hooks/useIdentity';
import { exportToJSON, exportToCSV, exportToMarkdown, calculateExportStats } from '@/lib/utils/exportData';
import { getHabitLogs } from '@/lib/supabase/queries';

export default function SettingsPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const { success, error } = useToast();
    const { habits } = useSWRHabits();
    const { identity } = useIdentity();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'markdown'>('json');

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
            success('Deconnexion reussie');
            router.push('/auth/login');
        } catch (err) {
            error('Erreur lors de la deconnexion');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleExport = async () => {
        if (!user) return;

        setIsExporting(true);
        try {
            // Fetch all logs for all habits
            const allLogs = await Promise.all(
                habits.map((h) => getHabitLogs(h.id))
            );
            const flatLogs = allLogs.flat();

            const stats = calculateExportStats(habits, flatLogs);

            switch (exportFormat) {
                case 'json':
                    exportToJSON({
                        identity,
                        habits,
                        habitLogs: flatLogs,
                        scorecardItems: [],
                        badHabits: [],
                        exportDate: new Date().toISOString(),
                        version: '0.1.0',
                    });
                    break;
                case 'csv':
                    exportToCSV(habits, flatLogs);
                    break;
                case 'markdown':
                    exportToMarkdown(identity, habits, stats);
                    break;
            }

            success('Export reussi !');
        } catch (err) {
            error('Erreur lors de l\'export');
        } finally {
            setIsExporting(false);
        }
    };

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        success(`Theme change : ${newTheme === 'light' ? 'Clair' : newTheme === 'dark' ? 'Sombre' : 'Systeme'}`);
    };

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Parametres</h1>

                {/* Account Section */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 animate-slide-up">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Compte</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <p className="text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID utilisateur</label>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-mono">{user.id}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Membre depuis</label>
                            <p className="text-gray-900 dark:text-white">
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
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Rappels quotidiens</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir un rappel pour completer vos habitudes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Celebration des series</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Notifications pour les nouvelles series atteintes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Apparence</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Theme</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        theme === 'light'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Clair
                                </button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        theme === 'dark'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Sombre
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        theme === 'system'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Systeme
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Langue</label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="fr">Francais</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Data Section */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Donnees</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Format d&apos;export</label>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv' | 'markdown')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                            >
                                <option value="json">JSON (complet)</option>
                                <option value="csv">CSV (tableur)</option>
                                <option value="markdown">Markdown (resume)</option>
                            </select>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                            >
                                {isExporting ? 'Export en cours...' : 'Exporter mes donnees'}
                            </button>
                        </div>
                        <button className="w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            Reinitialiser mes habitudes
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900 mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="p-4 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/30">
                        <h2 className="text-lg font-semibold text-red-900 dark:text-red-400">Zone de danger</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <button
                            onClick={handleSignOut}
                            disabled={isLoggingOut}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {isLoggingOut ? 'Deconnexion...' : 'Se deconnecter'}
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
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full animate-scale-in">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Supprimer le compte ?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Cette action est irreversible. Toutes vos donnees seront supprimees definitivement.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
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
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Atomic Habits v0.1.0</p>
                    <p className="mt-1">Base sur le livre de James Clear</p>
                </div>
            </div>
        </div>
    );
}
