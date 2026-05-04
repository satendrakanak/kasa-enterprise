"use client";

import { createContext, useContext } from "react";
import { PublicSettingsBundle } from "@/types/settings";

const defaultBundle: PublicSettingsBundle = {
  site: {
    siteName: "Code With KASA",
    siteTagline: "Coading tutorial for you",
    siteDescription:
      "Practical wellness education for learners who want clarity, mentorship, and real-world application.",
    logoUrl: "/assets/unitus-logo.png",
    footerLogoUrl: "/assets/unitus-logo.png",
    faviconUrl: "",
    adminPanelName: "U",
    adminPanelIconUrl: "",
    supportEmail: "info@academy.com",
    supportPhone: "+91-9809-XXXXXX",
    supportAddress: "India",
    footerAbout:
      "Practical wellness education for learners who want clarity, mentorship, and real-world application.",
    footerCopyright: `© ${new Date().getFullYear()} Unitus. All Rights Reserved`,
    footerCtaEyebrow: "Start Your Learning Journey",
    footerCtaHeading:
      "Build practical wellness expertise with a learning system that actually supports you.",
    footerCtaDescription:
      "Explore guided programs, thoughtful faculty, and a curriculum designed to help you learn clearly and apply with confidence.",
    footerPrimaryCtaLabel: "Explore Courses",
    footerPrimaryCtaHref: "/courses",
    footerSecondaryCtaLabel: "Talk to Us",
    footerSecondaryCtaHref: "/contact",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
  },
  socialProviders: [],
};

const SiteSettingsContext = createContext<PublicSettingsBundle>(defaultBundle);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: PublicSettingsBundle;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
