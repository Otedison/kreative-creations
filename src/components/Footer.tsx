import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-dark text-primary-foreground">
      <div className="container-tight section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-coral flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">K</span>
              </div>
              <span className="font-bold text-xl">
                Kreative<span className="text-coral">Creations</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              We don't just build websites; we build strategic digital foundations that drive growth. From code to campaign, we craft cohesive online experiences.
            </p>
            <div className="flex items-center gap-4">
              {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-coral transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {["Website Development", "E-commerce Solutions", "UI/UX Design", "SEO Optimization", "Brand Strategy", "Content Marketing"].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-primary-foreground/70 text-sm hover:text-coral transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Work", path: "/portfolio" },
                { name: "Blog", path: "/blog" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
                { name: "Admin Login", path: "/auth" },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-primary-foreground/70 text-sm hover:text-coral transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Get in Touch</h4>
            <ul className="space-y-4">
          <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-coral mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">hello@kreativecreations.co.ke</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-coral mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">+2547 43 653 115</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coral mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">Kahawa Sukari, Thika Road<br />Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} Kreative Creations. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary-foreground/50 text-sm hover:text-coral transition-colors">Privacy Policy</a>
            <a href="#" className="text-primary-foreground/50 text-sm hover:text-coral transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
