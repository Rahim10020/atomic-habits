// lib/utils/dateHelpers.ts

import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, addDays, isToday, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

export const getTodayString = (): string => {
    return formatDate(new Date(), 'yyyy-MM-dd');
};

export const getWeekDates = (date: Date = new Date()): Date[] => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Start on Sunday
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
};

export const getLast30Days = (): Date[] => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    return eachDayOfInterval({ start: thirtyDaysAgo, end: today });
};

export const getLast90Days = (): Date[] => {
    const today = new Date();
    const ninetyDaysAgo = subDays(today, 89);
    return eachDayOfInterval({ start: ninetyDaysAgo, end: today });
};

export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
    return eachDayOfInterval({ start: startDate, end: endDate });
};

export const isDateInPast = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
};

export const isDateToday = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dateObj);
};

export const areDatesEqual = (date1: Date | string, date2: Date | string): boolean => {
    const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(dateObj1, dateObj2);
};

export const getDayOfWeek = (date: Date | string): number => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.getDay(); // 0 = Sunday, 6 = Saturday
};

export const shouldTrackHabitToday = (targetDays?: number[]): boolean => {
    if (!targetDays || targetDays.length === 0) return true;
    const today = getDayOfWeek(new Date());
    return targetDays.includes(today);
};

export const getNextTrackingDate = (targetDays?: number[]): Date => {
    if (!targetDays || targetDays.length === 0) return new Date();

    const today = new Date();
    const todayDay = getDayOfWeek(today);

    // Find next valid day
    for (let i = 1; i <= 7; i++) {
        const nextDate = addDays(today, i);
        const nextDay = getDayOfWeek(nextDate);
        if (targetDays.includes(nextDay)) {
            return nextDate;
        }
    }

    return today;
};

export const formatDateForDisplay = (date: Date | string, formatType: 'short' | 'medium' | 'long' = 'medium'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    switch (formatType) {
        case 'short':
            return format(dateObj, 'dd/MM', { locale: fr });
        case 'long':
            return format(dateObj, 'EEEE d MMMM yyyy', { locale: fr });
        case 'medium':
        default:
            return format(dateObj, 'd MMM yyyy', { locale: fr });
    }
};

export const getMonthName = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM yyyy', { locale: fr });
};

export const getWeekNumber = (date: Date | string): number => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
    const pastDaysOfYear = (dateObj.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};