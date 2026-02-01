import { Link } from "react-router-dom";
import { ArrowRight, Heart, Target, Users, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Code,
    title: "Pixel-Perfect Code",
    description: "We write clean, maintainable code that performs flawlessly across all devices.",
  },
  {
    icon: Target,
    title: "Strategic Thinking",
    description: "Every design decision is backed by data and aligned with your business goals.",
  },
  {
    icon: Heart,
    title: "Partnership-Driven",
    description: "We see ourselves as an extension of your team, invested in your success.",
  },
  {
    icon: Sparkles,
    title: "Creative Excellence",
    description: "We push creative boundaries while maintaining usability and function.",
  },
];

const team = [
  {
    name: "Otieno Edison",
    role: "Founder & Creative Director",
    image: "/images/team/edison.png",
    
  },

  {
    name: "Christine Akinyi",
    role: "HR manager",
    image: "/images/team/christine.png",
    
  },
  {
    name: "Dickson Aluoch",
    role: "Marketing & Consultancy",
    image: "/images/team/dickson.png",
  },
  {
    name: "Hannah Dorcas",
    role: "Graphic Designer",
    image: "/images/team/hannah.jpeg",
  },
];

const stats = [
  { value: "150+", label: "Projects Completed" },
  { value: "50+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "15+", label: "Industry Awards" },
];

const About = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                We're Digital <span className="text-gradient">Craftspeople</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                Founded on the belief that great websites are the cornerstone of digital success, we combine technical expertise with strategic marketing to deliver results that matter.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-dark rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-gradient">{stat.value}</span>
                  <p className="text-primary-foreground/70 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                From Code to Campaign, We've Got You Covered
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Kreative Creations started with a simple observation: too many businesses were getting beautiful websites that didn't perform, or functional sites that lacked soul.
                </p>
                <p>
                  We bridge that gap. Our team brings together world-class developers, designers, and marketers who understand that a website isn't just code—it's the foundation of your digital presence.
                </p>
                <p>
                  Today, we've helped over 150 businesses transform their online presence, driving real results through thoughtful design and strategic development.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-coral opacity-10 blur-3xl rounded-3xl" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="relative rounded-2xl shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-2xl p-8 shadow-soft hover-lift text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-coral flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Meet the Creators
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              A talented group of developers, designers, and strategists passionate about digital excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-coral font-medium text-sm mt-1">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-slate-dark text-primary-foreground">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-coral font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                Not Just Developers. Not Just Marketers.
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
                We're a rare breed: a team that speaks both code and conversion. We understand that a beautiful website means nothing if it doesn't drive results, and a marketing strategy falls flat without a solid digital foundation.
              </p>
              <ul className="space-y-4">
                {[
                  "Deep technical expertise across modern web technologies",
                  "Strategic thinking rooted in business outcomes",
                  "Transparent communication throughout every project",
                  "Long-term partnerships, not just one-off projects",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-coral" />
                    </div>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-coral opacity-10 blur-3xl rounded-3xl" />
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop"
                alt="Team collaboration and excellence"
                className="relative rounded-2xl shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-tight text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's discuss how we can help bring your digital vision to life.
          </p>
          <Button variant="coral" size="xl" asChild>
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default About;
