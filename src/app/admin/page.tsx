import { buildMetadata } from "@/lib/metadata";
import Admin from "@/views/Admin";

export const metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "Admin dashboard for Kreative Creations.",
  url: "/admin",
  robots: "noindex, nofollow",
});

export default function Page() {
  return <Admin />;
}
