import Post from "@/features/posts/components/Post";
import ShareAi from "@/features/posts/components/ShareAi";
import { useEffect, useState } from "react";
import DeletePostAlert from "@/features/posts/components/DeletePostAlert";
import {
  postService,
  Post as PostType,
} from "../features/posts/services/postService";
import { useAuth } from "@/context/AuthContext";

export default function MyPost() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData] = await Promise.all([postService.getMyPosts()]);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) return <p>Loading...</p>;

  const handleDeleteClick = (id: number) => {
    setSelectedPostId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedPostId !== null) {
      try {
        await postService.deletePost(selectedPostId);
        setPosts((prev) => prev.filter((post) => post.id !== selectedPostId));
        setSelectedPostId(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[20px] w-full">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      <ShareAi
        author={user?.name || "Guest"}
        profile_picture={user?.profile_picture}
      />
      <div className="w-full flex flex-col items-center justify-center">
        {posts.length === 0 ? (
          <p className="text-[var(--foreground)] mt-4">
            No posts found for selected category
          </p>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              maxChars={null}
              showEdit={true}
              showDelete={true}
              onDeleteClick={() => handleDeleteClick(post.id)}
            />
          ))
        )}
      </div>
      {deleteDialogOpen && (
        <DeletePostAlert
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}
