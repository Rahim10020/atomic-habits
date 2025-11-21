// components/progress/PlateauCurve.tsx

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const PlateauCurve: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>📈 Le Plateau du Potentiel Latent</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Selon Atomic Habits, les habitudes semblent souvent ne pas faire de différence
                        jusqu'à ce que vous franchissiez un seuil critique. C'est ce qu'on appelle le
                        <strong> Plateau du Potentiel Latent</strong>.
                    </p>

                    {/* Visual representation */}
                    <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 overflow-hidden">
                        {/* Axes */}
                        <div className="absolute bottom-6 left-6 right-6 h-0.5 bg-gray-400"></div>
                        <div className="absolute bottom-6 left-6 top-6 w-0.5 bg-gray-400"></div>

                        {/* Labels */}
                        <div className="absolute bottom-2 right-6 text-xs text-gray-500">Temps</div>
                        <div className="absolute top-6 left-2 text-xs text-gray-500 -rotate-90 origin-left">Résultats</div>

                        {/* Expectation line (linear) */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <line
                                x1="10%"
                                y1="90%"
                                x2="90%"
                                y2="20%"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                            />
                            <text x="50%" y="15%" fill="#6B7280" fontSize="12" textAnchor="middle">
                                Attentes
                            </text>
                        </svg>

                        {/* Reality curve (exponential) */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path
                                d="M 10,90 Q 30,88 40,86 Q 50,84 60,75 Q 70,60 80,30 L 90,20"
                                fill="none"
                                stroke="#3C82F6"
                                strokeWidth="3"
                            />
                            <text x="80%" y="25%" fill="#3C82F6" fontSize="12" fontWeight="bold">
                                Réalité
                            </text>
                        </svg>

                        {/* Valley of disappointment */}
                        <div className="absolute" style={{ left: '25%', top: '50%' }}>
                            <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-1 text-xs text-red-800 whitespace-nowrap">
                                Vallée de la déception
                            </div>
                        </div>

                        {/* Breakthrough */}
                        <div className="absolute" style={{ left: '65%', top: '35%' }}>
                            <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-1 text-xs text-green-800 whitespace-nowrap">
                                🎯 Percée !
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                        <p className="text-sm text-primary-900">
                            <strong>💡 Leçon importante :</strong> Si vous voulez des résultats durables,
                            vous devez rester sur le plateau assez longtemps pour franchir le seuil.
                            <strong> Ne baissez pas les bras pendant la "Vallée de la déception"</strong> –
                            c'est précisément là que la plupart des gens abandonnent.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-semibold text-gray-900 mb-2">❌ Erreur courante</div>
                            <p className="text-gray-600">
                                "Je fais des efforts depuis des semaines et je ne vois aucun résultat.
                                Ça ne marche pas."
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-semibold text-gray-900 mb-2">✅ Mindset Atomic Habits</div>
                            <p className="text-gray-600">
                                "Je sais que les résultats viendront. Je me concentre sur le système,
                                pas sur les objectifs."
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};