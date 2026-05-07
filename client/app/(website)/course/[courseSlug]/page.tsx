import Container from "@/components/container";
import { CourseHero } from "@/components/course/course-hero";
import { CourseSidebarCard } from "@/components/course/course-sidebar-card";
import { CourseTabs } from "@/components/course/course-tabs";
import { RelatedCourses } from "@/components/course/related-courses";
import { getErrorMessage } from "@/lib/error-handler";
import { courseServerService } from "@/services/courses/course.server";
import { testimonialServerService } from "@/services/testimonials/testimonial.server";
import { Course } from "@/types/course";
import { Testimonial } from "@/types/testimonial";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type CoursePageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseSlug } = await params;

  try {
    const response = await courseServerService.getBySlug(courseSlug);
    const course = response.data;

    return buildMetadata({
      title: course.metaTitle || course.title,
      description:
        course.metaDescription || course.shortDescription || course.description,
      path: `/course/${course.slug}`,
      image: course.image?.path,
    });
  } catch {
    return buildMetadata({
      title: "Course not found",
      description: "This course is not currently available.",
      path: `/course/${courseSlug}`,
    });
  }
}

export default async function CourseSlugPage({ params }: CoursePageProps) {
  const { courseSlug } = await params;

  if (!courseSlug) {
    notFound();
  }

  let course: Course;

  try {
    const response = await courseServerService.getBySlug(courseSlug);
    course = response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error).toLowerCase();
    if (message.includes("not found") || message.includes("404")) {
      notFound();
    }
    throw new Error(getErrorMessage(error));
  }

  let relatedCourses: Course[] = [];
  try {
    const response = await courseServerService.getRealtedCourses(course.id);
    relatedCourses = response.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }

  let testimonials: Testimonial[] = [];
  try {
    const response = await testimonialServerService.getPublic({
      courseId: course.id,
      limit: 6,
    });
    testimonials = response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }

  return (
    <div className="relative bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-(--surface-shell)" />
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <CourseHero course={course} />

        <Container>
          <div className="flex items-start gap-10">
            {/* LEFT */}
            <div className="mt-10 max-w-4xl flex-1">
              <CourseTabs course={course} testimonials={testimonials} />
            </div>

            {/* RIGHT */}
            <div className="sticky top-30 z-40 -mt-120 w-100">
              <CourseSidebarCard course={course} />
            </div>
          </div>
        </Container>

        <Container>
          <RelatedCourses courses={relatedCourses} />
        </Container>
      </div>
    </div>
  );
}
