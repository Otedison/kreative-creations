import { buildMetadata } from "@/lib/metadata";
import Services from "@/views/Services";

export const metadata = buildMetadata({
  title: "Professional Web Development & Digital Marketing Services",
  description: "Kreative Creations offers professional web development, e-commerce solutions, UI/UX design, SEO optimization, and digital marketing services in Nairobi, Kenya.",
  url: "/services",
});

export default function Page() {
  return <Services />;
}
