"use client";

import Link from "next/link";
import { ArrowRight, Code, Palette, Rocket, Search, BarChart3, Sparkles, CheckCircle2, Lightbulb, PenTool, Layers, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const primaryServices = [
  {
    icon: Code,
    title: "Custom Website Development",
    description: "Bespoke websites built from the ground up with clean, maintainable code. We craft responsive, performant sites that scale with your business.",
    features: [
      "Responsive Design for All Devices",
      "Frontend & Backend Development",
      "CMS Integration (WordPress, Custom)",
      "Performance Optimization",
      "Website Maintenance & Support",
    ],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  },
  {
    icon: Rocket,
    title: "E-commerce Solutions",
    description: "Powerful online stores that convert browsers into buyers. From simple shops to enterprise platforms.",
    features: [
      "Shopify & WooCommerce Development",
      "Custom E-commerce Platforms",
      "Payment Gateway Integration",
      "Inventory Management Systems",
      "Conversion Rate Optimization",
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that balances aesthetics with functionality. Every interaction is crafted to delight.",
    features: [
      "User Research & Personas",
      "Wireframing & Prototyping",
      "Visual Design & Branding",
      "Usability Testing",
      "Design System Creation",
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  },
];

const supportingServices = [
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Data-driven strategies to boost your search rankings and drive organic traffic.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    icon: BarChart3,
    title: "Brand Strategy",
    description: "Compelling brand identities that resonate with your target audience.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Content Marketing",
    description: "Strategic content that tells your story and builds lasting connections.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80",
  },
];

const processSteps = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Discover",
    description: "We dive deep into understanding your business, goals, and target audience.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Strategy",
    description: "We develop a comprehensive plan that aligns with your objectives.",
  },
  {
    icon: Palette,
    step: "03",
    title: "Design",
    description: "We create stunning visuals and intuitive user experiences.",
  },
  {
    icon: Code,
    step: "04",
    title: "Develop",
    description: "We build with clean, performant code using modern technologies.",
  },
  {
    icon: Zap,
    step: "05",
    title: "Launch & Grow",
    description: "We deploy, monitor, and continuously optimize for success.",
  },
];

const Services = () => {
  return (
    <>
      <SEOHead
        title="Professional Web Development & Digital Marketing Services"
        description="Kreative Creations offers professional web development, e-commerce solutions, UI/UX design, SEO optimization, and digital marketing services in Nairobi, Kenya."
        url="/services"
      />
      <main className="overflow-hidden">
      {/* Hero */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Full-Service <span className="text-gradient">Digital Solutions</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              From website development to digital marketing, we provide end-to-end solutions that help your business thrive online.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Services */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Core Offerings</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Website Development & Design
            </h2>
          </div>

          <div className="space-y-12">
            {primaryServices.map((service, i) => (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-coral flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-coral flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-soft">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-coral/20 to-secondary/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Services */}
      <section className="section-padding bg-secondary">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Powered by Your Foundation</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Marketing & Growth Services
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              Complement your website with our full suite of digital marketing services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {supportingServices.map((service) => (
              <div
                key={service.title}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover-lift group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              How We Work
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              A proven methodology that delivers results every time.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="text-center">
                  <span className="text-6xl font-bold text-secondary">{step.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-coral flex items-center justify-center mx-auto -mt-4 mb-4">
                    <step.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <div className="h-0.5 bg-border w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Let's discuss how we can help transform your digital presence.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link href="/contact">
              Get Started
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

export default Services;
