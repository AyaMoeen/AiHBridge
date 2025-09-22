// src/services/profileService.ts
import axios, { AxiosError } from 'axios';
import { tokenManager } from '@/features/auth/services/authService';

const API_BASE_URL = "http://127.0.0.1:8000";

// Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) config.headers.Authorization = `Token ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => Promise.reject(error)
);

// --- Backend Interfaces ---
interface BackendProfile {
    id: number;
    user_id: number;
    name: string;
    email: string;
    username: string;
    bio: string;
    profile_picture: string;
    created_at: string;
    updated_at?: string;
    interested_categories?: InterestedCategory[];
}

export interface Post {
    id: number;
    user_id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    updated_at?: string;
}

interface Category { id: number; name: string; }
interface FollowersResponse { count: number; results: Array<{ id: number; follower: BackendProfile; created_at: string }>; }
interface FollowingResponse { count: number; results: Array<{ id: number; following: BackendProfile; created_at: string }>; }
interface PostCountResponse { posts_count: number; }
interface LikesCountResponse { likes_count: number; }

// --- Frontend Interfaces ---
export interface InterestedCategory { id?: number; text?: string; }

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
    bio?: string;
    interested_category: InterestedCategory[];
    createdAt: string;
    updatedAt: string;
}

export interface ProfileStats {
    posts: number;
    followers: number;
    following: number;
}

export interface ProfileSettings {
    isPublic: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface SocialLinks {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
}

export interface ProfileData {
    user: User;
    settings: ProfileSettings;
    socialLinks: SocialLinks;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: SocialLinks;
    interested_category?: InterestedCategory[];
}

export interface FollowStatus { isFollowing: boolean; isFollowedBy: boolean; canFollow: boolean; }

// --- Custom Errors ---
export class ProfileServiceError extends Error {
    constructor(message: string, public statusCode?: number, public originalError?: any) {
        super(message);
        this.name = 'ProfileServiceError';
    }
}

export class NetworkError extends ProfileServiceError {
    constructor(message: string = 'Network connection failed') { super(message, 0); this.name = 'NetworkError'; }
}

export class AuthenticationError extends ProfileServiceError {
    constructor(message: string = 'Authentication failed') { super(message, 401); this.name = 'AuthenticationError'; }
}

// --- Profile Service ---
class ProfileService {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000;

    private isCacheValid(key: string): boolean {
        const cached = this.cache.get(key);
        return cached ? Date.now() - cached.timestamp < this.CACHE_TTL : false;
    }

    private getCachedData<T>(key: string): T | null {
        if (this.isCacheValid(key)) return this.cache.get(key)!.data as T;
        this.cache.delete(key);
        return null;
    }

    private setCachedData<T>(key: string, data: T) { this.cache.set(key, { data, timestamp: Date.now() }); }
    private clearCache() { this.cache.clear(); }

    private mapBackendToFrontend(profile: BackendProfile): User {
        const [firstName, ...lastName] = (profile.name || '').trim().split(' ');
        return {
            id: profile.id,
            email: profile.email,
            firstName: firstName || '',
            lastName: lastName.join(' ') || '',
            username: profile.username,
            avatar: profile.profile_picture?.startsWith('http')
                ? profile.profile_picture
                : profile.profile_picture
                    ? `${API_BASE_URL}${profile.profile_picture}`
                    : undefined,
            bio: profile.bio || '',
            createdAt: profile.created_at,
            updatedAt: profile.updated_at || profile.created_at,
            interested_category: profile.interested_categories || [],
        };
    }

