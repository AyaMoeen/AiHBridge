import { useNavigate, useParams } from "react-router-dom";
import Comments from "@/features/posts/components/Comments";
import Post from "@/features/posts/components/Post";
import { posts, PostData } from "@/features/posts/mock-data/mockPosts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);
  const post: PostData | undefined = posts.find((p) => p.id === postId);
  if (!post) return <div>Post not found!</div>;

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <div className="w-full flex items-center mb-1">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Feed
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">{post.author.name}'s Post</h1>
      <Post post={post} maxChars={null} showLearnMore={false} />
      <Comments author={"Ahmad Tomeh"} />
    </div>
  );
}
