import Link from "next/link";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export type ServiceDetailProps = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  image: string;
  url: string;
  benefits: string[];
  deliverables: { icon: LucideIcon; title: string; description: string }[];
  process: { title: string; description: string }[];
};

const ServiceDetail = ({
  eyebrow,
  title,
  highlightedTitle,
  description,
  image,
  url,
  benefits,
  deliverables,
  process,
}: ServiceDetailProps) => {
  return (
    <>
      <SEOHead title={`${title} | Kreative Creations`} description={description} url={url} />
      <main className="overflow-hidden">
        <section className="relative bg-slate-dark text-primary-foreground py-16 md:py-20 lg:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <img src={image} alt="" className="h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-dark via-slate-dark/95 to-slate-dark/70" />
          </div>
          <div className="container-tight relative">
            <div className="max-w-3xl">
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">{eyebrow}</span>
              <h1 className="mt-4 mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
                {title} <span className="text-gradient">{highlightedTitle}</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">{description}</p>
              <Button variant="hero" size="xl" asChild className="mt-8">
                <Link href="/contact">
                  Discuss Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-medium">
                  <img src={image} alt={title} className="h-full w-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-3xl bg-coral/10 md:block" />
              </div>
              <div>
                <span className="text-coral font-semibold text-sm uppercase tracking-wider">Why It Matters</span>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold">Built to create measurable impact</h2>
                <ul className="mt-8 space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-coral" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary">
          <div className="container-tight">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">What We Deliver</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">A complete, practical solution</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {deliverables.map((item) => (
                <article key={item.title} className="rounded-2xl border border-border bg-card p-8 shadow-soft hover-lift">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-coral">
                    <item.icon className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="mb-12 text-center">
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Approach</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">Simple process. Clear progress.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {process.map((step, index) => (
                <div key={step.title} className="relative rounded-2xl border border-border p-7">
                  <span className="mb-5 block text-5xl font-bold text-coral/20">0{index + 1}</span>
                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-dark text-primary-foreground">
          <div className="container-tight text-center">
            <h2 className="mb-5 text-3xl md:text-4xl font-bold">Ready to move your business forward?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
              Tell us what you need and let our team build the right solution for your goals.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default ServiceDetail;
