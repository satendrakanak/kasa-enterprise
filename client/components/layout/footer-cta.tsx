"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Headphones } from "lucide-react";

import Container from "../container";
import { useSiteSettings } from "@/context/site-settings-context";

export default function FooterCta() {
  const { site } = useSiteSettings();

  const stats = [
    {
      icon: GraduationCap,
      value: "500+",
      label: "Learners mentored",
      desc: "Growing every cohort",
    },
    {
      icon: BookOpen,
      value: "100+",
      label: "Certified outcomes",
      desc: "Focused programs",
    },
    {
      icon: Headphones,
      value: "Live",
      label: "Faculty support",
      desc: "Human-first learning",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 text-white dark:bg-[#101b2d]">
      {/* LIGHT MODE - HERO STYLE DARK BLUE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.82),rgba(2,6,23,0.35),rgba(2,6,23,0.58))]" />
      </div>

      {/* DARK MODE */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="dark-section-shine absolute inset-0 opacity-35" />
      </div>

      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/12 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_35px_rgba(2,6,23,0.22)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              {site.footerCtaEyebrow}
            </span>

            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              {site.footerCtaHeading}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
              {site.footerCtaDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={site.footerPrimaryCtaHref || "/courses"}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-blue-950 shadow-[0_15px_45px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-50 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
              >
                {site.footerPrimaryCtaLabel}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                href={site.footerSecondaryCtaHref || "/contact"}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_40px_rgba(2,6,23,0.22)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-950 dark:hover:bg-rose-200 dark:hover:text-black"
              >
                {site.footerSecondaryCtaLabel}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="group rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15 dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/12 text-sky-100 dark:bg-white/10 dark:text-rose-200">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-3xl font-bold text-white dark:text-rose-200">
                    {item.value}
                  </h3>

                  <p className="mt-2 font-semibold text-white">{item.label}</p>

                  <p className="mt-1 text-sm text-white/68 dark:text-slate-300">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
