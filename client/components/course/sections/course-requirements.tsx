"use client";

import { Course } from "@/types/course";
import { Check, Info } from "lucide-react";

interface CourseRequirementsProps {
  course: Course;
}

const parseToArray = (value?: string): string[] => {
  if (!value) return [];

  return value
    .split("#")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const CourseRequirements = ({ course }: CourseRequirementsProps) => {
  const sections = [
    {
      title: "Technology Requirement",
      items: parseToArray(course.technologyRequirements!),
      fallback: ["Laptop and high speed internet."],
    },
    {
      title: "Eligibility Requirements",
      items: parseToArray(course.eligibilityRequirements!),
      fallback: ["Anybody with a zeal for healthy nutrition."],
    },
    {
      title: "Disclaimer",
      items: parseToArray(course.disclaimer!),
      fallback: ["Not for clinical practice."],
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Course Requirements
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review the requirements, eligibility, and important notes before
          starting this course.
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((section, index) => {
          const items = section.items.length ? section.items : section.fallback;

          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0b1628]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
                  <Info className="h-5 w-5" />
                </div>

                <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                  {section.title}
                </h3>
              </div>

              <div className="grid gap-3">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-blue-100 hover:bg-blue-50/60 dark:border-white/10 dark:bg-[#07111f] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.055]"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-300/10 dark:text-emerald-300">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>

                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
