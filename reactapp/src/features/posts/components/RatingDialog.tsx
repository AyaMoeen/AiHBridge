import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RatingFaces from "./RatingFace";
import { Star } from "lucide-react";
import { useState } from "react";
interface RatingDialogProps {
  onRequireAuth?: () => void;
  isAuthenticated?: boolean;
  onRate?: (value: number) => void;
}

export default function RatingDialog({
  onRequireAuth,
  isAuthenticated,
  onRate,
}: RatingDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleClick = () => {
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    setOpen(true);
  };
  const handleSubmit = () => {
    if (selectedRating && onRate) {
      onRate(selectedRating);
      setOpen(false);
      setSelectedRating(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        className="h-5 w-5 text-muted-foreground transition-transform duration-200 hover:text-yellow-500 hover:scale-110"
        onClick={handleClick}
      >
        <Star className="h-5 w-5 text-muted-foreground transition-transform duration-200 hover:text-yellow-500 hover:scale-110 hover:cursor-pointer" />
      </button>

      {isAuthenticated && (
        <DialogContent className="sm:max-w-md bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-foreground">
              Rate this post
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center mt-4">
            <RatingFaces onSelect={(value) => setSelectedRating(value)} />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 rounded py-2 bg-primary text-primary-foreground  hover:bg-primary/90 transition font-semibold cursor-pointer"
            >
              Submit
            </button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
