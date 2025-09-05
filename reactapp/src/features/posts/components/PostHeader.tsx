import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenShare, Star } from "lucide-react";

interface Props {
  author: { name: string; username: string; avatar?: string };
  badges: string[];
  rating: number;
  shareUrl: string;
  title: string;
}
export default function PostHeader({
  author,
  badges,
  rating,
  shareUrl,
  title,
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
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" className="p-5 hover:cursor-pointer">
            <ScreenShare className="w-4 h-5 text-muted-foreground" />
          </Button>
        </a>
      </div>
      <CardTitle className="text-lg font-bold text-foreground my-2">
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
        <div className="flex items-center gap-1 mr-4">
          <Star className="text-yellow-400 w-4" />
          <span className="text-sm font-medium text-foreground">{rating}</span>
        </div>
      </div>
    </CardHeader>
  );
}
