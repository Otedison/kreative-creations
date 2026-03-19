import { buildMetadata } from "@/lib/metadata";
import Careers from "@/views/Careers";

export const metadata = buildMetadata({
  title: "Careers - Join Our Team",
  description: "Join the Kreative Creations team. We're a small, focused team building high-impact digital experiences. Explore open roles in design, development, and digital marketing.",
  url: "/careers",
});

export default function Page() {
  return <Careers />;
}
