import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FilterSelect from "./FilterSelect";

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  initialDescription: string;
  initialUrl: string;
  initialReview: string;
  initialBadges: string[];
  onSave: (data: {
    title: string;
    description: string;
    shareUrl: string;
    review: string;
    badges: string[];
  }) => void;
}

export default function EditPostDialog({
  open,
  onOpenChange,
  initialTitle,
  initialDescription,
  initialUrl,
  initialReview,
  initialBadges,
  onSave,
}: EditPostDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [shareUrl, setUrl] = useState(initialUrl);
  const [review, setReview] = useState(initialReview);
  const [badges, setBadges] = useState<string[]>(initialBadges);

  const handleSave = () => {
    onSave({ title, description, shareUrl, review, badges });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground rounded-lg p-6 w-full h-auto max-h-screen md:max-w-2xl md:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-4 text-foreground">
            Edit Post
          </DialogTitle>
          <p> Update your Ai tool recommendation and review </p>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1 text-foreground ">
              Post Title Or Tool Name
            </label>
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow duration-200 "
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1 text-foreground">
              Tool URL
            </label>
            <Input
              type="url"
              placeholder="Post URL"
              value={shareUrl}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow duration-200 "
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm font-bold mb-1 text-foreground">
              Categories
            </label>
            <FilterSelect value={badges} onChange={setBadges} />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1 text-foreground">
              Post Description
            </label>
            <Textarea
              placeholder="Post description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="w-full resize-none overflow-hidden rounded border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1 text-foreground">
              Post Review
            </label>
            <Textarea
              placeholder="Post review"
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="w-full rounded border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm hover:shadow-md transition-shadow duration-200 h-min-24"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-secondary text-primary-foreground"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
