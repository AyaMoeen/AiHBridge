import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { profileService } from "@/services/profileService";
import { postService } from "@/features/posts/services/postService";
import Post from "@/features/posts/components/Post";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfile {
    id: number;
    username: string;
    name: string;
    profile_picture: string | null;
    bio?: string;
    interests?: string[];
    stats?: {
        posts: number;
        followers: number;
        following: number;
    };
}

export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!id) return;
                const profile = await profileService.getProfileById(Number(id));
                setUserProfile(profile);

                const userPosts = await postService.getPostsByUserId(Number(id));
                setPosts(userPosts.results || []);
            } catch (err) {
                console.error("Failed to load user profile", err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [id]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!userProfile) return <p className="p-6 text-red-500">User not found</p>;

    return (
        <div className="space-y-6 p-4">
            <Card>
                <CardContent className="flex items-center gap-4 p-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={userProfile.profile_picture || ""} />
                        <AvatarFallback>{userProfile.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">{userProfile.name}</h2>
                        <p className="text-muted-foreground">@{userProfile.username}</p>
                        {userProfile.bio && <p className="mt-2">{userProfile.bio}</p>}

                        {userProfile.interests && userProfile.interests.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {userProfile.interests.map((i, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-sm bg-primary/10 rounded-full"
                                    >
                                        {i}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {userProfile.stats && (
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">{userProfile.stats.posts}</p>
                        <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{userProfile.stats.followers}</p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{userProfile.stats.following}</p>
                        <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-muted-foreground">No posts yet.</p>
                ) : (
                    posts.map((post) => <Post key={post.id} post={post} />)
                )}
            </div>
        </div>
    );
}
