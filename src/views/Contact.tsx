"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import { contactFormAction, googleSheetsWebhookUrl, submitToGoogleSheets } from "@/lib/formEndpoints";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    company: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/contact?success=true`
      : "/contact?success=true";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!googleSheetsWebhookUrl) return;

    event.preventDefault();
    setIsSubmitting(true);
    try {
      await submitToGoogleSheets(event.currentTarget);
      window.location.assign(nextUrl);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us - Get a Free Website Audit & Consultation"
        description="Contact Kreative Creations for professional web development, digital marketing, and design services in Nairobi, Kenya. Get a free consultation and website audit today."
        url="/contact"
      />
      <main className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Let's Build Something <span className="text-gradient">Amazing</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Ready to start your project? Tell us about your vision and we'll help make it a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-secondary">
        <div className="container-tight">
          <div className="mb-12 max-w-2xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Start the conversation</span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Bring us the challenge. We&apos;ll help shape the next step.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Share a little about your goals, and our team will respond with practical recommendations for your project.</p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_.65fr] lg:gap-12">
            {/* Form */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
              <div className="mb-8 border-b border-border pb-6">
                <h3 className="text-2xl font-bold">Tell us about your project</h3>
                <p className="mt-2 text-sm text-muted-foreground">The more context you share, the more useful our first reply can be.</p>
              </div>
              <form
                action={contactFormAction}
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                <input type="hidden" name="formType" value="contact" />
                <input type="hidden" name="_subject" value="New Contact Form Submission - Kreative Creations" />
                <input type="hidden" name="_replyto" value={formData.email} />
                <input type="hidden" name="_next" value={nextUrl} />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="consent" value={formData.consent ? "Yes" : "No"} />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input
                      required
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+254 7XX XXX XXX"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your Company"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tell Us About Your Project *</label>
                  <Textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, goals, and timeline..."
                    rows={6}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-coral focus:ring-coral"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    I consent to my information being used to contact me regarding my inquiry. 
                    My data will be processed and stored securely in accordance with the Data Protection Act 
                    and will only be used for the purpose of responding to my request.
                  </label>
                </div>

                <Button
                  type="submit" 
                  variant="coral" 
                  size="xl" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-dark p-8 text-primary-foreground shadow-medium">
                <span className="text-sm font-semibold uppercase tracking-wider text-green-400">Reach us directly</span>
                <h3 className="mt-3 text-2xl font-bold">A real team is ready to listen.</h3>
                <p className="mt-3 leading-relaxed text-primary-foreground/70">Have a quick question or prefer a direct conversation? Use any of the channels below.</p>
                <ul className="mt-8 space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral/20">
                      <Mail className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:hello@kreativecreations.co.ke" className="text-primary-foreground/70 transition-colors hover:text-coral">
                        hello@kreativecreations.co.ke
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral/20">
                      <Phone className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+254743653115" className="text-primary-foreground/70 transition-colors hover:text-coral">
                        +2547 43 653 115
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral/20">
                      <MapPin className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-primary-foreground/70">
                        Kahawa Sukari, Thika Road<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-coral" />
                </div>
                <h3 className="text-xl font-bold mb-4">Prefer a conversation?</h3>
                <p className="text-muted-foreground mb-6">
                  Prefer to talk? Book a free 30-minute strategy call with our team.
                </p>
                <Button variant="coral-outline" className="w-full">
                  Book a Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="mb-12 max-w-2xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Before we begin</span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground">A few useful details about how we work together.</p>
          </div>

          <div className="grid max-w-5xl gap-5 md:grid-cols-2">
            {[
              {
                q: "What's your typical project timeline?",
                a: "Most website projects take 4-8 weeks from kickoff to launch, depending on complexity. We'll provide a detailed timeline during our initial consultation.",
              },
              {
                q: "Do you offer ongoing support?",
                a: "Yes! We offer various maintenance and support packages to keep your site running smoothly, secure, and up-to-date.",
              },
              {
                q: "What technologies do you use?",
                a: "We work with modern technologies including React, Next.js, WordPress, Shopify, and custom solutions tailored to your needs.",
              },
              {
                q: "How do you handle project communication?",
                a: "We use Slack for real-time communication, weekly video calls for updates, and project management tools to keep everything organized.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-soft">
                <h4 className="font-bold">{faq.q}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    </>
  );
};

export default Contact;
