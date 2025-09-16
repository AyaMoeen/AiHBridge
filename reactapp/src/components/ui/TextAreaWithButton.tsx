import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

export function TextareaWithButton({ value, onChange, onSubmit }: Props) {
  return (
    <div className="flex flex-col w-[90%] gap-2">
      <Textarea
        value={value}
        onChange={onChange}
        placeholder="Type your message here..."
        className="border border-gray-400 rounded-sm p-3 w-full"
      />
      <Button
        onClick={onSubmit}
        className="hover:cursor-pointer rounded w-20 h-8 bg-secondary hover:bg-primary self-end"
      >
        comment
      </Button>
    </div>
  );
}
