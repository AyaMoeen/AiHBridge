// src/features/auth/services/authService.ts
import axios, { AxiosResponse } from 'axios';
import { User } from '@/context/AuthContext';

const API_BASE_URL = "http://127.0.0.1:8000";
const USE_MOCK_API = false; // Set to false to use real API

// Token management utilities
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const tokenManager = {
    getAccessToken: (): string | null => sessionStorage.getItem(TOKEN_KEY),
    getRefreshToken: (): string | null => sessionStorage.getItem(REFRESH_TOKEN_KEY),
    getUser: (): User | null => {
        const userStr = sessionStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },
    setTokens: (accessToken: string, refreshToken: string): void => {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },
    setUser: (user: User): void => {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearTokens: (): void => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
    },
    hasValidTokens: (): boolean => {
        return !!(tokenManager.getAccessToken() && tokenManager.getRefreshToken());
    }
};

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle auth errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear tokens and redirect to login for Django API
            tokenManager.clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export interface LoginResponse {
    token: string;
    message?: string;
}

export interface RegisterResponse {
    token?: string;
    id: number;
    username: string;
    email: string;
    name: string;
    created_at: string;
    message: string;
}

export interface PasswordResetResponse {
    message: string;
    reset_token?: string;
}

export interface ApiError {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
    detail?: string;
    non_field_errors?: string[];
}

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response: AxiosResponse<LoginResponse> = await api.post('/accounts/login/', {
                username: email, // Django expects username or email as username field
                password,
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                const errorMessage =
                    apiError.detail ||
                    apiError.message ||
                    apiError.error ||
                    (apiError.non_field_errors && apiError.non_field_errors[0]) ||
                    'Invalid credentials';
                throw new Error(errorMessage);
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async register(
        name: string,
        email: string,
        password: string,
        username?: string
    ): Promise<RegisterResponse> {
        try {
            if (USE_MOCK_API) {
                throw new Error('Mock API not implemented for Django backend');
            }

            // Generate username from email if not provided
            const finalUsername =
                username || email.split('@')[0] + Math.random().toString(36).substr(2, 5);

            const response: AxiosResponse<RegisterResponse> = await api.post('/accounts/register/', {
                username: finalUsername,
                name,
                email,
                password,
            });

            return response.data;
        } catch (error: any) {
            console.log('Full error object:', error);

            // Log the response if exists
            if (error.response) {
                console.log('API response:', error.response);
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                console.log('Response headers:', error.response.headers);
            }

            if (error.response?.data) {
                const apiError: ApiError = error.response.data;

                // Handle validation errors
                if (apiError.errors) {
                    const firstError = Object.values(apiError.errors)[0];
                    throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
                }

                const errorMessage =
                    apiError.detail ||
                    apiError.message ||
                    apiError.error ||
                    (apiError.non_field_errors && apiError.non_field_errors[0]) ||
                    'Registration failed';
                throw new Error(errorMessage);
            }

            throw new Error('Network error. Please check your connection.');
        }
    }



    async getCurrentUser(): Promise<User> {
        try {
            const response: AxiosResponse<User> = await api.get('/profiles/'); // <-- Adjust endpoint
            const user = response.data;
            tokenManager.setUser(user);
            return user;
        } catch (error: any) {
            throw new Error('Failed to fetch user profile');
        }
    }
    async logout(): Promise<void> {
        try {
            if (!USE_MOCK_API) {
                await api.post('/accounts/logout/');
            }
        } catch (error) {
            // Even if logout fails on server, we clear local tokens
            console.error('Logout error:', error);
        } finally {
            tokenManager.clearTokens();
        }
    }

    async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
        try {
            if (USE_MOCK_API) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { message: 'Password reset email sent successfully' };
            }

            const response: AxiosResponse<PasswordResetResponse> = await api.post('/accounts/password_reset/', {
                email
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                const errorMessage =
                    apiError.detail ||
                    apiError.message ||
                    apiError.error ||
                    'Failed to send reset email';
                throw new Error(errorMessage);
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async verifyResetCode(code: string): Promise<{ reset_token: string }> {
        try {
            if (USE_MOCK_API) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (code.length !== 6 || !/^\d{6}$/.test(code)) {
                    throw new Error('Invalid verification code');
                }
                return { reset_token: 'mock_reset_token' };
            }

            const response: AxiosResponse<{ reset_token: string }> = await api.post('/accounts/password_reset_confirm_code/', {
                code,
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                const errorMessage =
                    apiError.detail ||
                    apiError.message ||
                    apiError.error ||
                    'Invalid verification code';
                throw new Error(errorMessage);
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async resetPassword(newPassword: string, confirmPassword: string, resetToken: string): Promise<void> {
        try {
            if (USE_MOCK_API) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return;
            }

            await api.post('/accounts/password_reset_set_new_password/', {
                new_password: newPassword,
                confirm_password: confirmPassword,
                reset_token: resetToken,
            });
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                const errorMessage =
                    apiError.detail ||
                    apiError.message ||
                    apiError.error ||
                    'Failed to reset password';
                throw new Error(errorMessage);
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    // Helper method to check if user is authenticated
    isAuthenticated(): boolean {
        return tokenManager.hasValidTokens() && !!tokenManager.getUser();
    }

    // Helper method to get stored access token
    getAccessToken(): string | null {
        return tokenManager.getAccessToken();
    }

    // Helper method to get stored refresh token
    getRefreshToken(): string | null {
        return tokenManager.getRefreshToken();
    }

    // Helper method to get stored user
    getUser(): User | null {
        return tokenManager.getUser();
    }

    // Helper method to clear all tokens
    clearTokens(): void {
        tokenManager.clearTokens();
    }
}

export const authService = new AuthService();
export { tokenManager };