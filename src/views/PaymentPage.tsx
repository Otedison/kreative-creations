"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead from "@/components/SEOHead";

export default function PaymentPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function proceedToPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber, amount: Number(amount), email, phoneNumber }),
      });
      const responseText = await response.text();
      let result: { error?: string; checkoutUrl?: string } = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Payment service is unavailable on this static website. Deploy the app with its Next.js API routes enabled.");
      }
      if (!response.ok) throw new Error(result.error || "Unable to start payment.");
      if (!result.checkoutUrl) throw new Error("Zetu Pay did not return a checkout URL.");
      window.location.assign(result.checkoutUrl);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Unable to start payment.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <SEOHead title="Pay Your Invoice" description="Pay a Kreative Creations invoice securely through Zetu Pay." url="/pay" />
      <main className="min-h-[70vh] bg-secondary/40 py-16 md:py-24">
        <div className="container-tight grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10 text-coral">
              <FileText className="h-7 w-7" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-coral">Invoice payment</p>
            <h1 className="mb-5 text-4xl font-bold md:text-5xl">Settle your invoice in a few clicks.</h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Enter the invoice number and amount shown on your invoice. You will continue to Zetu Pay to complete the payment securely.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-green" />
              Secure checkout powered by Zetu Pay
            </div>
          </div>

          <form onSubmit={proceedToPayment} className="rounded-2xl border border-border bg-card p-6 shadow-medium md:p-8">
            <div className="mb-7 border-b border-border pb-5">
              <p className="text-sm text-muted-foreground">Kreative Creations</p>
              <h2 className="mt-1 text-2xl font-bold">Invoice details</h2>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice number</Label>
                <Input id="invoice-number" placeholder="e.g. KC-2026-001" value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KSh)</Label>
                <Input id="amount" type="number" min="1" step="0.01" placeholder="e.g. 25,000" value={amount} onChange={(event) => setAmount(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Receipt email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">M-Pesa phone number</Label>
                <Input id="phone-number" type="tel" inputMode="tel" placeholder="e.g. 0712 345 678" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required />
                <p className="text-xs text-muted-foreground">Use the number that should receive the M-Pesa prompt.</p>
              </div>
              {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="coral" size="xl" className="w-full" disabled={isLoading}>
                {isLoading ? "Connecting to Zetu Pay..." : <>Proceed to pay <CreditCard className="h-5 w-5" /><ArrowRight className="h-5 w-5" /></>}
              </Button>
              <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-green" /> Your payment confirmation is handled by Zetu Pay.</p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}