import type { MetadataRoute } from "next";
import { staticBlogPosts } from "@/data/blogs";
import { projects } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kreativecreations.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/portfolio",
    "/about",
    "/contact",
    "/careers",
    "/blog",
    "/donate",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const blogEntries = staticBlogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
  }));

  const caseStudyEntries = projects.map((project) => ({
    url: `${siteUrl}/case-study/${project.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...blogEntries, ...caseStudyEntries];
}
