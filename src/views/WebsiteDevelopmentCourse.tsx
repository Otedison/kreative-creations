"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Code2, Globe2, LayoutTemplate, MonitorSmartphone, Search, UploadCloud, Users, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SEOHead from "@/components/SEOHead";
import africaMap from "@/images/section images/africakrc.webp";
import { enrollmentFormAction, googleSheetsWebhookUrl, submitToGoogleSheets } from "@/lib/formEndpoints";

const modules = [
  ["01", "WordPress foundations", "Set up WordPress, understand the dashboard, and configure a professional website."],
  ["02", "Design that works", "Choose themes, create page layouts, and build a polished experience for every screen size."],
  ["03", "Content & functionality", "Create pages, menus, forms, blogs, and galleries using the right WordPress tools."],
  ["04", "Launch with confidence", "Improve speed, secure your site, connect a domain, and publish your work online."],
];

const outcomes = [
  "Build and manage a complete WordPress website", "Create responsive pages without writing code", "Use essential plugins safely and effectively", "Launch a website with a custom domain and professional polish",
];

const tools = [
  { name: "Elementor Page Builder", description: "Design beautiful, responsive pages with an intuitive visual editor.", icon: LayoutTemplate },
  { name: "Local by Flywheel", description: "Build and test WordPress sites locally before they go live.", icon: MonitorSmartphone },
  { name: "Basic SEO", description: "Set up the essentials that help people discover your website on search engines.", icon: Search },
  { name: "Themes", description: "Choose, install, and customise themes to match your brand and purpose.", icon: Wand2 },
  { name: "All-in-One WP Migration", description: "Safely move, back up, and restore WordPress websites.", icon: UploadCloud },
  { name: "Live site publication", description: "Connect your domain and publish your finished site for the world to see.", icon: Globe2 },
];

