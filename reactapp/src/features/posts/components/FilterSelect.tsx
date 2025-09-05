import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function FilterSelect() {
  return (
    <div className="flex items-center gap-3 mb-5 w-full ml-10">
      <label className="text-[var(--foreground)] font-medium">
        Sorted By Category:
      </label>
      <Select>
        <SelectTrigger className="w-44 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow duration-200">
          <SelectValue placeholder="select category" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--card)] text-[var(--card-foreground)] rounded-lg shadow-lg">
          <SelectItem
            value="all-categories"
            className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-150"
          >
            All Categories
          </SelectItem>
          <SelectItem
            value="video_audio"
            className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-150"
          >
            Video / Audio
          </SelectItem>
          <SelectItem
            value="coding_devlopment"
            className="hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-150"
          >
            Coding / Development
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
