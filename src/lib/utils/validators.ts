// Utility validators for form validation

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
    if (!email) {
        return { isValid: false, error: 'L\'email est requis' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Format d\'email invalide' };
    }

    return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
        return { isValid: false, error: 'Le mot de passe est requis' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins 8 caractères' };
    }

    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins une majuscule' };
    }

    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins une minuscule' };
    }

    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Le mot de passe doit contenir au moins un chiffre' };
    }

    return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
        return { isValid: false, error: 'La confirmation du mot de passe est requise' };
    }

    if (password !== confirmPassword) {
        return { isValid: false, error: 'Les mots de passe ne correspondent pas' };
    }

    return { isValid: true };
};

// Required field validation
export const validateRequired = (value: string, fieldName: string = 'Ce champ'): ValidationResult => {
    if (!value || value.trim() === '') {
        return { isValid: false, error: `${fieldName} est requis` };
    }

    return { isValid: true };
};

// Min length validation
export const validateMinLength = (value: string, minLength: number, fieldName: string = 'Ce champ'): ValidationResult => {
    if (value.length < minLength) {
        return { isValid: false, error: `${fieldName} doit contenir au moins ${minLength} caractères` };
    }

    return { isValid: true };
};

// Max length validation
export const validateMaxLength = (value: string, maxLength: number, fieldName: string = 'Ce champ'): ValidationResult => {
    if (value.length > maxLength) {
        return { isValid: false, error: `${fieldName} ne doit pas dépasser ${maxLength} caractères` };
    }

    return { isValid: true };
};

// Array not empty validation
export const validateArrayNotEmpty = (arr: unknown[], fieldName: string = 'Ce champ'): ValidationResult => {
    if (!arr || arr.length === 0) {
        return { isValid: false, error: `${fieldName} doit contenir au moins un élément` };
    }

    return { isValid: true };
};

// Habit form validation
export const validateHabitForm = (data: {
    name: string;
    identity_reason: string;
    action: string;
    time_of_day: string;
    location: string;
    two_minute_version: string;
    cue: string;
}): ValidationResult => {
    const requiredFields = [
        { value: data.name, name: 'Le nom de l\'habitude' },
        { value: data.identity_reason, name: 'La raison identitaire' },
        { value: data.action, name: 'L\'action' },
        { value: data.time_of_day, name: 'Le moment de la journée' },
        { value: data.location, name: 'Le lieu' },
        { value: data.two_minute_version, name: 'La version 2 minutes' },
        { value: data.cue, name: 'Le signal' },
    ];

    for (const field of requiredFields) {
        const result = validateRequired(field.value, field.name);
        if (!result.isValid) {
            return result;
        }
    }

    return { isValid: true };
};

// Identity form validation
export const validateIdentityForm = (data: {
    who_you_want_to_be: string;
    core_values: string[];
}): ValidationResult => {
    const whoResult = validateRequired(data.who_you_want_to_be, 'Qui vous voulez devenir');
    if (!whoResult.isValid) {
        return whoResult;
    }

    const valuesResult = validateArrayNotEmpty(data.core_values, 'Les valeurs fondamentales');
    if (!valuesResult.isValid) {
        return valuesResult;
    }

    return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
    if (!url) {
        return { isValid: true }; // URL is optional
    }

    try {
        new URL(url);
        return { isValid: true };
    } catch {
        return { isValid: false, error: 'URL invalide' };
    }
};

// Number range validation
export const validateNumberRange = (
    value: number,
    min: number,
    max: number,
    fieldName: string = 'La valeur'
): ValidationResult => {
    if (value < min || value > max) {
        return { isValid: false, error: `${fieldName} doit être entre ${min} et ${max}` };
    }

    return { isValid: true };
};

// Date validation (not in the past)
export const validateFutureDate = (date: string): ValidationResult => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
        return { isValid: false, error: 'La date ne peut pas être dans le passé' };
    }

    return { isValid: true };
};

export default {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateArrayNotEmpty,
    validateHabitForm,
    validateIdentityForm,
    validateUrl,
    validateNumberRange,
    validateFutureDate,
};
