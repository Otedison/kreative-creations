import { buildMetadata } from "@/lib/metadata";
import Donate from "@/views/Donate";

export const metadata = buildMetadata({
  title: "Thank You for Your Donation",
  description: "Thank you for supporting Kreative Creations. Your donation helps us continue our work.",
  url: "/donate",
});

export default function Page() {
  return <Donate />;
}