function EnrollmentButton({ className }: { className?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextUrl = useMemo(
    () => typeof window === "undefined" ? "/courses/website-development?enrolled=true" : `${window.location.origin}/courses/website-development?enrolled=true`,
    [],
  );

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="coral" size="lg" className={className}>Enrol Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Enrol in the Web Design Course</DialogTitle>
          <DialogDescription>Complete the form below and our training team will contact you to confirm your place.</DialogDescription>
        </DialogHeader>
        <form action={enrollmentFormAction} method="POST" onSubmit={handleSubmit} className="space-y-5 pt-2">
          <input type="hidden" name="formType" value="enrollment" />
          <input type="hidden" name="_subject" value="New Web Design Course Enrollment" />
          <input type="hidden" name="_next" value={nextUrl} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="course" value="WordPress Website Development / Web Design Course" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="enrol-name" className="mb-2 block text-sm font-medium">Full name *</label><Input id="enrol-name" name="name" required placeholder="Your full name" /></div>
            <div><label htmlFor="enrol-email" className="mb-2 block text-sm font-medium">Email address *</label><Input id="enrol-email" name="email" type="email" required placeholder="you@example.com" /></div>
            <div><label htmlFor="enrol-phone" className="mb-2 block text-sm font-medium">Phone number *</label><Input id="enrol-phone" name="phone" type="tel" required placeholder="+254 7XX XXX XXX" /></div>
          </div>
          <div><label htmlFor="enrol-message" className="mb-2 block text-sm font-medium">Anything we should know?</label><Textarea id="enrol-message" name="message" rows={3} placeholder="Tell us about your goals or ask a question." /></div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground"><input name="consent" required type="checkbox" className="mt-1 h-4 w-4 rounded border-input accent-accent" />I agree to be contacted about this course enrolment.</label>
          <Button type="submit" variant="coral" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Submit enrolment"} <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function WebsiteDevelopmentCourse() {
  return (
    <>
      <SEOHead title="WordPress Website Development Training" description="Hands-on WordPress website development training from Kreative Creations." />
      <main>
        <section className="relative overflow-hidden bg-slate-dark py-16 text-white md:py-20 lg:py-24">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
          <div className="container-tight relative grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-green-300"><Code2 className="h-4 w-4" /> Website Development Course</span>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Build websites that bring ideas to life with <span className="text-green-400">WordPress.</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">A practical, beginner-friendly training that takes you from a blank screen to a live, professional website — no coding experience required.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <EnrollmentButton />
                <a href="#curriculum" className="inline-flex items-center rounded-md border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10">Explore the curriculum</a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm shadow-2xl md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white"><LayoutTemplate className="h-6 w-6" /></div>
              <h2 className="mt-6 text-2xl font-bold">Learn by building</h2>
              <p className="mt-3 text-slate-300">Work through real-world exercises and leave with a website you can proudly share.</p>
              <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
                <div><Clock3 className="mb-2 h-5 w-5 text-green-400" /><strong className="block">Hands-on</strong><span className="text-slate-400">Practical lessons</span></div>
                <div><Users className="mb-2 h-5 w-5 text-green-400" /><strong className="block">Beginner-friendly</strong><span className="text-slate-400">Clear guidance</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-tight grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="text-coral text-sm font-semibold uppercase tracking-wider">What you will learn</span>
              <h2 className="mt-3 text-3xl md:text-4xl">Everything you need to create a capable WordPress site.</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">We keep the learning practical and focused. Each lesson gives you the knowledge and the confidence to make your own decisions long after the training ends.</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {outcomes.map((outcome) => <li key={outcome} className="flex gap-3 rounded-xl border bg-card p-5 shadow-soft"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><span className="font-medium">{outcome}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="bg-slate-dark py-20 text-white md:py-24">
          <div className="container-tight">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-green-400">Industry-ready toolkit</span>
              <h2 className="mt-3 text-3xl md:text-4xl">The tools you will master.</h2>
              <p className="mt-4 leading-relaxed text-slate-300">Train with the professional tools working WordPress developers use to create, manage, and publish websites.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map(({ name, description, icon: Icon }) => (
                <article key={name} className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                  <Icon className="h-6 w-6 text-green-400" />
                  <h3 className="mt-5 text-lg">{name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-tight grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-3xl shadow-medium">
              <img
                src={africaMap.src}
                alt="Map of Africa representing technology trusted across the continent"
                className="h-full min-h-[320px] w-full object-contain"
              />
            </div>
            <div>
              <span className="text-coral text-sm font-semibold uppercase tracking-wider">Built for the modern web</span>
              <h2 className="mt-3 text-3xl md:text-4xl">Built on Technology Trusted Worldwide</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground"><strong>WordPress powers over 40% of all websites worldwide</strong>, making it one of the most widely used website platforms on the internet. With its flexibility, scalability, security, and extensive range of features, WordPress provides a reliable foundation for businesses of all sizes.</p>
              <p className="mt-5 leading-relaxed text-muted-foreground"><strong>Your business deserves a website built on technology trusted by millions.</strong></p>
            </div>
          </div>
        </section>

        <section id="curriculum" className="bg-secondary section-padding">
          <div className="container-tight">
            <div className="max-w-2xl"><span className="text-coral text-sm font-semibold uppercase tracking-wider">Course curriculum</span><h2 className="mt-3 text-3xl md:text-4xl">A simple path from first click to final launch.</h2></div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {modules.map(([number, title, description]) => <article key={number} className="rounded-2xl border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"><span className="text-4xl font-extrabold text-accent/25">{number}</span><h3 className="mt-5 text-xl">{title}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-tight rounded-3xl bg-gradient-to-br from-slate-dark to-slate-medium px-6 py-12 text-center text-white md:px-12 md:py-16">
            <Globe2 className="mx-auto h-9 w-9 text-green-400" />
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl md:text-4xl">Ready to start building for the web?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">Tell us about your learning goals and we’ll help you take the first step into WordPress website development.</p>
            <div className="mx-auto mt-9 grid max-w-4xl divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              <div className="p-5"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Course fee</span><strong className="mt-2 block text-xl">KSh 20,000/-</strong><span className="mt-1 block text-sm text-green-300">Two installments</span></div>
              <div className="p-5"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Duration</span><strong className="mt-2 block text-xl">2 Months</strong><span className="mt-1 block text-sm text-green-300">Virtual training</span></div>
              <div className="p-5"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Slots</span><strong className="mt-2 block text-xl">20</strong><span className="mt-1 block text-sm text-green-300">Limited</span></div>
              <div className="p-5"><span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Start date</span><strong className="mt-2 block text-xl">October 1st</strong><span className="mt-1 block text-sm text-green-300">2026</span></div>
            </div>
            <EnrollmentButton className="mt-8" />
          </div>
        </section>
      </main>
    </>
  );
}
