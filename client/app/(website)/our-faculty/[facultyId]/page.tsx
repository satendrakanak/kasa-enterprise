import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container";
import { CourseCard } from "@/components/courses/course-card";
import { FacultyReviewsSection } from "@/components/faculty/faculty-reviews-section";
import { getSession } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { userServerService } from "@/services/users/user.server";

type PageProps = {
  params: Promise<{ facultyId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { facultyId } = await params;

  try {
    const response = await userServerService.getFacultyProfile(Number(facultyId));
    const faculty = response.data;
    const fullName =
      [faculty.firstName, faculty.lastName].filter(Boolean).join(" ") ||
      "Faculty";

    return buildMetadata({
      title: fullName,
      description:
        faculty.profile?.bio ||
        faculty.facultyProfile?.expertise ||
        "Meet our faculty and explore learner feedback.",
      path: `/our-faculty/${faculty.id}`,
      image: faculty.avatar?.path || faculty.coverImage?.path || null,
    });
  } catch {
    return buildMetadata({
      title: "Faculty",
      description: "Meet the faculty behind Unitus Health Academy.",
      path: `/our-faculty/${facultyId}`,
    });
  }
}

export default async function FacultyDetailPage({ params }: PageProps) {
  const { facultyId } = await params;

  try {
    const response = await userServerService.getFacultyProfile(Number(facultyId));
    const faculty = response.data;
    const session = await getSession();
    const fullName = [faculty.firstName, faculty.lastName]
      .filter(Boolean)
      .join(" ");
    const enrolledCourses = session
      ? (await userServerService.getEnrolledCourses(session.id)).data
      : [];
    const enrolledCourseMap = new Map(
      enrolledCourses.map((course) => [course.id, course]),
    );
    const taughtCourses =
      faculty.taughtCourses?.map((course) => {
        const enrolledCourse = enrolledCourseMap.get(course.id);
        if (!enrolledCourse) return course;

        return {
          ...course,
          isEnrolled: true,
          progress: enrolledCourse.progress,
        };
      }) || [];

    return (
      <div className="min-h-screen academy-surface">
        <section className="relative overflow-hidden border-b border-[var(--brand-100)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),linear-gradient(135deg,var(--brand-900)_0%,var(--brand-700)_45%,var(--brand-500)_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <Container>
            <div className="relative grid gap-8 py-10 md:py-12 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
              <div className="text-white">
                <Link
                  href="/our-faculty"
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90"
                >
                  Faculty profile
                </Link>
                <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                  {fullName}
                </h1>
                <p className="mt-3 text-base font-medium text-white/85 md:text-lg">
                  {faculty.facultyProfile?.designation || "Faculty Mentor"}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                  {faculty.profile?.bio ||
                    faculty.facultyProfile?.expertise ||
                    "Experienced faculty member helping learners build practical confidence."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {faculty.facultyProfile?.experience ? (
                    <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/90">
                      {faculty.facultyProfile.experience} years experience
                    </span>
                  ) : null}
                  {faculty.profile?.headline ? (
                    <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/90">
                      {faculty.profile.headline}
                    </span>
                  ) : null}
                  {faculty.profile?.location ? (
                    <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/90">
                      {faculty.profile.location}
                    </span>
                  ) : null}
                  {session && taughtCourses.some((course) => course.isEnrolled) ? (
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-50">
                      You are enrolled in {taughtCourses.filter((course) => course.isEnrolled).length} course
                      {taughtCourses.filter((course) => course.isEnrolled).length > 1 ? "s" : ""} by this faculty
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm lg:justify-self-end">
                <div className="overflow-hidden rounded-[30px] border border-white/15 bg-white/10 p-3 shadow-[0_32px_90px_-48px_rgba(15,23,42,0.8)] backdrop-blur-sm">
                  <div className="relative aspect-square overflow-hidden rounded-[24px] bg-white/10">
                    <Image
                      src={faculty.avatar?.path || "/assets/default.png"}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Container>
          <div className="space-y-12 py-14">
            {taughtCourses.length ? (
              <section className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">
                      Courses by faculty
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                      Learn directly from {faculty.firstName}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    Explore the programs this faculty currently teaches inside
                    the academy.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {taughtCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            ) : null}

            <FacultyReviewsSection faculty={faculty} />
          </div>
        </Container>
      </div>
    );
  } catch {
    notFound();
  }
}
