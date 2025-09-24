// src/services/profileTypes.ts
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
export interface InterestedCategory { id?: number; text?: string; }
export interface Category { id: number; name: string; }

export interface Post {
    id: number;
    user_id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    updated_at?: string;
}

export interface ProfileStats {
    posts: number;
    followers: number;
    following: number;
    likes: number;
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
    stats: ProfileStats;
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
export interface FollowStatus {
    isFollowing: boolean;
    isFollowedBy: boolean;
    canFollow: boolean;
}
export interface FollowersResponse {
    count: number;
    results: Array<{ id: number; follower: User; created_at: string }>;
}
export interface FollowingResponse {
    count: number;
    results: Array<{ id: number; following: User; created_at: string }>;
}

export class ProfileServiceError extends Error {
    constructor(message: string, public statusCode?: number, public originalError?: any) {
        super(message);
        this.name = "ProfileServiceError";
    }
}
export class NetworkError extends ProfileServiceError {
    constructor(message: string = "Network connection failed") {
        super(message, 0);
        this.name = "NetworkError";
    }
}
export class AuthenticationError extends ProfileServiceError {
    constructor(message: string = "Authentication failed") {
        super(message, 401);
        this.name = "AuthenticationError";
    }
}
