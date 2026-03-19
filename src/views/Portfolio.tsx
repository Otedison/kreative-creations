"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import DecorativeShapes from "@/components/DecorativeShapes";
import SEOHead from "@/components/SEOHead";

const Portfolio = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 6);

  return (
    <>
      <SEOHead
        title="Portfolio & Case Studies"
        description="Explore our portfolio of successful website development and digital marketing projects. See how we've helped businesses in Nairobi and across Kenya transform their digital presence."
        url="/portfolio"
      />
      <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative section-padding bg-slate-dark text-primary-foreground overflow-hidden">
        <DecorativeShapes variant="hero" />
        <div className="container-tight relative z-10">
          <div className="max-w-3xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Work</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Case Studies & <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Explore our latest projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative section-padding bg-background overflow-hidden">
        <DecorativeShapes variant="dots" />
        <div className="container-tight relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <div
                key={project.slug}
                className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:border-coral/50 transition-colors"
              >
                <Link href={`/case-study/${project.slug}`}>
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold flex items-center gap-2">
                        View Case Study <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <span className="text-coral text-sm font-medium">{project.category}</span>
                  <h3 className="text-xl font-bold mt-1">{project.title}</h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/case-study/${project.slug}`}>
                      View Project
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* See More Button */}
          {projects.length > 6 && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="min-w-[180px]"
              >
                {showAllProjects ? (
                  <>
                    See Less
                    <ChevronUp className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    See More
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding bg-secondary overflow-hidden">
        <DecorativeShapes variant="section" />
        <div className="container-tight text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's create something amazing together. Get in touch to discuss your vision.
          </p>
          <Button variant="dark" size="xl" asChild>
            <Link href="/contact">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild className="border-coral text-coral hover:bg-coral hover:text-accent-foreground">
            <Link href="/donate">
              <Heart className="w-5 h-5 mr-1" />
              Donate
            </Link>
          </Button>
        </div>
      </section>
    </main>
    </>
  );
};

export default Portfolio;
