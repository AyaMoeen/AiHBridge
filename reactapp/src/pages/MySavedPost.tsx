import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FilterSelect from "@/features/posts/components/FilterSelect";
import Post from "../features/posts/components/Post";
import {
  postService,
  Post as PostType,
} from "../features/posts/services/postService";
import {
  categoryService,
  Category,
} from "@/features/posts/services/categoryService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, BookmarkCheck, List, ListCheck, ListChecks, ListChevronsDownUp } from "lucide-react";
import { ListBulletIcon } from "@radix-ui/react-icons";

export default function MySavedPost() {
  const { id } = useParams();
  const location = useLocation();
  const { title, description, count_post } = (location.state || {}) as {
    title?: string;
    description?: string;
    count_post: number;
  };
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="flex flex-col items-start w-full gap-4">
      <div className="w-full flex items-center mb-1">
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded cursor-pointer"
          onClick={() => navigate("/saved")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Feed
        </Button>
      </div>
      <div className="w-full mb-4">
        <div className="flex flex-row items-center gap-2 mb-2">
          <BookmarkCheck size={24} className="text-gray-400" />
          <h1 className="text-2xl font-bold">{title || "My Saved Tools"}</h1>
        </div>

        {description && <p className="text-gray-500">{description}</p>}
        <Badge className="rounded text-[10px] bg-muted text-secondary hover:bg-muted">
          {count_post} posts saved
        </Badge>
      </div>

      <div className="flex items-start justify-center w-full px-4">
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

      <div className="w-full flex flex-col items-center justify-center">
        {filteredPosts.length === 0 ? (
          <p className="text-[var(--foreground)]">
            No saved tools for selected category
          </p>
        ) : (
          filteredPosts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
