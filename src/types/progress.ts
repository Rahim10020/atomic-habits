// types/progress.ts

export interface ProgressData {
    date: string;
    completed: number;
    total: number;
    percentage: number;
}

export interface StreakData {
    habit_id: string;
    habit_name: string;
    current_streak: number;
    longest_streak: number;
}

export interface HeatMapData {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // Intensity level for color
}

export interface WeeklyStats {
    week_start: string;
    total_completions: number;
    completion_rate: number;
    habits_tracked: number;
}

export interface MonthlyStats {
    month: string;
    total_completions: number;
    completion_rate: number;
    best_streak: number;
    habits_completed: string[];
}