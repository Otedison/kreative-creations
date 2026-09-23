import Link from "next/link";
import { CheckCircle2, ArrowLeft, XCircle, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Payment Status",
  description: "View the status of your Kreative Creations invoice payment.",
  url: "/pay/success",
});

type PaymentStatusPageProps = {
  searchParams?: {
    status?: string;
    reference?: string;
  };
};

export default function PaymentStatusPage({ searchParams }: PaymentStatusPageProps) {
  const status = String(searchParams?.status || "success").toLowerCase();
  const isSuccess = status === "success" || status === "completed" || status === "paid";
  const isPending = status === "pending" || status === "processing";
  const reference = searchParams?.reference;
  const Icon = isSuccess ? CheckCircle2 : isPending ? Clock3 : XCircle;
  const title = isSuccess ? "Payment successful" : isPending ? "Payment processing" : "Payment not completed";
  const message = isSuccess
    ? "Your payment has been received. We will match it to your invoice shortly."
    : isPending
      ? "Your payment is still being confirmed. Please check again shortly."
      : "The payment was not completed. You can return to the payment page and try again.";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-secondary/40 px-4 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-medium md:p-12">
        <Icon className={`mx-auto mb-5 h-16 w-16 ${isSuccess ? "text-green" : isPending ? "text-amber-500" : "text-destructive"}`} />
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
        {reference && <p className="mt-5 text-sm text-muted-foreground">Reference: <span className="font-semibold text-foreground">{reference}</span></p>}
        <Button asChild variant="coral" className="mt-8">
          <Link href="/pay"><ArrowLeft className="h-4 w-4" /> Return to payments</Link>
        </Button>
      </section>
    </main>
  );
}