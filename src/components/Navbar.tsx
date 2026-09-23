"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Settings, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Courses", path: "/courses/website-development", hasDropdown: true },
  { name: "Portfolio", path: "/portfolio" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondaryNavHidden, setIsSecondaryNavHidden] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  // Track scroll position to adjust Navbar position when SecondaryNav is hidden
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // SecondaryNav hides after scrolling past 10px and scrolling down
      // Navbar should move to top-0 when SecondaryNav is hidden
      setIsSecondaryNavHidden(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed left-0 right-0 z-40 glass transition-all duration-300 ${
      isSecondaryNavHidden ? "top-0" : "top-12"
    }`}>
      <div className="container-tight">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/krc.png" alt="Kreative Creations" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => link.hasDropdown ? (
              <div key={link.path} className="group relative">
                <Link
                  href={link.path}
                  className={`text-sm font-medium transition-colors duration-200 link-underline ${
                    pathname.startsWith("/courses") ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 mt-0 w-60 -translate-x-1/2 translate-y-1 rounded-xl border border-border bg-card p-2 opacity-0 shadow-medium transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <Link href="/courses/website-development" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-accent">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent"><Code2 className="h-4 w-4" /></span>
                    <span>Website Development</span>
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors duration-200 link-underline ${
                  pathname === link.path
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
                <Link href="/admin" title="Admin Dashboard">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
            )}
            <Button variant="coral" asChild>
              <Link href="/contact">Start Your Project</Link>
            </Button>
            <Button variant="coral-outline" asChild>
              <Link href="/pay">Pay Invoice</Link>
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
            {navLinks.map((link) => link.hasDropdown ? (
              <div key={link.path} className="space-y-2">
                <Link href={link.path} onClick={() => setIsOpen(false)} className={`block text-base font-medium transition-colors ${pathname.startsWith("/courses") ? "text-accent" : "text-muted-foreground"}`}>{link.name}</Link>
                <Link href="/courses/website-development" onClick={() => setIsOpen(false)} className="ml-3 flex items-center gap-2 border-l border-accent/30 pl-3 text-sm font-medium text-muted-foreground hover:text-accent"><Code2 className="h-4 w-4" /> Website Development</Link>
              </div>
            ) : (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${pathname === link.path ? "text-accent" : "text-muted-foreground"}`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-accent"
              >
                Admin Dashboard
              </Link>
            )}
            <Button variant="coral" className="w-full mt-4" asChild>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Start Your Project
              </Link>
            </Button>
            <Button variant="coral-outline" className="w-full mt-2" asChild>
              <Link href="/pay" onClick={() => setIsOpen(false)}>
                Pay Invoice
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
