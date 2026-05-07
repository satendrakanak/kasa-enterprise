import { CourseHeader } from "@/components/admin/courses/course-header";
import { RightSidebar } from "@/components/admin/courses/right-sidebar";
import { BasicInfoForm } from "@/components/admin/courses/basic-info-form";
import { CourseDetailsForm } from "@/components/admin/courses/course-details-form";
import { RequirementsForm } from "@/components/admin/courses/requirements-form";
import { MetaForm } from "@/components/admin/courses/meta-form";
import { CourseFaqsForm } from "@/components/admin/courses/course-faqs-form";
import { courseServerService } from "@/services/courses/course.server";
import ChaptersForm from "@/components/admin/courses/chapters-form";
import { Course } from "@/types/course";
import { CourseDescription } from "@/components/admin/courses/course-description-form";
import { getErrorMessage } from "@/lib/error-handler";

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ courseId: number }>;
}) {
  const { courseId } = await params;

  let course: Course;

  try {
    const response = await courseServerService.getById(courseId);
    course = response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }

  return (
    <div>
      <CourseHeader course={course} />

      <div className="grid gap-6 py-6 xl:grid-cols-[4fr_1fr]">
        <div className="space-y-6">
          <BasicInfoForm course={course} />
          <CourseDescription course={course} />
          <CourseDetailsForm course={course} />
          <ChaptersForm course={course} />
          <RequirementsForm course={course} />
          <MetaForm course={course} />
          <CourseFaqsForm course={course} />
        </div>

        <div className="space-y-6">
          <RightSidebar course={course} />
        </div>
      </div>
    </div>
  );
}
