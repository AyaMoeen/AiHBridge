import { TextareaWithButton } from "@/components/ui/TextAreaWithButton";
import Comment from "./Comment";

interface Props {
  author: string;
}

export default function Comments({ author }: Props) {
  return (
    <div className="w-full  flex flex-col items-start justify-start space-y-4 border border-border bg-card text-card-foreground shadow-lg p-5 rounded-md">
      <h1 className="text-xl font-semibold text-foreground border-b border-border pb-2 w-full">
        Comments
      </h1>
      <div className="flex flex-row items-start gap-4 w-full">
        <div className="w-12 h-12  rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
          {author[0] + author.split(" ")[1][0]}
        </div>
        <TextareaWithButton />
      </div>
      <div className="flex flex-col w-full space-y-4">
        <Comment />
        <Comment />
        <Comment />
      </div>
    </div>
  );
}
