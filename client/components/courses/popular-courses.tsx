import { CouponBulkClient } from "../coupon/coupon-bulk-client";
import { Course } from "@/types/course";

interface PopularCoursesProps {
  courses: Course[];
}

export default function PopularCourses({ courses }: PopularCoursesProps) {
  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-[#101b2d]">
      {/* Light mode premium blue background */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#eef6ff] to-white" />

        <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/80 blur-[100px]" />

        <div className="absolute -left-36 top-24 h-96 w-96 rounded-full bg-sky-200/45 blur-[110px]" />

        <div className="absolute right-[-140px] bottom-0 h-96 w-96 rounded-full bg-blue-300/35 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.10),transparent_38%)]" />
      </div>

      {/* Dark mode glossy shine */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="dark-section-shine absolute inset-0 opacity-35" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-700 shadow-sm backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
            Popular Courses
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Choose a path that feels purposeful, not overwhelming.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Explore our most loved programs, curated for practical learning and
            real momentum.
          </p>
        </div>

        {/* GRID */}
        <CouponBulkClient courses={courses} />
      </div>
    </section>
  );
}
