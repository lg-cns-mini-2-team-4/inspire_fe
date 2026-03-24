import { ScheduleData } from '@schemas/schedule';
import { useClient } from "./client";
import { getMonthRange } from '../util/dateUtil';
import { format } from 'date-fns';

export const scheduleApi = () => {
    const api = useClient();

    const getFavorites = () => api.get('/schedules/favorites');

    const getSchedules = (year?: number, month?: number) => {
        const { startDate, endDate } = getMonthRange(year, month);

        return api.get('/schedules', {
            params: {
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd')
            }
        })
    }

    const createSchedule = (data: ScheduleData) => api.post('/schedules', data);

    const deleteSchedule = (id: number) => api.delete(`/schedules/${id}`);

    return { getFavorites, getSchedules, createSchedule, deleteSchedule };
};