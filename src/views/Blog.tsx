"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, User, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import NewsletterForm from "@/components/NewsletterForm";
import { format } from "date-fns";
import { staticBlogPosts } from "@/data/blogs";
import SEOHead from "@/components/SEOHead";

const categories = ["All", "Development", "Design", "SEO", "E-commerce", "Performance", "Management", "Growth"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const searchLower = searchQuery.toLowerCase().trim();
  
  const filteredPosts = staticBlogPosts.filter((p) => {
    if (!searchLower) return true;
    return (
      p.title.toLowerCase().includes(searchLower) ||
      p.excerpt.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      p.author.toLowerCase().includes(searchLower)
    );
  }).filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  return (
    <>
      <SEOHead
        title="Blog - Digital Marketing Insights & Tips | Kreative Creations"
        description="Explore our blog for the latest insights on web development, digital marketing, SEO, UI/UX design, and e-commerce strategies. Expert tips from Nairobi's leading digital agency."
        url="/blog"
      />
      <main className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Blog & Resources</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Insights & <span className="text-gradient">Ideas</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Stay up to date with the latest trends, tips, and best practices in web development and digital marketing.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-30">
        <div className="container-tight">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === selectedCategory
                    ? "bg-coral text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {staticBlogPosts.length === 0 ? (
        <section className="section-padding bg-background">
          <div className="container-tight text-center">
            <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </div>
        </section>
      ) : (
        <>
          {/* All Posts */}
          <section className="section-padding bg-secondary">
            <div className="container-tight">
              <h2 className="text-2xl font-bold mb-8">
                {selectedCategory === "All" ? "Latest Articles" : selectedCategory}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No articles in this category yet.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <article className="bg-card rounded-2xl overflow-hidden shadow-soft hover-lift h-full flex flex-col">
                        <div className="relative overflow-hidden aspect-[3/2]">
                          <img
                            src={post.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-background/90 text-foreground text-xs font-medium">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>{formatDate(post.published_at || post.created_at)}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.read_time}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-coral transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 flex-grow">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{post.author}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
              Get the latest insights, tips, and resources delivered straight to your inbox every week.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
    </>
  );
};

export default Blog;

