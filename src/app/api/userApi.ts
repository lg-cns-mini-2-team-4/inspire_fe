import { useClient } from './client';

export const userApi = () => {
    const api = useClient();

    const getMe = async () => {
        const res = await api.get('user-service/users/me');
        return res.data.data;
    }

    return { getMe };
};