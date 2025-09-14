import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenShare, Star, Trash2 } from "lucide-react";
import { SquarePen } from "lucide-react";
interface Props {
  author: string;
  badges: { id: number; name: string }[];
  avg_rating: number;
  link: string;
  title: string;
  name: string;
  username: string;
  showEdit?: boolean;
  onEditClick?: () => void;
  showDelete?: boolean;
  onDeleteClick?: () => void;
}
export default function PostHeader({
  name,
  username,
  badges,
  avg_rating,
  link,
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
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              : "AU"}{" "}
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold text-foreground">
              {name}
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">
              {username}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href={link} target="_blank" rel="noopener noreferrer">
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
              key={badge.id}
              className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              {badge.name}
            </Badge>
          ))}
        </div>
        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
          <Star className="w-4 h-4 fill-yellow-500" /> {avg_rating}
        </span>
      </div>
    </CardHeader>
  );
}
