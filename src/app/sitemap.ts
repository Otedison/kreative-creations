import type { MetadataRoute } from "next";
import { staticBlogPosts } from "@/data/blogs";
import { projects } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kreativecreations.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/courses/website-development",
    "/portfolio",
    "/about",
    "/contact",
    "/careers",
    "/blog",
    "/donate",
    "/pay",
    "/pay/success",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/blog" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/services" || path === "/portfolio" ? 0.9 : 0.7,
  }));

  const blogEntries = staticBlogPosts.filter((post) => post.is_published).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const caseStudyEntries = projects.map((project) => ({
    url: `${siteUrl}/case-study/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries, ...caseStudyEntries];
}
