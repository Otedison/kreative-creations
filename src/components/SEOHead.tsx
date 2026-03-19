"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

const defaultSEO = {
  siteName: "Kreative Creations",
  siteUrl: "https://kreativecreations.co.ke",
  defaultImage: "https://kreativecreations.co.ke/krc.png",
  twitter: "@KreativeCreate",
  defaultDescription: "Digital marketing agency specializing in website development, e-commerce solutions, and full-service digital marketing. We build strategic digital foundations that drive growth.",
};

const SEOHead = ({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  author,
  tags,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | ${defaultSEO.siteName}`
    : `${defaultSEO.siteName} | Website Development & Digital Marketing Agency`;

  const fullUrl = url
    ? url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${defaultSEO.siteUrl}${url}`
    : defaultSEO.siteUrl;
  const fullImage = image
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${defaultSEO.siteUrl}${image}`
    : defaultSEO.defaultImage;
  const metaDescription = description || defaultSEO.defaultDescription;

  useEffect(() => {
    // Update title
    document.title = fullTitle;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", metaDescription);

    // Update robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "index, follow");

    // Update canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", fullUrl);

    // Open Graph tags
    const ogTags = [
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: metaDescription },
      { property: "og:type", content: type },
      { property: "og:url", content: fullUrl },
      { property: "og:image", content: fullImage },
      { property: "og:site_name", content: defaultSEO.siteName },
      { property: "og:locale", content: "en_KE" },
    ];

    ogTags.forEach(({ property, content }) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement("meta");
        ogMeta.setAttribute("property", property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute("content", content);
    });

    // Article specific OG tags
    if (type === "article") {
      if (publishedTime) {
        let ogPublished = document.querySelector('meta[property="article:published_time"]');
        if (!ogPublished) {
          ogPublished = document.createElement("meta");
          ogPublished.setAttribute("property", "article:published_time");
          document.head.appendChild(ogPublished);
        }
        ogPublished.setAttribute("content", publishedTime);
      }
      if (author) {
        let ogAuthor = document.querySelector('meta[property="article:author"]');
        if (!ogAuthor) {
          ogAuthor = document.createElement("meta");
          ogAuthor.setAttribute("property", "article:author");
          document.head.appendChild(ogAuthor);
        }
        ogAuthor.setAttribute("content", author);
      }
    }

    // Twitter tags
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: defaultSEO.twitter },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: metaDescription },
      { name: "twitter:image", content: fullImage },
      { name: "twitter:url", content: fullUrl },
    ];

    twitterTags.forEach(({ name, content }) => {
      let twitterMeta = document.querySelector(`meta[name="${name}"]`);
      if (!twitterMeta) {
        twitterMeta = document.createElement("meta");
        twitterMeta.setAttribute("name", name);
        document.head.appendChild(twitterMeta);
      }
      twitterMeta.setAttribute("content", content);
    });

    // Cleanup function to reset to default on unmount
    return () => {
      document.title = defaultSEO.siteName;
    };
  }, [fullTitle, metaDescription, fullUrl, fullImage, type, publishedTime, author]);

  return null;
};

export default SEOHead;
