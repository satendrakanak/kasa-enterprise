import { BookOpenCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CourseCard } from "@/components/courses/course-card";
import { getSession } from "@/lib/auth";
import { getErrorMessage } from "@/lib/error-handler";
import { userServerService } from "@/services/users/user.server";
import { Course } from "@/types/course";

export default async function MyCoursesPage() {
  const session = await getSession();
  if (!session) return null;

  let enrolledCourses: Course[] = [];

  try {
    const response = await userServerService.getEnrolledCourses(session.id);
    enrolledCourses = response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }

  return (
    <section className="min-h-[60vh] space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Learning Library
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              My Courses
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Continue your enrolled programs and keep your learning progress
              moving.
            </p>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              <BookOpenCheck className="h-4 w-4" />
              {enrolledCourses.length}{" "}
              {enrolledCourses.length > 1 ? "courses" : "course"}
            </div>
          ) : null}
        </div>
      </div>

      {/* EMPTY STATE */}
      {enrolledCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <BookOpenCheck className="h-10 w-10" />
          </div>

          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
            No courses yet
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
            You haven’t enrolled in any courses yet. Explore available programs
            and start learning something new today.
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-rose-200 dark:text-black dark:hover:bg-rose-300"
          >
            Explore Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
