"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchWidgetProps {
  placeholder?: string;
  title?: string;
}

const SearchWidget = ({
  placeholder = "Search articles...",
  title = "Search",
}: SearchWidgetProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Search className="w-4 h-4 text-accent" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {/* Search Form */}
      <div className="p-4">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Links */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-1">
            {["React", "SEO", "Design", "Performance"].map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/blog?search=${term}`)}
                className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;
