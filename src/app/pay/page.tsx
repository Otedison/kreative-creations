import { buildMetadata } from "@/lib/metadata";
import PaymentPage from "@/views/PaymentPage";

export const metadata = buildMetadata({
  title: "Pay Your Invoice",
  description: "Pay a Kreative Creations invoice securely through Zetu Pay.",
  url: "/pay",
});

export default function Page() {
  return <PaymentPage />;
}