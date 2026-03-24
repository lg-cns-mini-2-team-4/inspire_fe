import { useClient } from "./client";

export const certApi = () => {
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

const e = {
    getActiveSchedules: () => api.get('/certs/active'),
    getUpcomingSchedules: () => api.get('/certs/upcoming'),
    getStatusCounts: () => api.get('/certs/status-counts'),
    getSchedulesForCalendar: () => api.get('/certs/calendar'),
    getExams: () => api.get('certs/exam'),
    getCertificateDetails: () => api.get('/certs'),
    
}

export default certApi;

const response = await fetch(`http://localhost:8080/certificate-service/calendar?year=${year}`);
const response = await fetch(`http://localhost:8080/certificate-service/${id}/detail`);