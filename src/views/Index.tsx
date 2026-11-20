"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code, Palette, Rocket, Search, BarChart3, Sparkles, Clock, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import PartnersCarousel from "@/components/PartnersCarousel";
import { staticBlogPosts } from "@/data/blogs";
import SEOHead from "@/components/SEOHead";

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
  },
  {
    quote: "The attention to detail and strategic thinking they bring to every project is unmatched. True digital partners.",
    author: "Michael Roberts",
    role: "Founder, Luxe Fashion",
  },
];

// Get featured blogs from static data
const featuredBlogs = staticBlogPosts.slice(0, 3).map(blog => ({
  slug: blog.slug,
  title: blog.title,
  excerpt: blog.excerpt,
  category: blog.category,
  readTime: blog.read_time,
  author: blog.author,
  image: blog.image,
}));

const clientLogos = [
  "TechFlow", "Luxe", "Artisan", "FinPro", "Nexus", "Bloom"
];

const Index = () => {
  const [rotatingWord, setRotatingWord] = useState("feel alive");
  const [activePreview, setActivePreview] = useState<"design" | "build" | "ship">("design");

  useEffect(() => {
    const words = ["feel alive", "load fast", "convert", "get remembered"];
    let wordIndex = 0;
    const wordTimer = window.setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      setRotatingWord(words[wordIndex]);
    }, 2800);

    const previewTimer = window.setInterval(() => {
      setActivePreview((current) => current === "design" ? "build" : current === "build" ? "ship" : "design");
    }, 5000);

    return () => {
      window.clearInterval(wordTimer);
      window.clearInterval(previewTimer);
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Website Development & Digital Marketing Agency"
        description="Kreative Creations is a leading digital agency in Nairobi, Kenya specializing in website development, e-commerce solutions, UI/UX design, SEO optimization, and comprehensive digital marketing services."
        url="/"
      />
      <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative isolate min-h-screen overflow-hidden bg-[#d7f0e2] text-[#0a0a0b]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(168deg,#f5fdf9_0%,#e2f7ec_32%,#c3eed7_60%,#8fdab4_100%)]" />
          <div className="absolute -bottom-40 -right-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_bottom_right,#0a2a4a_0%,rgba(10,42,74,0.35)_35%,transparent_70%)] opacity-20" />
          <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_top_left,#0a2a4a_0%,rgba(10,42,74,0.25)_35%,transparent_70%)] opacity-10" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(10,10,11,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_25%,transparent_100%)]" />
        </div>

        <div className="container-tight relative z-10 flex min-h-screen items-center px-6 py-28 lg:px-8 lg:py-24">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="max-w-xl">
              <h1 className="text-[2.7rem] font-semibold leading-[0.96] tracking-[-0.035em] text-[#0a0a0b] sm:text-6xl lg:text-[4.35rem]">
                We build websites
                <br className="hidden sm:block" />
                {" "}that{" "}
                <span className="inline-block align-baseline">
                  <span
                    key={rotatingWord}
                    className="inline-block pr-1.5 font-serif text-[1.08em] italic leading-[0.9] tracking-[-0.01em] animate-[fade-up_0.75s_ease-out_both]"
                    style={{
                      backgroundImage: "linear-gradient(transparent 56%, #d4ff5c 56%, #d4ff5c 95%, transparent 95%)",
                    }}
                  >
                    {rotatingWord}
                  </span>
                </span>.
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#0a0a0b]/55 sm:text-[17px]">
                Strategy, design and engineering under one roof. We ship high-performance
                sites that look sharp, load instantly and turn visitors into customers -
                without the agency overhead.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="group h-auto rounded-full bg-[#0a0a0b] px-7 py-4 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(10,10,11,0.9)] hover:-translate-y-0.5 hover:bg-[#0a0a0b]"
                >
                  <Link href="/contact">
                    Start a project
                    <span className="ml-1 grid h-6 w-6 place-items-center rounded-full bg-[#d4ff5c] text-[#0a0a0b] transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.8} />
                    </span>
                  </Link>
                </Button>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-2 py-4 text-sm font-semibold text-[#0a0a0b]/75 underline decoration-[#0a0a0b]/30 underline-offset-8 transition-colors hover:text-[#0a0a0b]"
                >
                  See recent work
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[24px] bg-[linear-gradient(140deg,#34a878_0%,#1b6b4a_38%,#0a2a4a_100%)] p-[1.5px] shadow-[0_46px_90px_-42px_rgba(10,42,74,0.6)]">
                <div className="relative overflow-hidden rounded-[23px] bg-[#eafaf1]">
                  <div className="flex items-center gap-2 border-b border-[#0a0a0b]/10 bg-[#e3f6ea] px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <div className="mx-auto flex items-center gap-1.5 rounded-md bg-[#0a0a0b]/10 px-3 py-1 text-[11px] font-medium text-[#0a0a0b]/55">
                      <span className="h-3 w-3 rounded-sm border-2 border-current" />
                      kreativecreations.co.ke
                    </div>
                  </div>

                  <div role="tablist" aria-label="Project phases" className="flex gap-1.5 px-4 pt-4">
                    {(["design", "build", "ship"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={activePreview === tab}
                        onClick={() => setActivePreview(tab)}
                        className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold capitalize transition-all ${
                          activePreview === tab
                            ? "bg-[#0a0a0b] text-white shadow-[0_6px_18px_-8px_rgba(10,10,11,0.7)]"
                            : "text-[#0a0a0b]/55 hover:text-[#0a0a0b]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="relative h-[300px] p-4 sm:h-[320px]">
                    {activePreview === "design" && (
                      <div className="absolute inset-4 overflow-hidden rounded-xl border border-[#0a0a0b]/10 bg-[#f7fdfa]">
                        <div className="flex items-center justify-between border-b border-[#0a0a0b]/10 px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="grid h-4 w-4 place-items-center rounded-[5px] bg-[#0a0a0b] text-[7px] font-bold text-[#d4ff5c]">K</span>
                            <span className="text-[9px] font-bold text-[#0a0a0b]">Aurora</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="h-1 w-5 rounded-full bg-[#0a0a0b]/15" />
                            <span className="h-1 w-6 rounded-full bg-[#0a0a0b]/15" />
                            <span className="h-1 w-4 rounded-full bg-[#0a0a0b]/15" />
                            <span className="rounded-full bg-[#0a0a0b] px-2 py-[3px] text-[7px] font-bold text-white">Get app</span>
                          </div>
                        </div>

                        <div className="grid h-[calc(100%-42px)] grid-cols-[1.15fr_0.85fr] gap-2.5 p-3">
                          <div className="flex flex-col justify-center">
                            <span className="mb-1.5 w-fit rounded-full bg-[#d4ff5c]/70 px-1.5 py-[2px] text-[6.5px] font-bold uppercase tracking-wider text-[#0a0a0b]/80">New · v3.0</span>
                            <p className="text-[13px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0a0a0b]">
                              Money that<br />moves with <span className="font-serif italic">you</span>
                            </p>
                            <p className="mt-1 text-[7px] leading-[1.5] text-[#0a0a0b]/45">
                              Spend, save and send across borders - instantly, with zero fees.
                            </p>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className="rounded-full bg-[#0a0a0b] px-2 py-[3.5px] text-[7px] font-bold text-white">Open account</span>
                              <span className="rounded-full border border-[#0a0a0b]/15 px-2 py-[3.5px] text-[7px] font-bold text-[#0a0a0b]/60">Demo</span>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                              <div className="flex -space-x-1">
                                <span className="h-3 w-3 rounded-full border border-[#f7fdfa] bg-[#9fe3bd]" />
                                <span className="h-3 w-3 rounded-full border border-[#f7fdfa] bg-[#0a2a4a]" />
                                <span className="h-3 w-3 rounded-full border border-[#f7fdfa] bg-[#a5f3c6]" />
                              </div>
                              <span className="text-[6.5px] font-medium text-[#0a0a0b]/40">12k+ users</span>
                            </div>
                          </div>

                          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#bfeed4] via-[#dcf8e7] to-[#f0fdf4] p-2">
                            <div className="relative mt-1 h-[52px] w-full rounded-md bg-[#0a0a0b] p-1.5 shadow-lg shadow-[#0a0a0b]/25">
                              <div className="flex items-start justify-between">
                                <span className="h-2.5 w-3.5 rounded-[2px] bg-gradient-to-br from-[#ffe7a5] to-[#d4a72c]" />
                                <div className="flex gap-[2px]">
                                  <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
                                  <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
                                </div>
                              </div>
                              <p className="mt-1 font-mono text-[6.5px] tracking-[0.08em] text-white/85">4829 •••• 1204</p>
                              <div className="mt-1 flex items-end justify-between">
                                <span className="text-[5.5px] uppercase tracking-wider text-white/40">Aurora</span>
                                <span className="text-[6px] font-semibold text-[#d4ff5c]">$24,510</span>
                              </div>
                            </div>
                            <div className="relative mt-1.5 flex items-center gap-1 rounded-md bg-[#f7fdfa]/95 px-1.5 py-1 shadow-sm">
                              <span className="grid h-3 w-3 place-items-center rounded-full bg-emerald-100 text-[7px] text-emerald-600">↗</span>
                              <div>
                                <p className="text-[6px] font-bold text-[#0a0a0b]">+18.4%</p>
                                <p className="mt-[1px] text-[5px] text-[#0a0a0b]/40">this month</p>
                              </div>
                            </div>
                            <div className="relative mt-1 h-[3px] w-full overflow-hidden rounded-full bg-[#0a0a0b]/10">
                              <div className="h-full w-[68%] rounded-full bg-[#0a0a0b]" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 border-t border-[#0a0a0b]/10 px-3 py-2">
                          {[
                            ["Instant", "transfers", "bg-[#9fe3bd]"],
                            ["Zero fees", "on FX", "bg-[#d4ff5c]"],
                            ["Secure", "by default", "bg-[#a5f3c6]"],
                          ].map(([title, caption, color]) => (
                            <div key={title} className="rounded-md bg-[#e6f6ec] p-1.5">
                              <div className={`mb-1 grid h-3 w-3 place-items-center rounded-[3px] ${color}`}>
                                <span className="h-1 w-1 rounded-full bg-[#0a0a0b]/60" />
                              </div>
                              <p className="text-[6px] font-bold leading-none text-[#0a0a0b]">{title}</p>
                              <p className="mt-[2px] text-[5px] leading-none text-[#0a0a0b]/40">{caption}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activePreview === "build" && (
                      <div className="absolute inset-4 flex flex-col rounded-xl bg-[#0d0d10] p-4 font-mono text-[11px] leading-[1.95] text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                          <span className="ml-2 text-[10px] text-slate-500">app/page.tsx</span>
                        </div>
                        <div className="mt-2 space-y-0.5">
                          <div><span className="text-emerald-400">export default function</span> <span className="text-[#9ec5ff]">Page</span>() {'{'}</div>
                          <div className="pl-4"><span className="text-emerald-400">return</span> (</div>
                          <div className="pl-8"><span className="text-emerald-300">&lt;Hero</span></div>
                          <div className="pl-12 text-slate-500">speed=<span className="text-emerald-300">&quot;100&quot;</span></div>
                          <div className="pl-12 text-slate-500">a11y=<span className="text-emerald-300">&quot;AA&quot;</span></div>
                          <div className="pl-12 text-slate-500">motion=<span className="text-emerald-300">&quot;tasteful&quot;</span></div>
                          <div className="pl-8"><span className="text-emerald-300">/&gt;</span></div>
                          <div className="pl-4">);</div>
                          <div>{'}'}</div>
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-[10px] text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          compiled in 812ms
                        </div>
                      </div>
                    )}

                    {activePreview === "ship" && (
                      <div className="absolute inset-4 flex flex-col gap-3 rounded-xl border border-[#0a0a0b]/10 bg-[#eafaf1] p-3">
                        <div className="flex items-center justify-between">
                          <span className="h-1.5 w-16 rounded-full bg-[#0a0a0b]/15" />
                          <span className="rounded-full bg-[#d4ff5c] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0a0a0b]">Live</span>
                        </div>
                        <div className="flex flex-1 items-center gap-5 rounded-lg bg-[#f7fdfa] p-3.5">
                          <div className="relative h-[74px] w-[74px] shrink-0 rounded-full border-[8px] border-[#0a0a0b]">
                            <span className="absolute inset-0 grid place-items-center text-lg font-bold text-[#0a0a0b]">100</span>
                          </div>
                          <div className="space-y-2">
                            {["Performance", "Accessibility", "Best practices"].map((item) => (
                              <div key={item} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-medium text-[#0a0a0b]/60">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[["LCP", "0.8s"], ["CLS", "0.00"], ["TTFB", "42ms"]].map(([label, value]) => (
                            <div key={label} className="rounded-lg bg-[#f7fdfa] p-2">
                              <div className="text-[10px] font-medium text-[#0a0a0b]/40">{label}</div>
                              <div className="mt-0.5 text-[13px] font-bold text-[#0a0a0b]">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
      <section className="section-padding bg-background">
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
            
            <div>
              <div className="grid grid-cols-2 gap-4">
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
              <Link href="/services">
                Explore All Services
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding bg-background">
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
                <Link href="/portfolio">View All Projects</Link>
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
                    href={`/case-study/${project.slug}`}
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
      <section className="section-padding bg-slate-dark text-primary-foreground">
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
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-primary-foreground/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Modern Roadmap: Expert Tips for Digital Growth */}
      <section className="section-padding bg-background">
        <div className="container-tight relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Latest Insights</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              The Modern Roadmap: <span className="text-gradient">Expert Tips for Digital Growth</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Stay ahead with our expert insights on digital transformation, design, and growth strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <div
                key={blog.slug}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-coral/50 transition-colors"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="relative overflow-hidden aspect-[16/9] bg-secondary">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-coral/20 to-purple-500/20">
                        <span className="text-4xl font-bold text-coral/30">{blog.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="text-coral font-medium">{blog.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blog.readTime} read
                    </span>
                  </div>
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-bold hover:text-coral transition-colors">{blog.title}</h3>
                  </Link>
                  <p className="text-muted-foreground mt-2 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/blog/${blog.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="dark" size="lg" asChild>
              <Link href="/blog">
                Read More Insights
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 lg:p-20">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Build Your Digital Home?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Let's discuss your project and create something amazing together. Get a free website audit and consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link href="/contact">
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link href="/contact">Schedule a Call</Link>
                </Button>
                <Button variant="outline" size="xl" asChild className="border-coral text-coral hover:bg-coral hover:text-accent-foreground">
                  <Link href="/donate">
                    <Heart className="w-5 h-5 mr-1" />
                    Donate
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default Index;
