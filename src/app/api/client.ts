import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const useClient = () => {
    const { accessToken, reissue } = useAuth();

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    instance.interceptors.request.use((config) => {
        config.headers = config.headers || {};
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    });

    instance.interceptors.response.use((response) => response,
        async (error) => {
            const originalRequest = error.config;
            if(error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const newToken = await reissue();
                if(newToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};