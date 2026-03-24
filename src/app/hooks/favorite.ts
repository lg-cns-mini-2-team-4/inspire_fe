import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "../api/scheduleApi"
import { useAuth } from "../context/AuthContext";

export const useFavorites = () => {
    const api = scheduleApi();
    const { accessToken } = useAuth();
    return useQuery({
        queryKey: ["favorites"],
        queryFn: () => api.getFavorites(),
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });
}