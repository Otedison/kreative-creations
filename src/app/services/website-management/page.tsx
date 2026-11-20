import Link from "next/link";
import { ArrowRight, ShieldCheck, Gauge, RefreshCcw, DatabaseBackup, Search, Wrench, Activity, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const managementTasks = [
  { icon: RefreshCcw, title: "Platform & Plugin Updates", text: "We review, stage and apply CMS, theme and plugin updates. Risky updates are tested before release, while outdated or unsupported components are replaced." },
  { icon: DatabaseBackup, title: "Backups & Recovery", text: "Automated backups are stored safely and verified regularly. We document restoration steps so the website can be recovered quickly after an incident." },
  { icon: LockKeyhole, title: "Security Monitoring", text: "We review suspicious activity, malware signals, login protection, SSL certificates and user access so vulnerabilities are addressed before they become outages." },
  { icon: Gauge, title: "Speed & Reliability", text: "Caching, image delivery, scripts and server resources are monitored to keep pages fast. Downtime alerts help us identify and resolve failures quickly." },
  { icon: Wrench, title: "Content & Feature Support", text: "Small content updates, forms, landing pages, product changes and feature improvements are handled through an organized request and approval process." },
  { icon: Activity, title: "Analytics & Performance Review", text: "We check traffic, lead sources, broken forms and key pages to identify problems and recommend practical improvements during each review." },
];

const routine = [
  ["Daily", "Uptime, security alerts and backup status"],
  ["Weekly", "Software updates, broken-link checks and new content support"],
  ["Monthly", "Performance, analytics, plugin health and maintenance report"],
  ["As needed", "Emergency fixes, recovery, migrations and feature work"],
];

export default function WebsiteManagementPage() {
  return (
    <>
      <SEOHead
        title="Website Management & Maintenance | Kreative Creations"
        description="Website updates, backups, security, speed monitoring, content support and practical ongoing management."
        url="/services/website-management"
      />
      <main className="overflow-hidden">
        <section className="py-16 md:py-20 lg:py-24 bg-slate-dark text-primary-foreground">
          <div className="container-tight">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-end">
              <div>
                <span className="text-coral text-sm font-semibold uppercase tracking-wider">Website Management</span>
                <h1 className="mt-4 text-4xl font-bold md:text-6xl">Keep the website <span className="text-gradient">working, secure and current</span></h1>
              </div>
              <p className="text-lg leading-relaxed text-primary-foreground/75">
                A website needs regular operational care, not only a launch. We manage updates, backups, monitoring, content and improvements through one clear maintenance process.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-tight">
            <div className="mb-12 max-w-2xl">
              <span className="text-coral text-sm font-semibold uppercase tracking-wider">Management Tasks</span>
              <h2 className="mt-4 text-3xl font-bold md:text-5xl">The work behind a reliable website</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {managementTasks.map((task) => (
                <article key={task.title} className="bg-card p-7 md:p-8">
                  <task.icon className="h-8 w-8 text-coral" />
                  <h3 className="mt-6 text-xl font-bold">{task.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{task.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary">
          <div className="container-tight">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <span className="text-coral text-sm font-semibold uppercase tracking-wider">Maintenance Schedule</span>
                <h2 className="mt-4 text-3xl font-bold md:text-4xl">A routine that prevents small issues becoming serious</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  The exact schedule depends on the platform and traffic, but every managed website follows a documented monitoring and update routine.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {routine.map(([period, task], index) => (
                  <div key={period} className={`grid grid-cols-[100px_1fr] gap-4 p-6 md:grid-cols-[140px_1fr] ${index > 0 ? "border-t border-border" : ""}`}>
                    <span className="font-bold text-coral">{period}</span>
                    <span className="text-muted-foreground">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-dark text-primary-foreground">
          <div className="container-tight text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-coral" />
            <h2 className="mt-5 text-3xl font-bold md:text-4xl">Put website care on a dependable schedule</h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/70">Tell us what platform you use and we will create a maintenance plan around your current site and priorities.</p>
            <Button variant="hero" size="xl" asChild className="mt-8">
              <Link href="/contact">Discuss Website Management <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
