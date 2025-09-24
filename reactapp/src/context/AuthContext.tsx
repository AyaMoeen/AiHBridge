// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  authService,
  tokenManager,
} from "../features/auth/services/authService";

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
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
  fieldErrors?: Record<string, string[]>;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_FIELD_ERRORS"; payload: Record<string, string[]> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  fieldErrors: {},
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_FIELD_ERRORS":
      return {
        ...state,
        fieldErrors: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    username?: string
  ) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const accessToken = authService.getAccessToken();
        const storedUser = authService.getUser();

        if (accessToken && storedUser) {
          // Convert stored user to match our User interface
          const user: User = {
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            username: storedUser.username,
            profile_picture: storedUser.profile_picture,
            bio: storedUser.bio,
            interests: storedUser.interests,
            created_at: storedUser.created_at,
          };
          dispatch({ type: "SET_USER", payload: user });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        // Clear any invalid tokens
        authService.clearTokens();
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await authService.login(email, password);

      // Store token
      tokenManager.setTokens(response.token, response.token); // single token for both

      // Fetch user profile after login
      const user = await authService.getCurrentUser();

      tokenManager.setUser(user);
      dispatch({ type: "SET_USER", payload: user });
    } catch (error: any) {
      const errorMessage = "Email or password is not correct";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      // dispatch({
      //   type: "SET_ERROR",
      //   payload: error.message || "Login failed. Please try again.",
      // });
      throw new Error(errorMessage);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    username?: string
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await authService.register(
        name,
        email,
        password,
        username
      );

      // Store tokens if registration includes auto-login
      if (response.token) {
        tokenManager.setTokens(response.token, response.token);

        // Convert response user to match our User interface
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          username: response.username,
          created_at: response.created_at,
        };

        tokenManager.setUser(user);
        dispatch({ type: "SET_USER", payload: user });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error: any) {
      // catch (error: any) {
      //   dispatch({
      //     type: "SET_ERROR",
      //     payload: error.message || "Registration failed. Please try again.",
      //   });
      //   throw error;
      // }
      if (error.response?.data) {
        dispatch({ type: "SET_FIELD_ERRORS", payload: error.response.data });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Registration failed",
        });
      }
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: "SET_USER", payload: user });
    } catch (error) {
      // If refresh fails, logout user
      await logout();
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
