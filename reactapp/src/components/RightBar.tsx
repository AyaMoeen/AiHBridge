import { Input } from "@/components/ui/input";
import TrendingTools from "./TrendingTools";
import HighlightedTool from "./HighlightedTools";

export default function Rightbar() {
  return (
    <aside className="w-72 p-4 space-y-4 overflow-y-auto">
      <Input
        placeholder="Search AI tools..."
        className="w-full rounded-sm border-1 border-gray-30 bg-secondary-foreground p-2"
      />
      <TrendingTools />
      <HighlightedTool />
    </aside>
  );
}
