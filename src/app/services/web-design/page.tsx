import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { projects } from "@/data/projects";
import heroDesignImage from "@/assets/hero-bg.jpg";

export default function WebDesignPage() {
  const featuredProjects = projects
    .filter((project) =>
      [
        "bonga-na-jacinta-wellness",
        "corporate-mc",
        "jejo-foundation",
      ].includes(project.slug)
    )
    .sort((a, b) =>
      ["bonga-na-jacinta-wellness", "corporate-mc", "jejo-foundation"].indexOf(a.slug) -
      ["bonga-na-jacinta-wellness", "corporate-mc", "jejo-foundation"].indexOf(b.slug)
    );

  return (
    <>
      <SEOHead
        title="Professional Web Design | Kreative Creations"
        description="Professional corporate, e-commerce and creative website design built for Kenyan businesses."
        url="/services/web-design"
      />
      <main className="overflow-hidden">
        <section className="relative overflow-hidden bg-slate-dark text-primary-foreground">
          <img
            src={heroDesignImage.src}
            alt="Website design portfolio"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-dark via-slate-dark/90 to-slate-dark/20" />
          <div className="container-tight relative min-h-[420px] py-16 md:py-20 lg:py-24">
            <div className="flex min-h-[300px] max-w-3xl flex-col justify-center">
              <span className="text-coral text-sm font-semibold uppercase tracking-[0.2em]">Website Design</span>
              <h1 className="mt-5 mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
                Websites people <span className="text-gradient">want to use</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
                We turn a business goal into a clear digital experience - with focused messaging, intuitive navigation and design that works beautifully on every screen.
              </p>
              <Button variant="hero" size="xl" asChild className="mt-8">
                <Link href="/portfolio">View Full Portfolio <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="mb-16 flex flex-col justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="text-coral text-sm font-semibold uppercase tracking-wider">Selected Work</span>
                <h2 className="mt-4 text-3xl font-bold md:text-5xl">Three websites, three different goals</h2>
              </div>
              <p className="max-w-md text-muted-foreground">
                Built around the audience, content and decisions that matter to each organization.
              </p>
            </div>

            <div className="space-y-20 md:space-y-32">
              {featuredProjects.map((project, index) => (
                <article
                  key={project.slug}
                  className="grid items-center gap-9 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16"
                >
                  <Link
                    href={`/case-study/${project.slug}`}
                    className={`group relative block overflow-hidden rounded-[1.75rem] border border-border bg-secondary shadow-medium ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-slate-dark/0 transition-colors duration-300 group-hover:bg-slate-dark/20" />
                    <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-coral text-accent-foreground shadow-medium">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                  </Link>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <span className="text-6xl font-bold leading-none text-coral/20">0{index + 1}</span>
                    <span className="text-coral text-sm font-semibold uppercase tracking-wider">{project.category}</span>
                    <h3 className="mt-3 text-2xl font-bold md:text-4xl">{project.title}</h3>
                    <p className="mt-5 leading-relaxed text-muted-foreground">{project.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.services.slice(0, 4).map((service) => (
                        <span key={service} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold">
                          {service}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/case-study/${project.slug}`}
                      className="mt-7 inline-flex items-center gap-2 font-semibold text-coral transition-colors hover:text-coral/80"
                    >
                      View case study <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-dark text-primary-foreground">
          <div className="container-tight flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold md:text-4xl">Need a website for a specific business?</h2>
              <p className="mt-4 text-primary-foreground/70">We will recommend the structure, content and features based on your audience and goals.</p>
            </div>
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact">Plan Your Website <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
