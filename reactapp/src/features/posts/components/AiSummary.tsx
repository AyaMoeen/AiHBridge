"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { postService } from "../services/postService";
interface props {
  textToSummarize: string;
  title: string;
}
export default function AiSummary({ textToSummarize, title }: props) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setSummary(null);

    try {
      const result = await postService.summarizeText(textToSummarize);
      setSummary(result);
    } catch (error) {
      console.log("error ", error);
      setSummary("Error generating summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge
          className="
        cursor-pointer flex items-center gap-2 px-3 py-1 font-semibold rounded-full
        text-gray-600 bg-muted border border-gray-400
        hover:bg-primary hover:text-primary-foreground transition-all duration-200
      "
          onClick={generateSummary}
        >
          <Sparkles size={14} />
          Summarize
        </Badge>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-4">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-lg font-bold text-gray-900 flex flex-row items-center justify-center gap-1 mt-2">
            <Sparkles size={14} /> {`AI summary - ${title}`}
          </DialogTitle>

          <DialogDescription className="text-gray-500 text-[10px] text-center">
            AI generates a summary combining the tool's description and user
            reviews.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-[100px] flex items-center justify-center">
          {loading ? (
            <div className="relative w-fit font-mono font-bold text-2xl">
              <span
                className="relative z-10 text-transparent bg-clip-text 
                   bg-gradient-to-r from-white via-primary to-secondary
                   animate-loading-text"
              >
                Loading...
              </span>
            </div>
          ) : summary ? (
            <p className="bg-muted p-4 rounded-lg font-serif text-gray-800 text-sm shadow-lg leading-relaxed tracking-wide">
              {summary}
            </p>
          ) : (
            <p className="text-gray-400">Click the badge to generate summary</p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button className="bg-secondary rounded px-2 py-1 cursor-pointer ">
              close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
