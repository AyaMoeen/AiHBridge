import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const categories = [
  { value: "all-categories", label: "All Categories" },
  { value: "video_audio", label: "Video / Audio" },
  { value: "coding_development", label: "Coding / Development" },
  { value: "AI", label: "AI" },
];

interface FilterSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function FilterSelect({ value, onChange }: FilterSelectProps) {
  const handleSelect = (selected: string) => {
    if (!value.includes(selected)) {
      onChange([...value, selected]);
    }
  };

  const handleRemove = (removed: string) => {
    onChange(value.filter((v) => v !== removed));
  };

  return (
    <div className="flex flex-col gap-3">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full rounded border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow duration-200">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--card)] text-[var(--card-foreground)] rounded-lg shadow-lg">
          {categories.map((cat) => (
            <SelectItem
              key={cat.value}
              value={cat.value}
              disabled={value.includes(cat.value)}
              className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-150"
            >
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {value.map((badge) => (
          <Badge
            key={badge}
            className="flex items-center gap-2 px-3 py-1"
            variant="secondary"
          >
            {categories.find((c) => c.value === badge)?.label || badge}
            <button
              onClick={() => handleRemove(badge)}
              className="ml-1 rounded hover:bg-muted"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
