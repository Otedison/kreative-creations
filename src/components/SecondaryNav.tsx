"use client";

import { Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const SecondaryNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide on scroll down (more than 10px), show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-slate-dark border-b border-white/10 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container-tight">
        <div className="flex items-center justify-between h-12">
          {/* Contact Info - Left Side */}
          <div className="flex items-center gap-6">
            <a
              href="tel:+254743653115"
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-coral transition-colors duration-200 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>+2547 43 653 115</span>
            </a>
            <a
              href="mailto:hello@kreativecreations.co.ke"
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-coral transition-colors duration-200 text-sm"
            >
              <Mail className="w-4 h-4" />
              <span>hello@kreativecreations.co.ke</span>
            </a>
          </div>

          {/* Right Side - Optional: Working Hours or additional info */}
          <div className="hidden md:flex items-center gap-2 text-primary-foreground/60 text-sm">
            <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;

