"use client";

import Image from "next/image";
import { BookOpen, Star, Users, UserRound } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { Course } from "@/types/course";
import Link from "next/link";

interface CourseInstructorProps {
  course: Course;
}

export const CourseInstructor = ({ course }: CourseInstructorProps) => {
  const faculties = course.faculties || [];

  if (faculties.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Instructor
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/70 px-6 py-12 text-center dark:border-white/10 dark:bg-[#0b1628]">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <UserRound className="h-7 w-7" />
          </div>

          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            No instructor assigned yet
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Instructor details will appear here once assigned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Instructor{faculties.length > 1 ? "s" : ""}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Meet the faculty guiding this course with practical experience and
          subject depth.
        </p>
      </div>

      <div className="space-y-5">
        {faculties.map((instructor) => {
          const profile = instructor.profile;
          const facultyProfile = instructor.facultyProfile;
          const name = `${instructor.firstName || ""} ${
            instructor.lastName || ""
          }`.trim();

          const avatar = instructor.avatar?.path || "/assets/default.png";

          const bio = instructor.profile?.bio
            ? instructor.profile.bio.length > 220
              ? `${instructor.profile.bio.slice(0, 220)}...`
              : instructor.profile.bio
            : "This instructor has not added a bio yet.";

          const socials = [
            {
              href: profile?.linkedin,
              icon: FaLinkedinIn,
              label: "LinkedIn",
            },
            {
              href: profile?.facebook,
              icon: FaFacebookF,
              label: "Facebook",
            },
            {
              href: profile?.instagram,
              icon: FaInstagram,
              label: "Instagram",
            },
            {
              href: profile?.twitter,
              icon: FaXTwitter,
              label: "X",
            },
          ].filter((item) => Boolean(item.href));

          return (
            <div
              key={instructor.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-[0_16px_48px_rgba(37,99,235,0.08)] dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.045] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-5"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-0 transition group-hover:opacity-100">
                <div className="h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.10),transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(251,113,133,0.12),transparent_65%)]" />
              </div>

              <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-start">
                <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-[0_14px_36px_rgba(15,23,42,0.12)] ring-1 ring-blue-100 dark:border-[#0b1628] dark:bg-white/10 dark:ring-white/10 md:mx-0">
                  <Image
                    src={avatar}
                    alt={name || "Instructor"}
                    fill
                    sizes="112px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1 text-center md:text-left">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <Link href={`/our-faculty/${instructor.id}`}>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                          {name || "Course Instructor"}
                        </h3>
                      </Link>

                      <p className="mt-1 text-sm font-semibold text-blue-700 dark:text-rose-200">
                        {facultyProfile?.designation || "Course Instructor"}
                      </p>
                    </div>

                    {socials.length > 0 && (
                      <div className="flex justify-center gap-2 md:justify-end">
                        {socials.map((social) => {
                          const Icon = social.icon;

                          return (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={social.label}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 md:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/10">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      -- Rating
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/10">
                      <Users className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
                      -- Students
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/10">
                      <BookOpen className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
                      -- Courses
                    </span>
                  </div>

                  {facultyProfile?.expertise && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 dark:border-white/10 dark:bg-[#07111f]">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Expertise
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {facultyProfile.expertise}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
