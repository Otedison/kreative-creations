import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoriesProps {
  categories: Category[];
  activeCategory?: string;
  title?: string;
}

const Categories = ({
  categories,
  activeCategory,
  title = "Categories",
}: CategoriesProps) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
          <FolderOpen className="w-4 h-4 text-coral" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {/* Categories List */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.name;

            return (
              <Link
                key={category.id}
                to={`/blog?category=${category.slug}`}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-coral text-accent-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <span className="font-medium">{category.name}</span>
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className={cn(
                    "text-xs px-1.5 py-0 h-5",
                    isActive
                      ? "bg-white/20 text-accent-foreground"
                      : "bg-background text-muted-foreground"
                  )}
                >
                  {category.count}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;

