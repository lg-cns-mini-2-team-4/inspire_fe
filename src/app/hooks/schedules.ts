import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '../api/scheduleApi';
import { ScheduleData } from '@schemas/schedule';
import { useAuth } from '../context/AuthContext';

export const useSchedules = (year?: number, month?: number) => {
    const api = scheduleApi();
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ["schedules", year, month],
        queryFn: () => api.getSchedules(year, month),
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });
}

export const useCreateSchedule = () => {
    const api = scheduleApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ScheduleData) => api.createSchedule(data),
        onSuccess: (_res, variable) => {
            const date = new Date(variable.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            queryClient.invalidateQueries({ queryKey: ["schedules", year, month] });

            if (variable.type === "EXAM") {
                queryClient.invalidateQueries({ queryKey: ["favorites"] });
            }
        }
    });
}

export const useDeleteSchedule = () => {
    const api = scheduleApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.deleteSchedule(id),
        onSuccess: (res) => {
            const data = res.data
            const date = new Date(data.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            queryClient.invalidateQueries({ queryKey: ["schedules", year, month] });

            if (data.type === "EXAM") {
                queryClient.invalidateQueries({ queryKey: ["favorites"] });
            }
        }
    })
}