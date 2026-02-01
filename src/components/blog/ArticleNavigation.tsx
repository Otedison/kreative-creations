import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface ArticleNavigationProps {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}

const ArticleNavigation = ({
  previousPost,
  nextPost,
}: ArticleNavigationProps) => {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <section className="container-tight py-12">
      <div className="border-t border-border pt-12">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          More Articles
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Previous Post */}
          {previousPost ? (
            <Link
              to={`/blog/${previousPost.slug}`}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-coral/50 transition-all hover-lift"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-coral/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-coral transition-colors" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Previous Article
                </p>
                <h4 className="font-medium text-foreground group-hover:text-coral transition-colors line-clamp-2">
                  {previousPost.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {/* Next Post */}
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-coral/50 transition-all hover-lift"
            >
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground mb-1">
                  Next Article
                </p>
                <h4 className="font-medium text-foreground group-hover:text-coral transition-colors line-clamp-2">
                  {nextPost.title}
                </h4>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-coral/10 transition-colors">
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-coral transition-colors" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleNavigation;

