"use client";

import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { getCourseProgress } from "@/helpers/course-progress";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { WebsiteNavUser } from "@/components/auth/website-nav-user";

interface Props {
  course: Course;
}

export const PlayerHeader = ({ course }: Props) => {
  const router = useRouter();
  const { total, completed, percent } = getCourseProgress(course);

  const [open, setOpen] = useState(false);

  return (
    <div
      className="h-14 py-8 bg-linear-to-r from-[#0f172a] via-[#020617] to-[#0f172a]
      text-white flex items-center justify-between px-6
      border-b border-white/10"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div onClick={() => router.push("/")} className="cursor-pointer">
          <Logo />
        </div>

        <div className="h-4 w-px bg-white/20" />

        <h2 className="text-sm text-gray-200 truncate max-w-75">
          {course.title}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="relative flex items-center gap-4">
        {/* 🔥 ICON */}
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ProgressCircle percent={percent} />

          {/* 🔥 TEXT RIGHT SIDE */}
          <span className="text-xs text-gray-300 whitespace-nowrap">
            Your progress
          </span>

          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* 🔥 TOOLTIP FIXED */}
        {open && (
          <div className="absolute right-0 top-10 w-64 bg-white text-black rounded-lg shadow-xl p-4 z-999">
            {/* 🔥 ARROW */}
            <div
              className="absolute -top-2 right-5 w-0 h-0 
                border-l-8 border-l-transparent
                border-r-8 border-r-transparent
                border-b-8 border-b-white"
            />

            <p className="text-sm font-semibold mb-2">{percent}% completed</p>

            <p className="text-xs text-gray-600 mb-1">
              {completed} of {total} lectures completed
            </p>

            <p className="text-xs text-gray-500">
              Finish course to get your certificate
            </p>
          </div>
        )}
        <WebsiteNavUser />
      </div>
    </div>
  );
};
