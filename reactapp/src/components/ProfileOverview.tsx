import { Camera, Loader2, Save } from "lucide-react";
import { Button } from "./ui/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/components/ui/avatar";
import {
    type ProfileData,
    type UpdateProfileRequest,
} from "@/services/profileService";
import { Textarea } from "./ui/components/ui/textarea";
import { Label } from "./ui/components/ui/label";
import { Input } from "./ui/components/ui/input";
interface Category {
    id: number;
    name: string;
}
// Add props for modal functions
interface UserCard {
    id: number;
    name: string;
    username: string;
    profile_picture: string;
    created_date: string;
    email: string;
}
interface Props {
    profileData: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    editForm: UpdateProfileRequest;
    setEditForm: React.Dispatch<React.SetStateAction<UpdateProfileRequest>>;
    handleSaveProfile: () => void;
    handleAvatarChange: (file: File) => void;
    isSaving: boolean;
    isUploadingAvatar: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    categories: Category[];
    selectedCategoryIds: number[];
    setSelectedCategoryIds: React.Dispatch<React.SetStateAction<number[]>>;
    openFollowers: () => void;
    openFollowing: () => void;
    //   followers: number;
    followers: UserCard[];
    following: UserCard[];
}

export default function ProfileOverview({
    profileData,
    isLoading,
    error,
    editForm,
    setEditForm,
    handleSaveProfile,
    handleAvatarChange,
    isSaving,
    isUploadingAvatar,
    fileInputRef,
    categories,
    selectedCategoryIds,
    setSelectedCategoryIds,
    openFollowers,
    openFollowing,
    followers,
    following,
}: Props) {
    if (isLoading) return <p>Loading...</p>;
    if (error && !profileData) return <p className="text-red-500">{error}</p>;
    if (!profileData) return null;

    const { user } = profileData;

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6 flex flex-col md:flex-row items-start gap-6">
                    <div className="relative">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={user.avatar} />
                            {/*<AvatarFallback className="text-2xl">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>*/}

                            <AvatarFallback className="text-2xl">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}{" "}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 rounded-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                        >
                            {isUploadingAvatar ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="h-4 w-4" />
                            )}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                e.target.files?.[0] && handleAvatarChange(e.target.files[0])
                            }
                        />
                    </div>

                    <div className="flex-1 space-y-4">
                        <h1 className="text-2xl font-bold">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-muted-foreground">@{user.username}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                            <div>
                                {/* <div className="text-2xl font-bold">{posts || 0}</div>
                                <div className="text-sm text-muted-foreground">AI Tools Shared</div> */}
                            </div>

                            <div className="cursor-pointer" onClick={openFollowers}>
                                <div className="text-2xl font-bold">{followers.length}</div>
                                <div className="text-sm text-muted-foreground">Followers</div>
                            </div>
                            <div className="cursor-pointer" onClick={openFollowing}>
                                <div className="text-2xl font-bold">{following.length}</div>
                                <div className="text-sm text-muted-foreground">Following</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name & Username */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={editForm.firstName}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        firstName: e.target.value,
                                    }))
                                }
                                className="border-gray-200"
                                disabled
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={editForm.lastName}
                                className="border-gray-200"
                                disabled
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={editForm.username}
                            className="border-gray-200"
                            disabled
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            rows={3}
                            value={editForm.bio}
                            onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                            }
                            className="border-gray-200"
                        />
                    </div>

                    {/* Interests */}
                    <div className="space-y-2">
                        <Label>Interests</Label>
                        <div className="flex flex-wrap gap-2">
                            {categories?.map((category) => {
                                const selected = selectedCategoryIds.includes(category.id);
                                console.log(
                                    `Category ${category.name} (ID: ${category.id}) selected:`,
                                    selected
                                );

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategoryIds((prev) =>
                                                selected
                                                    ? prev.filter((id) => id !== category.id)
                                                    : [...prev, category.id]
                                            );
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm ${selected
                                                ? "bg-primary text-white"
                                                : "bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={handleSaveProfile}
                        className="w-full"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
