"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Heart, CreditCard, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import DecorativeShapes from "@/components/DecorativeShapes";

// Paystack public key
const PAYSTACK_PUBLIC_KEY = "pk_live_fb8743f1a10487c96cb5676b4c6e4489b40c2976";

const presetAmounts = [
  { amount: 500, label: "KSh 500" },
  { amount: 1000, label: "KSh 1,000" },
  { amount: 2500, label: "KSh 2,500" },
  { amount: 5000, label: "KSh 5,000" },
  { amount: 10000, label: "KSh 10,000" },
];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const initializePayment = useCallback(async () => {
    if (!donorEmail) {
      alert("Please enter your email address");
      return;
    }

    if (!finalAmount || finalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      // Dynamically load Paystack
      const PaystackPop = await import("@paystack/inline-js");
      const paystack = new PaystackPop.default();

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: donorEmail,
        amount: finalAmount * 100,
        currency: "KES",
        ref: `DONATE_${Date.now()}`,
        metadata: {
          name: donorName || "Anonymous",
          custom_fields: [
            {
              display_name: "Donor Name",
              variable_name: "donor_name",
              value: donorName || "Anonymous",
            },
          ],
        },
        onSuccess: (transaction: { reference: string }) => {
          console.log("Payment successful:", transaction.reference);
          setIsSuccess(true);
        },
        onCancel: () => {
          console.log("Payment cancelled by user");
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  }, [donorEmail, donorName, finalAmount]);

  if (isSuccess) {
    return (
      <>
        <SEOHead
          title="Thank You for Your Donation"
          description="Thank you for supporting Kreative Creations. Your donation helps us continue our work."
          url="/donate"
        />
        <main className="overflow-hidden">
          <section className="relative section-padding bg-slate-dark min-h-screen flex items-center justify-center">
            <DecorativeShapes variant="section" />
            <div className="container-tight relative z-10">
              <Card className="max-w-lg mx-auto text-center bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-3xl">Thank You!</CardTitle>
                  <CardDescription className="text-lg">
                    Your donation of KSh {finalAmount.toLocaleString()} has been received.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your generous support helps us continue creating amazing digital experiences.
                    We've sent a confirmation email to {donorEmail}.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button asChild className="w-full">
                    <Link href="/">
                      Return Home
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false);
                      setDonorName("");
                      setDonorEmail("");
                      setSelectedAmount(1000);
                      setCustomAmount("");
                    }}
                    className="w-full"
                  >
                    Make Another Donation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Support Our Work - Donate"
        description="Support Kreative Creations with a donation. Your contribution helps us continue delivering exceptional digital solutions."
        url="/donate"
      />
      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative section-padding bg-slate-dark text-primary-foreground overflow-hidden">
          <DecorativeShapes variant="hero" />
          <div className="container-tight relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coral/20 mb-6">
                <Heart className="w-8 h-8 text-coral" />
              </div>
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">
                Support Our Work
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Make a <span className="text-gradient">Difference</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                Your donation helps us continue creating exceptional digital experiences
                for businesses across Kenya and beyond.
              </p>
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="relative section-padding bg-background overflow-hidden">
          <DecorativeShapes variant="section" />
          <div className="container-tight relative z-10">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-soft">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Choose Amount to Donate</CardTitle>
                  <CardDescription>
                    Select an amount or enter a custom value
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(preset.amount);
                          setCustomAmount("");
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                          selectedAmount === preset.amount && !customAmount
                            ? "border-coral bg-coral/10 text-coral"
                            : "border-border hover:border-coral/50"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="custom-amount">Or enter custom amount (KSh)</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (e.target.value) {
                          setSelectedAmount(0);
                        }
                      }}
                      className="text-lg py-6"
                    />
                  </div>

                  {/* Selected Amount Display */}
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">You will donate</p>
                    <p className="text-3xl font-bold text-coral">
                      KSh {finalAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Donor Details */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="donor-name">Your Name (Optional)</Label>
                      <Input
                        id="donor-name"
                        type="text"
                        placeholder="Enter your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor-email">Email Address *</Label>
                      <Input
                        id="donor-email"
                        type="email"
                        placeholder="Enter your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll send your receipt to this email
                      </p>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={initializePayment}
                    disabled={isLoading}
                    className="w-full py-6 text-lg"
                    size="xl"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Donate KSh {finalAmount.toLocaleString()}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Additional Info */}
              <div className="mt-8 text-center text-muted-foreground">
                <p className="text-sm">
                  By donating, you agree to our terms of service.
                  <br />
                  All donations are processed securely via Paystack.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="section-padding bg-secondary">
          <div className="container-tight">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Impact
              </h2>
              <p className="text-muted-foreground">
                Every donation makes a difference in what we can accomplish.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h3 className="font-bold mb-2">Build More Websites</h3>
                  <p className="text-muted-foreground text-sm">
                    Help us create free websites for local businesses and nonprofits
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="font-bold mb-2">Train Developers</h3>
                  <p className="text-muted-foreground text-sm">
                    Support our coding bootcamps for aspiring young developers
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="font-bold mb-2">Innovation Fund</h3>
                  <p className="text-muted-foreground text-sm">
                    Help us develop new tools and solutions for our clients
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-slate-dark text-primary-foreground">
          <div className="container-tight text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Do More?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Partner with us for ongoing projects or explore other ways to support our mission.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Donate;

