"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";

import { CourseCard } from "../courses/course-card";
import { StatCard } from "./stat-card";
import { OrderHistory } from "./order-history";
import { ExamHistory } from "./exam-history";
import { Course } from "@/types/course";
import { DashboardStats, User, WeeklyProgress } from "@/types/user";
import { Order } from "@/types/order";
import { ExamHistoryRecord } from "@/types/exam";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { DateRangeValue, updateDateRangeSearchParams } from "@/lib/date-range";

const ProgressChart = dynamic(
  () => import("@/components/profile/progress-chart"),
  { ssr: false },
);

interface DashboardClientProps {
  stats: DashboardStats;
  courses: Course[];
  weeklyProgress: WeeklyProgress[];
  orders: Order[];
  examHistory: ExamHistoryRecord[];
  user: User;
  dateRange: DateRangeValue;
}

export default function DashboardClient({
  stats,
  courses,
  weeklyProgress,
  orders,
  examHistory,
  user,
  dateRange,
}: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDateRangeApply = (nextRange: DateRangeValue) => {
    const params = updateDateRangeSearchParams(searchParams, nextRange);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <DateRangeFilter value={dateRange} onChange={handleDateRangeApply} />
      </div>

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

      <section className="academy-card p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-2 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Continue Learning
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-card-foreground">
              Pick up where you left off
            </h3>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Resume your latest courses, keep the streak alive, and move one step
            closer to completion.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/50 p-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <BookOpenCheck className="h-8 w-8" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-card-foreground">
              No courses yet
            </h3>

            <p className="mb-6 max-w-md text-sm leading-7 text-muted-foreground">
              You haven’t enrolled in any courses yet. Start learning something
              new today.
            </p>

            <Link
              href="/courses"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_14px_35px_color-mix(in_oklab,var(--primary)_24%,transparent)] transition hover:-translate-y-0.5 hover:bg-primary/90"
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

      <section className="academy-card p-5 md:p-6">
        <OrderHistory
          orders={orders}
          enrolledCourses={courses}
          limit={2}
          showViewAll
          canRequestRefund={user.canRequestRefund}
        />
      </section>

      <section className="academy-card p-5 md:p-6">
        <ExamHistory records={examHistory} />
      </section>
    </div>
  );
}
