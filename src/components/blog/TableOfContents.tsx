"use client";

import { useEffect, useState } from "react";
import { List, Minus, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  className?: string;
}

const TableOfContents = ({ items, className }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-card rounded-2xl shadow-soft border border-border", className)}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-border cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Table of Contents</h3>
        </div>
        <Minus
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            !isExpanded && "rotate-90"
          )}
        />
      </div>

      {/* Content */}
      {isExpanded && (
        <nav className="p-4">
          <ul className="space-y-1">
            {items.map((item, index) => {
              const isActive = activeId === item.id;
              const indentClass =
                item.level === 1
                  ? "pl-0"
                  : item.level === 2
                  ? "pl-4"
                  : "pl-8";

              return (
                <li key={`${item.id}-${index}`}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-start gap-2",
                      isActive
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                      indentClass
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex-shrink-0",
                        isActive ? "text-accent" : "text-muted-foreground/50"
                      )}
                    >
                      {item.level === 1 ? (
                        <MinusCircle className="w-3 h-3" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current mt-1" />
                      )}
                    </span>
                    <span className="line-clamp-2">{item.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Progress indicator */}
          {items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {items.findIndex((item) => item.id === activeId) + 1} of{" "}
                {items.length} sections
              </p>
            </div>
          )}
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;

