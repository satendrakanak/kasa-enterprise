"use client";

import { BookOpen, Headphones, Target } from "lucide-react";
import Container from "../container";

export function CoursesBanner({ totalCourses }: { totalCourses: number }) {
  return (
    <section className="relative overflow-hidden py-14 text-white dark:bg-[#101b2d] md:py-16">
      {/* LIGHT MODE - SAME HERO BLUE THEME */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.82),rgba(2,6,23,0.32),rgba(2,6,23,0.58))]" />
      </div>

      {/* DARK MODE */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="dark-section-shine absolute inset-0 opacity-30" />
      </div>

      <Container className="relative z-10">
        <p className="mb-4 text-xs font-medium text-white/65">
          Home • All Courses
        </p>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-xs font-semibold text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(2,6,23,0.20)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              {totalCourses}+ curated programs
            </div>

            <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-[46px]">
              Learn through structured, career-conscious wellness education.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
              Browse certification-led, practical programs designed for
              beginners, practitioners, and serious learners building real
              capability.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_22px_60px_rgba(0,0,0,0.36)] md:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-100 dark:text-rose-200">
              Snapshot
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md dark:bg-white/5">
                <BookOpen className="mb-2 h-4 w-4 text-sky-100 dark:text-rose-200" />
                <p className="text-2xl font-bold text-white">{totalCourses}+</p>
                <p className="mt-1 text-xs leading-5 text-white/68">
                  Published courses
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md dark:bg-white/5">
                <Headphones className="mb-2 h-4 w-4 text-sky-100 dark:text-rose-200" />
                <p className="text-2xl font-bold text-white">Live</p>
                <p className="mt-1 text-xs leading-5 text-white/68">
                  Mentor support
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md dark:bg-white/5">
                <Target className="mb-2 h-4 w-4 text-sky-100 dark:text-rose-200" />
                <p className="text-2xl font-bold text-white">Practical</p>
                <p className="mt-1 text-xs leading-5 text-white/68">
                  Outcome-first curriculum
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
