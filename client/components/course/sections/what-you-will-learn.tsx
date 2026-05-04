"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Course } from "@/types/course";
import { cn } from "@/lib/utils";

interface WhatYouWillLearnProps {
  course: Course;
}

export const WhatYouWillLearn = ({ course }: WhatYouWillLearnProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
      {/* Heading */}
      <div className="mb-5 border-b border-slate-100 pb-4 dark:border-white/10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          What you&apos;ll learn
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A quick overview of the key outcomes and concepts covered in this
          course.
        </p>
      </div>

      {/* Content */}
      <div className="relative">
        <div
          className={cn(
            "prose max-w-none text-sm leading-7",
            "prose-p:text-slate-600 prose-p:leading-7",
            "prose-li:text-slate-700 prose-li:leading-7 prose-li:marker:text-blue-600",
            "prose-strong:text-slate-950 prose-headings:text-slate-950 prose-a:text-blue-700",
            "dark:prose-p:text-slate-300 dark:prose-li:text-slate-300 dark:prose-li:marker:text-rose-200 dark:prose-strong:text-white dark:prose-headings:text-white dark:prose-a:text-rose-200",
            !expanded && "line-clamp-5",
          )}
          dangerouslySetInnerHTML={{ __html: course.description ?? "" }}
        />

        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent dark:from-[#07111f]" />
        )}
      </div>

      {/* Show More */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-rose-200 dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
      >
        {expanded ? "Show Less" : "Show More"}

        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>
    </div>
  );
};
