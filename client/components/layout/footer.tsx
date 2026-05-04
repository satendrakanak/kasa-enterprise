"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import Container from "../container";
import Logo from "../logo";
import { useSiteSettings } from "@/context/site-settings-context";
import FooterCta from "./footer-cta";

export default function Footer() {
  const { site } = useSiteSettings();

  const socialLinks = [
    {
      href: site.facebookUrl,
      icon: <FaFacebookF size={15} />,
      label: "Facebook",
    },
    {
      href: site.twitterUrl,
      icon: <FaXTwitter size={15} />,
      label: "X",
    },
    {
      href: site.instagramUrl,
      icon: <FaInstagram size={15} />,
      label: "Instagram",
    },
    {
      href: site.linkedinUrl,
      icon: <FaLinkedinIn size={15} />,
      label: "LinkedIn",
    },
  ].filter((item) => item.href);

  const usefulLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/articles", label: "Articles" },
    { href: "/client-testimonials", label: "Testimonials" },
    { href: "/our-faculty", label: "Faculty" },
  ];

  const companyLinks = [
    { href: "/contact", label: "Contact Us" },
    { href: "/courses", label: "Admissions" },
    { href: "/articles", label: "Learning Resources" },
    { href: "/our-faculty", label: "Meet the Faculty" },
    { href: "/cart", label: "Your Cart" },
  ];

  return (
    <>
      <FooterCta />

      <footer className="relative overflow-hidden bg-slate-100 text-slate-700 dark:bg-[#050b14] dark:text-slate-300">
        {/* subtle footer-only background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/10" />
          <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-blue-100/60 blur-[100px] dark:bg-blue-500/5" />
          <div className="absolute right-[-120px] bottom-0 h-72 w-72 rounded-full bg-slate-200/80 blur-[100px] dark:bg-rose-300/5" />
        </div>

        <Container className="relative z-10">
          <div className="grid gap-10 py-16 md:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_0.9fr_1.1fr]">
            {/* ABOUT */}
            <div>
              <div className="mb-5">
                <Logo footer />
              </div>

              <p className="mb-6 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
                {site.footerAbout || site.siteDescription}
              </p>

              <Link
                href="/contact"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
              >
                Contact With Us
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* USEFUL LINKS */}
            <div>
              <h3 className="mb-5 text-base font-semibold text-slate-950 dark:text-white">
                Useful Links
              </h3>

              <ul className="space-y-3 text-sm">
                {usefulLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex text-slate-600 transition hover:translate-x-1 hover:text-blue-700 dark:text-slate-400 dark:hover:text-rose-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="mb-5 text-base font-semibold text-slate-950 dark:text-white">
                Our Company
              </h3>

              <ul className="space-y-3 text-sm">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex text-slate-600 transition hover:translate-x-1 hover:text-blue-700 dark:text-slate-400 dark:hover:text-rose-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="mb-5 text-base font-semibold text-slate-950 dark:text-white">
                Get Contact
              </h3>

              <ul className="mb-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                {site.supportPhone && (
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm dark:bg-white/8 dark:text-rose-200">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span>{site.supportPhone}</span>
                  </li>
                )}

                {site.supportEmail && (
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm dark:bg-white/8 dark:text-rose-200">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span>{site.supportEmail}</span>
                  </li>
                )}

                {site.supportAddress && (
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm dark:bg-white/8 dark:text-rose-200">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="leading-6">{site.supportAddress}</span>
                  </li>
                )}
              </ul>

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-300/70 py-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-500 md:flex-row">
            <p>{site.footerCopyright}</p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/terms"
                className="transition hover:text-blue-700 dark:hover:text-rose-200"
              >
                Terms
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-blue-700 dark:hover:text-rose-200"
              >
                Privacy
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
