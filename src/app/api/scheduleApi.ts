import { ScheduleData } from '@schemas/schedule';
import { useClient } from "./client";

export const scheduleApi = () => {
    const api = useClient();

    const getSchedules = async (type?: string, startDate?: string, endDate?: string) => {
        const res = await api.get('/schedules', {
            params: { type, startDate, endDate }
        });
        return res.data;
    }

    const createSchedule = (data: ScheduleData) => api.post('/schedules', data);

    const deleteSchedule = (id: number) => api.delete(`/schedules/${id}`);

    return { getSchedules, createSchedule, deleteSchedule };
};