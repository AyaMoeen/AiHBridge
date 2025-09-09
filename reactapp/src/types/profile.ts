export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
    phone?: string;
    birthDate?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
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
    location?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
    phone?: string;
    avatar?: string;
}

export interface UpdateSettingsRequest {
    isPublic?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
}

export interface UpdateSocialLinksRequest {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
}

// Activity types
export interface Activity {
    id: string;
    type: 'post' | 'like' | 'comment' | 'follow' | 'share';
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface ProfileActivity {
    recent: Activity[];
    total: number;
}

// Tab types for profile page
export type ProfileTab = 'overview' | 'posts' | 'saved';

export interface ProfileTabData {
    overview: {
        user: User;
        stats: ProfileStats;
    };
    posts: AIToolPost[];
    saved: AIToolPost[];
}

export interface LoginHistory {
    id: string;
    timestamp: string;
    ipAddress: string;
    location: string;
    device: string;
    success: boolean;
}

export interface ActiveSession {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
}