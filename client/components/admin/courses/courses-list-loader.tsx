"use client";

import dynamic from "next/dynamic";

import { Course } from "@/types/course";

const CoursesList = dynamic(
  () => import("./courses-list").then((mod) => mod.CoursesList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-[28px] border border-slate-100 bg-slate-100/70" />
        <div className="h-96 animate-pulse rounded-[28px] border border-slate-100 bg-white" />
      </div>
    ),
  },
);

export function CoursesListLoader({ courses }: { courses: Course[] }) {
  return <CoursesList courses={courses} />;
}
