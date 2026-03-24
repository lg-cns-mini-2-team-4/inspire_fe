import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '../api/scheduleApi';
import { ScheduleData } from '@schemas/schedule';
import { format } from 'date-fns';
import {getMonthRange} from '../util/dateUtil';

export const useSchedules = (calendarStart: Date, calendarEnd: Date) => {
    const api = scheduleApi();

    return useQuery({
        queryKey: ["schedules", calendarStart, calendarEnd],
        queryFn: () => api.getSchedules(
            undefined,
            format(calendarStart, 'yyyy-MM-dd'),
            format(calendarEnd, 'yyyy-MM-dd')
        ),
        staleTime: 5 * 60 * 1000,
        retry: 1
    });
};

export const useCreateSchedule = () => {
    const api = scheduleApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ScheduleData) => api.createSchedule(data),
        onSuccess: (_res, variable) => {
            const date = new Date(variable.date);
            const { startDate, endDate } = getMonthRange(date);
            queryClient.invalidateQueries({ queryKey: ["schedules", startDate, endDate] });

            if (variable.type === "EXAM") {
                queryClient.invalidateQueries({ queryKey: ["favorites"] });
            }
        }
    });
};

export const useDeleteSchedule = () => {
    const api = scheduleApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.deleteSchedule(id),
        onSuccess: (res) => {
            const date = new Date(res.date);
            const { startDate, endDate } = getMonthRange(date);

            queryClient.invalidateQueries({ queryKey: ["schedules", startDate, endDate] });

            if (res.type === "EXAM") {
                queryClient.invalidateQueries({ queryKey: ["favorites"] });
            }
        }
    })
};