    private handleError(error: any, defaultMessage: string): never {
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.code === 'ENOTFOUND')
            throw new NetworkError('Cannot connect to server.');
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            switch (status) {
                case 401: throw new AuthenticationError('Authentication failed.');
                case 403: default: throw new ProfileServiceError(data?.detail || defaultMessage, status, error);
            }
        }
        throw new ProfileServiceError(error.message || defaultMessage, 0, error);
    }

    // --- Separate Methods ---
    async getUserProfile(): Promise<User> {
        const cacheKey = 'current-user-profile';
        const cached = this.getCachedData<User>(cacheKey);
        if (cached) return cached;

        try {
            const res = await api.get<BackendProfile>('/profiles/');
            const user = this.mapBackendToFrontend(res.data);
            this.setCachedData(cacheKey, user);
            return user;
        } catch (err: any) { this.handleError(err, 'Failed to fetch profile'); }
    }

    async getFollowers(userId: number): Promise<FollowersResponse> {
        const token = localStorage.getItem("token");
        console.log("Userid", userId)
        const res = await api.get<FollowersResponse>(`/follows/users/${userId}/followers/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        console.log("followerAPI", res)

        return res.data;
    }

    async getFollowing(userId: number): Promise<FollowingResponse> {
            const res = await api.get<FollowingResponse>(`/follows/users/${userId}/following/`);
            console.log("Following",res)
            return res.data;
       
    }

    async getPostsCount(): Promise<number> {
        try {
            const res = await api.get<PostCountResponse>('/posts/my_posts_count/');
            return res.data.posts_count ?? 0;
        } catch (err: any) { this.handleError(err, 'Failed to fetch posts count'); }
    }


    async getProfile(): Promise<ProfileData> {
        const user = await this.getUserProfile();
        return {
            user,
            settings: { isPublic: true, showEmail: false, showPhone: false, allowMessages: true, emailNotifications: true, pushNotifications: false },
            socialLinks: {},
        };
    }

    async updateProfile(updates: UpdateProfileRequest & { interested_category_ids?: number[] }): Promise<User> {
        try {
            const payload: any = {};
            if (updates.firstName || updates.lastName) payload.name = `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
            if (updates.username) payload.username = updates.username;
            if (updates.bio !== undefined) payload.bio = updates.bio;
            payload.interested_category_ids = updates.interested_category_ids || [];

            const res = await api.patch<BackendProfile>('/profiles/update_profile/', payload);
            this.clearCache();
            return this.mapBackendToFrontend(res.data);
        } catch (error: any) { this.handleError(error, 'Failed to update profile'); }
    }

    async uploadAvatar(file: File): Promise<string> {
        try {
            if (file.size > 5 * 1024 * 1024) throw new ProfileServiceError('File size must be less than 5MB');
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) throw new ProfileServiceError('Invalid image format');

            const formData = new FormData();
            formData.append('profile_picture', file);

            const res = await api.patch<BackendProfile>('/profiles/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            this.clearCache();
            return this.mapBackendToFrontend(res.data).avatar || '';
        } catch (err: any) { this.handleError(err, 'Failed to upload avatar'); }
    }

    async followUser(userId: number) {
        try { await api.post(`/follows/users/${userId}/follow/`); this.clearCache(); }
        catch (err: any) { this.handleError(err, "Failed to follow user"); }
    }

    async unfollowUser(userId: number) {
        try { await api.delete(`/follows/users/${userId}/unfollow/`); this.clearCache(); }
        catch (err: any) { this.handleError(err, "Failed to unfollow user"); }
    }

    async getFollowStatus(userId: number): Promise<FollowStatus> {
        try {
            const [followers, following] = await Promise.all([
                this.getFollowers(userId),
                this.getFollowing(userId)
            ]);
            const currentUserId = (await this.getUserProfile()).id;

            const isFollowing = following.results.some(f => f.following.id === userId);
            const isFollowedBy = followers.results.some(f => f.follower.id === currentUserId);

            return { isFollowing, isFollowedBy, canFollow: true };
        } catch (err: any) { this.handleError(err, "Failed to get follow status"); }
    }

    async getCategories(): Promise<Category[]> {
        try {
            const res = await api.get<Category[]>('/posts/categories');
            return res.data;
        } catch (error: any) { this.handleError(error, 'Failed to fetch categories'); }
    }

    async searchUsers(query: string, page = 1, limit = 10): Promise<User[]> {
        try {
            const res = await api.get('/profiles/search/', { params: { q: query, page, limit } });
            return res.data.results.map((profile: BackendProfile) => this.mapBackendToFrontend(profile));
        } catch (error: any) { this.handleError(error, 'Failed to search users'); }
    }

    clearProfileCache(): void { this.clearCache(); }
    getCacheStats(): { size: number; keys: string[] } { return { size: this.cache.size, keys: Array.from(this.cache.keys()) }; }
}

export const profileService = new ProfileService();
