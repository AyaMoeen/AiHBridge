// src/services/sharedApi.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import { tokenManager } from "@/features/auth/services/authService";
import { NetworkError, AuthenticationError, ProfileServiceError } from "./profileTypes";

const API_BASE_URL = "http://127.0.0.1:8000";

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Attach auth token
api.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            // ⚠️ Django REST Framework usually expects `Token <token>`
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.code === "ECONNABORTED" || error.message === "Network Error") {
            return Promise.reject(new NetworkError());
        }
        if (error.response?.status === 401) {
            return Promise.reject(new AuthenticationError());
        }
        return Promise.reject(
            new ProfileServiceError(
                error.message,
                error.response?.status,
                error.response?.data
            )
        );
    }
);
