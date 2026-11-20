import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Search, BarChart3, Link2, FileText, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const services = [
  { icon: Search, number: "01", title: "Keyword Research", text: "We identify the exact searches your customers use, compare search intent and map priority phrases to suitable pages instead of targeting isolated words.", tags: ["Search intent", "Competitor gaps", "Content opportunities"] },
  { icon: Gauge, number: "02", title: "Technical SEO", text: "We improve crawlability, indexation, page speed, mobile usability, duplicate URLs and structured data so search engines can understand and trust the site.", tags: ["Core Web Vitals", "Sitemap & robots", "Schema markup"] },
  { icon: FileText, number: "03", title: "On-Page Optimization", text: "We improve titles, headings, internal links, page copy and image text around real topics. The goal is useful content that answers questions and guides users clearly.", tags: ["Title & metadata", "Page structure", "Internal linking"] },
  { icon: MapPin, number: "04", title: "Google Business Profile", text: "We optimize categories, services, locations, descriptions, photos and review activity, then keep business information consistent across the web.", tags: ["Local ranking", "Reviews", "Maps visibility"] },
  { icon: Link2, number: "05", title: "Authority & Local Links", text: "We build a credible link and citation profile through relevant directories, publications, local organizations and high-quality industry mentions.", tags: ["Local citations", "Quality backlinks", "Brand mentions"] },
  { icon: BarChart3, number: "06", title: "Reporting & Improvement", text: "We track impressions, clicks, calls, enquiries and rankings. Regular reviews show what changed, what is growing and what work should come next.", tags: ["Google Search Console", "Analytics", "Clear actions"] },
];

const phases = [
  ["1", "Audit", "Baseline crawl, analytics, rankings, competitors and conversion actions."],
  ["2", "Plan", "Choose keyword opportunities, content priorities and technical fixes."],
  ["3", "Implement", "Optimize pages, Google Business, structure and supporting content."],
  ["4", "Measure", "Review results and improve pages that show demand or weak engagement."],
];

export default function SeoGooglePage() {
  return (
    <>
      <SEOHead
        title="SEO, Google Search & Google Business | Kreative Creations"
        description="Practical SEO, keyword research, technical optimization, Google Business profile and local search services."
        url="/services/seo-google"
      />
      <main className="overflow-hidden">
        <section className="relative bg-slate-dark text-primary-foreground py-16 md:py-20 lg:py-24">
          <div className="container-tight">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <span className="text-coral text-sm font-semibold uppercase tracking-wider">Search & Local Visibility</span>
                <h1 className="mt-4 text-4xl font-bold md:text-6xl">Turn search demand into <span className="text-gradient">qualified enquiries</span></h1>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-primary-foreground/80">
                  SEO is a practical system: find the right searches, improve the pages people land on, strengthen your local presence and measure what leads to business.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/60">Search visibility foundation</span>
                  <Search className="h-5 w-5 text-coral" />
                </div>
                {["Search demand", "Google Business", "Technical health", "Relevant content"].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 border-t border-white/10 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/15 text-xs font-bold text-coral">0{index + 1}</span>
                    <span className="font-semibold">{item}</span>
                    <CheckCircle2 className="ml-auto h-5 w-5 text-coral" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="mb-12 max-w-3xl">
              <span className="text-coral text-sm font-semibold uppercase tracking-wider">What We Work On</span>
              <h2 className="mt-4 text-3xl font-bold md:text-5xl">A complete SEO programme, not isolated tactics</h2>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {services.map((service) => (
                <article key={service.title} className="grid gap-6 py-9 md:grid-cols-[70px_0.55fr_1fr] md:items-start">
                  <span className="text-3xl font-bold text-coral/25">{service.number}</span>
                  <div>
                    <service.icon className="mb-4 h-7 w-7 text-coral" />
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                  <div>
                    <p className="leading-relaxed text-muted-foreground">{service.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary">
          <div className="container-tight">
            <div className="mb-10 text-center">
              <span className="text-coral text-sm font-semibold uppercase tracking-wider">How It Works</span>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Four steps from visibility to growth</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
              {phases.map(([number, title, text]) => (
                <div key={title} className="bg-card p-7">
                  <span className="text-sm font-bold text-coral">{number}</span>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button variant="coral" size="xl" asChild>
                <Link href="/contact">Request an SEO Review <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
