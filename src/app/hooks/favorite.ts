import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "../api/scheduleApi";
import { format } from 'date-fns';

export const useFavorites = (today: Date) => {
    const api = scheduleApi();

    return useQuery({
        queryKey: ["favorites"],
        queryFn: () => api.getSchedules("EXAM", format(today, 'yyyy-MM-dd'), undefined),
        staleTime: 5 * 60 * 1000,
        retry: 1
    });
};



export const useToggleFavorite = () => {
  const api = scheduleApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      exam, 
      isFavorite, 
      scheduleId 
    }: { 
      exam: any; 
      isFavorite: boolean; 
      scheduleId?: number 
    }) => {
      if (isFavorite) {
        if (!scheduleId) throw new Error("삭제할 ID가 없습니다.");
        return await api.deleteSchedule(scheduleId);
      } else {
        const requestData: any = {
          title: `[시험] ${exam.itemName}`,
          date: exam.startDate, 
          type: 'EXAM',
          description: exam.description || '',
          refId: exam.itemCode
        };
        return await api.createSchedule(requestData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  });
};;
