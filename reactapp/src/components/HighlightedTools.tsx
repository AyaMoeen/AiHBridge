import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export default function HighlightedTool() {
  const highlightedTools = [
    { name: "Jasper AI", category: "Writing", rating: 4.6 },
    { name: "Synthesia", category: "Video", rating: 4.9 },
    { name: "Replit Ghostwriter", category: "Coding", rating: 4.7 },
  ];

  return (
    <Card className="bg-secondary-foreground text-card-foreground shadow-md rounded-xl">
      <CardContent className="p-4">
        <h2 className="flex items-center gap-2 font-semibold text-yellow-500 mb-3">
          <Star className="w-5 h-5" /> Highlighted Tools
        </h2>
        <ul className="space-y-3">
          {highlightedTools.map((tool) => (
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
              <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                <Star className="w-4 h-4 fill-yellow-500" /> {tool.rating}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
