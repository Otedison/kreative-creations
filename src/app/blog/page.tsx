import { buildMetadata } from "@/lib/metadata";
import Blog from "@/views/Blog";

export const metadata = buildMetadata({
  title: "Blog - Digital Marketing Insights & Tips | Kreative Creations",
  description: "Explore our blog for the latest insights on web development, digital marketing, SEO, UI/UX design, and e-commerce strategies. Expert tips from Nairobi's leading digital agency.",
  url: "/blog",
});

export default function Page() {
  return <Blog />;
}
