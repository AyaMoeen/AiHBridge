// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../features/auth/services/authService';

export interface User {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
    bio?: string;
    interests?: string[];
    created_at: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: User }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initialize auth state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            try {
                const accessToken = authService.getAccessToken();
                const refreshToken = authService.getRefreshToken();

                if (accessToken && refreshToken) {
                    // Try to get current user data
                    try {
                        const user = await authService.getCurrentUser();
                        dispatch({ type: 'SET_USER', payload: user });
                    } catch (error) {
                        // If getting user fails, try to refresh token
                        try {
                            await authService.refreshToken();
                            const user = await authService.getCurrentUser();
                            dispatch({ type: 'SET_USER', payload: user });
                        } catch (refreshError) {
                            // Both failed, clear tokens and show login
                            authService.clearTokens();
                            dispatch({ type: 'SET_LOADING', payload: false });
                        }
                    }
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } catch (error) {
                // Clear any invalid tokens
                authService.clearTokens();
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            const response = await authService.login(email, password);

            // Store tokens in sessionStorage
            const tokenManager = await import('../features/auth/services/authService').then(m => m.tokenManager);
            tokenManager.setTokens(response.access_token, response.refresh_token);

            // Set user in state
            dispatch({ type: 'SET_USER', payload: response.user });

            // Redirect to home or dashboard
            window.location.href = '/';
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.message || 'Login failed. Please try again.'
            });
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            const response = await authService.register(name, email, password);

            // Store tokens if registration includes auto-login
            if (response.access_token && response.refresh_token) {
                const tokenManager = await import('../features/auth/services/authService').then(m => m.tokenManager);
                tokenManager.setTokens(response.access_token, response.refresh_token);
                dispatch({ type: 'SET_USER', payload: response.user });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error: any) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.message || 'Registration failed. Please try again.'
            });
            throw error;
        }
    };

    const logout = (): void => {
        authService.clearTokens();
        dispatch({ type: 'LOGOUT' });
        window.location.href = '/login';
    };

    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const user = await authService.getCurrentUser();
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
            // If refresh fails, logout user
            logout();
        }
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        register,
        clearError,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};