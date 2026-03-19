import { buildMetadata } from "@/lib/metadata";
import About from "@/views/About";

export const metadata = buildMetadata({
  title: "About Us - Digital Marketing & Web Development Agency",
  description: "Learn about Kreative Creations, a leading digital agency in Nairobi, Kenya. Our team of experts specializes in website development, e-commerce, UI/UX design, and digital marketing.",
  url: "/about",
});

export default function Page() {
  return <About />;
}
