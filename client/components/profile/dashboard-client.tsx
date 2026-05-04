"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CourseCard } from "../courses/course-card";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Course } from "@/types/course";
import { DashboardStats, WeeklyProgress } from "@/types/user";
import { Order } from "@/types/order";
import { OrderHistory } from "./order-history";
import { ExamHistoryRecord } from "@/types/exam";
import { ExamHistory } from "./exam-history";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";

interface DashboardClientProps {
  stats: DashboardStats;
  courses: Course[];
  weeklyProgress: WeeklyProgress[];
  orders: Order[];
  examHistory: ExamHistoryRecord[];
}

export default function DashboardClient({
  stats,
  courses,
  weeklyProgress,
  orders,
  examHistory,
}: DashboardClientProps) {
  const ProgressChart = dynamic(
    () => import("@/components/profile/progress-chart"),
    { ssr: false },
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={BookOpenCheck}
          title="Courses Completed"
          value={`${stats.completed}/${stats.courses}`}
          description="Completed courses out of your total active enrollments."
        />

        <StatCard
          icon={BarChart3}
          title="Average Progress"
          value={`${stats.progress}%`}
          description="Overall learning momentum across enrolled courses."
          highlight
        />

        <StatCard
          icon={ClipboardCheck}
          title="Exam Attempts"
          value={stats.examsTaken}
          description="Total final exam submissions across your courses."
        />

        <StatCard
          icon={GraduationCap}
          title="Exams Passed"
          value={stats.examsPassed}
          description="Final exams you have cleared successfully."
        />

        <StatCard
          icon={Award}
          title="Certificates"
          value={stats.certificatesEarned}
          description="Certificates unlocked after completion milestones."
        />
      </div>

      <ProgressChart weeklyProgress={weeklyProgress} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Continue Learning
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              Pick up where you left off
            </h3>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Resume your latest courses, keep the streak alive, and move one step
            closer to completion.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center dark:border-white/10 dark:bg-[#0b1628]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
              <BookOpenCheck className="h-8 w-8" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-slate-950 dark:text-white">
              No courses yet
            </h3>

            <p className="mb-6 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              You haven’t enrolled in any courses yet. Start learning something
              new today.
            </p>

            <Link
              href="/courses"
              className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <OrderHistory
          orders={orders}
          enrolledCourses={courses}
          limit={2}
          showViewAll
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <ExamHistory records={examHistory} />
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  highlight = false,
}: {
  icon: typeof BookOpenCheck;
  title: string;
  value: string | number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={
        highlight
          ? "overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/80 shadow-[0_20px_60px_rgba(37,99,235,0.08)] dark:border-rose-200/20 dark:bg-rose-200/10 dark:shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
          : "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
      }
    >
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <Icon className="h-5 w-5" />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {value}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
