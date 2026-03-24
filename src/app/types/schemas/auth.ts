export interface SignupData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    expires: number;
}