import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Save, Camera, Loader2 } from "lucide-react";
import { profileService, type ProfileData, type UpdateProfileRequest } from "@/services/profileService";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
    fileInputRef
}: Props) {
    const [isFollowersOpen, setFollowersOpen] = useState(false);
    const [isFollowingOpen, setFollowingOpen] = useState(false);
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    if (isLoading) return <p>Loading...</p>;
    if (error && !profileData) return <p className="text-red-500">{error}</p>;
    if (!profileData) return null;

    const { user, stats } = profileData;
    const loadFollowers = async () => {
        try {
            setLoadingList(true);
            const res = await profileService.getFollowers(user.id);
            setFollowers(res.results.map(r => r.follower));
            setFollowersOpen(true);
        } finally {
            setLoadingList(false);
        }
    };

    // Load following
    const loadFollowing = async () => {
        try {
            setLoadingList(true);
            const res = await profileService.getFollowing(user.id);
            setFollowing(res.results.map(r => r.following));
            setFollowingOpen(true);
        } finally {
            setLoadingList(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* Top Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="relative">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-2xl">
                                    {user.firstName[0]}{user.lastName[0]}
                                </AvatarFallback>
                            </Avatar>

                            {/* Avatar upload */}
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute -bottom-2 -right-2 rounded-full"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                            >
                                {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleAvatarChange(e.target.files[0]);
                                }}
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <h1 className="text-2xl font-bold">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-muted-foreground">@{user.username}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{stats.posts}</div>
                                    <div className="text-sm text-muted-foreground">AI Tools Shared</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold"></div>
                                    <div className="text-sm text-muted-foreground"></div>
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:text-primary"
                                    onClick={loadFollowers}
                                >
                                    <div className="text-2xl font-bold">{stats.followers || 0}</div>
                                    <div className="text-sm text-muted-foreground">Followers</div>
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:text-primary"
                                    onClick={loadFollowing}
                                >
                                    <div className="text-2xl font-bold">{stats.following || 0}</div>
                                    <div className="text-sm text-muted-foreground">Following</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form - shown immediately (no button needed) */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={editForm.firstName}
                                onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                                className="border-gray-300"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={editForm.lastName}
                                onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                                className="border-gray-300"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={editForm.username}
                            onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                            className="border-gray-300"
                        />
                    </div>

                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            className="border-gray-300"
                        />
                    </div>
                    {/* Interests */}
                    <div className="space-y-2">
                        <Label>Interests</Label>
                        <div className="flex flex-wrap gap-2">
                            {editForm.interests?.map((interest, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center gap-2"
                                >
                                    {interest}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = [...(editForm.interests || [])];
                                            updated.splice(idx, 1);
                                            setEditForm((prev) => ({ ...prev, interests: updated }));
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Add a new interest..."
                                value={editForm.newInterest || ""}
                                onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, newInterest: e.target.value }))
                                    
                                }
                                className="border-gray-300"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (!editForm.newInterest?.trim()) return;
                                    setEditForm((prev) => ({
                                        ...prev,
                                        interests: [...(prev.interests || []), prev.newInterest.trim()],
                                        newInterest: "",
                                    }));
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    <Button onClick={handleSaveProfile} className="w-full" disabled={isSaving}>
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
            <Dialog open={isFollowersOpen} onOpenChange={setFollowersOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Followers</DialogTitle>
                    </DialogHeader>
                    {loadingList ? (
                        <p>Loading followers...</p>
                    ) : followers.length === 0 ? (
                        <p className="text-muted-foreground">No followers yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {followers.map((f) => (
                                <li key={f.id} className="flex items-center gap-3">
                                    <Link
                                        to={`/users/${f.id}`}
                                        className="flex items-center gap-3 hover:text-primary"
                                    >
                                        <Avatar>
                                            <AvatarImage src={f.profile_picture} />
                                            <AvatarFallback>{f.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{f.username}</p>
                                            <p className="text-sm text-muted-foreground">{f.name}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isFollowingOpen} onOpenChange={setFollowingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Following</DialogTitle>
                    </DialogHeader>
                    {loadingList ? (
                        <p>Loading following...</p>
                    ) : following.length === 0 ? (
                        <p className="text-muted-foreground">Not following anyone yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {following.map((f) => (
                                <li key={f.id} className="flex items-center gap-3">
                                    <Link
                                        to={`/users/${f.id}`}
                                        className="flex items-center gap-3 hover:text-primary"
                                    >
                                        <Avatar>
                                            <AvatarImage src={f.profile_picture} />
                                            <AvatarFallback>{f.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{f.username}</p>
                                            <p className="text-sm text-muted-foreground">{f.name}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}