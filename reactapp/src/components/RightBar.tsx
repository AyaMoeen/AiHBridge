import { Input } from "@/components/ui/input";
import TrendingTools from "./TrendingTools";
import HighlightedTool from "./HighlightedTools";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";

export default function Rightbar() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { handleSearch } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (text.trim()) {
      axios
        .get(`http://127.0.0.1:8000/search/autocomplete/?q=${text}`)
        .then((res) => {
          setSuggestions(res.data);
          setShowDropdown(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setShowDropdown(false);
    }
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      await handleSearch(text);
      navigate("/search");
    }
  };

  const handleClickSuggestion = async (s: string) => {
    setText(s);
    await handleSearch(s);
    setShowDropdown(false);
    navigate("/search");
  };
  const { isAuthenticated } = useAuth();

  return (
    <aside className="w-72 p-4 space-y-4 relative">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Search AI tools..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-sm border-1 border-gray-30 bg-secondary-foreground p-2"
        />
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded shadow-lg w-[90%]  max-h-60 overflow-y-auto z-50">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-2 py-2 hover:bg-blue-100 cursor-pointer transition-colors flex items-center gap-2"
              onClick={() => handleClickSuggestion(s)}
            >
              <span className="truncate">{s}</span>
            </li>
          ))}
        </ul>
      )}

      <TrendingTools />
      {isAuthenticated && <HighlightedTool />}
    </aside>
  );
}
