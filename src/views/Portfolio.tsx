"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { projects } from "@/data/projects";
import portfolioHero from "@/assets/hero-bg.jpg";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Business", "Education", "Non-Profit", "Creative"];

  const matchesFilter = (industry: string) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Business") return /commercial|business|entertainment|catering/i.test(industry);
    if (activeFilter === "Education") return /education|school/i.test(industry);
    if (activeFilter === "Non-Profit") return /non-profit|association|peacebuilding|civic/i.test(industry);
    return /creative|entertainment|portfolio/i.test(industry);
  };

  const visibleProjects = projects.filter((project) => matchesFilter(project.industry));

  return (
    <>
      <SEOHead
        title="Portfolio & Case Studies"
        description="Explore websites and digital platforms designed and developed by Kreative Creations."
        url="/portfolio"
      />
      <main className="overflow-hidden">
        <section className="relative isolate min-h-[218px] overflow-hidden bg-slate-dark text-primary-foreground md:min-h-[240px]">
          <img
            src={portfolioHero.src}
            alt="Creative team working on digital projects"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-dark/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-dark via-slate-dark/55 to-slate-dark/10" />
          <div className="container-tight relative flex min-h-[218px] items-center py-10 md:min-h-[240px] md:py-12">
            <div className="max-w-3xl">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-coral" />
                <span className="text-coral text-sm font-semibold uppercase tracking-[0.22em]">Our Portfolio</span>
              </div>
              <h1 className="text-5xl font-bold leading-[0.98] md:text-7xl lg:text-8xl">
                Work that makes <span className="text-gradient">a difference.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-primary-foreground/75 md:text-xl">
                Websites and digital experiences designed around clear goals, strong identities and real human needs.
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-20 section-padding bg-background">
          <div className="container-tight">
            <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="text-coral text-sm font-semibold uppercase tracking-wider">Selected Work</span>
                <h2 className="mt-3 text-3xl font-bold md:text-5xl">Projects by category</h2>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      activeFilter === filter
                        ? "border-slate-dark bg-slate-dark text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-coral/50 hover:text-coral"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {visibleProjects.length > 0 ? (
              <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, index) => (
                  <article
                    key={project.slug}
                    className="group"
                  >
                    <Link
                      href={`/case-study/${project.slug}`}
                      className="relative block overflow-hidden border-[3px] border-slate-dark bg-secondary"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-slate-dark/0 transition-colors duration-300 group-hover:bg-slate-dark/25" />
                      <div className="absolute right-4 top-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-medium transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                      <span className="absolute bottom-4 left-4 rounded-full bg-slate-dark/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                    <div className="pt-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-coral text-xs font-semibold uppercase tracking-wider">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{project.timeline}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-bold md:text-2xl">{project.title}</h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                      <Link
                        href={`/case-study/${project.slug}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-coral"
                      >
                        View project
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border py-16 text-center">
                <Grid2X2 className="mx-auto h-8 w-8 text-coral" />
                <p className="mt-4 text-muted-foreground">No projects match this category.</p>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border bg-secondary">
          <div className="container-tight grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="text-coral text-sm font-semibold uppercase tracking-wider">Start a project</span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Let us build your next digital experience.</h2>
            </div>
            <Button variant="dark" size="xl" asChild>
              <Link href="/contact">
                Reach Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Portfolio;
