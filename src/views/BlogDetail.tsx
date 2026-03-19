"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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
import SearchWidget from "@/components/blog/SearchWidget";
import NewsletterWidget from "@/components/blog/NewsletterWidget";
import ArticleNavigation from "@/components/blog/ArticleNavigation";
import { TableOfContentsItem } from "@/types/blog";
import { staticBlogPosts, getBlogBySlug, getRecentPosts, getRelatedPosts, getAllCategories, StaticBlogPost } from "@/data/blogs";
import SEOHead from "@/components/SEOHead";

const categoriesData = getAllCategories().map((cat, index) => ({
  id: String(index + 1),
  name: cat.name,
  slug: cat.name.toLowerCase(),
  count: cat.count,
}));

const BlogDetail = () => {
  const params = useParams();
  const pathname = usePathname();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : undefined;
  const [post, setPost] = useState<StaticBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<StaticBlogPost[]>([]);
  const [recentPostsData, setRecentPostsData] = useState<{ id: string; title: string; slug: string; image: string | null; published_at: string | null; read_time: string | null }[]>([]);
  const [previousPost, setPreviousPost] = useState<StaticBlogPost | null>(null);
  const [nextPost, setNextPost] = useState<StaticBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");

  const currentUrl = typeof window !== "undefined"
    ? `${window.location.origin}${pathname}`
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
    if (!slug) {
      setError("Blog post not found");
      setLoading(false);
      return;
    }

    // Fetch post from static data
    const foundPost = getBlogBySlug(slug);
    
    if (!foundPost) {
      setError("Blog post not found");
      setLoading(false);
      return;
    }

    setPost(foundPost);

    // Set related posts
    const related = getRelatedPosts(foundPost.category, foundPost.slug);
    setRelatedPosts(related);

    // Set recent posts
    const recent = getRecentPosts(5, foundPost.slug).map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      image: p.image,
      published_at: p.published_at,
      read_time: p.read_time,
    }));
    setRecentPostsData(recent);

    // Set previous and next posts
    const currentIndex = staticBlogPosts.findIndex(p => p.slug === foundPost.slug);
    if (currentIndex > 0) {
      setNextPost(staticBlogPosts[currentIndex - 1]);
    }
    if (currentIndex < staticBlogPosts.length - 1) {
      setPreviousPost(staticBlogPosts[currentIndex + 1]);
    }

    setLoading(false);
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
          <Link href="/blog">
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
      
      {post && (
        <SEOHead
          title={`${post.title} | Kreative Creations Blog`}
          description={post.excerpt || `Read about ${post.title} on Kreative Creations blog. Expert insights on ${post.category?.toLowerCase() || 'digital marketing'}.`}
          url={`/blog/${post.slug}`}
          image={post.image || undefined}
          type="article"
        />
      )}
      
      <main className="overflow-hidden">
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
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1 text-coral text-sm font-medium mb-4">
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
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
                  {format(new Date(post.published_at || ""), "MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.read_time}
                </span>
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
                className="prose prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-foreground 
                  prose-headings:mt-10 prose-headings:mb-5
                  prose-p:text-muted-foreground prose-p:leading-8 prose-p:my-6
                  prose-a:text-coral prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-blockquote:border-l-4 prose-blockquote:border-coral prose-blockquote:bg-secondary/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-code:text-coral prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                  prose-ul:my-5 prose-ul:pl-6 prose-li:my-2 prose-li:marker:text-coral
                  prose-ol:my-5 prose-ol:pl-6 prose-li:my-2 prose-li:marker:text-coral
                  prose-hr:my-10 prose-hr:border-border
                  prose-table:my-6 prose-table:w-full prose-th:bg-secondary prose-th:p-3 prose-th:text-foreground prose-td:p-3 prose-td:border prose-td:border-border"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Navigation */}
              <ArticleNavigation
                previousPost={previousPost}
                nextPost={nextPost}
              />
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
                twitter={undefined}
                linkedin={undefined}
              />

              {/* Search Widget */}
              <SearchWidget />

              {/* Categories */}
              <Categories
                categories={categoriesData}
                activeCategory={post.category || undefined}
              />

              {/* Recent Posts */}
              <RecentPosts posts={recentPostsData} currentPostId={post.id} />

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
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
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
                      <span className="text-coral text-xs font-medium uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-2 line-clamp-2 group-hover:text-coral transition-colors">
                        {relatedPost.title}
                      </h3>
                      <span className="flex items-center gap-1 text-muted-foreground text-sm mt-3">
                        <Clock className="w-3 h-3" />
                        {relatedPost.read_time}
                      </span>
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
                <Link href="/blog">Read More Articles</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogDetail;
