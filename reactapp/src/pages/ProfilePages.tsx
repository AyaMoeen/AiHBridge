// src/pages/ProfilePage.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileOverview from "@/components/ProfileOverview";
import { profileService, type ProfileData, type UpdateProfileRequest } from "@/services/profileService";

interface Category { id: number; name: string; }
interface data {
    id: number;
    followers: number;
    following: number;
    created_date: string;
    follower_email: string;
    following_email: string;
}
export default function ProfilePage() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editForm, setEditForm] = useState<UpdateProfileRequest>({
        firstName: "",
        lastName: "",
        username: "",
        bio: "",
        interested_category: [],
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [isFollowersOpen, setIsFollowersOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true);

                const [profile, cats] = await Promise.all([
                    profileService.getProfile(),
                    profileService.getCategories(),
                ]);

                setProfileData(profile);
                setCategories(cats);

                setEditForm({
                    firstName: profile.user.firstName,
                    lastName: profile.user.lastName,
                    username: profile.user.username,
                    bio: profile.user.bio || "",
                    interested_category: profile.user.interested_category || [],
                });

                // Map names to category IDs
                const selectedIds = profile.user.interested_category
                    ?.map((name) => cats.find(c => c.name === name)?.id)
                    .filter((id): id is number => id !== undefined) || [];
                setSelectedCategoryIds(selectedIds);

            } catch (err: any) {
                console.error("Error loading profile:", err);
                setError(err.message || "Failed to load profile.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, []);
    console.log("GetProfile", profileData)
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);

            const updated: UpdateProfileRequest = {
                ...editForm,
                interested_category: selectedCategoryIds.map(id => ({ id })),
            };

            await profileService.updateProfile({
                ...updated,
                interested_category_ids: selectedCategoryIds,
            });

            const data = await profileService.getProfile();
            setProfileData(data);

        } catch (err: any) {
            alert(err.message || "Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = async (file: File) => {
        try {
            setIsUploadingAvatar(true);
            await profileService.uploadAvatar(file);
            const data = await profileService.getProfile();
            setProfileData(data);
        } catch (err: any) {
            alert(err.message || "Failed to upload avatar.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };
    // Followers / Following functions
    const openFollowers = async () => {
        if (!profileData) return;
        const data = await profileService.getFollowers(profileData.user.id);
        setFollowers(data.results);
        setIsFollowersOpen(true);
    };
    const openFollowing = async () => {
        if (!profileData) return;
        const response = await profileService.getFollowing(profileData.user.id);
        const mapped = response.results?.map((item: any) => ({
            id: item.following, // currently just the user ID
            name: item.following_email ?? `User ${item.following}`, // fallback name
            username: item.following_email?.split('@')[0] ?? `user${item.following}`, // fallback username
            profile_picture: "", // no avatar from API, leave empty
            created_date: item.created_att,
            following_email: item.following_email,
        }));
        setFollowing(mapped);
        setIsFollowingOpen(true);
        setIsFollowersOpen(false);
    };

    const goToUserProfile = (id: number) => {
        closeModal();
        navigate(`/users/${id}`);
    };
    console.log("FollowingCard", following)
    return (
        <>
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
                fileInputRef={fileInputRef}
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                setSelectedCategoryIds={setSelectedCategoryIds}
                openFollowers={openFollowers}
                followers={followers}
                following={following}
                openFollowing={openFollowing}
            />
            {/* Modal for followers / following */}
            {(isFollowersOpen || isFollowingOpen) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-y-auto p-4">
                        <h3 className="text-lg font-bold mb-2">
                            {isFollowersOpen ? "Followers" : "Following"}
                        </h3>
                        <ul>
                            {(isFollowersOpen ? followers : following)?.map(u => {
                                const userObj = isFollowersOpen ? u.follower : u.following;
                                return (
                                    <li
                                        key={userObj.id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        onClick={() => goToUserProfile(userObj.id)}
                                    >
                                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                                            {userObj.profile_picture ? (
                                                <img src={userObj.profile_picture} alt={userObj.username} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="flex items-center justify-center h-full w-full text-sm font-bold">{userObj.username[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{userObj.name}</p>
                                            <p className="text-sm text-muted-foreground">@{userObj.username}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            className="mt-4 w-full py-2 bg-gray-200 rounded"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
function closeModal() {
    throw new Error("Function not implemented.");
}

