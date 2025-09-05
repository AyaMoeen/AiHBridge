import { Card } from "@/components/ui/card";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import { PostData } from "../mock-data/mockPosts";
interface Props {
  post: PostData;
  maxChars?: number | null;
  showLearnMore?: boolean;
}
export default function Post({ post, maxChars = 150, showLearnMore }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center my-3">
      <Card className="shadow-lg border border-border bg-card text-card-foreground flex flex-col justify-center w-full p-5">
        <PostHeader
          author={post.author}
          badges={post.badges}
          rating={post.rating}
          shareUrl={post.shareUrl}
        />
        <PostContent
          postId={post.id}
          description={post.description}
          review={post.review}
          maxChars={maxChars}
          showLearnMore={showLearnMore}
        />
        <PostFooter />
      </Card>
    </div>
  );
}
