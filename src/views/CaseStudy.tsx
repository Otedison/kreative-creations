"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Briefcase, Layers, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, projects } from "@/data/projects";
import SEOHead from "@/components/SEOHead";
import caseStudyHero from "@/assets/hero-bg.jpg";

const CaseStudy = () => {
  const params = useParams();
  const router = useRouter();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : undefined;
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    if (!project) router.replace("/portfolio");
  }, [project, router]);

  if (!project) return null;

  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <>
      <SEOHead
        title={`${project.title} - Case Study | Kreative Creations`}
        description={project.description}
        url={`/case-study/${project.slug}`}
        image={project.image}
        type="article"
      />
      <main className="overflow-hidden">
        <section className="relative isolate min-h-[465px] overflow-hidden bg-slate-dark text-primary-foreground md:min-h-[465px]">
          <img
            src={caseStudyHero.src}
            alt="Creative digital project workspace"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-dark via-slate-dark/75 to-slate-dark/20" />
          <div className="container-tight relative flex min-h-[465px] items-center">
            <div className="max-w-3xl py-12">
              <Link
                href="/portfolio"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-coral"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to portfolio
              </Link>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-coral" />
                <span className="text-coral text-sm font-semibold uppercase tracking-[0.2em]">
                  {project.category}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-[1.02] md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/75">
                {project.description}
              </p>
              {project.projectUrl && (
                <Button variant="hero" size="xl" asChild className="mt-7">
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    Visit live website
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="relative z-10 bg-background">
          <div className="container-tight">
            <div className="-mt-8 grid overflow-hidden border border-border bg-card shadow-medium md:grid-cols-3">
              <div className="flex items-center gap-4 px-6 py-5 md:border-r md:border-border">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-coral/10 text-coral">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Timeline</p>
                  <p className="mt-1 font-bold">{project.timeline}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-border px-6 py-5 md:border-r md:border-t-0 md:border-border">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-slate-dark/10 text-slate-dark">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Industry</p>
                  <p className="mt-1 font-bold">{project.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-border px-6 py-5 md:border-t-0">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-coral/10 text-coral">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Speciality</p>
                  <p className="mt-1 line-clamp-2 text-sm font-bold">{project.category}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <p className="text-coral text-sm font-semibold uppercase tracking-[0.18em]">The brief</p>
                <h2 className="mt-4 text-3xl font-bold md:text-5xl">Understanding the challenge</h2>
              </div>
              <div className="border-l-2 border-coral pl-7 md:pl-10">
                <p className="text-xl leading-[1.75] text-muted-foreground md:text-2xl">{project.challenge}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16 md:py-24">
          <div className="container-tight grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="border-[3px] border-slate-dark bg-card">
              <img
                src={project.image}
                alt={`${project.title} website`}
                className="aspect-[16/10] h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-coral text-sm font-semibold uppercase tracking-[0.18em]">Our approach</p>
              <h2 className="mt-4 text-3xl font-bold md:text-5xl">A solution made for the audience</h2>
              <p className="mt-6 text-lg leading-[1.85] text-muted-foreground">{project.solution}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.services.map((service) => (
                  <span key={service} className="border border-border bg-card px-3 py-2 text-xs font-semibold">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-coral text-sm font-semibold uppercase tracking-[0.18em]">What changed</p>
                <h2 className="mt-4 text-3xl font-bold md:text-5xl">Project outcomes</h2>
              </div>
              <p className="max-w-md text-muted-foreground">
                Improvements delivered around usability, visibility and the next customer action.
              </p>
            </div>
            <div className="grid border-l border-t border-border md:grid-cols-2">
              {project.results.map((result, index) => (
                <div key={result} className="flex min-h-[180px] gap-5 border-b border-r border-border p-7 md:p-9">
                  <span className="text-4xl font-bold text-coral/25">0{index + 1}</span>
                  <div>
                    <CheckCircle2 className="mb-5 h-6 w-6 text-coral" />
                    <p className="text-lg font-semibold leading-relaxed">{result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {project.gallery.length > 0 && (
          <section className="section-padding bg-slate-dark text-primary-foreground">
            <div className="container-tight">
              <div className="mb-10">
                <p className="text-coral text-sm font-semibold uppercase tracking-[0.18em]">Visual details</p>
                <h2 className="mt-4 text-3xl font-bold md:text-5xl">The project in focus</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-12">
                {project.gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`overflow-hidden border-[3px] border-slate-dark bg-card ${
                      index === 0 ? "md:col-span-7" : "md:col-span-5"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${project.title} view ${index + 1}`}
                      className="aspect-[16/10] h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.testimonial && (
          <section className="section-padding bg-card">
            <div className="container-tight">
              <div className="mx-auto max-w-4xl text-center">
                <span className="text-coral text-sm font-semibold uppercase tracking-[0.18em]">Client perspective</span>
                <blockquote className="mt-6 text-2xl font-medium leading-relaxed md:text-4xl">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-8">
                  <p className="font-bold">{project.testimonial.author}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{project.testimonial.role}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border bg-background">
          <div className="container-tight grid md:grid-cols-2">
            {previousProject ? (
              <Link
                href={`/case-study/${previousProject.slug}`}
                className="group flex items-center gap-5 border-b border-border py-9 md:border-b-0 md:border-r md:pr-8"
              >
                <ArrowLeft className="h-5 w-5 text-coral transition-transform group-hover:-translate-x-1" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Previous project</span>
                  <p className="mt-1 font-bold">{previousProject.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link
                href={`/case-study/${nextProject.slug}`}
                className="group flex items-center justify-end gap-5 py-9 text-right md:pl-8"
              >
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Next project</span>
                  <p className="mt-1 font-bold">{nextProject.title}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-coral transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>

        <section className="section-padding bg-secondary">
          <div className="container-tight text-center">
            <p className="text-coral text-sm font-semibold uppercase tracking-[0.18em]">Plan your website</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold md:text-5xl">Let&apos;s turn your goals into a better digital experience.</h2>
            <Button variant="dark" size="xl" asChild className="mt-8">
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

export default CaseStudy;
