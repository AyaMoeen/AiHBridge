import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import RatingFaces from "./RatingFace";

export default function RatingDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Star className="h-5 w-5 text-muted-foreground transition-transform duration-200 hover:text-yellow-500 hover:scale-110 hover:cursor-pointer" />
      </DialogTrigger>
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
    </Dialog>
  );
}
