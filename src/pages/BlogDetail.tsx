import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import { format } from "date-fns";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBio from "@/components/blog/AuthorBio";
import RecentPosts from "@/components/blog/RecentPosts";
import Categories from "@/components/blog/Categories";
import Tags from "@/components/blog/Tags";
import SearchWidget from "@/components/blog/SearchWidget";
import NewsletterWidget from "@/components/blog/NewsletterWidget";
import ArticleNavigation from "@/components/blog/ArticleNavigation";
import CommentSection from "@/components/blog/CommentSection";
import { TableOfContentsItem, BlogPost } from "@/types/blog";

// API URL - change this to your server URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const categoriesData = [
  { id: "1", name: "Development", slug: "development", count: 12 },
  { id: "2", name: "Design", slug: "design", count: 8 },
  { id: "3", name: "SEO", slug: "seo", count: 5 },
  { id: "4", name: "E-commerce", slug: "e-commerce", count: 6 },
  { id: "5", name: "Performance", slug: "performance", count: 4 },
];

const tagsData = [
  { id: "1", name: "React", count: 8 },
  { id: "2", name: "TypeScript", count: 6 },
  { id: "3", name: "Next.js", count: 5 },
  { id: "4", name: "Tailwind CSS", count: 4 },
  { id: "5", name: "Performance", count: 4 },
  { id: "6", name: "SEO", count: 5 },
  { id: "7", name: "Web Design", count: 7 },
  { id: "8", name: "UI/UX", count: 6 },
  { id: "9", name: "JavaScript", count: 9 },
  { id: "10", name: "API", count: 3 },
];

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [previousPost, setPreviousPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");

  const currentUrl = typeof window !== "undefined"
    ? `${window.location.origin}${location.pathname}`
    : "";

  // Parse headings from content for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];

    const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h\1>/g;
    const items: TableOfContentsItem[] = [];
    let match;

    while ((match = headingRegex.exec(post.content)) !== null) {
      const id = match[2]
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      
      items.push({
        id: id || `heading-${items.length + 1}`,
        text: match[2].replace(/<[^>]*>/g, ""),
        level: parseInt(match[1]),
      });
    }

    return items;
  }, [post?.content]);

  // Highlight active heading in TOC
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      tableOfContents.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [tableOfContents]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        // Fetch current post
        const response = await fetch(`${API_URL}/blogs/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog post not found");
          } else {
            setError("Failed to load blog post");
          }
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setPost(data);
        
        // Fetch all posts for recent posts and navigation
        const allPostsResponse = await fetch(`${API_URL}/blogs`);
        
        if (allPostsResponse.ok) {
          const allPosts = await allPostsResponse.json();
          
          if (Array.isArray(allPosts)) {
            // Set recent posts (excluding current)
            setRecentPosts(
              allPosts
                .filter((p: BlogPost) => p.id !== data.id && p.slug !== data.slug)
                .slice(0, 5)
                .map((p: BlogPost) => ({
                  id: p.id || p.slug,
                  title: p.title,
                  slug: p.slug,
                  image: p.image,
                  published_at: p.published_at,
                  read_time: p.read_time,
                }))
            );

            // Set previous and next posts
            const currentIndex = allPosts.findIndex((p: BlogPost) => p.id === data.id || p.slug === data.slug);
            
            if (currentIndex > 0 && currentIndex < allPosts.length - 1) {
              setPreviousPost(allPosts[currentIndex + 1] || null);
            }
            if (currentIndex > 0) {
              setNextPost(allPosts[currentIndex - 1] || null);
            }
            
            // Fetch related posts from same category
            if (data.category) {
              const related = allPosts
                .filter((p: BlogPost) => 
                  p.category === data.category && 
                  p.id !== data.id && 
                  p.slug !== data.slug
                )
                .slice(0, 3);
              
              setRelatedPosts(related);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const publishedDate = post?.published_at || post?.created_at;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">{error || "Post not found"}</h1>
        <Button variant="coral" asChild>
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress color="hsl(0 72% 51%)" />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative">
          {post.image && (
            <div className="absolute inset-0 h-[400px] md:h-[500px]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
            </div>
          )}
          <div className="container-tight relative pt-12 pb-8">
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <div className="max-w-3xl">
              {post.category && (
                <span className="inline-flex items-center gap-1 text-coral text-sm font-medium mb-4">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(publishedDate || ""), "MMMM d, yyyy")}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.read_time}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="container-tight py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Article Column */}
            <div className="lg:w-2/3">
              {/* Article Actions */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {copySuccess ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Share:</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 rounded-full"
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 rounded-full"
                  >
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 rounded-full"
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <article 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-coral prose-strong:text-foreground prose-blockquote:border-coral prose-blockquote:text-muted-foreground prose-code:text-coral prose-pre:bg-secondary prose-pre:border prose-pre:border-border"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Navigation */}
              <ArticleNavigation
                previousPost={previousPost}
                nextPost={nextPost}
              />

              {/* Comment Section */}
              <CommentSection slug={post.slug} blogId={post.id} />
            </div>

            {/* Sidebar Column */}
            <aside className="lg:w-1/3 space-y-8">
              {/* Table of Contents - Desktop Only */}
              <div className="hidden xl:block">
                <TableOfContents
                  items={tableOfContents}
                  className="sticky top-24"
                />
              </div>

              {/* Author Bio */}
              <AuthorBio
                name={post.author}
                bio={post.author_bio}
                avatar={post.author_avatar}
                twitter={post.author_twitter}
                linkedin={post.author_linkedin}
              />

              {/* Search Widget */}
              <SearchWidget />

              {/* Categories */}
              <Categories
                categories={categoriesData}
                activeCategory={post.category || undefined}
              />

              {/* Tags */}
              <Tags tags={tagsData} />

              {/* Recent Posts */}
              <RecentPosts posts={recentPosts} currentPostId={post.id} />

              {/* Newsletter Widget */}
              <NewsletterWidget
                title="Stay in the Loop"
                description="Get weekly insights delivered to your inbox."
              />
            </aside>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container-tight pb-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id || relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-card rounded-2xl overflow-hidden shadow-soft hover-lift"
                  >
                    {relatedPost.image && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {relatedPost.category && (
                        <span className="text-coral text-xs font-medium uppercase tracking-wider">
                          {relatedPost.category}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-foreground mt-2 line-clamp-2 group-hover:text-coral transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.read_time && (
                        <span className="flex items-center gap-1 text-muted-foreground text-sm mt-3">
                          <Clock className="w-3 h-3" />
                          {relatedPost.read_time}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog CTA */}
        <section className="container-tight pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="border-t border-border pt-12">
              <p className="text-muted-foreground mb-4">Enjoyed this article?</p>
              <Button variant="coral" asChild>
                <Link to="/blog">Read More Articles</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogDetail;

