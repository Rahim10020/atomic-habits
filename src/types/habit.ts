// types/habit.ts

export type FrequencyType = 'daily' | 'weekly' | 'custom';
export type RoutineType = 'morning' | 'evening' | 'anytime';

export interface Habit {
    id: string;
    user_id: string;

    // Basic info
    name: string;
    identity_reason: string; // "Because I am someone who..."

    // Implementation intention
    action: string;
    time_of_day: string;
    location: string;

    // Two minute version
    two_minute_version: string;

    // Law 1: Make it Obvious
    cue: string;
    context?: string;
    habit_stacking?: string; // "After [existing habit], I will [new habit]"

    // Law 2: Make it Attractive
    temptation_bundling?: string;
    emotional_why?: string;
    anticipated_reward?: string;

    // Law 3: Make it Easy
    friction_reducers?: string[];
    friction_adders_for_bad?: string[];

    // Law 4: Make it Satisfying
    immediate_reward?: string;

    // Tracking
    frequency: FrequencyType;
    target_days?: number[]; // [0,1,2,3,4,5,6] (0=Sunday)

    // Routine category
    routine_type: RoutineType;

    // Status
    is_active: boolean;
    current_streak: number;
    longest_streak: number;

    created_at: string;
    updated_at: string;
}

export interface HabitWithLogs extends Habit {
    logs: HabitLog[];
}

export interface HabitLog {
    id: string;
    habit_id: string;
    user_id: string;
    completed: boolean;
    log_date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface HabitFormData {
    name: string;
    identity_reason: string;
    action: string;
    time_of_day: string;
    location: string;
    two_minute_version: string;
    cue: string;
    context?: string;
    habit_stacking?: string;
    temptation_bundling?: string;
    emotional_why?: string;
    anticipated_reward?: string;
    friction_reducers?: string[];
    friction_adders_for_bad?: string[];
    immediate_reward?: string;
    frequency: FrequencyType;
    target_days?: number[];
    routine_type: RoutineType;
}

export interface DailyHabitStatus {
    habit: Habit;
    isCompleted: boolean;
    canComplete: boolean; // Based on target_days
    log?: HabitLog;
}