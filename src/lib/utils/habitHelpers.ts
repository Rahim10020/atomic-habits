// lib/utils/habitHelpers.ts

import type { Habit, HabitLog, DailyHabitStatus } from '@/types/habit';
import { shouldTrackHabitToday, getTodayString, areDatesEqual } from './dateHelpers';

export const calculateStreak = (logs: HabitLog[]): number => {
    if (logs.length === 0) return 0;

    const completedLogs = logs
        .filter(log => log.completed)
        .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

    if (completedLogs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completedLogs.length; i++) {
        const logDate = new Date(completedLogs[i].log_date);
        logDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === expectedDate.getTime()) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

export const getCompletionRate = (logs: HabitLog[], days: number = 30): number => {
    if (logs.length === 0) return 0;

    const completedLogs = logs.filter(log => log.completed);
    const rate = (completedLogs.length / days) * 100;
    return Math.min(Math.round(rate), 100);
};

export const getTotalCompletions = (logs: HabitLog[]): number => {
    return logs.filter(log => log.completed).length;
};

export const isHabitCompletedToday = (logs: HabitLog[]): boolean => {
    const today = getTodayString();
    const todayLog = logs.find(log => areDatesEqual(log.log_date, today));
    return todayLog?.completed || false;
};

export const canCompleteHabitToday = (habit: Habit): boolean => {
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekly' || habit.frequency === 'custom') {
        return shouldTrackHabitToday(habit.target_days as number[]);
    }
    return true;
};

export const getDailyHabitStatus = (habit: Habit, logs: HabitLog[]): DailyHabitStatus => {
    const today = getTodayString();
    const todayLog = logs.find(log => areDatesEqual(log.log_date, today));

    return {
        habit,
        isCompleted: todayLog?.completed || false,
        canComplete: canCompleteHabitToday(habit),
        log: todayLog,
    };
};

export const groupHabitsByRoutine = (habits: Habit[]) => {
    return habits.reduce((acc, habit) => {
        const type = habit.routine_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(habit);
        return acc;
    }, {} as Record<string, Habit[]>);
};

export const getHabitScore = (habit: Habit, logs: HabitLog[]): number => {
    // Simple scoring system based on streak and completion rate
    const streak = habit.current_streak;
    const completionRate = getCompletionRate(logs, 30);

    return Math.round((streak * 0.6) + (completionRate * 0.4));
};

export const getMotivationalMessage = (streak: number): string => {
    if (streak === 0) return "Commencez aujourd'hui ! 🎯";
    if (streak === 1) return "Premier jour ! Continue comme ça ! 💪";
    if (streak < 7) return `${streak} jours ! Vous construisez la routine ! 🔥`;
    if (streak < 21) return `${streak} jours ! L'habitude s'installe ! 🌱`;
    if (streak < 66) return `${streak} jours ! Vous êtes sur la bonne voie ! 🚀`;
    return `${streak} jours ! Habitude solidement ancrée ! 🏆`;
};

export const get2MinuteVersionSuggestion = (habitName: string): string => {
    const suggestions: Record<string, string> = {
        'méditation': 'Méditer pendant 2 minutes',
        'lecture': 'Lire une page',
        'sport': 'Faire 5 pompes',
        'exercice': 'Mettre ses chaussures de sport',
        'écriture': 'Écrire une phrase',
        'journal': 'Écrire un mot',
        'yoga': 'Faire une posture',
        'course': 'Mettre ses chaussures de course',
        'guitare': 'Jouer un accord',
        'piano': 'Jouer une gamme',
    };

    const lowerName = habitName.toLowerCase();
    for (const [key, value] of Object.entries(suggestions)) {
        if (lowerName.includes(key)) {
            return value;
        }
    }

    return `Version 2 minutes de "${habitName}"`;
};

export const validateHabitForm = (formData: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name || formData.name.trim().length === 0) {
        errors.push("Le nom de l'habitude est requis");
    }

    if (!formData.identity_reason || formData.identity_reason.trim().length === 0) {
        errors.push("La raison identitaire est requise");
    }

    if (!formData.action || formData.action.trim().length === 0) {
        errors.push("L'action est requise");
    }

    if (!formData.time_of_day || formData.time_of_day.trim().length === 0) {
        errors.push("Le moment de la journée est requis");
    }

    if (!formData.location || formData.location.trim().length === 0) {
        errors.push("Le lieu est requis");
    }

    if (!formData.two_minute_version || formData.two_minute_version.trim().length === 0) {
        errors.push("La version 2 minutes est requise");
    }

    if (!formData.cue || formData.cue.trim().length === 0) {
        errors.push("Le signal déclencheur est requis");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};