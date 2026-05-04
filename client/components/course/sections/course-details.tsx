"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import {
  Monitor,
  Award,
  ClipboardList,
  Clock,
  BarChart,
  BookOpen,
  Book,
  Languages,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseDetailsProps {
  course: Course;
}

export const CourseDetails = ({ course }: CourseDetailsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const items = [
    {
      label: "Course Type",
      value: "100% Online Courses",
      icon: Monitor,
    },
    {
      label: "Certificate",
      value: course.certificate || "Course completion certificate provided",
      icon: Award,
    },
    {
      label: "Exams",
      value: course.exams || "Exam conducted after course completion",
      icon: ClipboardList,
    },
    {
      label: "Duration",
      value: course.duration || "N/A",
      icon: Clock,
    },
    {
      label: "Experience Level",
      value: course.experienceLevel || "No prior experience required",
      icon: BarChart,
    },
    {
      label: "Study Material",
      value: "Included in the course",
      icon: BookOpen,
    },
    {
      label: "Additional Book",
      value: "Everyday Ayurveda : Daily Habits That Can Change Your Life",
      icon: Book,
    },
    {
      label: "Language",
      value: course.language || "English - Hindi",
      icon: Languages,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-5 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Course Details
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Important information about course format, level, certificate, and
          learning resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = expandedIndex === index;
          const isLong = item.value.length > 80;

          return (
            <div
              key={index}
              className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/60 hover:shadow-[0_14px_40px_rgba(37,99,235,0.08)] dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.055] dark:hover:shadow-[0_18px_55px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-white/10 dark:text-rose-200 dark:ring-white/10 dark:group-hover:bg-rose-200 dark:group-hover:text-black">
                  <Icon className="h-5 w-5 stroke-[1.9]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>

                  <p className="text-sm font-medium leading-6 text-slate-800 dark:text-slate-100">
                    {isExpanded
                      ? item.value
                      : isLong
                        ? `${item.value.slice(0, 80)}...`
                        : item.value}
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex(isExpanded ? null : index)
                      }
                      className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-700 transition hover:text-blue-800 dark:text-rose-200 dark:hover:text-rose-100"
                    >
                      {isExpanded ? "Show less" : "Show more"}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
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
