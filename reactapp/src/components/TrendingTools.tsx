import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import {
  postService,
  Post as PostType,
} from "../features/posts/services/postService";
import { useNavigate } from "react-router-dom";

export default function TrendingTools() {

  const [trendyPost, setTrendyPost] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData] = await Promise.all([postService.getTrendyTools()]);
        setTrendyPost(postsData);
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
        <h2 className="flex items-center gap-2 font-semibold text-primary mb-3">
          <TrendingUp className="w-5 h-5 text-primary" /> Trending Tools
        </h2>
        <ul
          className="max-h-70 overflow-y-auto pr-2 space-y-4 "
          style={{
            scrollbarWidth: "none",
          }}
        >
          {trendyPost.map((tool, index) => (
            <li
              key={tool.id}
              className={`flex items-center justify-between text-sm `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div>
                <p
                  className={`text-[13px] mb-1 font-bold hover:cursor-pointer hover:text-accent-foreground cursor-pointer animate-fade-in`}
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
                    <Badge className="bg-primary text-primary-foreground text-xs ">
                      +{tool.categories.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-4 text-muted-foreground">
                <span className="flex items-center gap-1 text-xs">
                  <Heart className="w-3 h-3" /> {tool.like_count}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-3 h-3" /> {tool.comment_count}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
