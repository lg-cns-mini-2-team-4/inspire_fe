export interface ValidException {
    target: string;
    message: string;
}

export interface ErrorResponse {
    code: string;
    message?: string;
    details?: ValidException[];
}

export interface ApiResponse<T> {
    success: boolean;
    status: number;
    data?: T;
    error?: ErrorResponse;
    timestamp: string;
}