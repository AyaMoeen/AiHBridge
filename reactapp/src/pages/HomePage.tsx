import { useState } from "react";
import ShareAi from "@/features/posts/components/ShareAi";
import FilterSelect from "../features/posts/components/FilterSelect";
import Post from "../features/posts/components/Post";
import { posts } from "../features/posts/mock-data/mockPosts";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredPosts =
    selectedCategories.length === 0
      ? posts
      : posts.filter((post) =>
          post.badges.some((badge) => selectedCategories.includes(badge))
        );

  return (
    <div className="flex flex-col items-start  mt-[20px] w-full">
      <div className="w-full flex flex-col items-center">
        <ShareAi author={"Ahmad Tomeh"} />
        <div className="flex  w-full px-4 mb-4">
          <label className="w-70 text-[var(--foreground)] font-medium ">
            Sorted By Category:
          </label>
          <div className="w-full">
            <FilterSelect
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        {filteredPosts.length === 0 ? (
          <p className="text-[var(--foreground)] mt-4">
            No posts found for selected category
          </p>
        ) : (
          filteredPosts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
