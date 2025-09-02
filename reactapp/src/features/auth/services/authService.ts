// src/features/auth/services/authService.ts
import axios, { AxiosResponse } from 'axios';
import { User } from '@/context/AuthContext';

const API_BASE_URL = "";
const USE_MOCK_API = ""; // Use mock if no API URL provided

// Token management utilities
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const tokenManager = {
    getAccessToken: (): string | null => sessionStorage.getItem(TOKEN_KEY),
    getRefreshToken: (): string | null => sessionStorage.getItem(REFRESH_TOKEN_KEY),
    setTokens: (accessToken: string, refreshToken: string): void => {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },
    clearTokens: (): void => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
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
            config.headers.Authorization = `Bearer ${token}`;
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

            try {
                // Try to refresh token
                const newAccessToken = await authService.refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                tokenManager.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: User;
    message?: string;
}

export interface RegisterResponse {
    access_token?: string;
    refresh_token?: string;
    user: User;
    message: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

// Mock API data for development
const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'AI enthusiast and developer',
        interests: ['Programming', 'Design', 'Business'],
        created_at: '2024-01-01T00:00:00Z',
        // updated_at: '2024-01-01T00:00:00Z',
    }
];

// Mock password (in real app, this would be hashed)
const mockPassword = 'password123';

// Mock API functions
const mockApi = {
    async login(email: string, password: string): Promise<LoginResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = mockUsers.find(u => u.email === email);

        if (!user || password !== mockPassword) {
            throw new Error('Invalid credentials');
        }

        return {
            access_token: `mock_access_token_${Date.now()}`,
            refresh_token: `mock_refresh_token_${Date.now()}`,
            user,
            message: 'Login successful'
        };
    },

    async register(name: string, email: string, _password: string): Promise<RegisterResponse> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if user already exists
        if (mockUsers.find(u => u.email === email)) {
            throw new Error('User with this email already exists');
        }

        const newUser: User = {
            id: String(mockUsers.length + 1),
            name,
            email,
            created_at: new Date().toISOString(),
            // updated_at: new Date().toISOString(),
        };

        mockUsers.push(newUser);

        return {
            access_token: `mock_access_token_${Date.now()}`,
            refresh_token: `mock_refresh_token_${Date.now()}`,
            user: newUser,
            message: 'Registration successful'
        };
    },

    async getCurrentUser(): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const token = tokenManager.getAccessToken();
        if (!token) {
            throw new Error('No access token');
        }

        // In mock API, return first user
        return mockUsers[0];
    },

    async refreshToken(): Promise<RefreshTokenResponse> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        return {
            access_token: `mock_access_token_${Date.now()}`,
            refresh_token: `mock_refresh_token_${Date.now()}`
        };
    }
};

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            if (USE_MOCK_API) {
                return await mockApi.login(email, password);
            }

            const response: AxiosResponse<LoginResponse> = await api.post('/auth/login/', {
                email,
                password,
            });

            return response.data;
        } catch (error: any) {
            if (USE_MOCK_API && error.message) {
                throw error;
            }

            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                throw new Error(apiError.message || 'Invalid credentials');
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async register(name: string, email: string, password: string): Promise<RegisterResponse> {
        try {
            if (USE_MOCK_API) {
                return await mockApi.register(name, email, password);
            }

            const response: AxiosResponse<RegisterResponse> = await api.post('/auth/register/', {
                name,
                email,
                password,
            });

            return response.data;
        } catch (error: any) {
            if (USE_MOCK_API && error.message) {
                throw error;
            }

            if (error.response?.data) {
                const apiError: ApiError = error.response.data;

                // Handle validation errors
                if (apiError.errors) {
                    const firstError = Object.values(apiError.errors)[0];
                    throw new Error(firstError[0] || 'Registration failed');
                }

                throw new Error(apiError.message || 'Registration failed');
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            if (USE_MOCK_API) {
                return await mockApi.getCurrentUser();
            }

            const response: AxiosResponse<User> = await api.get('/auth/user/');
            return response.data;
        } catch (error: any) {
            if (USE_MOCK_API && error.message) {
                throw error;
            }

            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                throw new Error(apiError.message || 'Failed to get user data');
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async logout(): Promise<void> {
        try {
            if (!USE_MOCK_API) {
                await api.post('/auth/logout/');
            }
            // Simulate API delay for mock
            else {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (error) {
            // Even if logout fails on server, we clear local tokens
            console.error('Logout error:', error);
        } finally {
            tokenManager.clearTokens();
        }
    }

    async refreshToken(): Promise<string> {
        try {
            let response: RefreshTokenResponse;

            if (USE_MOCK_API) {
                response = await mockApi.refreshToken();
            } else {
                const refreshToken = tokenManager.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const apiResponse: AxiosResponse<RefreshTokenResponse> = await api.post('/auth/refresh/', {
                    refresh_token: refreshToken
                });
                response = apiResponse.data;
            }

            // Update stored tokens
            tokenManager.setTokens(response.access_token, response.refresh_token);
            return response.access_token;

        } catch (error: any) {
            tokenManager.clearTokens();
            throw new Error('Session expired. Please login again.');
        }
    }

    async requestPasswordReset(email: string): Promise<void> {
        try {
            if (USE_MOCK_API) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return;
            }

            await api.post('/auth/password-reset/', { email });
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                throw new Error(apiError.message || 'Failed to send reset email');
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async verifyResetCode(email: string, code: string): Promise<void> {
        try {
            if (USE_MOCK_API) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Mock validation - accept any 6-digit code
                if (code.length !== 6 || !/^\d{6}$/.test(code)) {
                    throw new Error('Invalid verification code');
                }
                return;
            }

            await api.post('/auth/verify-reset-code/', {
                email,
                code,
            });
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                throw new Error(apiError.message || 'Invalid verification code');
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
        try {
            if (USE_MOCK_API) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return;
            }

            await api.post('/auth/reset-password/', {
                email,
                code,
                password: newPassword,
            });
        } catch (error: any) {
            if (error.response?.data) {
                const apiError: ApiError = error.response.data;
                throw new Error(apiError.message || 'Failed to reset password');
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    // Helper method to check if user is authenticated
    isAuthenticated(): boolean {
        return tokenManager.hasValidTokens();
    }

    // Helper method to get stored access token
    getAccessToken(): string | null {
        return tokenManager.getAccessToken();
    }

    // Helper method to get stored refresh token
    getRefreshToken(): string | null {
        return tokenManager.getRefreshToken();
    }

    // Helper method to clear all tokens
    clearTokens(): void {
        tokenManager.clearTokens();
    }
}

export const authService = new AuthService();
export { tokenManager };