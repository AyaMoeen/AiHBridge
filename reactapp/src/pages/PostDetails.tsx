import { useNavigate, useParams } from "react-router-dom";
import Comments from "@/features/posts/components/Comments";
import Post from "@/features/posts/components/Post";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  postService,
  Post as PostType,
} from "@/features/posts/services/postService";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PostDetails() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setPost(null);

    const fetchPost = async () => {
      if (!postId) return;
      try {
        const data = await postService.getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);


  if (loading) return <p>Loading post...</p>;
  if (!post) return <div>Post not found!</div>;
  
  return (
    <div className="p-4 flex flex-col items-center justify-center w-full">
      <div className="w-full flex items-center mb-1">
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 " />
          Back To Feed
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">{post.name}'s Post</h1>
      <Post post={post} maxChars={null} showLearnMore={false} />
      <Comments postId={postId}  profile_picture ={user?.profile_picture}/>
    </div>
  );
}
