import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import {
  postService,
  Post as PostType,
} from "../features/posts/services/postService";
import { useNavigate } from "react-router-dom";
import { usePostContext } from "@/context/PostContext";

export default function HighlightedTool() {
  const [highLightTool, setHighLightTool] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { ratings } = usePostContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData] = await Promise.all([
          postService.getHighlightedTools(),
        ]);
        setHighLightTool(postsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Card className="bg-secondary-foreground text-card-foreground shadow-md rounded-xl">
      <CardContent className="p-4">
        <h2 className="flex items-center gap-2 font-semibold text-yellow-500 mb-3">
          <Star className="w-5 h-5" /> Highlighted Tools
        </h2>
        <ul
          className="max-h-70 overflow-y-auto pr-2 space-y-4"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {highLightTool.map((tool, index) => {
            const avgRating = ratings[tool.id] ?? tool.avg_rating;
            return (
              <li
                key={tool.id}
                className={`flex items-center justify-between text-sm hover:cursor-pointer hover:text-accent-foreground cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <p
                    className="text-[13px] mb-1 font-bold"
                    onClick={() => navigate(`/posts/${tool.id}`)}
                  >
                    {tool.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tool.categories.slice(0, 2).map((category) => (
                      <Badge
                        key={category.id}
                        className="bg-accent text-accent-foreground text-xs text-[9px] hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {tool.categories.length > 2 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        +{tool.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                  <Star className="w-4 h-4 fill-yellow-500" /> {avgRating}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
