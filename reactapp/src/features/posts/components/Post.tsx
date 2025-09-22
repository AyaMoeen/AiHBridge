import { Card } from "@/components/ui/card";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import EditPostDialog from "./EditPostDialog";
import { useState } from "react";
import { postService } from "../services/postService";

interface Props {
  post: any;
  maxChars?: number | null;
  showLearnMore?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  onDeleteClick?: () => void;
}

export default function Post({ post, maxChars = 150, showLearnMore, showEdit, showDelete, onDeleteClick }: Props) {
  const [postData, setPostData] = useState({
    ...post,
    userId: post.user_id || post.id, // ensure userId exists
  });

  const [editOpen, setEditOpen] = useState(false);

  const handleSave = async (updated: any) => {
    try {
      const response = await postService.updatePost(postData.id, {
        title: updated.title,
        description: updated.description,
        link: updated.link,
        personal_review: updated.personal_review,
        category_ids: updated.badges.map((b: any) => b.id),
      });

      setPostData({
        ...postData,
        ...response,
        categories: response.categories,
      });
    } catch (error) {
      console.error("Failed to update post", error);
    } finally {
      setEditOpen(false);
    }
  };

  const textToSummarize = `${postData.description} ${postData.personal_review}`;

  return (
    <div className="flex w-full flex-col items-center justify-center my-3">
      <Card className="shadow-lg border bg-card text-card-foreground flex flex-col justify-center w-full p-5">
        <PostHeader
          authorId={postData.userId}
          author={postData.user}
          badges={postData.categories || []}
          link={postData.link}
          title={postData.title}
          showEdit={showEdit}
          showDelete={showDelete}
          onEditClick={() => setEditOpen(true)}
          onDeleteClick={onDeleteClick}
          avg_rating={postData.avg_rating}
          username={postData.username}
          name={postData.name}
          create_at={postData.created_at}
          profile_picture={postData.profile_picture}
          postId={postData.id}
        />
        <PostContent
          postId={postData.id}
          description={postData.description}
          review={postData.personal_review}
          maxChars={maxChars}
          showLearnMore={showLearnMore}
        />
        <PostFooter
          postId={postData.id}
          like_count={postData.like_count}
          comment_count={postData.comment_count}
          textToSummarize={textToSummarize}
          title={postData.title}
        />
        {editOpen && (
          <EditPostDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialTitle={postData.title}
            initialDescription={postData.description}
            initialUrl={postData.link}
            initialReview={postData.personal_review}
            initialBadges={postData.categories}
            onSave={handleSave}
          />
        )}
      </Card>
    </div>
  );
}
