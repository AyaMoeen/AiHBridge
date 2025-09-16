import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FilterSelect from "@/features/posts/components/FilterSelect";
import Post from "../features/posts/components/Post";
import { SavedListWithItems } from "../features/posts/services/postService";
import {
  categoryService,
  Category,
} from "@/features/posts/services/categoryService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSaved } from "@/context/SavedContext";

export default function MySavedPost() {
  const { id } = useParams();
  const numericId = Number(id);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listWithItems, setListWithItems] = useState<SavedListWithItems>();
  const { getListWithItems } = useSaved();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          categoryService.getCategories(),
        ]);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSavedList = useCallback(async () => {
    if (!isAuthenticated || !numericId) return;
    try {
      const list = await getListWithItems(numericId);
      setListWithItems(list);
    } catch (err) {
      console.error("Failed to fetch saved list:", err);
    }
  }, [isAuthenticated, numericId, getListWithItems]);

  useEffect(() => {
    fetchSavedList();
  }, [fetchSavedList]);
  const filteredPosts =
    selectedCategories.length === 0
      ? listWithItems?.items || []
      : listWithItems?.items.filter((post) =>
          selectedCategories.every((catId) =>
            post.categories?.some((c) => c.id === catId)
          )
        ) || [];

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
          <h1 className="text-2xl font-bold">
            {listWithItems?.name || "My Saved Tools"}
          </h1>
        </div>

        {listWithItems?.description && (
          <p className="text-gray-500">{listWithItems?.description}</p>
        )}
        <Badge className="rounded text-[10px] bg-muted text-secondary hover:bg-muted">
          {listWithItems?.items.length} posts saved
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
