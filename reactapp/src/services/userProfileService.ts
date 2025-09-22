// src/services/userProfileService.ts
import { myProfileService } from "./myProfileService";
import {
    Post,
    ProfileData,
    FollowStatus,
    FollowersResponse,
    FollowingResponse,
    ProfileServiceError,
} from "./profileTypes";
import { api } from "./sharedApi";

class UserProfileService {
    async getUserProfile(userId: number): Promise<{ profile: ProfileData; posts: Post[] }> {
        try {
            const res = await api.get(`/profiles/${userId}/details`);
            console.log("userOther", res.data);

            const profileData: ProfileData = {
                user: {
                    id: res.data.profile.id,
                    username: res.data.profile.username,
                    email: res.data.profile.email,
                    firstName: res.data.profile.name?.split(" ")[0] || "",
                    lastName: res.data.profile.name?.split(" ")[1] || "",
                    avatar: res.data.profile.profile_picture,
                    bio: res.data.profile.bio,
                },
                stats: {
                    posts: res.data.posts?.length || 0,
                    followers: res.data.profile.followers_count,
                    following: res.data.profile.following_count,
                    likes: 0, // backend doesn’t return yet
                },
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

            return {
                profile: profileData,
                posts: res.data.posts || [],
            };
        } catch (error: any) {
            throw new ProfileServiceError("Failed to fetch user profile", error.response?.status, error);
        }
    }

    async followUser(userId: number): Promise<void> {
        const token = localStorage.getItem("token"); // or however you store it
        await api.post(
            `/follows/users/${userId}/follow/`,
            {}, // body is empty
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async unfollowUser(userId: number): Promise<void> {
        const token = localStorage.getItem("token"); // or from auth context
        await api.delete(`/follows/users/${userId}/unfollow/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
    }


    async getFollowers(userId: number): Promise<FollowersResponse> {
        const res = await api.get(`/follows/users/${userId}/followers/`);
        return res.data;
    }

    async getFollowing(userId: number, page = 1, limit = 20): Promise<FollowingResponse> {
        const res = await api.get(`/follows/users/${userId}/following/`, { params: { page, limit } });
        return res.data;
    }

    async getFollowStatus(targetUserId: number): Promise<FollowStatus> {
        try {
            // 1. Get logged-in user profile (fresh, no cache)
            const myProfile = await api.get("/profiles/");
            const myUserId = myProfile.data.user_id;

            // 2. Fetch following list directly
            const res = await api.get(
                `/follows/users/${myUserId}/following/`
            );

            console.log("res", res.data);

            // 3. Check if targetUserId is in my following list
            const isFollowing = Array.isArray(res.data)
                ? res.data.some((f) => f.following === targetUserId)
                : false;

            console.log("isFollowing", isFollowing);

            return { isFollowing, isFollowedBy: false, canFollow: true };
        } catch (err: any) {
            console.error("Failed to get follow status", err);
            return { isFollowing: false, isFollowedBy: false, canFollow: false };
        }
    }


}

export const userProfileService = new UserProfileService();
