import { Card } from "@/components/ui/card";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import { PostData } from "../mock-data/mockPosts";
import EditPostDialog from "./EditPostDialog";
import { useState } from "react";
interface Props {
  post: PostData;
  maxChars?: number | null;
  showLearnMore?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  onDeleteClick?: () => void;
}
export default function Post({
  post,
  maxChars = 150,
  showLearnMore,
  showEdit,
  showDelete,
  onDeleteClick,
}: Props) {
  const [postData, setPostData] = useState({
    title: post.title,
    description: post.description,
    review: post.review,
    shareUrl: post.shareUrl,
    badges: post.badges,
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleSave = (updated: {
    title: string;
    description: string;
    review: string;
    shareUrl: string;
    badges: string[];
  }) => {
    setPostData(updated);
    setEditOpen(false);
  };
  return (
    <div className="flex w-full flex-col items-center justify-center my-3">
      <Card className="shadow-lg border  bg-card text-card-foreground flex flex-col justify-center w-full p-5">
        <PostHeader
          author={post.author}
          badges={postData.badges}
          rating={post.rating}
          shareUrl={postData.shareUrl}
          title={postData.title}
          showEdit={showEdit}
          showDelete={showDelete}
          onEditClick={() => setEditOpen(true)}
          onDeleteClick={onDeleteClick}
        />

        <PostContent
          postId={post.id}
          description={postData.description}
          review={postData.review}
          maxChars={maxChars}
          showLearnMore={showLearnMore}
        />
        <PostFooter />
        {editOpen && (
          <EditPostDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialTitle={postData.title}
            initialDescription={postData.description}
            initialUrl={postData.shareUrl}
            initialReview={postData.review}
            initialBadges={postData.badges}
            onSave={handleSave}
          />
        )}
      </Card>
    </div>
  );
}
