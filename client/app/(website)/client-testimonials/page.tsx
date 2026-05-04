import Container from "@/components/container";
import { TestimonialsFilterBar } from "@/components/testimonials/testimonials-filter-bar";
import { TestimonialsPagination } from "@/components/testimonials/testimonials-pagination";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { getErrorMessage } from "@/lib/error-handler";
import { buildMetadata } from "@/lib/seo";
import { courseServerService } from "@/services/courses/course.server";
import { testimonialServerService } from "@/services/testimonials/testimonial.server";
import { Course } from "@/types/course";
import { Testimonial, TestimonialType } from "@/types/testimonial";

const buildPageHref = (
  current: Record<string, string | undefined>,
  page: number,
) => {
  const params = new URLSearchParams();

  if (current.type) params.set("type", current.type);
  if (current.courseId) params.set("courseId", current.courseId);
  if (page > 1) params.set("page", String(page));

  return `/client-testimonials${params.toString() ? `?${params}` : ""}`;
};

export const metadata = buildMetadata({
  title: "Client Testimonials",
  description:
    "Explore learner stories, written testimonials, and video reviews from Unitus Health Academy students.",
  path: "/client-testimonials",
});

export default async function ClientTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    courseId?: string;
    page?: string;
  }>;
}) {
  const { type, courseId, page } = await searchParams;

  const selectedType =
    type === "TEXT" || type === "VIDEO" ? (type as TestimonialType) : undefined;

  const selectedCourseId = courseId ? Number(courseId) : undefined;
  const currentPage = page ? Math.max(Number(page), 1) : 1;

  let testimonials: Testimonial[] = [];
  let totalPages = 1;

  try {
    const response = await testimonialServerService.getPublic({
      type: selectedType,
      courseId: Number.isNaN(selectedCourseId) ? undefined : selectedCourseId,
      page: currentPage,
      limit: 9,
    });

    testimonials = response.data.data;
    totalPages = response.data.meta.totalPages || 1;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }

  let courses: Course[] = [];

  try {
    const response = await courseServerService.getAll();
    courses = response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }

  return (
    <div className="relative bg-linear-to-b from-slate-50 via-white to-slate-50 pb-20 dark:bg-[#101b2d] dark:bg-none">
      {/* HERO */}
      <section className="relative overflow-hidden py-14 text-white dark:bg-[#101b2d] md:py-16">
        {/* LIGHT MODE - HERO BLUE THEME */}
        <div className="pointer-events-none absolute inset-0 dark:hidden">
          <div className="absolute inset-0 academy-hero-animated-bg-light" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

          <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
          <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
          <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

          <div className="academy-hero-shine absolute inset-0 opacity-45" />
          <div className="academy-hero-grid absolute inset-0 opacity-20" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.82),rgba(2,6,23,0.32),rgba(2,6,23,0.58))]" />
        </div>

        {/* DARK MODE */}
        <div className="pointer-events-none absolute inset-0 hidden dark:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="dark-section-shine absolute inset-0 opacity-30" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(2,6,23,0.20)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              Client Testimonials
            </span>

            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-[46px]">
              Stories from learners who trusted the process and saw results.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
              Explore featured written reviews and video testimonials, then
              drill down by course to see exactly how learners experienced
              Unitus.
            </p>
          </div>
        </Container>
      </section>

      {/* CONTENT */}
      <section className="py-12">
        <Container>
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-5">
              <TestimonialsFilterBar courses={courses} />
            </div>

            {testimonials.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    variant="featured"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#07111f]">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  No testimonials found
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try changing the selected filters.
                </p>
              </div>
            )}

            <TestimonialsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={(nextPage) =>
                buildPageHref(
                  {
                    type: selectedType,
                    courseId,
                  },
                  nextPage,
                )
              }
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
