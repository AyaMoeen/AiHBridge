import { useSearch } from "@/context/SearchContext";
import Post from "@/features/posts/components/Post";

export default function SearchResults() {
  const { results, loading } = useSearch();

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full space-y-4">
      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        results.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}
