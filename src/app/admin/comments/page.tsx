import { buildMetadata } from "@/lib/metadata";
import AdminComments from "@/views/AdminComments";

export const metadata = buildMetadata({
  title: "Admin Comments",
  description: "Comment moderation for Kreative Creations.",
  url: "/admin/comments",
  robots: "noindex, nofollow",
});

export default function Page() {
  return <AdminComments />;
}
