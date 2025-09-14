import { CardFooter } from "@/components/ui/card";
import { Heart, MessageCircle, BookmarkPlus } from "lucide-react";
import { useState } from "react";
import RatingDialog from "./RatingDialog";
import { useAuth } from "@/hooks/useAuth";
import RequireLoginDialog from "@/components/common/RequireLoginDialog";
import SaveListDialog from "@/components/SaveListDialog";
import { postService } from "@/features/posts/services/postService";

interface props {
  like_count: number;
  comment_count: number;
  postId: number;
}
export default function PostFooter({
  like_count,
  comment_count,
  postId,
}: props) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(like_count);
  const [commentCount] = useState(comment_count);
  const [open, setOpen] = useState(false);
  const [showRequireLogin, setShowRequireLogin] = useState(false);
  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowRequireLogin(true);
      return;
    }
    try {
      const res = await postService.likePost(postId);
      console.log("Like response:", res);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };
  const handleRate = async (value: number) => {
    if (!isAuthenticated) {
      setShowRequireLogin(true);
      return;
    }
    try {
      const res = postService.ratePost(postId, value);
      console.log("Rate response:", res);
    } catch (err) {
      console.error("Failed to rate post:", err);
    }
  };

  return (
    <>
      <CardFooter className="flex items-center justify-between px-5 py-5 border-t border-border ml-2 mr-2">
        <div className="flex items-center gap-10 justify-center">
          <div className="flex items-center gap-1">
            <Heart
              onClick={handleLike}
              className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${
                liked
                  ? "text-destructive fill-destructive"
                  : "text-muted-foreground hover:text-destructive"
              }`}
            />
            <span className="text-sm text-muted-foreground">{likeCount}</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle
              onClick={() => {
                if (!isAuthenticated) {
                  setShowRequireLogin(true);
                  return;
                }
                console.log("Open comments");
              }}
              className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition"
            />
            <span className="text-sm text-muted-foreground">
              {commentCount}
            </span>
          </div>

          <RatingDialog
            isAuthenticated={isAuthenticated}
            onRequireAuth={() => setShowRequireLogin(true)}
            onRate={handleRate}
          />
        </div>
        <div>
          <BookmarkPlus
            onClick={() => {
              if (!isAuthenticated) {
                setShowRequireLogin(true);
                return;
              }
              setOpen(true);
              setSaved(true);
            }}
            className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 
            ${
              saved
                ? "text-secondary fill-secondary"
                : "text-muted-foreground hover:text-secondary"
            }`}
          />
          <SaveListDialog
            open={open}
            onOpenChange={setOpen}
            onSave={() => setSaved(true)}
          />
        </div>
      </CardFooter>
      <RequireLoginDialog
        open={showRequireLogin}
        onOpenChange={setShowRequireLogin}
      />
    </>
  );
}
