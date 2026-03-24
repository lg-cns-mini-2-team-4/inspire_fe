import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

export const useUser = () => {
    const api = userApi();

    return useQuery({
        queryKey: ['me'],
        queryFn: api.getMe,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1
    });
}