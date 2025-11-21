// components/confetti/ConfettiEffect.tsx

'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
    trigger: boolean;
    onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ trigger, onComplete }) => {
    useEffect(() => {
        if (trigger) {
            const duration = 1500;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                    return;
                }

                const particleCount = 50 * (timeLeft / duration);

                // Fire confetti from two different angles
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#3C82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#3C82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [trigger, onComplete]);

    return null;
};

export const fireConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3C82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });
};