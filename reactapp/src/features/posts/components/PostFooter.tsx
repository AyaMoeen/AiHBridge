import { CardFooter } from "@/components/ui/card";
import { Heart, MessageCircle, Bookmark, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import RequireLoginDialog from "@/components/common/RequireLoginDialog";
import RatingFaces from "./RatingFace";

export default function PostFooter() {
  const { isAuthenticated } = useAuth();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const [commentCount] = useState(5);

  const [showDialog, setShowDialog] = useState(false);

  // Helper to require authentication before performing an action
  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setShowDialog(true);
      return;
    }
    action();
  };

  return (
    <>
      <CardFooter className="flex items-center justify-between px-5 py-5 border-t border-border ml-2 mr-2">
        <div className="flex items-center gap-10 justify-center">
          {/* Like */}
          <div className="flex items-center gap-1">
            <Heart
              onClick={() =>
                requireAuth(() => {
                  setLiked((prev) => !prev);
                  setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
                })
              }
              className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${liked
                  ? "text-destructive fill-destructive"
                  : "text-muted-foreground hover:text-destructive"
                }`}
            />
            <span className="text-sm text-muted-foreground">{likeCount}</span>
          </div>

          {/* Comment */}
          <div className="flex items-center gap-1">
            <MessageCircle
              onClick={() =>
                requireAuth(() => console.log("Open comments"))
              }
              className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition"
            />
            <span className="text-sm text-muted-foreground">{commentCount}</span>
          </div>

          {/* Rating */}
          <div>
            <Star
              onClick={() =>
                requireAuth(() => console.log("Open rating dialog"))
              }
              className="h-5 w-5 text-muted-foreground transition-transform duration-200 hover:text-yellow-500 hover:scale-110 cursor-pointer"
            />
          </div>
        </div>

        {/* Save */}
        <div>
          <Bookmark
            onClick={() =>
              requireAuth(() => setSaved((prev) => !prev))
            }
            className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${saved
                ? "text-secondary fill-secondary"
                : "text-muted-foreground hover:text-secondary"
              }`}
          />
        </div>
      </CardFooter>

      {/* Require Login Dialog */}
      <RequireLoginDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}
