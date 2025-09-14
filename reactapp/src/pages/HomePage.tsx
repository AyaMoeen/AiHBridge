import { useEffect, useState } from "react";
import ShareAi from "@/features/posts/components/ShareAi";
import FilterSelect from "../features/posts/components/FilterSelect";
import Post from "../features/posts/components/Post";
import {
  postService,
  Post as PostType,
} from "../features/posts/services/postService";
import {
  categoryService,
  Category,
} from "@/features/posts/services/categoryService";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          postService.getPosts(),
          categoryService.getCategories(),
        ]);

        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredPosts =
    selectedCategories.length === 0
      ? posts
      : posts.filter((post) =>
          selectedCategories.every((catId) =>
            post.categories?.some((c) => c.id === catId)
          )
        );

  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col items-start  mt-[20px] w-full">
      <div className="w-full flex flex-col items-center">
        <ShareAi author={user?.name || "Guest"} />
        <div className="flex  w-full px-4 mb-4">
          <label className="w-70 text-[var(--foreground)] font-medium ">
            Sorted By Category:
          </label>
          <div className="w-full">
            <FilterSelect
              value={selectedCategories}
              onChange={setSelectedCategories}
              categories={categories}
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
