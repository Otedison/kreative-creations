import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { RecentPost } from "@/types/blog";

interface RecentPostsProps {
  posts: RecentPost[];
  currentPostId?: string;
  title?: string;
}

const RecentPosts = ({
  posts,
  currentPostId,
  title = "Recent Posts",
}: RecentPostsProps) => {
  // Filter out current post and limit to 5
  const filteredPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 5);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {/* Posts List */}
      <div className="p-4 space-y-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group flex gap-4 items-start"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
              <img
                src={
                  post.image ||
                  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=140&fit=crop"
                }
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-coral transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{formatDate(post.published_at)}</span>
                {post.read_time && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="p-4 border-t border-border">
        <Link
          to="/blog"
          className="text-sm text-accent font-medium hover:text-accent/80 transition-colors flex items-center justify-center gap-1"
        >
          View All Posts
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RecentPosts;

