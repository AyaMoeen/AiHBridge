import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TextareaWithButton() {
  return (
    <div className="grid gap-2 w-[90%]">
      <Textarea
        placeholder="Type your message here."
        className="border-1 border-gray-400 rounded-lg p-3"
      />
      <Button className="hover:cursor-pointer">comment</Button>
    </div>
  );
}
