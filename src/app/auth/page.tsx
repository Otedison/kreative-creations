import { buildMetadata } from "@/lib/metadata";
import Auth from "@/views/Auth";

export const metadata = buildMetadata({
  title: "Admin Sign In",
  description: "Admin sign in for Kreative Creations.",
  url: "/auth",
  robots: "noindex, nofollow",
});

export default function Page() {
  return <Auth />;
}
