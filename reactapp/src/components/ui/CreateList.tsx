import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function CreateList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded bg-secondary cursor-pointer">
          <Plus size={16} />
          <span>Create New List</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 bg-secondary-foreground">
        <DialogHeader className="flex items-start flex-row gap-2">
          <PlusCircle size={20} className="text-secondary" />
          <DialogTitle className="text-sm font-bold">
            Create new list
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mb-4 border-t border-gray-500 text-sm font-semibold text-muted-foreground">
          <div className="flex flex-col items-start justify-center mt-4">
            <label className="text-[12px] m-1">List name</label>
            <Input
              className="border border-border rounded bg-muted placeholder:text-[12px] border-gray-400"
              placeholder="Enter name of list .... "
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <label className="text-[12px] m-1">Description (optional)</label>
            <Textarea
              className="border border-border rounded bg-muted placeholder:text-[12px] border-gray-400"
              placeholder="Enter description of list .... "
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 hover:bg-muted transition rounded hover:cursor-pointer"
          >
            Close
          </Button>
          <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition rounded hover:cursor-pointer">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
