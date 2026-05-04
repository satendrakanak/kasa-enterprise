"use client";

import { featuresData } from "@/data/features-data";

export default function WhyJoinOurCourses() {
  return (
    <section className="relative overflow-hidden py-24 text-white dark:bg-[#101b2d]">
      {/* LIGHT MODE - EXACT HERO BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-linear-to-r from-[#020617]/85 via-[#020617]/35 to-[#020617]/60" />
      </div>

      {/* DARK MODE - SAME AS CURRENT */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(56,189,248,0.14),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="dark-section-shine absolute inset-0 opacity-35" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-rose-300 dark:text-rose-200">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            Why Join Our Courses?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/78 dark:text-slate-300">
            We provide a powerful learning experience to help you grow and
            succeed.
          </p>
        </div>

        {/* TOP ROW */}
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          {featuresData.slice(0, 3).map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)] supports-backdrop-filter:bg-white/10 supports-backdrop-filter:backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)] dark:supports-backdrop-filter:bg-[#07111f] dark:supports-backdrop-filter:backdrop-blur-none dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.18)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-300 via-blue-300 to-indigo-300 dark:from-rose-200 dark:via-rose-300 dark:to-pink-300" />

                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/15 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-blue-700 dark:bg-white/10 dark:text-rose-200 dark:group-hover:bg-rose-200 dark:group-hover:text-black">
                  <Icon size={24} />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-white/75 dark:text-slate-300">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ROW */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {featuresData.slice(3).map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)] supports-backdrop-filter:bg-white/10 supports-backdrop-filter:backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)] dark:supports-backdrop-filter:bg-[#07111f] dark:supports-backdrop-filter:backdrop-blur-none dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.18)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-300 via-blue-300 to-indigo-300 dark:from-rose-200 dark:via-rose-300 dark:to-pink-300" />

                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/15 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-blue-700 dark:bg-white/10 dark:text-rose-200 dark:group-hover:bg-rose-200 dark:group-hover:text-black">
                  <Icon size={24} />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-white/75 dark:text-slate-300">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
