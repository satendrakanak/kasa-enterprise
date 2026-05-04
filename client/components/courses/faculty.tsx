"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { User } from "@/types/user";
import Container from "../container";
import { FacultyCard } from "../faculty/faculty-card";

export default function Faculty({ faculties }: { faculties: User[] }) {
  if (!faculties?.length) return null;

  return (
    <section className="relative overflow-hidden py-24 text-white dark:bg-[#101b2d]">
      {/* LIGHT MODE - HERO STYLE DARK BLUE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-linear-to-r from-[#020617]/80 via-[#020617]/30 to-[#020617]/55" />
      </div>

      {/* DARK MODE - SAME FAMILY AS OTHER SECTIONS */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="dark-section-shine absolute inset-0 opacity-35" />
      </div>

      <Container className="relative z-10">
        {/* HEADER */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl text-center lg:text-left">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/12 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_35px_rgba(2,6,23,0.22)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              Our Experts
            </span>

            <h2 className="text-4xl font-semibold tracking-tight text-white dark:text-white lg:text-5xl">
              Meet the faculty shaping thoughtful practitioners.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 dark:text-slate-300">
              Learn from specialists who combine academic depth, industry
              practice, and mentorship that actually guides students forward.
            </p>
          </div>

          <Link
            href="/our-faculty"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_40px_rgba(2,6,23,0.22)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-900 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
          >
            View All Faculty
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {faculties.slice(0, 4).map((item) => (
            <FacultyCard key={item.id} faculty={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
