
export interface BadHabit {
    id: string;
    user_id: string;
    name: string;

    // Breaking down the habit loop
    cue: string;
    craving: string;
    response: string;
    reward: string;

    // Inversion of 4 laws
    make_invisible?: string;
    make_unattractive?: string;
    make_difficult?: string;
    make_unsatisfying?: string;

    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface BadHabitFormData {
    name: string;
    cue: string;
    craving: string;
    response: string;
    reward: string;
    make_invisible?: string;
    make_unattractive?: string;
    make_difficult?: string;
    make_unsatisfying?: string;
}