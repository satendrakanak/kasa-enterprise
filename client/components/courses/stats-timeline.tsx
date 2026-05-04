"use client";

import { GraduationCap, BookOpen, Award, Users } from "lucide-react";

const stats = [
  {
    icon: <GraduationCap size={20} />,
    value: "500+",
    label: "Learners & counting",
  },
  {
    icon: <BookOpen size={20} />,
    value: "800+",
    label: "Courses & Video",
  },
  {
    icon: <Award size={20} />,
    value: "1000+",
    label: "Certified Students",
  },
  {
    icon: <Users size={20} />,
    value: "100+",
    label: "Registered Enrolls",
  },
];

export default function StatsTimeline() {
  return (
    <section className="relative -mt-px overflow-hidden bg-white px-6 pb-24 pt-20 dark:bg-[#101b2d]">
      {/* Light soft glow */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute left-1/2 top-8 h-72 w-[680px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-[90px]" />
      </div>

      {/* Dark shine */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.14),transparent_32%),radial-gradient(circle_at_85%_30%,rgba(99,102,241,0.13),transparent_35%)]" />
        <div className="dark-section-shine absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-700 shadow-sm dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
          Why Choose Us
        </span>

        <h2 className="mx-auto mb-14 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white lg:text-5xl">
          Creating A Community Of <br /> Life Long Learners.
        </h2>

        <div className="relative">
          <div className="absolute left-[8%] right-[8%] top-3 hidden h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-rose-200/35 xl:block" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div className="relative z-20 hidden h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white shadow-[0_0_0_6px_rgba(37,99,235,0.08)] dark:border-rose-200 dark:bg-[#101b2d] dark:shadow-[0_0_0_6px_rgba(251,207,232,0.08)] xl:flex">
                  <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-rose-200" />
                </div>

                <div className="relative z-10 hidden h-10 w-px bg-blue-200 dark:bg-rose-200/35 xl:block" />

                <div className="group relative w-full max-w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 pb-8 pt-8 shadow-[0_22px_65px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_25px_70px_rgba(0,0,0,0.38)] dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.16)]">
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 dark:from-rose-200 dark:via-rose-300 dark:to-pink-300" />

                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white dark:border-white/10 dark:bg-[#1b2638] dark:text-rose-200 dark:group-hover:bg-rose-200 dark:group-hover:text-black">
                    {item.icon}
                  </div>

                  <h3 className="text-3xl font-bold text-blue-700 dark:text-rose-200">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
