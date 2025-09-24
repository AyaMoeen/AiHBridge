// src/pages/UserProfilePage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostComponent from "@/features/posts/components/Post";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { userProfileService } from "@/services/userProfileService";
import { Post, ProfileData } from "@/services/profileTypes";
import { useAuth } from "@/context/AuthContext";


export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth(); // assuming user contains { id, username, ... }

    const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    // ✅ Redirect to /profile if same user
    useEffect(() => {
        if (id && user && Number(id) === user.id) {
            navigate("/profile", { replace: true });
        }
    }, [id, user, navigate]);

    const loadProfile = async () => {
        if (!id) return;
        try {
            setLoading(true);

            const { profile, posts } = await userProfileService.getUserProfile(Number(id));
            setUserProfile(profile);
            setPosts(posts);

            const status = await userProfileService.getFollowStatus(Number(id));
            setIsFollowing(status.isFollowing);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && user && Number(id) !== user.id) {
            loadProfile();
        }
    }, [id, user]);

    const toggleFollow = async () => {
        if (!userProfile) return;
        try {
            if (isFollowing) {
                await userProfileService.unfollowUser(userProfile.user.id);
            } else {
                await userProfileService.followUser(userProfile.user.id);
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!userProfile) return <p className="p-6 text-red-500">User not found</p>;

    return (
        <div className="space-y-6 p-4">
            {/* Profile Card */}
            <Card>
                <CardContent className="flex items-center justify-between gap-4 p-6">
                      <div className="flex items-start gap-4">
            <Avatar className="h-15 w-15 flex-shrink-0">
              <img
                src={userProfile.user.avatar}
                className="w-14 h-14 rounded-full object-cover"
              />
            </Avatar>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                {userProfile.user.firstName} {userProfile.user.lastName}
              </h2>
              <p className="text-muted-foreground text-[12px]">@{userProfile.user.username}</p>
              {userProfile.user.bio && (
                <p className="mt-1 text-sm">{userProfile.user.bio}</p>
              )}
              <Button className="mt-2 w-max" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
                    <div className="grid grid-cols-3 gap-4 text-center mr-10">
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
                </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-muted-foreground">No posts yet.</p>
                ) : (
                    posts.map((post) => <PostComponent key={post.id} post={post} />)
                )}
            </div>
        </div>
    );
}
