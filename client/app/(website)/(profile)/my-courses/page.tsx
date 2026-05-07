import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";

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
      <div className="academy-card p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Learning Library
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-card-foreground">
              My Courses
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Continue your enrolled programs and keep your learning progress
              moving.
            </p>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <BookOpenCheck className="h-4 w-4" />
              {enrolledCourses.length}{" "}
              {enrolledCourses.length > 1 ? "courses" : "course"}
            </div>
          ) : null}
        </div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="academy-card flex flex-col items-center justify-center border-dashed p-10 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <BookOpenCheck className="h-10 w-10" />
          </div>

          <h3 className="text-2xl font-semibold text-card-foreground">
            No courses yet
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
            You haven’t enrolled in any courses yet. Explore available programs
            and start learning something new today.
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_14px_35px_color-mix(in_oklab,var(--primary)_24%,transparent)] transition hover:-translate-y-0.5 hover:bg-primary/90"
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
