import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  categories: { id: number; name: string }[];
}

export default function FilterSelect({
  value,
  onChange,
  categories,
}: FilterSelectProps) {
  const handleSelect = (selected: string) => {
    const selectedId = Number(selected);
    if (!value.includes(selectedId)) {
      onChange([...value, selectedId]);
    }
  };

  const handleRemove = (removedId: number) => {
    onChange(value.filter((id) => id !== removedId));
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
              key={cat.id}
              value={cat.id.toString()}
              disabled={value.includes(cat.id)}
              className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-150"
            >
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {value.map((id) => (
          <Badge
            key={id}
            className="flex items-center gap-2 px-3 py-1"
            variant="secondary"
          >
            {categories.find((c) => c.id === id)?.name || id}
            <button
              onClick={() => handleRemove(id)}
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
