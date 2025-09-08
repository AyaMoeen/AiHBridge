import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";

export default function TrendingTools() {
  const trendingTools = [
    { name: "Notion AI", category: "Productivity", likes: 320, comments: 45 },
    { name: "Perplexity AI", category: "Research", likes: 275, comments: 38 },
    { name: "Runway Gen-2", category: "Video", likes: 410, comments: 62 },
    { name: "ElevenLabs", category: "Voice", likes: 290, comments: 51 },
  ];

  return (
    <Card className="bg-secondary-foreground text-card-foreground shadow-md rounded-xl">
      <CardContent className="p-4">
        <h2 className="flex items-center gap-2 font-semibold text-primary mb-3">
          <TrendingUp className="w-5 h-5 text-primary" /> Trending Tools
        </h2>
        <ul className="space-y-4">
          {trendingTools.map((tool) => (
            <li
              key={tool.name}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium">{tool.name}</p>
                <Badge className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer rounded">
                  {tool.category}
                </Badge>
              </div>
              <div className="flex gap-4 text-muted-foreground">
                <span className="flex items-center gap-1 text-xs">
                  <Heart className="w-4 h-4" /> {tool.likes}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-4 h-4" /> {tool.comments}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
