import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

export const getMonthRange = (baseDate: Date) => {
    return {
        startDate: startOfWeek(startOfMonth(baseDate)),
        endDate: endOfWeek(endOfMonth(baseDate)),
    };
};