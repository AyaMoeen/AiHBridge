import { TextareaWithButton } from "@/components/ui/TextAreaWithButton";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import {
  postService,
  Comment as CommentType,
} from "@/features/posts/services/postService";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import RequireLoginDialog from "@/components/common/RequireLoginDialog";

interface Props {
  postId: number;
  profile_picture?: string;
}

export default function Comments({ profile_picture, postId }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const { isAuthenticated } = useAuth();
  const [showRequireLogin, setShowRequireLogin] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await postService.getComments(postId);
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      setShowRequireLogin(true);
      return;
    }
    if (!text.trim()) return;
    try {
      const newComment = await postService.addComment(postId, text);
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div className="w-full  flex flex-col items-start justify-start space-y-4 border border-border bg-card text-card-foreground shadow-lg p-5 rounded-md">
      <h1 className="text-xl font-semibold text-foreground border-b border-border pb-2 w-full">
        Comments
      </h1>
      <div className="flex flex-row items-start gap-4 w-full">
        <Avatar className="h-10 w-10 bg-muted flex items-center justify-center">
          {isAuthenticated && profile_picture ? (
            <img
              src={`http://127.0.0.1:8000/${profile_picture}`}
              className="w-10 h-10 rounded-full object-cover"
              alt="User Avatar"
            />
          ) : (
            <AvatarFallback>
              <User className="text-primary " />
            </AvatarFallback>
          )}
        </Avatar>
        <TextareaWithButton
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleAddComment}
        />
      </div>
      <div className="flex flex-col w-full space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => <Comment key={c.id} comment={c} />)
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>
      <RequireLoginDialog
        open={showRequireLogin}
        onOpenChange={setShowRequireLogin}
      />
    </div>
  );
}
