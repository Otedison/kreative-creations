import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import PaymentStatusClient from "@/views/PaymentStatusClient";

export const metadata = buildMetadata({
  title: "Payment Status",
  description: "View the status of your Kreative Creations invoice payment.",
  url: "/pay/success",
});

export default function PaymentStatusPage() {
  return <PaymentStatusClient />;
}