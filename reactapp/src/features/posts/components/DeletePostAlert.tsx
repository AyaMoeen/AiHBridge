"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeletePostAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export default function DeletePostAlert({
  open,
  onOpenChange,
  onDelete,
}: DeletePostAlertProps) {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Warning</DialogTitle>
        </DialogHeader>
        <p className="py-2">
          Are you sure you want to delete this post? This action cannot be
          undone!
        </p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded hover:cursor-pointer">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="bg-red-600 rounded hover:bg-red-700 hover:cursor-pointer">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
