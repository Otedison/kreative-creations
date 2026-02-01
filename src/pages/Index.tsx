import { Link } from "react-router-dom";
import { ArrowRight, Code, Palette, Rocket, Search, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroBg from "@/assets/hero-bg.jpg";
import DecorativeShapes from "@/components/DecorativeShapes";
import PartnersCarousel from "@/components/PartnersCarousel";
const services = [
  {
    icon: Code,
    title: "Website Development",
    description: "Custom-built websites with clean code, blazing speed, and pixel-perfect design.",
    featured: true,
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered interfaces that look stunning and convert visitors into customers.",
  },
  {
    icon: Rocket,
    title: "E-commerce Solutions",
    description: "Scalable online stores built on Shopify, WooCommerce, or custom platforms.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Data-driven strategies to rank higher and drive organic traffic.",
  },
  {
    icon: BarChart3,
    title: "Brand Strategy",
    description: "Compelling brand identities that resonate with your target audience.",
  },
  {
    icon: Sparkles,
    title: "Content Marketing",
    description: "Strategic content that tells your story and builds lasting connections.",
  },
];

import { projects } from "@/data/projects";

const featuredProjects = projects.slice(0, 6).map(p => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  image: p.image,
  result: p.results[0],
}));

const testimonials = [
  {
    quote: "Kreative Creations transformed our outdated website into a modern, high-performing digital asset. Our leads have tripled since launch.",
    author: "Sarah Chen",
    role: "CEO, TechFlow",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote: "The attention to detail and strategic thinking they bring to every project is unmatched. True digital partners.",
    author: "Michael Roberts",
    role: "Founder, Luxe Fashion",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
];

const clientLogos = [
  "TechFlow", "Luxe", "Artisan", "FinPro", "Nexus", "Bloom"
];

const Index = () => {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-slate-dark/80" />
        </div>
        
        <div className="relative z-10 container-tight text-center text-primary-foreground pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-up">
              <Sparkles className="w-4 h-4 text-coral" />
              <span className="text-sm font-medium">Digital Marketing Agency</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-up animation-delay-100">
              Where Code Meets <span className="text-gradient">Strategy</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-200">
              We build websites that drive results. From pixel-perfect design to data-driven marketing, we craft digital experiences that convert visitors into loyal customers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-coral rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Partners Carousel */}
      <section className="py-12 bg-secondary border-y border-border">
        <div className="container-tight">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by innovative brands</p>
          <PartnersCarousel />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="relative section-padding bg-background overflow-hidden">
        <DecorativeShapes variant="section" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                Seamless Integration of <span className="text-gradient">Development & Marketing</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We don't just build websites—we build strategic digital foundations. Our unique approach combines technical excellence with marketing expertise, ensuring every line of code serves your business goals.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom development tailored to your needs",
                  "Conversion-focused design principles",
                  "SEO built into the foundation",
                  "Ongoing support and optimization",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-coral" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-coral opacity-10 blur-3xl rounded-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl p-6 shadow-soft hover-lift">
                    <span className="text-4xl font-bold text-gradient">150+</span>
                    <p className="text-muted-foreground mt-2">Projects Delivered</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-soft hover-lift">
                    <span className="text-4xl font-bold text-gradient">98%</span>
                    <p className="text-muted-foreground mt-2">Client Satisfaction</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-card rounded-2xl p-6 shadow-soft hover-lift">
                    <span className="text-4xl font-bold text-gradient">5+</span>
                    <p className="text-muted-foreground mt-2">Years Experience</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-soft hover-lift">
                    <span className="text-4xl font-bold text-gradient">24/7</span>
                    <p className="text-muted-foreground mt-2">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-secondary">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              Full-Service <span className="text-gradient">Digital Solutions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              From initial concept to ongoing optimization, we handle every aspect of your digital presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`group bg-card rounded-2xl p-8 shadow-soft hover-lift cursor-pointer ${
                  service.featured ? "lg:col-span-1 ring-2 ring-coral/20" : ""
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  service.featured 
                    ? "bg-gradient-coral text-accent-foreground" 
                    : "bg-secondary group-hover:bg-coral group-hover:text-accent-foreground"
                }`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                {service.featured && (
                  <span className="inline-block mt-4 text-coral text-sm font-semibold">Primary Service →</span>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="dark" size="lg" asChild>
              <Link to="/services">
                Explore All Services
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="relative section-padding bg-background overflow-hidden">
        <DecorativeShapes variant="dots" />
        <div className="container-tight relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Work</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4">
                Featured <span className="text-gradient">Projects</span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/portfolio">View All Projects</Link>
              </Button>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredProjects.map((project) => (
                <CarouselItem key={project.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link
                    to={`/case-study/${project.slug}`}
                    className="group relative overflow-hidden rounded-2xl aspect-[4/3] block hover-lift"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-dark via-slate-dark/50 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-coral text-sm font-medium">{project.category}</span>
                      <h3 className="text-xl font-bold text-primary-foreground mt-2">{project.title}</h3>
                      <p className="text-primary-foreground/80 text-sm mt-1">{project.result}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-coral hover:text-accent-foreground hover:border-coral" />
            <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-coral hover:text-accent-foreground hover:border-coral" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative section-padding bg-slate-dark text-primary-foreground overflow-hidden">
        <DecorativeShapes variant="circles" />
        <div className="container-tight relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.author}
                className="glass-dark rounded-2xl p-8"
              >
                <p className="text-lg text-primary-foreground/90 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-primary-foreground/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 lg:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Build Your Digital Home?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Let's discuss your project and create something amazing together. Get a free website audit and consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contact">
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/contact">Schedule a Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
