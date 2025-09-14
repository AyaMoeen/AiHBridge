import { createContext, useContext, useState, ReactNode } from "react";
import { postService, Post } from "@/features/posts/services/postService";

interface SearchContextType {
  query: string;
  results: Post[];
  loading: boolean;
  handleSearch: (q: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await postService.searchPosts(q); 

      const detailedPosts = await Promise.all(
        data.map((p: { id: number }) => postService.getPostById(p.id))
      );

      setResults(detailedPosts);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ query, results, loading, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
