import { notFound, redirect } from "next/navigation";

import { Course } from "@/types/course";
import { courseServerService } from "@/services/courses/course.server";
import { LearnClient } from "@/components/course/learn/learn-client";
import { getErrorMessage } from "@/lib/error-handler";
import { EnrollmentGate } from "@/components/layout/enrollment-gate";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  // 🔥 future: fetch course from API
  const { courseSlug } = await params;

  if (!courseSlug) {
    notFound();
  }

  let course: Course | null = null;
  let hasAccess = true;

  try {
    const response =
      await courseServerService.getLearningCourseBySlug(courseSlug);

    course = response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    // 🔥 detect access error
    if (message.toLowerCase().includes("have access to this course")) {
      hasAccess = false;
    } else {
      throw error;
    }
  }

  return (
    <EnrollmentGate hasAccess={hasAccess} courseSlug={courseSlug}>
      {course && <LearnClient course={course} />}
    </EnrollmentGate>
  );
}
