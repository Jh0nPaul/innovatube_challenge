export interface UserCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}
