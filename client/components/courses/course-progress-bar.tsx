"use client";

import Link from "next/link";

interface CourseProgressBarProps {
  percent: number;
  slug: string;
}

export function CourseProgressBar({ percent, slug }: CourseProgressBarProps) {
  return (
    <div className="mt-auto space-y-3 ">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <Link href={`/course/${slug}/learn`}>
        <span className="text-sm font-medium text-green-600 ">
          {percent > 0 ? "Continue Learning →" : "Start Learning →"}
        </span>
      </Link>
    </div>
  );
}
