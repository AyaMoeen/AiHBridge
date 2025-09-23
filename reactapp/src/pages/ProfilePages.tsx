// src/pages/ProfilePage.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileOverview from "@/components/ProfileOverview";
import {
    profileService,
    type ProfileData,
    type UpdateProfileRequest,
} from "@/services/profileService";

interface Category {
    id: number;
    name: string;
}
interface UserCard {
    id: number;
    name: string;
    username: string;
    profile_picture: string;
    created_date: string;
    email: string;
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

    const [followers, setFollowers] = useState<UserCard[]>([]);
    const [following, setFollowing] = useState<UserCard[]>([]);
    const [isFollowersOpen, setIsFollowersOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);

    const navigate = useNavigate();

    // 
    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true);

                const profile = await profileService.getProfile();
                const cats = await profileService.getCategories();
                const followersData = await profileService.getFollowers(
                    profile.user.id
                );
                const followingData = await profileService.getFollowing(
                    profile.user.id
                );

                setProfileData(profile);
                setCategories(cats);

                setEditForm({
                    firstName: profile.user.firstName,
                    lastName: profile.user.lastName,
                    username: profile.user.username,
                    bio: profile.user.bio || "",
                    interested_category: profile.user.interested_category || [],
                });

                const selectedIds =
                    profile.user.interested_category
                        ?.map((name) => cats.find((c) => c.name === name)?.id)
                        .filter((id): id is number => id !== undefined) || [];
                setSelectedCategoryIds(selectedIds);


                const mappedFollowers = followersData
                    .filter((item) => item.following === profile.user.id)
                    .map((item) => ({
                        id: item.follower,
                        name: item.follower_email.split("@")[0],
                        username: item.follower_email.split("@")[0],
                        profile_picture: "",
                        created_date: item.created_at,
                        email: item.follower_email,
                    }));
                setFollowers(mappedFollowers);


                const mappedFollowing = followingData
                    .filter((item) => item.follower === profile.user.id)
                    .map((item) => ({
                        id: item.following,
                        name: item.following_email.split("@")[0],
                        username: item.following_email.split("@")[0],
                        profile_picture: "",
                        created_date: item.created_at,
                        email: item.following_email,
                    }));
                setFollowing(mappedFollowing);
            } catch (err: any) {
                console.error("Error loading profile:", err);
                setError(err.message || "Failed to load profile.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, []);

    //   useEffect(() => {
    //     async function loadProfile() {
    //       try {
    //         setIsLoading(true);

    //         const [profile, cats] = await Promise.all([
    //           profileService.getProfile(),
    //           profileService.getCategories(),
    //         ]);

    //         setProfileData(profile);
    //         setCategories(cats);

    //         setEditForm({
    //           firstName: profile.user.firstName,
    //           lastName: profile.user.lastName,
    //           username: profile.user.username,
    //           bio: profile.user.bio || "",
    //           interested_category: profile.user.interested_category || [],
    //         });

    //         // Map names to category IDs
    //         const selectedIds =
    //           profile.user.interested_category
    //             ?.map((name) => cats.find((c) => c.name === name)?.id)
    //             .filter((id): id is number => id !== undefined) || [];
    //         setSelectedCategoryIds(selectedIds);
    //       } catch (err: any) {
    //         console.error("Error loading profile:", err);
    //         setError(err.message || "Failed to load profile.");
    //       } finally {
    //         setIsLoading(false);
    //       }
    //     }

    //     loadProfile();
    //   }, []);

    console.log("GetProfile", profileData);
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);

            const updated: UpdateProfileRequest = {
                ...editForm,
                interested_category: selectedCategoryIds.map((id) => ({ id })),
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

    //
    const closeModal = () => {
        setIsFollowersOpen(false);
        setIsFollowingOpen(false);
    };

    const openFollowers = async () => {
        if (!profileData) return;

        const data = await profileService.getFollowers(profileData.user.id);

        const mappedFollowers: UserCard[] = data
            .filter((item) => item.following === profileData.user.id)
            .map((item) => ({
                id: item.follower,
                name: item.follower_email.split("@")[0],
                username: item.follower_email.split("@")[0],
                profile_picture: "",
                created_date: item.created_at,
                email: item.follower_email,
            }));

        setFollowers(mappedFollowers);
        setIsFollowersOpen(true);
        setIsFollowingOpen(false);
    };

    const openFollowing = async () => {
        if (!profileData) return;

        const data = await profileService.getFollowing(profileData.user.id);

        const mappedFollowing: UserCard[] = data
            .filter((item) => item.follower === profileData.user.id)
            .map((item) => ({
                id: item.following,
                name: item.following_email.split("@")[0],
                username: item.following_email.split("@")[0],
                profile_picture: "",
                created_date: item.created_at,
                email: item.following_email,
            }));

        setFollowing(mappedFollowing);
        setIsFollowingOpen(true);
        setIsFollowersOpen(false);
    };

    // Followers / Following functions
    //   const openFollowers = async () => {
    //     if (!profileData) return;
    //     const data = await profileService.getFollowers(profileData.user.id);
    //     setFollowers(data.results);
    //     setIsFollowersOpen(true);
    //   };
    //   const openFollowing = async () => {
    //     if (!profileData) return;
    //     const response = await profileService.getFollowing(profileData.user.id);
    //     const mapped = response.results?.map((item: any) => ({
    //       id: item.following, // currently just the user ID
    //       name: item.following_email ?? `User ${item.following}`, // fallback name
    //       username: item.following_email?.split("@")[0] ?? `user${item.following}`, // fallback username
    //       profile_picture: "", // no avatar from API, leave empty
    //       created_date: item.created_att,
    //       following_email: item.following_email,
    //     }));
    //     setFollowing(mapped);
    //     setIsFollowingOpen(true);
    //     setIsFollowersOpen(false);
    //   };

    const goToUserProfile = (id: number) => {
        closeModal();
        navigate(`/otherProfile/${id}`);
    };
    console.log("FollowingCard", following);
    return (
        // <>
        //   <ProfileOverview
        //     profileData={profileData}
        //     isLoading={isLoading}
        //     error={error}
        //     editForm={editForm}
        //     setEditForm={setEditForm}
        //     handleSaveProfile={handleSaveProfile}
        //     handleAvatarChange={handleAvatarChange}
        //     isSaving={isSaving}
        //     isUploadingAvatar={isUploadingAvatar}
        //     fileInputRef={fileInputRef}
        //     categories={categories}
        //     selectedCategoryIds={selectedCategoryIds}
        //     setSelectedCategoryIds={setSelectedCategoryIds}
        //     openFollowers={openFollowers}
        //     followers={followers}
        //     following={following}
        //     openFollowing={openFollowing}
        //   />
        //   {/* Modal for followers / following */}
        //   {(isFollowersOpen || isFollowingOpen) && (
        //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        //       <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-y-auto p-4">
        //         <h3 className="text-lg font-bold mb-2">
        //           {isFollowersOpen ? "Followers" : "Following"}
        //         </h3>
        //         <ul>
        //           {(isFollowersOpen ? followers : following)?.map((user) => (
        //             <li
        //               key={user.id}
        //               className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
        //               onClick={() => goToUserProfile(user.id)}
        //             >
        //               <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-bold">
        //                 {user.profile_picture ? (
        //                   <img
        //                     src={user.profile_picture}
        //                     alt={user.username}
        //                     className="h-full w-full object-cover"
        //                   />
        //                 ) : (
        //                   user.username[0]
        //                 )}
        //               </div>
        //               <div>
        //                 <p className="font-medium">{user.name}</p>
        //                 <p className="text-sm text-muted-foreground">
        //                   @{user.username}
        //                 </p>
        //               </div>
        //             </li>
        //           ))}
        //         </ul>
        //         <button
        //           className="mt-4 w-full py-2 bg-gray-200 rounded"
        //           onClick={closeModal}
        //         >
        //           Close
        //         </button>
        //       </div>
        //     </div>
        //   )}
        // </>
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
                openFollowing={openFollowing}
                followers={followers}
                following={following}
            />


            {(isFollowersOpen || isFollowingOpen) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-y-auto p-4">
                        <h3 className="text-lg font-bold mb-2">
                            {isFollowersOpen ? "Followers" : "Following"}
                        </h3>
                        <ul>
                            {(isFollowersOpen ? followers : following)?.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                    onClick={() => goToUserProfile(user.id)}
                                >
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-bold">
                                        {user.profile_picture ? (
                                            <img
                                                src={user.profile_picture}
                                                alt={user.username}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            user.username[0]
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            @{user.username}
                                        </p>
                                    </div>
                                </li>
                            ))}
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
