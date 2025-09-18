import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
    profileService,
    ProfileData,
    UpdateProfileRequest
} from "@/services/profileService";
import ProfileOverview from "@/components/ProfileOverview";

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editForm, setEditForm] = useState<UpdateProfileRequest>({
        firstName: "",
        lastName: "",
        username: "",
        bio: "",
    });

    // Load profile data
    useEffect(() => {
        console.log('🚀 ProfilePage mounted, loading profile data...');
        console.log('👤 Auth user:', authUser);
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            console.log('📋 Starting profile data load...');
            setIsLoading(true);
            setError(null);

            // Check if user is authenticated
            if (!authUser) {
                console.warn('⚠️ No authenticated user found');
                setError("You must be logged in to view your profile");
                return;
            }

            console.log('🔄 Calling profileService.getCurrentUserProfile()...');
            const data = await profileService.getCurrentUserProfile();
            console.log('✅ Profile data loaded successfully:', data);

            setProfileData(data);

            // Initialize edit form
            const formData = {
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                username: data.user.username || "",
                bio: data.user.bio || "",
            };
            console.log('📝 Initializing edit form with:', formData);
            setEditForm(formData);

        } catch (error: any) {
            console.error('❌ Failed to load profile data:', error);
            const errorMessage = error.message || "Failed to load profile";
            setError(errorMessage);

            toast({
                title: "Error Loading Profile",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            console.log('🏁 Profile data load completed');
        }
    };

    const handleSaveProfile = async () => {
        if (!profileData) {
            console.warn('⚠️ No profile data available for save');
            return;
        }

        try {
            console.log('💾 Starting profile save...');
            setSaving(true);
            setError(null);

            // Calculate what actually changed
            const updates: UpdateProfileRequest = {};
            for (const key in editForm) {
                const formValue = editForm[key as keyof UpdateProfileRequest];
                const currentValue = profileData.user[key as keyof typeof profileData.user];

                if (formValue !== currentValue) {
                    updates[key as keyof UpdateProfileRequest] = formValue;
                    console.log(`📝 Field changed - ${key}: "${currentValue}" -> "${formValue}"`);
                }
            }

            if (Object.keys(updates).length === 0) {
                console.log('ℹ️ No changes detected');
                toast({
                    title: "No Changes",
                    description: "No changes to save."
                });
                return;
            }

            console.log('📤 Saving updates:', updates);
            const updatedUser = await profileService.updateProfile(updates);
            console.log('✅ Profile updated successfully:', updatedUser);

            setProfileData(prev =>
                prev ? { ...prev, user: updatedUser } : null
            );

            toast({
                title: "Success",
                description: "Profile updated successfully!"
            });
        } catch (error: any) {
            console.error('❌ Failed to save profile:', error);
            const errorMessage = error.message || "Failed to save profile";
            setError(errorMessage);

            toast({
                title: "Error Saving Profile",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setSaving(false);
            console.log('🏁 Profile save completed');
        }
    };

    const handleAvatarChange = async (file: File) => {
        if (!profileData) {
            console.warn('⚠️ No profile data available for avatar upload');
            return;
        }

        try {
            console.log('📸 Starting avatar upload:', file.name);
            setIsUploadingAvatar(true);

            const newAvatarUrl = await profileService.uploadAvatar(file);
            console.log('✅ Avatar uploaded successfully:', newAvatarUrl);

            setProfileData(prev =>
                prev ? { ...prev, user: { ...prev.user, avatar: newAvatarUrl } } : null
            );

            toast({
                title: "Success",
                description: "Profile picture updated!"
            });
        } catch (error: any) {
            console.error('❌ Failed to upload avatar:', error);
            toast({
                title: "Error Uploading Avatar",
                description: error.message || "Failed to upload avatar",
                variant: "destructive"
            });
        } finally {
            setIsUploadingAvatar(false);
            console.log('🏁 Avatar upload completed');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-lg">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !profileData) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold mb-2">Unable to Load Profile</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <button
                            onClick={loadProfileData}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <ProfileOverview
                profileData={profileData}
                isLoading={isLoading}
                error={error}
                editForm={editForm}
                setEditForm={setEditForm}
                handleSaveProfile={handleSaveProfile}
                handleAvatarChange={handleAvatarChange}
                isSaving={isSaving}
                isUploadingAvatar={isUploadingAvatar}
                fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            />
        </div>
    );
}