"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ClipboardCheck,
  MoveRight,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { ExamHistoryRecord } from "@/types/exam";

export function ExamHistory({ records }: { records: ExamHistoryRecord[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
            Final Exam History
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Track every exam you have attempted
          </h3>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Review your latest exam scores, attempt counts, and cleared courses in
          one place.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center dark:border-white/10 dark:bg-[#0b1628]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <ClipboardCheck className="h-8 w-8" />
          </div>

          <h4 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
            No final exam attempts yet
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
            Complete your course lessons and take the final exam when it
            unlocks. Your results will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {records.map((record) => (
            <article
              key={record.course.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:border-blue-100 hover:shadow-[0_26px_80px_rgba(37,99,235,0.1)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.12)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
                    {record.attemptsCount} attempt
                    {record.attemptsCount > 1 ? "s" : ""}
                  </p>

                  <h4 className="mt-2 line-clamp-2 text-lg font-semibold leading-7 text-slate-950 dark:text-white">
                    {record.course.title}
                  </h4>
                </div>

                <ExamStatusBadge passed={record.passed} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Metric
                  icon={ClipboardCheck}
                  label="Latest Score"
                  value={`${record.latestScore}/${record.latestMaxScore}`}
                />

                <Metric
                  icon={RotateCcw}
                  label="Latest %"
                  value={`${record.latestPercentage}%`}
                  featured
                />

                <Metric
                  icon={Trophy}
                  label="Best Score"
                  value={`${record.bestScore}%`}
                />
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Last attempted
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(record.lastAttemptedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <Link
                  href={`/course/${record.course.slug}/learn`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                >
                  Open course
                  <MoveRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ExamStatusBadge({ passed }: { passed: boolean }) {
  return (
    <span
      className={
        passed
          ? "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300"
          : "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-300"
      }
    >
      {passed ? (
        <BadgeCheck className="h-4 w-4" />
      ) : (
        <ClipboardCheck className="h-4 w-4" />
      )}
      {passed ? "Passed" : "In Progress"}
    </span>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  featured = false,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div
      className={
        featured
          ? "flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 dark:border-rose-200/20 dark:bg-rose-200/10"
          : "flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-[#0b1628]"
      }
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
        <Icon className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="text-lg font-semibold leading-none text-slate-950 dark:text-white">
          {value}
        </p>

        <p
          className={
            featured
              ? "mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-rose-200"
              : "mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
          }
        >
          {label}
        </p>
      </div>
    </div>
  );
}
