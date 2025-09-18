import { Card } from "@/components/ui/card";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import EditPostDialog from "./EditPostDialog";
import { useState } from "react";
import { postService } from "../services/postService";
interface Props {
  post: {
    id: number;
    title: string;
    description: string;
    personal_review: string;
    link: string;
    categories: { id: number; name: string }[];
    user: string;
    username: string;
    name: string;
    profile_picture: string | null;
    like_count: number;
    comment_count: number;
    avg_rating: number;
    created_at: string;
    updated_at: string;
  };
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
    id: post.id,
    author: post.user,
    title: post.title,
    description: post.description,
    personal_review: post.personal_review,
    link: post.link,
    categories: post.categories,
    avg_rating: post.avg_rating,
    like_count: post.like_count,
    comment_count: post.comment_count,
    name: post.name,
    username: post.username,
  });

  const [editOpen, setEditOpen] = useState(false);

  const handleSave = async (updated: {
    title: string;
    description: string;
    personal_review: string;
    link: string;
    badges: { id: number; name: string }[];
  }) => {
    try {
      const response = await postService.updatePost(postData.id, {
        title: updated.title,
        description: updated.description,
        link: updated.link,
        personal_review: updated.personal_review,
        category_ids: updated.badges.map((b) => b.id),
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
  return (
    <div className="flex w-full flex-col items-center justify-center my-3">
      <Card className="shadow-lg border  bg-card text-card-foreground flex flex-col justify-center w-full p-5">
        <PostHeader
          author={Number(postData.author)}
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
