"use client";

import { cn } from "@/lib/utils";

interface DecorativeShapesProps {
  variant?: "hero" | "section" | "corner" | "dots" | "circles";
  className?: string;
}

export const DecorativeShapes = ({ variant = "section", className }: DecorativeShapesProps) => {
  switch (variant) {
    case "hero":
      return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
          {/* Large gradient circle top right */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />
          {/* Medium circle bottom left */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green/15 rounded-full blur-2xl" />
          {/* Floating rings */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-coral/20 rounded-full animate-float" />
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border border-green/20 rounded-full animate-float animation-delay-200" />
          {/* Triangle */}
          <svg className="absolute top-1/2 right-10 w-16 h-16 text-coral/10 animate-float animation-delay-300" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" fill="currentColor" />
          </svg>
          {/* Cross */}
          <svg className="absolute bottom-1/4 right-1/3 w-12 h-12 text-green/15" viewBox="0 0 100 100">
            <rect x="45" y="10" width="10" height="80" fill="currentColor" />
            <rect x="10" y="45" width="80" height="10" fill="currentColor" />
          </svg>
        </div>
      );
    
    case "section":
      return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
          {/* Gradient blob */}
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-coral/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-green/10 rounded-full blur-2xl" />
          {/* Decorative ring */}
          <div className="absolute top-20 left-10 w-24 h-24 border border-coral/10 rounded-full" />
          {/* Small dots */}
          <div className="absolute bottom-20 right-20 w-3 h-3 bg-coral/30 rounded-full" />
          <div className="absolute bottom-28 right-28 w-2 h-2 bg-green/30 rounded-full" />
          <div className="absolute top-32 right-16 w-2 h-2 bg-coral/20 rounded-full" />
        </div>
      );
    
    case "corner":
      return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
          {/* Top left corner accent */}
          <svg className="absolute -top-4 -left-4 w-40 h-40 text-coral/10" viewBox="0 0 100 100">
            <path d="M0 0 L100 0 L0 100 Z" fill="currentColor" />
          </svg>
          {/* Bottom right corner accent */}
          <svg className="absolute -bottom-4 -right-4 w-40 h-40 text-green/10" viewBox="0 0 100 100">
            <path d="M100 100 L0 100 L100 0 Z" fill="currentColor" />
          </svg>
        </div>
      );
    
    case "dots":
      return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
          {/* Grid of dots */}
          <div className="absolute top-10 right-10 grid grid-cols-5 gap-4 opacity-20">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-coral" />
            ))}
          </div>
          <div className="absolute bottom-10 left-10 grid grid-cols-4 gap-3 opacity-15">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-green" />
            ))}
          </div>
        </div>
      );
    
    case "circles":
      return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
          {/* Concentric circles */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2">
            <div className="w-64 h-64 border border-coral/10 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border border-coral/15 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 border border-coral/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-coral/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          {/* Left side accent */}
          <div className="absolute -left-10 bottom-20">
            <div className="w-40 h-40 border border-green/10 rounded-full" />
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export default DecorativeShapes;
