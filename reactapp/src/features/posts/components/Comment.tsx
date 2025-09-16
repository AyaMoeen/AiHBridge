import { Comment as CommentType } from "@/features/posts/services/postService";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export default function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className="border border-border w-full pt-4 flex flex-row items-start gap-4 hover:bg-primary/10 transition-colors rounded-lg p-3 animate-fade-in bg-card">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
        {comment.name
          ? comment.name
              .split(" ")
              .filter(Boolean)
              .map((name) => name[0])
              .join("")
              .toUpperCase()
          : "??"}
      </div>
      <div className="flex flex-col items-start justify-center space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-secondary">
              {comment.name}
            </span>
            <span className="text-[10px] font-semibold text-gray-500">
              @{comment.username}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
            <span className="mx-1">•</span>
            {formatRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-foreground mt-2">{comment.text}</p>
      </div>
    </div>
  );
}
