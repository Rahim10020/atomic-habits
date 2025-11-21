// types/identity.ts

export interface Identity {
    id: string;
    user_id: string;
    who_you_want_to_be: string;
    core_values: string[];
    created_at: string;
    updated_at: string;
}

export interface IdentityFormData {
    who_you_want_to_be: string;
    core_values: string[];
}