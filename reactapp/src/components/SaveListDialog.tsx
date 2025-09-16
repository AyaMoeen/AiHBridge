import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Bookmark, Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useSaved } from "@/context/SavedContext";

export interface SaveListDialogProps {
  open: boolean;
  postId: number;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function SaveListDialog({
  open,
  onOpenChange,
  onSave,
  postId,
}: SaveListDialogProps) {

  const [description, setDescription] = useState("");
  const [nameOfList, setNameOfList] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const { lists, createList, bookmark } = useSaved();

  const handleAddList = async () => {
    if (nameOfList.trim() === "") return;
    try {
      await createList(nameOfList.trim(), description);
      setNameOfList("");
      setDescription("");
      setShowInput(false);
      onSave();
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };


  const handleSaveBookmarks = async () => {
    try {
      let listsToSave = selectedLists;

      if (listsToSave.length === 0) {
        const defaultList = lists.find((l) => l.is_default);
        if (defaultList) {
          listsToSave = [defaultList.id];
        }
      }

      for (const listId of listsToSave) {
        await bookmark(postId, listId);
      }
      onSave();
      onOpenChange(false);
      setSelectedLists([]);
    } catch (err) {
      console.error("Failed to bookmark post:", err);
    }
  };

  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md  p-6 bg-secondary-foreground">
        <DialogHeader className="flex items-start flex-row gap-2">
          <Bookmark size={20} className="text-secondary" />
          <DialogTitle className="text-sm font-bold">Save to list</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 rounded border border-border border-gray-500 ">
          <div className="flex items-center gap-2">
            <Checkbox
              id="default"
              defaultChecked
              className="w-4 h-4 rounded border-border checked:border-secondary transition-all cursor-pointer "
            />
            <label
              htmlFor="default"
              className="rounded text-sm font-semibold text-muted-foreground"
            >
              Default List – Saved
            </label>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Available Lists
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto mb-2 ml-1">
          {lists.slice(1, lists.length).map((list, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded hover:bg-muted  transition cursor-pointer"
            >
              <Checkbox
                className="w-4 h-4 rounded border border-gray-500 checked:border-secondary transition-all cursor-pointer"
                id={list.id.toString()}
                checked={selectedLists.includes(list.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLists((prev) => [...prev, list.id]);
                  } else {
                    setSelectedLists((prev) =>
                      prev.filter((id) => id !== list.id)
                    );
                  }
                }}
              />
              <label
                htmlFor={list.id.toString()}
                className="text-sm font-semibold text-muted-foreground  cursor-pointer"
              >
                {list.name}
              </label>
            </div>
          ))}
        </div>

        {showInput && (
          <div className="flex flex-col gap-2 mb-4 border-t border-gray-500 text-sm font-semibold text-muted-foreground">
            <div className="flex flex-col items-start justify-center mt-4">
              <label className="text-[12px] m-1">List name</label>
              <Input
                value={nameOfList}
                onChange={(e) => setNameOfList(e.target.value)}
                className="border border-border rounded bg-muted placeholder:text-[12px] border-gray-400"
                placeholder="Enter name of list .... "
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <label className="text-[12px] m-1">Desription (optimal)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-border rounded bg-muted placeholder:text-[12px] border-gray-400"
                placeholder="Enter description of list .... "
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="rounded"
                variant="outline"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </Button>
              <Button className="rounded bg-secondary" onClick={handleAddList}>
                Add
              </Button>
            </div>
          </div>
        )}

        {!showInput && (
          <Button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center justify-center gap-2 rounded bg-secondary-foreground text-secondary  transition border-gray-400 border hover:bg-muted hover:text-black hover:cursor-pointer"
          >
            <Plus size={16} /> New List
          </Button>
        )}

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 hover:bg-muted transition rounded hover:cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition rounded hover:cursor-pointer"
            onClick={handleSaveBookmarks}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
