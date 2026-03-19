"use client";

import { Twitter, Linkedin, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthorBioProps {
  name: string;
  bio?: string | null;
  avatar?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
  email?: string | null;
  role?: string;
}

const AuthorBio = ({
  name,
  bio,
  avatar,
  twitter,
  linkedin,
  website,
  email,
  role = "Author",
}: AuthorBioProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-accent/20">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Globe className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>

        {/* Name and Role */}
        <h3 className="text-lg font-bold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{role}</p>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
            {bio}
          </p>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-2 mb-4">
          {twitter && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
            >
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
          )}
          {linkedin && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
            >
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          {email && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
            >
              <a href={`mailto:${email}`} aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          )}
          {website && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 rounded-full hover:bg-accent/10 hover:text-accent"
            >
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>

        {/* Contact Button */}
        {(email || twitter) && (
          <Button variant="coral" size="sm" className="w-full" asChild>
            <a
              href={email ? `mailto:${email}` : twitter || "#"}
              target={email ? undefined : "_blank"}
              rel={email ? undefined : "noopener noreferrer"}
            >
              Get in Touch
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthorBio;

