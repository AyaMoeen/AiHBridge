import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RatingFaces from "./RatingFace";

interface RatingDialogProps {
  onRequireAuth?: () => void;
  isAuthenticated?: boolean;
}

export default function RatingDialog({ onRequireAuth, isAuthenticated }: RatingDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="h-5 w-5 text-muted-foreground transition-transform duration-200 hover:text-yellow-500 hover:scale-110"
          onClick={(e) => {
            if (isAuthenticated === false && onRequireAuth) {
              e.preventDefault();
              onRequireAuth();
            }
          }}
        >
          ⭐
        </button>
      </DialogTrigger>

      {isAuthenticated && (
        <DialogContent className="sm:max-w-md bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-foreground">
              Rate this post
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center mt-4">
            <RatingFaces />
          </div>

          <div className="flex justify-center mt-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold">
              Submit
            </button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
