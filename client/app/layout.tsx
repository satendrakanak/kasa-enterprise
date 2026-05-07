import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "@/context/session-context";
import { getSession } from "@/lib/auth";
import { headers } from "next/headers";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { settingsServerService } from "@/services/settings/settings.server";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { FloatingThemeToggle } from "@/components/theme/floating-theme-toggle";
import { ScrollProgressButton } from "@/components/ui/scroll-progress-button";
import { RouteProgressBar } from "@/components/ui/route-progress-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-admin",
});

export const metadata: Metadata = {
  ...buildMetadata({}),
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const headerList = await headers();
  const hasSession = headerList.get("x-has-session") === "true";
  const publicSettings = (await settingsServerService
    .getPublicSettingsBundle()
    .then((response) => response.data)
    .catch(() => null)) || {
    site: {
      siteName: "Unitus Health Academy",
      siteTagline: "A Unit of Ranfort Wellness",
      siteDescription:
        "Practical wellness education for learners who want clarity, mentorship, and real-world application.",
      logoUrl: "/assets/unitus-logo.png",
      footerLogoUrl: "/assets/unitus-logo.png",
      adminPanelName: "UHA",
      adminPanelIconUrl: "/assets/unitus-logo.png",
      faviconUrl: "",
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <head>
        {publicSettings.site.faviconUrl ? (
          <link rel="icon" href={publicSettings.site.faviconUrl} />
        ) : null}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem("theme") || "light";
                  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  var resolvedTheme = storedTheme === "system" ? systemTheme : storedTheme;
                  var root = document.documentElement;
                  root.classList.remove("light", "dark");
                  root.classList.add(resolvedTheme);
                  root.style.colorScheme = resolvedTheme;
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <SiteSettingsProvider value={publicSettings}>
            <SessionProvider session={session} hasSession={hasSession}>
              <RouteProgressBar />
              <Toaster richColors />
              <FloatingThemeToggle />
              <ScrollProgressButton />
              {children}
            </SessionProvider>
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
