import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface CardOfListProp {
  id: number;
  title: string;
  date: string;
  description: string;
  count_post: number;
}

export default function CardOfList({
  id,
  title,
  date,
  description,
  count_post,
}: CardOfListProp) {
  return (
    <Link
      to={`/saved/${id}`}
      state={{ title, description, count_post }}
      className="w-72"
    >
      <Card className="bg-secondary-foreground text-card-foreground flex flex-col items-start justify-between h-37 p-4 rounded-sm border-gray-400 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-sans cursor-pointer">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>

        <p className="text-sm text-muted-foreground mt-1">{description}</p>

        <Badge className="flex flex-row items-center gap-2 mt-3 text-sm rounded bg-muted">
          <Bookmark size={10} className="text-primary fill-primary" />
          <span className="text-muted-foreground text-[10px] ">{count_post}</span>
        </Badge>
      </Card>
    </Link>
  );
}
