export interface AuthContextType {
    accessToken: string | null;
    login: (token: string) => void;
    logout: () => void;
    reissue: () => Promise<string | null>;
}