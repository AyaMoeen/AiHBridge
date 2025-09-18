import { Avatar } from "@/components/ui/avatar";
import { Comment as CommentType } from "@/features/posts/services/postService";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export default function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className="border border-border w-full pt-4 flex flex-row items-start gap-4 hover:bg-primary/10 transition-colors rounded-lg p-3 animate-fade-in bg-card">
      <Avatar className="h-10 w-10">
        <img
          src={`http://127.0.0.1:8000/${comment.profile_picture}`}
          className="w-9 h-9 rounded-full object-cover"
        />
      </Avatar>
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
