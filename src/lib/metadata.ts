import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kreativecreations.co.ke";
const siteName = "Kreative Creations";
const defaultImage = "https://kreativecreations.co.ke/krc.png";
const defaultDescription =
  "Digital marketing agency specializing in website development, e-commerce solutions, and full-service digital marketing. We build strategic digital foundations that drive growth.";

const toAbsoluteUrl = (value?: string) => {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
};

export function buildMetadata({
  title,
  description,
  url,
  image,
  type = "website",
  publishedTime,
  author,
  tags,
  robots,
}: {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  tags?: string[];
  robots?: string;
}): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const fullUrl = toAbsoluteUrl(url) || siteUrl;
  const fullImage = toAbsoluteUrl(image) || defaultImage;
  const metaDescription = description || defaultDescription;

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: { canonical: fullUrl },
    robots,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      type,
      url: fullUrl,
      siteName,
      images: [{ url: fullImage }],
      locale: "en_KE",
    },
    twitter: {
      card: "summary_large_image",
      site: "@KreativeCreate",
      title: fullTitle,
      description: metaDescription,
      images: [fullImage],
    },
    other: {
      ...(type === "article" && publishedTime ? { "article:published_time": publishedTime } : {}),
      ...(type === "article" && author ? { "article:author": author } : {}),
      ...(tags && tags.length ? { "article:tag": tags.join(",") } : {}),
    },
  };
}

export const seoDefaults = {
  siteUrl,
  siteName,
  defaultImage,
  defaultDescription,
};
