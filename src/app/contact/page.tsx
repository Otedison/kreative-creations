import { buildMetadata } from "@/lib/metadata";
import Contact from "@/views/Contact";

export const metadata = buildMetadata({
  title: "Contact Us - Get a Free Website Audit & Consultation",
  description: "Contact Kreative Creations for professional web development, digital marketing, and design services in Nairobi, Kenya. Get a free consultation and website audit today.",
  url: "/contact",
});

export default function Page() {
  return <Contact />;
}
