import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Layers,
  PenLine,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FacultyWorkspaceData } from "@/types/faculty-workspace";
import { formatDate, formatDateTime } from "@/utils/formate-date";

type FacultyDashboardProps = {
  data: FacultyWorkspaceData;
};

export function FacultyDashboard({ data }: FacultyDashboardProps) {
  const stats = [
    {
      label: "Assigned courses",
      value: data.summary.assignedCourses,
      icon: BookOpen,
    },
    {
      label: "Active students",
      value: data.summary.activeStudents,
      icon: Users,
    },
    {
      label: "Assigned exams",
      value: data.summary.assignedExams,
      icon: ClipboardCheck,
    },
    {
      label: "Upcoming classes",
      value: data.summary.upcomingClasses,
      icon: CalendarDays,
    },
    {
      label: "Pending reminders",
      value: data.summary.pendingReminders,
      icon: Bell,
    },
    {
      label: "Manual reviews",
      value: data.summary.pendingManualReviews,
      icon: PenLine,
    },
    {
      label: "Active batches",
      value: data.summary.activeBatches,
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Faculty workspace
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Your teaching operations, in one place.
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage assigned courses, exams, batches, calendar sessions, and
              reminder readiness from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/faculty/exams">Review exams</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faculty/calendar">Open calendar</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <stat.icon className="size-5" />
            </div>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Assigned courses"
          description="Courses connected to your faculty profile."
          actionHref="/faculty/courses"
          actionLabel="View courses"
        >
          <div className="space-y-3">
            {data.courses.length ? (
              data.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.studentsCount} active students
                    </p>
                  </div>
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState text="No course has been assigned yet." />
            )}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Assigned exams"
          description="Assessments you can manage or review."
          actionHref="/faculty/exams"
          actionLabel="View exams"
        >
          <div className="space-y-3">
            {data.exams.length ? (
              data.exams.map((exam) => (
                <div key={exam.id} className="rounded-xl border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {exam.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {exam.courses.map((course) => course.title).join(", ") ||
                          "No course mapped"}
                      </p>
                    </div>
                    <Badge variant="outline">{exam.status}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {exam.attemptsCount} submitted attempts
                  </p>
                </div>
              ))
            ) : (
              <EmptyState text="No exam has been assigned yet." />
            )}
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardPanel
          title="Recent exam activity"
          description="Latest submissions from your assigned courses."
          actionHref="/faculty/students"
          actionLabel="View learners"
        >
          <div className="space-y-3">
            {data.recentAttempts.length ? (
              data.recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="grid gap-3 rounded-xl border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {attempt.learnerName}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {attempt.examTitle} - {attempt.courseTitle}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {attempt.submittedAt
                        ? formatDateTime(attempt.submittedAt)
                        : "Not submitted"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Badge variant={attempt.passed ? "default" : "secondary"}>
                      {attempt.passed ? "Passed" : attempt.status}
                    </Badge>
                    <span className="text-sm font-semibold">
                      {attempt.percentage}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="No submitted attempts are available yet." />
            )}
          </div>
        </DashboardPanel>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <DashboardPanel
            title="Batch activity"
            description={`${data.summary.activeBatches} active and ${data.summary.upcomingBatches} upcoming batches.`}
            actionHref="/faculty/batches"
            actionLabel="Manage batches"
          >
            <div className="space-y-3">
              {data.batches.length ? (
                data.batches.map((batch) => (
                  <div key={batch.id} className="rounded-xl border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{batch.name}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {batch.courseTitle}
                        </p>
                      </div>
                      <Badge variant="outline">{batch.status}</Badge>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {batch.studentsCount} students - {batch.sessionsCount} classes
                      {batch.endDate ? ` - Ends ${formatDate(batch.endDate)}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState text="No batch has been created yet." />
              )}
            </div>
          </DashboardPanel>
          <DashboardPanel
            title="Calendar and reminders"
            description={`${data.summary.upcomingClasses} upcoming classes and ${data.summary.pendingReminders} pending reminder mails.`}
            actionHref="/faculty/reminders"
            actionLabel="Open reminders"
          >
            <div className="space-y-3">
              {data.upcomingSessions.length ? (
                data.upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="grid gap-3 rounded-xl border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{session.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {session.courseTitle} - {session.batchName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(session.startsAt)}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {(session.reminderOffsetsMinutes ?? []).length} reminders
                    </Badge>
                  </div>
                ))
              ) : (
                <EmptyState text="No upcoming class is scheduled yet." />
              )}
            </div>
          </DashboardPanel>
        </div>
      </section>
    </div>
  );
}

function DashboardPanel({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-background p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
