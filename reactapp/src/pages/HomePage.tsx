import ShareAi from "@/features/posts/components/ShareAi";
import FilterSelect from "../features/posts/components/FilterSelect";
import Post from "../features/posts/components/Post";
import { posts } from "../features/posts/mock-data/mockPosts";
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center mt-[20px]">
      <ShareAi author={"Ahmad Tomeh"} />
      <FilterSelect />
      <div className="w-full flex flex-col items-center justify-center">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
