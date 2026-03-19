"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Briefcase, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { applyToJob, getActiveJobs, JobPosting } from "@/services/api/jobs";
import SEOHead from "@/components/SEOHead";

const Careers = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ category: "", type: "", location: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    resume_url: "",
    cover_letter: "",
  });

  const loadJobs = async (nextFilters = filters) => {
      try {
        setLoadingJobs(true);
        const data = await getActiveJobs({
          category: nextFilters.category || undefined,
          type: nextFilters.type || undefined,
          location: nextFilters.location || undefined,
        });
        setJobs(data || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };

  useEffect(() => {
    loadJobs(filters);
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return;

    if (!form.name.trim() || !form.email.trim()) {
      toast({
        title: "Missing details",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await applyToJob(selectedJobId, {
        job_title: selectedJob?.title || "",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        portfolio: form.portfolio.trim(),
        resume_url: form.resume_url.trim(),
        cover_letter: form.cover_letter.trim(),
      });
      toast({
        title: "Application sent",
        description: "Thanks for applying! We’ll review and get back to you soon.",
      });
      setForm({ name: "", email: "", phone: "", portfolio: "", resume_url: "", cover_letter: "" });
      setSelectedJobId(null);
    } catch (error) {
      toast({
        title: "Application failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Careers - Join Our Team"
        description="Join the Kreative Creations team. We're a small, focused team building high-impact digital experiences. Explore open roles in design, development, and digital marketing."
        url="/careers"
      />
      <main className="pt-20">
    {/* Hero */}
    <section className="section-padding bg-slate-dark text-primary-foreground">
      <div className="container-tight">
        <div className="max-w-3xl">
          <span className="text-coral font-semibold text-sm uppercase tracking-wider">Careers</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Join the <span className="text-gradient">Kreative</span> Team
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            We’re a small, focused team building high‑impact digital experiences. If you care about craft and
            outcomes, we’d love to work with you.
          </p>
          <div className="mt-8">
            <Button asChild variant="hero">
              <a href="mailto:hello@kreativecreations.co.ke?subject=Careers%20Inquiry">Email Your CV</a>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Why Join */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Real Ownership",
              icon: Sparkles,
              text: "Small teams, big impact. Your work ships fast and matters.",
            },
            {
              title: "Flexible Work",
              icon: MapPin,
              text: "Remote-friendly roles with clear communication and focus time.",
            },
            {
              title: "Grow Your Craft",
              icon: Briefcase,
              text: "Work across strategy, design, and engineering on diverse projects.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-coral/15 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-coral" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Open Roles */}
    <section className="section-padding bg-secondary">
      <div className="container-tight">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <div>
            <h2 className="text-3xl font-bold">Open Roles</h2>
            <p className="text-muted-foreground mt-2">
              Don’t see your role? Send your CV and a short note about how you can help.
            </p>
          </div>
          <Button asChild variant="coral">
            <a href="mailto:hello@kreativecreations.co.ke?subject=General%20Application">
              General Application
            </a>
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-4 md:p-6 border border-border mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Design, Engineering..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Input
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="Full-time, Contract..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Nairobi, Remote..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button variant="coral" onClick={() => loadJobs(filters)}>
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const cleared = { category: "", type: "", location: "" };
                setFilters(cleared);
                loadJobs(cleared);
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        {loadingJobs ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-coral border-t-transparent rounded-full mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <h3 className="font-semibold mb-2">No openings right now</h3>
            <p className="text-muted-foreground mb-4">
              We’re not actively hiring, but we’re always happy to meet great people.
            </p>
            <Button asChild variant="coral">
              <a href="mailto:hello@kreativecreations.co.ke?subject=General%20Application">
                Send Your CV
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((role) => (
              <div
                key={role.id || role.title}
                className="bg-card rounded-2xl p-6 shadow-soft flex items-center justify-between gap-6 flex-wrap"
              >
                <div className="min-w-[240px]">
                  <h3 className="text-lg font-bold">{role.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {role.reference ? `${role.reference} · ` : ""}{role.category ? `${role.category} · ` : ""}{role.type} · {role.location}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm flex-1 min-w-[240px]">
                  {role.summary || role.description || "Join our team and make an impact."}
                </p>
                <Button
                  variant="hero"
                  onClick={() => setSelectedJobId(role.id || null)}
                >
                  Apply <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>

    {/* Application Form */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 shadow-soft border border-border">
          <h3 className="text-2xl font-bold mb-2">Apply for a Role</h3>
          <p className="text-muted-foreground mb-6">
            {selectedJob ? `Applying for: ${selectedJob.title}` : "Select a job to start your application."}
          </p>

          <form onSubmit={handleApply} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="jane@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Portfolio / LinkedIn</label>
                <Input
                  value={form.portfolio}
                  onChange={(e) => setForm((prev) => ({ ...prev, portfolio: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resume URL</label>
                <Input
                  value={form.resume_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, resume_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Letter</label>
              <Textarea
                rows={6}
                value={form.cover_letter}
                onChange={(e) => setForm((prev) => ({ ...prev, cover_letter: e.target.value }))}
                placeholder="Tell us why you’re a great fit..."
              />
            </div>

            <Button type="submit" variant="coral" disabled={!selectedJobId || submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to build with us?</h3>
            <p className="text-primary-foreground/80">
              Send your CV, portfolio, and a short introduction. We respond within 5 business days.
            </p>
          </div>
          <Button asChild variant="hero">
            <a href="mailto:hello@kreativecreations.co.ke?subject=Careers%20Inquiry">
              Get in Touch
            </a>
          </Button>
        </div>
        <div className="text-center mt-8">
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-coral transition-colors">
            Prefer the contact form? Reach us here.
          </Link>
        </div>
      </div>
    </section>
  </main>
  </>
  );
};

export default Careers;
