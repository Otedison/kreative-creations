import { buildMetadata } from "@/lib/metadata";
import WebsiteDevelopmentCourse from "@/views/WebsiteDevelopmentCourse";

export const metadata = buildMetadata({
  title: "WordPress Website Development Training",
  description: "Learn to design, build, and launch professional websites with practical WordPress training from Kreative Creations.",
  url: "/courses/website-development",
});

export default function Page() {
  return <WebsiteDevelopmentCourse />;
}
