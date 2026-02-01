import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container-tight">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/krc.png" alt="Kreative Creations" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 link-underline ${
                  location.pathname === link.path
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button & Admin */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/admin" title="Admin Dashboard">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
            )}
            <Button variant="coral" asChild>
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass border-t border-border animate-fade-in">
          <div className="container-tight py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-accent"
              >
                Admin Dashboard
              </Link>
            )}
            <Button variant="coral" className="w-full mt-4" asChild>
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                Start Your Project
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
