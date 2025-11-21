import type { Habit, HabitLog } from '@/types/habit';
import type { Identity } from '@/types/identity';
import type { ScorecardItem } from '@/types/scorecard';
import type { BadHabit } from '@/types/badHabit';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExportData {
    identity: Identity | null;
    habits: Habit[];
    habitLogs: HabitLog[];
    scorecardItems: ScorecardItem[];
    badHabits: BadHabit[];
    exportDate: string;
    version: string;
}

// Export to JSON
export const exportToJSON = (data: ExportData): void => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `atomic-habits-export-${format(new Date(), 'yyyy-MM-dd')}.json`);
};

// Export to CSV
export const exportToCSV = (habits: Habit[], logs: HabitLog[]): void => {
    // Create habits CSV
    const habitsHeader = [
        'ID',
        'Nom',
        'Raison identitaire',
        'Action',
        'Moment',
        'Lieu',
        'Version 2 minutes',
        'Signal',
        'Fréquence',
        'Type de routine',
        'Série actuelle',
        'Plus longue série',
        'Date de création',
    ].join(',');

    const habitsRows = habits.map((h) =>
        [
            h.id,
            `"${escapeCSV(h.name)}"`,
            `"${escapeCSV(h.identity_reason)}"`,
            `"${escapeCSV(h.action)}"`,
            `"${escapeCSV(h.time_of_day)}"`,
            `"${escapeCSV(h.location)}"`,
            `"${escapeCSV(h.two_minute_version)}"`,
            `"${escapeCSV(h.cue)}"`,
            h.frequency,
            h.routine_type,
            h.current_streak,
            h.longest_streak,
            format(new Date(h.created_at), 'dd/MM/yyyy', { locale: fr }),
        ].join(',')
    );

    const habitsCSV = [habitsHeader, ...habitsRows].join('\n');

    // Create logs CSV
    const logsHeader = ['ID Habitude', 'Date', 'Complété', 'Notes'].join(',');

    const logsRows = logs.map((l) =>
        [
            l.habit_id,
            format(new Date(l.log_date), 'dd/MM/yyyy', { locale: fr }),
            l.completed ? 'Oui' : 'Non',
            `"${escapeCSV(l.notes || '')}"`,
        ].join(',')
    );

    const logsCSV = [logsHeader, ...logsRows].join('\n');

    // Combine into one file
    const fullCSV = `HABITUDES\n${habitsCSV}\n\nJOURNAL\n${logsCSV}`;
    const blob = new Blob(['\ufeff' + fullCSV], { type: 'text/csv;charset=utf-8' });
    downloadFile(blob, `atomic-habits-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
};

// Export habits summary as Markdown
export const exportToMarkdown = (
    identity: Identity | null,
    habits: Habit[],
    stats: { daily: number; weekly: number; monthly: number }
): void => {
    let md = `# Atomic Habits - Résumé\n\n`;
    md += `*Exporté le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}*\n\n`;

    // Identity
    if (identity) {
        md += `## Identité\n\n`;
        md += `**Qui je veux devenir:** ${identity.who_you_want_to_be}\n\n`;
        md += `**Valeurs fondamentales:**\n`;
        identity.core_values.forEach((v) => {
            md += `- ${v}\n`;
        });
        md += `\n`;
    }

    // Stats
    md += `## Statistiques\n\n`;
    md += `- Taux journalier: ${stats.daily}%\n`;
    md += `- Taux hebdomadaire: ${stats.weekly}%\n`;
    md += `- Taux mensuel: ${stats.monthly}%\n\n`;

    // Habits
    md += `## Habitudes (${habits.length})\n\n`;

    habits.forEach((habit, index) => {
        md += `### ${index + 1}. ${habit.name}\n\n`;
        md += `**Raison identitaire:** ${habit.identity_reason}\n\n`;
        md += `**Intention d'implémentation:**\n`;
        md += `> Je vais ${habit.action} à ${habit.time_of_day} dans ${habit.location}\n\n`;
        md += `**Version 2 minutes:** ${habit.two_minute_version}\n\n`;
        md += `**Signal:** ${habit.cue}\n\n`;

        if (habit.habit_stacking) {
            md += `**Empilement:** ${habit.habit_stacking}\n\n`;
        }

        md += `**Progression:** ${habit.current_streak} jours (record: ${habit.longest_streak})\n\n`;
        md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    downloadFile(blob, `atomic-habits-resume-${format(new Date(), 'yyyy-MM-dd')}.md`);
};

// Helper to download file
const downloadFile = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Helper to escape CSV values
const escapeCSV = (value: string): string => {
    return value.replace(/"/g, '""').replace(/\n/g, ' ');
};

// Calculate export statistics
export const calculateExportStats = (habits: Habit[], logs: HabitLog[]) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // Daily
    const todayLogs = logs.filter((l) => l.log_date === todayStr && l.completed);
    const daily = habits.length > 0 ? Math.round((todayLogs.length / habits.length) * 100) : 0;

    // Weekly (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = format(weekAgo, 'yyyy-MM-dd');
    const weekLogs = logs.filter(
        (l) => l.log_date >= weekAgoStr && l.log_date <= todayStr && l.completed
    );
    const weeklyPossible = habits.length * 7;
    const weekly = weeklyPossible > 0 ? Math.round((weekLogs.length / weeklyPossible) * 100) : 0;

    // Monthly (last 30 days)
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = format(monthAgo, 'yyyy-MM-dd');
    const monthLogs = logs.filter(
        (l) => l.log_date >= monthAgoStr && l.log_date <= todayStr && l.completed
    );
    const monthlyPossible = habits.length * 30;
    const monthly = monthlyPossible > 0 ? Math.round((monthLogs.length / monthlyPossible) * 100) : 0;

    return { daily, weekly, monthly };
};

export default {
    exportToJSON,
    exportToCSV,
    exportToMarkdown,
    calculateExportStats,
};
