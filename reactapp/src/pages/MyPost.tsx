import Post from "@/features/posts/components/Post";
import ShareAi from "@/features/posts/components/ShareAi";
import { posts } from "../features/posts/mock-data/mockPosts";
import { useState } from "react";
import DeletePostAlert from "@/features/posts/components/DeletePostAlert";

export default function MyPost() {
  const [postsData, setPostsData] = useState(posts);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedPostId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedPostId !== null) {
      setPostsData((prev) => prev.filter((post) => post.id !== selectedPostId));
      setSelectedPostId(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[20px]">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      <ShareAi author={"Ahmad Tomeh"} />
      <div className="w-full flex flex-col items-center justify-center">
        {postsData.map((post) => (
          <Post
            post={post}
            maxChars={null}
            showEdit={true}
            showDelete={true}
            onDeleteClick={() => handleDeleteClick(post.id)}
          />
        ))}
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
