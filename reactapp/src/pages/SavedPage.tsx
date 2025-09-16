import CreateList from "@/components/ui/CreateList";
import { useSaved } from "@/context/SavedContext";
import CardOfList from "@/features/posts/components/CardOfList";
import { useEffect } from "react";

export default function SavedPage() {
  const { lists, fetchLists } = useSaved();

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="flex flex-col mt-4 w-full px-4 gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">My Saved Tools</h1>
        <p className="text-muted-foreground">
          Organize your favorite AI tools into custom lists
        </p>
      </div>

      <div className="flex justify-center">
        <CreateList />
      </div>

      <div className="w-full">
        {lists.length === 0 ? (
          <p className="text-foreground text-center">
            No saved tools for selected category
          </p>
        ) : (
          <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
            {lists.map((list) => (
              <CardOfList
                id={list.id}
                title={list.name}
                date={list.created_at}
                description={list.description}
                count_post={list.post_count}
                is_default={list.is_default}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
