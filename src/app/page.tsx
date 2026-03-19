import { buildMetadata } from "@/lib/metadata";
import Index from "@/views/Index";

export const metadata = buildMetadata({
  title: "Website Development & Digital Marketing Agency",
  description: "Kreative Creations is a leading digital agency in Nairobi, Kenya specializing in website development, e-commerce solutions, UI/UX design, SEO optimization, and comprehensive digital marketing services.",
  url: "/",
});

export default function Page() {
  return <Index />;
}
