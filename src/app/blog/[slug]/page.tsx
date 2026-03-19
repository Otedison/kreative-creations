import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getBlogBySlug } from "@/data/blogs";
import BlogDetail from "@/views/BlogDetail";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogBySlug(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Blog Post",
      description: "Kreative Creations blog post.",
      url: `/blog/${params.slug}`,
      robots: "noindex, nofollow",
    });
  }

  return buildMetadata({
    title: `${post.title} | Kreative Creations Blog`,
    description:
      post.excerpt ||
      `Read about ${post.title} on Kreative Creations blog. Expert insights on ${post.category?.toLowerCase() || "digital marketing"}.`,
    url: `/blog/${post.slug}`,
    image: post.image || undefined,
    type: "article",
    publishedTime: post.published_at || undefined,
    author: post.author || undefined,
    tags: post.tags || undefined,
  });
}

export default function Page() {
  return <BlogDetail />;
}
