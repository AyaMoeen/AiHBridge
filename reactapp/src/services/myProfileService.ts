// src/services/myProfileService.ts
import { api } from "./sharedApi";
import {
    ProfileData,
    UpdateProfileRequest,
    ProfileServiceError,
    Category,
    ProfileStats,
    FollowersResponse,
    FollowingResponse,
    Post,
} from "./profileTypes";

class MyProfileService {
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

    private setCachedData<T>(key: string, data: T) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    private clearCache() {
        this.cache.clear();
    }

    private handleError(error: any, defaultMessage: string): never {
        if (error.code === "ECONNREFUSED" || error.message?.includes("Network Error")) {
            throw new ProfileServiceError("Cannot connect to server.", 0, error);
        }
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            switch (status) {
                case 401:
                    throw new ProfileServiceError("Authentication failed.", 401, error);
                case 403:
                default:
                    throw new ProfileServiceError(data?.detail || defaultMessage, status, error);
            }
        }
        throw new ProfileServiceError(error.message || defaultMessage, 0, error);
    }
    // Add inside MyProfileService class

    async getFollowersCount(userId: number): Promise<number> {
        const data = await this.getFollowers(userId);
        return data?.count ?? 0;
    }

    async getFollowingCount(userId: number): Promise<number> {
        const data = await this.getFollowing(userId);
        return data?.count ?? 0;
    }

    // --- Current User Profile ---
    async getProfile(): Promise<ProfileData> {
        const cacheKey = "current-user-profile";
        const cached = this.getCachedData<ProfileData>(cacheKey);
        if (cached) return cached;

        try {
            const profileRes = await api.get("/profiles/");
            const profile = profileRes.data;

            const stats: ProfileStats = {
                posts: await this.getPostsCount(),
                followers: await this.getFollowersCount(profile.user_id),
                following: await this.getFollowingCount(profile.user_id),
                likes: await this.getLikesCount(),
            };

            const profileData: ProfileData = {
                user: profile,
                stats,
                settings: {
                    isPublic: true,
                    showEmail: false,
                    showPhone: false,
                    allowMessages: true,
                    emailNotifications: true,
                    pushNotifications: false,
                },
                socialLinks: {},
            };

            this.setCachedData(cacheKey, profileData);
            return profileData;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch profile");
        }
    }

    // --- Other Users ---
    async getUserProfile(userId: number): Promise<ProfileData> {
        const cacheKey = `user-profile-${userId}`;
        const cached = this.getCachedData<ProfileData>(cacheKey);
        if (cached) return cached;

        try {
            const res = await api.get(`/profiles/${userId}/details`);
            const profile = res.data.profiles;

            const stats: ProfileStats = {
                posts: 0,
                followers: 0,
                following: 0,
                likes: 0,
            };

            const profileData: ProfileData = {
                user: profile,
                stats,
                settings: {
                    isPublic: true,
                    showEmail: false,
                    showPhone: false,
                    allowMessages: true,
                    emailNotifications: true,
                    pushNotifications: false,
                },
                socialLinks: {},
            };

            this.setCachedData(cacheKey, profileData);
            return profileData;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch user profile");
        }
    }

    // --- Followers / Following ---
    async getFollowers(userId: number, page = 1, limit = 20) {
        try {
            const res = await api.get<FollowersResponse>(`/follows/users/${userId}/followers/`, {
                params: { page, limit },
            });
            return res.data;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch followers");
        }
    }

    async getFollowing(userId: number, page = 1, limit = 20) {
        try {
            const res = await api.get<FollowingResponse>(`/follows/users/${userId}/following/`, {
                params: { page, limit },
            });
            return res.data;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch following");
        }
    }

    async followUser(userId: number) {
        try {
            await api.post(`/follows/users/${userId}/follow/`);
            this.clearCache();
        } catch (err: any) {
            this.handleError(err, "Failed to follow user");
        }
    }

    async unfollowUser(userId: number) {
        try {
            await api.delete(`/follows/users/${userId}/unfollow/`);
            this.clearCache();
        } catch (err: any) {
            this.handleError(err, "Failed to unfollow user");
        }
    }

    async getFollowStatus(userId: number) {
        try {
            const res = await api.get<FollowingResponse>(`/follows/users/${userId}/following/`);
            const isFollowing = res.data.results?.some(f => f.following.id === userId) ?? false;
            return { isFollowing, isFollowedBy: false, canFollow: true };
        } catch (err: any) {
            this.handleError(err, "Failed to get follow status");
        }
    }

    // --- Posts / Likes ---
    async getPostsByUserId(userId: number, page = 1, limit = 20): Promise<Post[]> {
        try {
            const res = await api.get<{ results: Post[] }>(`/posts/user/${userId}/`, { params: { page, limit } });
            return res.data.results.map(post => ({
                ...post,
                image: post.image?.startsWith("http") ? post.image : post.image ? `${post.image}` : undefined,
            }));
        } catch (err: any) {
            this.handleError(err, "Failed to fetch user posts");
        }
    }

    async getPostsCount(): Promise<number> {
        try {
            const res = await api.get("/posts/my_posts_count/");
            return res.data.posts_count ?? 0;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch posts count");
        }
    }

    async getLikesCount(): Promise<number> {
        try {
            const res = await api.get("/posts/my_likes_count/");
            return res.data.likes_count ?? 0;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch likes count");
        }
    }

    // --- Update Profile / Avatar ---
    async updateProfile(updates: UpdateProfileRequest & { interested_category_ids?: number[] }) {
        try {
            const payload: any = {};
            if (updates.firstName || updates.lastName) payload.name = `${updates.firstName || ""} ${updates.lastName || ""}`.trim();
            if (updates.username) payload.username = updates.username;
            if (updates.bio !== undefined) payload.bio = updates.bio;
            payload.interested_category_ids = updates.interested_category_ids || [];

            const res = await api.patch("/profiles/update_profile/", payload);
            this.clearCache();
            return res.data;
        } catch (err: any) {
            this.handleError(err, "Failed to update profile");
        }
    }

    async uploadAvatar(file: File) {
        try {
            if (file.size > 5 * 1024 * 1024) throw new ProfileServiceError("File size must be less than 5MB");
            const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!allowedTypes.includes(file.type)) throw new ProfileServiceError("Invalid image format");

            const formData = new FormData();
            formData.append("profile_picture", file);

            const res = await api.patch("/profiles/", formData, { headers: { "Content-Type": "multipart/form-data" } });
            this.clearCache();
            return res.data.profile_picture;
        } catch (err: any) {
            this.handleError(err, "Failed to upload avatar");
        }
    }

    // --- Categories ---
    async getCategories(): Promise<Category[]> {
        try {
            const res = await api.get<Category[]>("/posts/categories");
            return res.data;
        } catch (err: any) {
            this.handleError(err, "Failed to fetch categories");
        }
    }
}

export const myProfileService = new MyProfileService();
