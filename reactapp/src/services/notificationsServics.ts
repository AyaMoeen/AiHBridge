import axios, { AxiosResponse } from "axios";
import { tokenManager } from "@/features/auth/services/authService";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export interface Notification {
  id: number;
  recipient: number;
  actor: number;
  actor_email: string;
  actor_name: string;
  actor_profile_picture: string;
  verb: string;
  data: any;
  read: boolean;
  timestamp: string;
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      "/notifications/"
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function markAsRead(id: number): Promise<Notification> {
  try {
    const response: AxiosResponse<Notification> = await api.post(
      `/notifications/${id}/mark_read/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
