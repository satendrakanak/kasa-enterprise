"use client";

import { Award, BookOpenCheck, ClipboardCheck, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/types/user";

interface ProfileInfoProps {
  name: string;
  email?: string;
  stats?: DashboardStats;
}

export function ProfileInfo({ name, email, stats }: ProfileInfoProps) {
  const statItems = stats
    ? [
        {
          label: "Courses Completed",
          value: `${stats.completed || 0}/${stats.courses || 0}`,
          icon: BookOpenCheck,
          featured: false,
        },
        {
          label: "Exam Attempts",
          value: stats.examsTaken || 0,
          icon: ClipboardCheck,
          featured: false,
        },
        {
          label: "Progress",
          value: `${stats.progress || 0}%`,
          icon: TrendingUp,
          featured: true,
        },
        {
          label: "Certificates",
          value: stats.certificatesEarned || 0,
          icon: Award,
          featured: false,
        },
      ]
    : [];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
          Learner Profile
        </p>

        <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
          {name || "Learner"}
        </h1>

        {email ? (
          <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400 md:text-base">
            {email}
          </p>
        ) : null}
      </div>

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={
                  item.featured
                    ? "flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 shadow-sm dark:border-rose-200/20 dark:bg-rose-200/10"
                    : "flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#0b1628]"
                }
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-none text-slate-950 dark:text-white">
                    {item.value}
                  </p>

                  <p
                    className={
                      item.featured
                        ? "mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-rose-200"
                        : "mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
                    }
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
