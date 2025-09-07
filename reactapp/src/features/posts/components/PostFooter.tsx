import { CardFooter } from "@/components/ui/card";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useState } from "react";
import RatingDialog from "./RatingDialog";

export default function PostFooter() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const [commentCount] = useState(5);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <CardFooter className="flex items-center justify-between px-5 py-5 border-t border-border ml-2 mr-2">
      <div className="flex items-center gap-10 justify-center">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 
              ${
                liked
                  ? "text-destructive fill-destructive"
                  : "text-muted-foreground hover:text-destructive"
              }`}
          />
          <span className="text-sm text-muted-foreground">{likeCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition" />
          <span className="text-sm text-muted-foreground">{commentCount}</span>
        </div>

        <RatingDialog />
      </div>
      <div>
        <Bookmark
          onClick={handleSave}
          className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 
            ${
              saved
                ? "text-secondary fill-secondary"
                : "text-muted-foreground hover:text-secondary"
            }`}
        />
      </div>
    </CardFooter>
  );
}
