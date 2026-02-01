import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Briefcase, Layers, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, projects } from "@/data/projects";
import DecorativeShapes from "@/components/DecorativeShapes";

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-dark via-slate-dark/70 to-transparent" />
        </div>
        <DecorativeShapes variant="hero" />
        
        <div className="relative z-10 container-tight pb-16">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          
          <span className="text-coral font-semibold text-sm uppercase tracking-wider">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-2 mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            {project.description}
          </p>
        </div>
      </section>

      {/* Project Info Bar */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container-tight">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-semibold">{project.timeline}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-semibold">{project.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Services</p>
                <p className="font-semibold">{project.services.join(", ")}</p>
              </div>
            </div>
            {project.projectUrl && (
              <div className="col-span-2 md:col-span-4 flex items-center gap-3 mt-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View Live Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="relative section-padding bg-background">
        <DecorativeShapes variant="dots" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/10 text-coral text-sm font-medium mb-4">
                The Challenge
              </div>
              <h2 className="text-3xl font-bold mb-6">What They Were Facing</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green/10 text-green text-sm font-medium mb-4">
                Our Solution
              </div>
              <h2 className="text-3xl font-bold mb-6">How We Solved It</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="relative section-padding bg-slate-dark text-primary-foreground overflow-hidden">
        <DecorativeShapes variant="circles" />
        <div className="container-tight relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">
              The Results
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Measurable Impact
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.results.map((result, i) => (
              <div
                key={i}
                className="glass-dark rounded-2xl p-6 text-center hover-lift"
              >
                <CheckCircle2 className="w-8 h-8 text-green mx-auto mb-4" />
                <p className="text-lg font-semibold">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative section-padding bg-secondary overflow-hidden">
        <DecorativeShapes variant="section" />
        <div className="container-tight relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">
              Project Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Visual Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {project.gallery.map((image, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden hover-lift"
              >
                <img
                  src={image}
                  alt={`${project.title} gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {project.testimonial && (
        <section className="relative section-padding bg-gradient-hero text-primary-foreground overflow-hidden">
          <DecorativeShapes variant="hero" />
          <div className="container-tight relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <svg
                className="w-12 h-12 text-coral mx-auto mb-8 opacity-50"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
              </svg>
              <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                "{project.testimonial.quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={project.testimonial.avatar}
                  alt={project.testimonial.author}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold">{project.testimonial.author}</p>
                  <p className="text-primary-foreground/60">
                    {project.testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container-tight">
          <div className="flex justify-between items-center">
            {prevProject ? (
              <Link
                to={`/case-study/${prevProject.slug}`}
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <p className="text-sm">Previous</p>
                  <p className="font-semibold text-foreground">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                to={`/case-study/${nextProject.slug}`}
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-right"
              >
                <div>
                  <p className="text-sm">Next</p>
                  <p className="font-semibold text-foreground">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding bg-secondary overflow-hidden">
        <DecorativeShapes variant="section" />
        <div className="container-tight text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want Similar Results?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's discuss how we can help transform your digital presence and
            achieve your business goals.
          </p>
          <Button variant="coral" size="xl" asChild>
            <Link to="/contact">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default CaseStudy;
