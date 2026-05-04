"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  ClipboardCheck,
  Lock,
  Sparkles,
} from "lucide-react";

import { Course } from "@/types/course";
import { ExamHistoryRecord } from "@/types/exam";
import { ExamHistory } from "./exam-history";

interface ExamsViewProps {
  courses: Course[];
  examHistory: ExamHistoryRecord[];
}

export function ExamsView({ courses, examHistory }: ExamsViewProps) {
  const attemptedCourseIds = new Set(examHistory.map((item) => item.course.id));

  const upcomingExams = courses
    .filter((course) => course.exam?.isPublished)
    .map((course) => ({
      course,
      hasAttempted: attemptedCourseIds.has(course.id),
      progress: Math.round(course.progress?.progress || 0),
    }));

  const totalAttempts = examHistory.reduce(
    (sum, item) => sum + item.attemptsCount,
    0,
  );

  const passedCourses = examHistory.filter((item) => item.passed).length;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="pointer-events-none absolute inset-0 dark:hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100/70 blur-[90px]" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-100/70 blur-[90px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 hidden dark:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.14),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.12),transparent_36%)]" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Exam Centre
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Review every final exam, result, and next milestone.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400 md:text-base">
              See what is available now, what is still locked behind course
              completion, and how your final assessments are progressing.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <HeroMetric label="Exam courses" value={upcomingExams.length} />
            <HeroMetric label="Attempts tracked" value={totalAttempts} />
            <HeroMetric label="Passed courses" value={passedCourses} />
          </div>
        </div>
      </section>

      {/* UPCOMING EXAMS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Upcoming Exams
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              Courses with final assessments
            </h3>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            A final exam unlocks only after course completion. Open the course
            and continue learning to make an exam available.
          </p>
        </div>

        {upcomingExams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center dark:border-white/10 dark:bg-[#0b1628]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
              <ClipboardCheck className="h-8 w-8" />
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              No published final exams found
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              No published final exams are attached to your current enrollments.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {upcomingExams.map(({ course, hasAttempted, progress }) => {
              const unlocked = progress >= 100;

              return (
                <article
                  key={course.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:border-blue-100 hover:shadow-[0_26px_80px_rgba(37,99,235,0.1)] dark:border-white/10 dark:bg-[#0b1628] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
                        Final assessment
                      </p>

                      <h4 className="mt-2 line-clamp-2 text-lg font-semibold leading-7 text-slate-950 dark:text-white">
                        {course.title}
                      </h4>
                    </div>

                    <span
                      className={
                        unlocked
                          ? "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300"
                          : "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 text-xs font-bold text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-300"
                      }
                    >
                      {unlocked ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                      {unlocked ? "Available now" : "Locked"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>Course progress</span>
                      <span>{Math.min(progress, 100)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all dark:bg-rose-200"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {unlocked
                      ? "All course lectures are complete, so you can now take the final exam."
                      : `${progress}% course progress completed. Finish all lessons to unlock the exam.`}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 font-semibold dark:border-white/10 dark:bg-white/10">
                      <Clock3 className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
                      {course.exam?.timeLimitMinutes
                        ? `${course.exam.timeLimitMinutes} mins`
                        : "No time limit"}
                    </span>

                    <span className="inline-flex h-9 items-center rounded-full border border-slate-100 bg-slate-50 px-3 font-semibold dark:border-white/10 dark:bg-white/10">
                      {course.exam?.maxAttempts || "Unlimited"} attempts
                    </span>

                    {hasAttempted ? (
                      <span className="inline-flex h-9 items-center rounded-full border border-blue-100 bg-blue-50 px-3 font-semibold text-blue-700 dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
                        Attempted before
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/course/${course.slug}/learn`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                    >
                      Open learning screen
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* HISTORY */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <ExamHistory records={examHistory} />
      </section>
    </div>
  );
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#0b1628]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
        <ClipboardCheck className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="text-lg font-semibold leading-none text-slate-950 dark:text-white">
          {value}
        </p>

        <p className="mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}
