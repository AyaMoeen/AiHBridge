import { Card, CardContent, CardDescription } from "@/components/ui/card";
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  description: string;
  review: string;
  postId: number;
  maxChars?: number | null;
  showLearnMore?: boolean;
}
export default function PostContent({
  description,
  review,
  postId,
  maxChars = 150,
  showLearnMore = true,
}: Props) {
  const truncateText = (text: string) =>
    maxChars && text.length > maxChars ? text.slice(0, maxChars) + "..." : text;

  return (
    <CardContent>
      <Tabs defaultValue="Description" className="w-[100%]">
        <TabsList className="flex w-full p-0 mb-1">
          <TabsTrigger
            value="Description"
            className="flex-1 text-center m-1 hover:cursor-pointer"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="Review"
            className="flex-1 text-center m-1 hover:cursor-pointer"
          >
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Description" className="mb-1">
          <Card className="border-none shadow-none bg-card">
            <CardContent className="grid gap-2">
              <CardDescription className="text-sm text-muted-foreground">
                {truncateText(description)}
              </CardDescription>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Review" className="mb-1">
          <Card className="border-none shadow-none bg-card">
            <CardContent className="grid gap-2">
              <CardDescription className="text-sm text-muted-foreground">
                {truncateText(review)}
              </CardDescription>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showLearnMore && (
        <div className="flex justify-center items-end flex-col">
          <LearnMoreButton postId={postId} />
        </div>
      )}
    </CardContent>
  );
}
