import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface CardOfListProp {
  id: number;
  title: string;
  date: string;
  description: string;
  count_post: number;
  is_default: boolean;
}

export default function CardOfList({
  id,
  title,
  date,
  description,
  count_post,
  is_default,
}: CardOfListProp) {
  
  return (
    <Link
      to={`/saved/${id}`}
      state={{ title, description, count_post }}
      className="w-72"
    >
      <Card className="bg-secondary-foreground text-card-foreground flex flex-col items-start justify-between h-37 p-4 rounded-sm border-gray-400 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-sans cursor-pointer">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row justify-center items-center gap-1">
            <h1 className="text-sm font-bold">{title}</h1>
            {is_default && (
              <Badge className="text-[9px] rounded bg-gray-400">Default</Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold flex-col justify-center items-center">
            {formatRelativeTime(date)}
          </span>
        </div>

        <p className="text-[12px] text-muted-foreground mt-1">{description}</p>

        <Badge className="flex flex-row items-center gap-2 mt-3 text-sm rounded bg-muted">
          <Bookmark size={10} className="text-primary fill-primary" />
          <span className="text-muted-foreground text-[10px] ">
            {count_post}
          </span>
        </Badge>
      </Card>
    </Link>
  );
}
