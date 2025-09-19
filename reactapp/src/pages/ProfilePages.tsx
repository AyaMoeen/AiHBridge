import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
    Mail,
    MapPin,
    Link,
    Calendar,
    Edit,
    Save,
    Camera,
} from "lucide-react";
import type { ProfileData, UpdateProfileRequest } from "@/types/profile";


// Mock data - replace with actual API calls
const mockProfileData: ProfileData = {
    user: {
        id: 1,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "AI enthusiast and full-stack developer. I love discovering and sharing innovative AI tools that can boost productivity and creativity.",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        company: "TechCorp Inc.",
        jobTitle: "Senior Frontend Developer",
        phone: "+1 (555) 123-4567",
        birthDate: "1990-05-15",
        isVerified: true,
        createdAt: "2023-01-15T00:00:00Z",
        updatedAt: "2024-12-01T00:00:00Z"
    },
    stats: {
        posts: 12,
        followers: 245,
        following: 89,
        likes: 1420
    },
    settings: {
        isPublic: true,
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        emailNotifications: true,
        pushNotifications: false
    },
    socialLinks: {
        twitter: "https://twitter.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe"
    }
};


export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [profileData, setProfileData] = useState<ProfileData>(mockProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<UpdateProfileRequest>({
        firstName: profileData.user.firstName,
        lastName: profileData.user.lastName,
        username: profileData.user.username,
        bio: profileData.user.bio,
        location: profileData.user.location,
        website: profileData.user.website,
        company: profileData.user.company,
        jobTitle: profileData.user.jobTitle,
        phone: profileData.user.phone
    });

    const handleSaveProfile = () => {
        // TODO: Call API to update profile
        setProfileData(prev => ({
            ...prev,
            user: {
                ...prev.user,
                ...editForm
            }
        }));
        setIsEditing(false);
    };


    const ProfileOverview = () => (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="relative">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={profileData.user.avatar} />
                                <AvatarFallback className="text-2xl">
                                    {profileData.user.firstName[0]}{profileData.user.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute -bottom-2 -right-2 rounded-full"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold flex items-center gap-2">
                                        {profileData.user.firstName} {profileData.user.lastName}

                                    </h1>
                                    <p className="text-muted-foreground">@{profileData.user.username}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{profileData.stats.posts}</div>
                                    <div className="text-sm text-muted-foreground">AI Tools Shared</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">15</div>
                                    <div className="text-sm text-muted-foreground">Tools Saved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{profileData.stats.likes}</div>
                                    <div className="text-sm text-muted-foreground">Total Likes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="border-gray-200"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="border-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                    className="border-gray-200"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={3}
                                    placeholder="Tell the community about your AI interests and expertise..."
                                    className="border-gray-200"
                                />
                            </div>
                            <Button onClick={handleSaveProfile} className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
            
                    
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <ProfileOverview />
        </div>
    );
}