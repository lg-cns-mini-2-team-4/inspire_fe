import { useClient } from './client';
import { SignupData, LoginData } from '@schemas/auth';

export const userApi = () => {
    const api = useClient();

    const getMe = async () => {
        const res = await api.get('/users/me');
        return res.data;
    }

    return { getMe };
};