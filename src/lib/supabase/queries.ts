
import { supabase } from './client';
import type { Habit, HabitLog, HabitFormData } from '@/types/habit';
import type { Identity, IdentityFormData } from '@/types/identity';
import type { ScorecardItem, ScorecardFormData } from '@/types/scorecard';
import type { BadHabit, BadHabitFormData } from '@/types/badHabit';

// ============================================
// IDENTITY QUERIES
// ============================================

export const getIdentity = async (userId: string): Promise<Identity | null> => {
    const { data, error } = await supabase
        .from('identities')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const createIdentity = async (userId: string, formData: IdentityFormData): Promise<Identity> => {
    const { data, error } = await supabase
        .from('identities')
        .insert({
            user_id: userId,
            who_you_want_to_be: formData.who_you_want_to_be,
            core_values: formData.core_values,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateIdentity = async (userId: string, formData: Partial<IdentityFormData>): Promise<Identity> => {
    const { data, error } = await supabase
        .from('identities')
        .update(formData)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ============================================
// SCORECARD QUERIES
// ============================================

export const getScorecardItems = async (userId: string): Promise<ScorecardItem[]> => {
    const { data, error } = await supabase
        .from('scorecard_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const createScorecardItem = async (userId: string, formData: ScorecardFormData): Promise<ScorecardItem> => {
    const { data, error } = await supabase
        .from('scorecard_items')
        .insert({
            user_id: userId,
            ...formData,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateScorecardItem = async (id: string, formData: Partial<ScorecardFormData>): Promise<ScorecardItem> => {
    const { data, error } = await supabase
        .from('scorecard_items')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteScorecardItem = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('scorecard_items')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// ============================================
// HABIT QUERIES
// ============================================

export const getHabits = async (userId: string): Promise<Habit[]> => {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getHabitById = async (id: string): Promise<Habit | null> => {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const createHabit = async (userId: string, formData: HabitFormData): Promise<Habit> => {
    const { data, error } = await supabase
        .from('habits')
        .insert({
            user_id: userId,
            ...formData,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateHabit = async (id: string, formData: Partial<HabitFormData>): Promise<Habit> => {
    const { data, error } = await supabase
        .from('habits')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteHabit = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;
};

// ============================================
// HABIT LOG QUERIES
// ============================================

export const getHabitLogs = async (habitId: string, startDate?: string, endDate?: string): Promise<HabitLog[]> => {
    let query = supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId);

    if (startDate) {
        query = query.gte('log_date', startDate);
    }
    if (endDate) {
        query = query.lte('log_date', endDate);
    }

    const { data, error } = await query.order('log_date', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const getHabitLogsByDate = async (userId: string, date: string): Promise<HabitLog[]> => {
    const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('log_date', date);

    if (error) throw error;
    return data || [];
};

export const toggleHabitLog = async (
    userId: string,
    habitId: string,
    date: string,
    completed: boolean
): Promise<HabitLog> => {
    // Check if log exists
    const { data: existingLog } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .eq('log_date', date)
        .single();

    if (existingLog) {
        // Update existing log
        const { data, error } = await supabase
            .from('habit_logs')
            .update({ completed })
            .eq('id', existingLog.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } else {
        // Create new log
        const { data, error } = await supabase
            .from('habit_logs')
            .insert({
                user_id: userId,
                habit_id: habitId,
                log_date: date,
                completed,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

// ============================================
// BAD HABIT QUERIES
// ============================================

export const getBadHabits = async (userId: string): Promise<BadHabit[]> => {
    const { data, error } = await supabase
        .from('bad_habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getBadHabitById = async (id: string): Promise<BadHabit | null> => {
    const { data, error } = await supabase
        .from('bad_habits')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const createBadHabit = async (userId: string, formData: BadHabitFormData): Promise<BadHabit> => {
    const { data, error } = await supabase
        .from('bad_habits')
        .insert({
            user_id: userId,
            ...formData,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateBadHabit = async (id: string, formData: Partial<BadHabitFormData>): Promise<BadHabit> => {
    const { data, error } = await supabase
        .from('bad_habits')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteBadHabit = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('bad_habits')
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;
};