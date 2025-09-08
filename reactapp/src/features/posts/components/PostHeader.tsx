import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenShare, Star, Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";
interface Props {
  author: { name: string; username: string; avatar?: string };
  badges: string[];
  rating: number;
  shareUrl: string;
  title: string;
  showEdit?: boolean;
  onEditClick?: () => void;
  showDelete?: boolean;
  onDeleteClick?: () => void;
}
export default function PostHeader({
  author,
  badges,
  rating,
  shareUrl,
  title,
  showEdit = false,
  onEditClick,
  showDelete = false,
  onDeleteClick,
}: Props) {
  return (
    <CardHeader className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {author.name[0] + author.name.split(" ")[1][0]}
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold text-foreground">
              {author.name}
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">
              {author.username}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="p-5 hover:cursor-pointer">
              <ScreenShare className="w-4 h-5 text-muted-foreground" />
            </Button>
          </a>
          {showEdit && (
            <Button
              variant="ghost"
              className="p-5 hover:cursor-pointer"
              onClick={onEditClick}
            >
              <SquarePen className="w-4 h-5 text-muted-foreground" />
            </Button>
          )}
          {showDelete && (
            <Button
              variant="ghost"
              className="p-5 hover:cursor-pointer hover:bg-red-600/10"
              onClick={onDeleteClick}
            >
              <Trash2 className="w-4 h-5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
      <CardTitle className="text-lg font-bold text-foreground my-1">
        {title}
      </CardTitle>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {badges.map((badge) => (
            <Badge
              key={badge}
              className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              {badge}
            </Badge>
          ))}
        </div>
        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
          <Star className="w-4 h-4 fill-yellow-500" /> {rating}
        </span>
      </div>
    </CardHeader>
  );
}
