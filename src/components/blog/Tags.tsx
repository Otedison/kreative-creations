import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagItem {
  id: string;
  name: string;
  count?: number;
}

interface TagsProps {
  tags: TagItem[];
  activeTag?: string;
  title?: string;
  maxVisible?: number;
}

const Tags = ({
  tags,
  activeTag,
  title = "Popular Tags",
  maxVisible = 15,
}: TagsProps) => {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center">
          <Tag className="w-4 h-4 text-green" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {/* Tags Cloud */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => {
            const isActive = activeTag === tag.name;

            return (
              <Link
                key={tag.id}
                to={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200",
                  isActive
                    ? "bg-green text-accent-foreground"
                    : "bg-secondary hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <span className="text-xs opacity-70">#</span>
                <span className="font-medium">{tag.name}</span>
                {tag.count !== undefined && tag.count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20"
                        : "bg-background text-muted-foreground"
                    )}
                  >
                    {tag.count}
                  </span>
                )}
              </Link>
            );
          })}

          {remainingCount > 0 && (
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              +{remainingCount} more
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tags;

