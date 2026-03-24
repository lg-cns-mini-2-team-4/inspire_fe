import { useClient } from './client';
import { SignupData, LoginData } from '@schemas/auth';

export const authApi = () => {
    const api = useClient();

    const signup = async (data: SignupData) => {
        const res = await api.post('/auth/signup', data);
        return res.data;
    }

    const login = async (data: LoginData) => {
        const res = await api.post('/auth/login', data);
        return res.data;
    }

    const logout = () => api.post('/auth/logout');

    const reissue = async () => {
        const res = await api.post('/auth/reissue');
        return res.data;
    }

    return { signup, login, logout, reissue };
};