import { useClient } from './client';

export const certApi = () => {
    const api = useClient();

    // Home 화면용 요약 데이터 (통계 및 접수/예정 목록 3개씩)
    const getExamSummary = async () => {
        const res = await api.get('/certificate-service/certs/exams/summary');
        return res.data.data;
    };

    // 전체 시험 목록 조회 (필터링 및 페이징 포함)
    const getExams = async (params?: {
        itemName?: string;
        fieldCode?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        size?: number;
        sort?: string;
    }) => {
        const res = await api.get('/certs/exams', { params });
        return res.data.data;
    };

    // 자격증 상세 및 상세 일정 조회
    const getExamDetail = async (itemCode: string) => {
        const res = await api.get(`/certs/${itemCode}`);
        return res.data.data;
    };

    return { 
        getExamSummary, 
        getExams, 
        getExamDetail 
    };
};