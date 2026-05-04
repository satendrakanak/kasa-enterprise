import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  ClipboardCheck,
  Globe,
  MapPin,
  Trophy,
} from "lucide-react";

import Container from "@/components/container";
import { ProfileCover } from "@/components/profile/profile-cover";
import { ProfileHeader } from "@/components/profile/profile-header";
import ProgressChart from "@/components/profile/progress-chart";
import { userServerService } from "@/services/users/user.server";
import { Course } from "@/types/course";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

type PageProps = {
  params: Promise<{ username: string }>;
};

const reserved = [
  "dashboard",
  "login",
  "courses",
  "orders",
  "settings",
  "profile",
  "exams",
  "certificates",
  "articles",
  "article",
  "course",
  "contact",
  "cart",
  "checkout",
  "our-faculty",
  "client-testimonials",
  "auth",
  "admin",
  "api",
];

export default async function PublicProfilePage({ params }: PageProps) {
  const { username: rawUsername } = await params;

  const username = rawUsername.startsWith("@")
    ? rawUsername.slice(1)
    : rawUsername;

  if (reserved.includes(username)) {
    return notFound();
  }

  const response = await userServerService.getPublicProfile(username);
  const bundle = response.data;

  if (!bundle) {
    return notFound();
  }

  const { user, stats, weeklyProgress, courses, certificates, examHistory } =
    bundle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:bg-[#101b2d] dark:bg-none">
      <Container>
        <div className="pb-12 pt-6">
          <ProfileCover coverImage={user.coverImage?.path} isOwner={false} />

          <div className="relative z-10 px-2 md:px-6">
            <ProfileHeader user={user} isOwner={false} stats={stats} />
          </div>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
              <SectionHeader
                icon={BookOpenCheck}
                eyebrow="About"
                title="Learning journey in focus"
                description="A public snapshot of this learner’s progress, exams, recognitions, and visible course portfolio."
              />

              <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                {user.profile?.bio ||
                  "This learner has made the profile public to showcase educational momentum, exam activity, and earned recognitions."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatPill label="Courses" value={String(stats.courses)} />
                <StatPill
                  label="Progress"
                  value={`${stats.progress}%`}
                  active
                />
                <StatPill
                  label="Passed Exams"
                  value={String(stats.examsPassed)}
                />
                <StatPill
                  label="Certificates"
                  value={String(stats.certificatesEarned)}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {user.profile?.website ? (
                  <ActionBadge
                    href={user.profile.website}
                    icon={<Globe className="h-4 w-4" />}
                  >
                    Visit website
                  </ActionBadge>
                ) : null}

                {user.profile?.linkedin ? (
                  <ActionBadge
                    href={user.profile.linkedin}
                    icon={<FaLinkedinIn className="h-4 w-4" />}
                  >
                    LinkedIn
                  </ActionBadge>
                ) : null}

                {user.profile?.instagram ? (
                  <ActionBadge
                    href={user.profile.instagram}
                    icon={<FaInstagram className="h-4 w-4" />}
                  >
                    Instagram
                  </ActionBadge>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-5">
              <ProgressChart weeklyProgress={weeklyProgress} />
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
              <SectionHeader
                icon={ClipboardCheck}
                eyebrow="Final Exam Highlights"
                title="Public assessment report"
                description="Published exam activity and assessment progress visible on this profile."
              />

              {examHistory.length === 0 ? (
                <EmptyBlock
                  icon={ClipboardCheck}
                  title="No final exam activity"
                  description="No public final exam activity is available on this profile yet."
                />
              ) : (
                <div className="mt-5 space-y-4">
                  {examHistory.map((item) => (
                    <div
                      key={item.courseId}
                      className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="line-clamp-2 text-base font-semibold text-slate-950 dark:text-white">
                            {item.courseTitle}
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {item.attempts} attempt
                            {item.attempts > 1 ? "s" : ""} • Best{" "}
                            {item.bestPercentage}% • Latest{" "}
                            {item.latestPercentage}%
                          </p>
                        </div>

                        <span
                          className={
                            item.passed
                              ? "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300"
                              : "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 text-xs font-bold text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-300"
                          }
                        >
                          {item.passed ? (
                            <BadgeCheck className="h-4 w-4" />
                          ) : (
                            <ClipboardCheck className="h-4 w-4" />
                          )}
                          {item.passed ? "Passed" : "In Progress"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
              <SectionHeader
                icon={Award}
                eyebrow="Certificate Wall"
                title="Earned recognitions"
                description="Certificates shared publicly by this learner."
              />

              {certificates.length === 0 ? (
                <EmptyBlock
                  icon={Award}
                  title="No public certificates"
                  description="No certificates are public on this profile yet."
                />
              ) : (
                <div className="mt-5 space-y-4">
                  {certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4 dark:border-rose-200/20 dark:bg-rose-200/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
                          <Trophy className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-base font-semibold text-slate-950 dark:text-white">
                            {certificate.course.title}
                          </p>

                          <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-300">
                            Certificate #{certificate.certificateNumber}
                          </p>

                          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-rose-200">
                            Issued{" "}
                            {new Date(certificate.issuedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {courses.length ? (
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
              <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
                    Visible Courses
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                    Public learning portfolio
                  </h3>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Public profile par learner access ya internal progress show
                  nahi hota. Yahan sirf visible course showcase dikh raha hai.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <PublicCourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof BookOpenCheck;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-5 dark:border-white/10">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:text-rose-200">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? "flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 dark:border-rose-200/20 dark:bg-rose-200/10"
          : "flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-[#0b1628]"
      }
    >
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-none text-slate-950 dark:text-white">
          {value}
        </p>

        <p
          className={
            active
              ? "mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-rose-200"
              : "mt-1.5 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
          }
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function SoftBadge({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: typeof MapPin;
}) {
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
      {Icon ? (
        <Icon className="h-4 w-4 text-blue-700 dark:text-rose-200" />
      ) : null}
      {children}
    </span>
  );
}

function ActionBadge({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
    >
      <span className="text-blue-700 transition group-hover:text-white dark:text-rose-200">
        {icon}
      </span>
      {children}
    </Link>
  );
}

function EmptyBlock({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Award;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-white/10 dark:bg-[#0b1628]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
        <Icon className="h-7 w-7" />
      </div>

      <p className="text-sm font-semibold text-slate-800 dark:text-white">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function PublicCourseCard({ course }: { course: Course }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_26px_80px_rgba(37,99,235,0.1)] dark:border-white/10 dark:bg-[#0b1628] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_30px_90px_rgba(244,63,94,0.12)]">
      <Link href={`/course/${course.slug}`} className="block">
        <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-white/5">
          <Image
            src={course.image?.path || "/assets/default.png"}
            alt={course.imageAlt || course.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/55 via-transparent to-transparent opacity-70" />
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/course/${course.slug}`}>
          <h4 className="line-clamp-2 text-lg font-semibold leading-7 text-slate-950 transition hover:text-blue-700 dark:text-white dark:hover:text-rose-200">
            {course.title}
          </h4>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {course.shortDescription ||
            "A public showcase course from this learner's visible portfolio."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
          {course.experienceLevel ? (
            <CourseTag>{course.experienceLevel}</CourseTag>
          ) : null}
          {course.language ? <CourseTag>{course.language}</CourseTag> : null}
        </div>
      </div>
    </article>
  );
}

function CourseTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
      {children}
    </span>
  );
}
