import "../index.css";
import type { Metadata } from "next";
import { Sora, Syne } from "next/font/google";
import type { ReactNode } from "react";
import Providers from "./providers";

const bodyFont = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kreative Creations",
  description: "Kreative Creations - Web development, design, and digital marketing.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kreativecreations.co.ke"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/krc%20fav.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
