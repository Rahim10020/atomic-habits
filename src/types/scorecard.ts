// types/scorecard.ts

export type RatingType = 'positive' | 'negative' | 'neutral';

export interface ScorecardItem {
    id: string;
    user_id: string;
    habit_name: string;
    rating: RatingType;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ScorecardFormData {
    habit_name: string;
    rating: RatingType;
    notes?: string;
}