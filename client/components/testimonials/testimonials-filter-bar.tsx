"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Course } from "@/types/course";

export const TestimonialsFilterBar = ({ courses }: { courses: Course[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
    });
  };

  const hasFilters =
    Boolean(searchParams.get("type")) || Boolean(searchParams.get("courseId"));

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
          <SlidersHorizontal className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            Filter testimonials
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Browse written reviews or watch video stories course-wise.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <NativeSelect
          aria-label="Filter by testimonial type"
          className="h-11 w-full rounded-full border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 shadow-none focus:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-200 dark:focus:ring-rose-200 sm:w-52"
          value={searchParams.get("type") || "all"}
          onChange={(event) => updateFilters({ type: event.target.value })}
        >
          <NativeSelectOption value="all">All Types</NativeSelectOption>
          <NativeSelectOption value="TEXT">
            Text Testimonials
          </NativeSelectOption>
          <NativeSelectOption value="VIDEO">
            Video Testimonials
          </NativeSelectOption>
        </NativeSelect>

        <NativeSelect
          aria-label="Filter by course"
          className="h-11 w-full rounded-full border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 shadow-none focus:ring-blue-600 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-200 dark:focus:ring-rose-200 sm:w-72"
          value={searchParams.get("courseId") || "all"}
          onChange={(event) => updateFilters({ courseId: event.target.value })}
        >
          <NativeSelectOption value="all">All Courses</NativeSelectOption>

          {courses.map((course) => (
            <NativeSelectOption key={course.id} value={String(course.id)}>
              {course.title}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <Button
          type="button"
          variant="outline"
          disabled={!hasFilters}
          className="h-11 rounded-full border-slate-200 bg-white px-5 font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
          onClick={() =>
            startTransition(() => {
              router.push(pathname);
            })
          }
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};
