import { Course } from "@/types/course";
import Container from "../container";
import CourseRatingDetails from "../courses/course-rating-details";
import CourseAuthor from "./course-author";
import CourseUpdateDetails from "../courses/course-update-details";
import guestAuthor from "@/public/assets/guest-user.webp";
import { formatDate } from "@/utils/formate-date";

interface CourseHeroProps {
  course: Course;
}

export const CourseHero = ({ course }: CourseHeroProps) => {
  return (
    <section className="relative overflow-hidden py-16 text-white dark:bg-[#101b2d] lg:py-20">
      {/* LIGHT MODE - SAME HERO BLUE THEME */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.84),rgba(2,6,23,0.36),rgba(2,6,23,0.62))]" />
      </div>

      {/* DARK MODE */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="dark-section-shine absolute inset-0 opacity-30" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-12 items-start gap-8">
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-xs font-semibold text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(2,6,23,0.20)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              Certified Course
            </div>

            <h1 className="mb-4 text-center text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-left lg:text-[50px]">
              {course.title}
            </h1>

            {course.shortDescription && (
              <p className="mx-auto mb-5 max-w-2xl text-center text-sm leading-7 text-white/78 md:text-base lg:mx-0 lg:text-left">
                {course.shortDescription}
              </p>
            )}

            <div className="mb-5">
              <CourseRatingDetails
                rating={4.8}
                reviews={1560}
                enrolledStudentCount={2365}
              />
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-start">
              <CourseAuthor
                authorName={`${course.updatedBy.firstName} ${course.updatedBy.lastName}`}
                authorPhoto={guestAuthor}
              />

              <div className="inline-flex rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-[0_18px_55px_rgba(2,6,23,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <CourseUpdateDetails
                  lastUpdateDate={formatDate(course.updatedAt)}
                  language={course.language || "English"}
                  certificate="Certified Course"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block" />
        </div>
      </Container>
    </section>
  );
};
