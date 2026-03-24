import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

export const getMonthRange = (year?: number, month?: number) => {
    const now = new Date();

    const resolvedYear = year ?? now.getFullYear();
    const resolvedMonth = month ?? (now.getMonth() + 1);

    const baseDate = new Date(resolvedYear, resolvedMonth - 1);

    return {
        startDate: startOfWeek(startOfMonth(baseDate), { locale: ko }),
        endDate: endOfWeek(endOfMonth(baseDate), { locale: ko }),
    };
};