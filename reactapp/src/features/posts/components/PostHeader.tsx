import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { Avatar } from "@radix-ui/react-avatar";
import { ScreenShare, Star, Trash2, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  authorId: number; // userId
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
  create_at: string;
  profile_picture?: string;
  postId: number;
}

export default function PostHeader({
  authorId,
  name,
  username,
  badges,
  avg_rating,
  link,
  title,
  create_at,
  showEdit = false,
  onEditClick,
  showDelete = false,
  onDeleteClick,
  profile_picture,
  postId,
}: Props) {
  const navigate = useNavigate();
  const displayedRating = avg_rating;

  const goToProfile = () => {
    navigate(`/otherProfile/${authorId}`);
  };

  return (
    <CardHeader className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={goToProfile}>
          <Avatar className="h-10 w-10">
            <img src={profile_picture} className="w-9 h-9 rounded-full object-cover" />
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold text-foreground">{name}</CardTitle>
            <span className="text-[10px] text-muted-foreground">{username}</span>
          </div>
          <div className="text-sm font-semibold text-gray-500">• {formatRelativeTime(create_at)}</div>
        </div>
        <div className="flex items-center gap-4">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="p-5 hover:cursor-pointer">
              <ScreenShare className="w-4 h-5 text-muted-foreground" />
            </Button>
          </a>
          {showEdit && (
            <Button variant="ghost" className="p-5 hover:cursor-pointer" onClick={onEditClick}>
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
      <CardTitle className="text-lg font-bold text-foreground my-1">{title}</CardTitle>
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
          <Star className="w-4 h-4 fill-yellow-500" /> {displayedRating}
        </span>
      </div>
    </CardHeader>
  );
}
