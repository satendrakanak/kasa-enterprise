"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Plus, Minus, PlayCircle, Lock, FileText } from "lucide-react";
import VideoPreviewModal from "@/components/modals/video-preview-modal";
import { cn } from "@/lib/utils";
import { getVideoDuration, formatDuration } from "@/helpers/get-section-stats";

interface CourseContentProps {
  course: Course;
}

export const CourseContent = ({ course }: CourseContentProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [durationMap, setDurationMap] = useState<Record<number, number>>({});
  const [sectionDuration, setSectionDuration] = useState<
    Record<number, number>
  >({});

  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const loadDurations = async () => {
      const lectureDurations: Record<number, number> = {};
      const sectionDurations: Record<number, number> = {};

      for (const chapter of course.chapters ?? []) {
        let total = 0;

        for (const lecture of chapter.lectures ?? []) {
          if (lecture.video?.path) {
            const duration = await getVideoDuration(lecture.video.path);

            lectureDurations[lecture.id] = duration;
            total += duration;
          }
        }

        sectionDurations[chapter.id] = total;
      }

      setDurationMap(lectureDurations);
      setSectionDuration(sectionDurations);
    };

    loadDurations();
  }, [course]);

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Course Content
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Explore chapters, lectures, previews, and learning material included
            in this course.
          </p>
        </div>

        <div className="space-y-3">
          {course.chapters?.map((chapter, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={chapter.id}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all duration-300",
                  isOpen
                    ? "border-blue-200 bg-blue-50/35 shadow-[0_14px_45px_rgba(37,99,235,0.08)] dark:border-rose-200/20 dark:bg-white/[0.045] dark:shadow-[0_18px_55px_rgba(0,0,0,0.25)]"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.025]",
                )}
              >
                {/* CHAPTER HEADER */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left transition hover:bg-blue-50/70 dark:hover:bg-white/[0.055]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3
                        className={cn(
                          "line-clamp-1 font-semibold text-slate-850 dark:text-white",
                          isOpen && "text-blue-700 dark:text-rose-200",
                        )}
                      >
                        {chapter.title}
                      </h3>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-white/10 dark:text-slate-300">
                        {chapter.lectures?.length || 0} lectures
                      </span>

                      {sectionDuration[chapter.id] > 0 && (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {formatDuration(sectionDuration[chapter.id])}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
                      isOpen
                        ? "border-blue-200 bg-blue-600 text-white dark:border-rose-200 dark:bg-rose-200 dark:text-black"
                        : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300",
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {/* LECTURES */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-[1200px]" : "max-h-0",
                  )}
                >
                  <div className="border-t border-slate-200 px-4 py-4 dark:border-white/10">
                    {/* CHAPTER DESCRIPTION */}
                    {chapter.description && (
                      <div className="mb-4 rounded-2xl border border-blue-100 bg-white/75 p-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-[#101b2d] dark:text-slate-300">
                        {chapter.description}
                      </div>
                    )}

                    <div className="space-y-2">
                      {chapter.lectures?.map((lecture) => {
                        const isLocked = !lecture.isFree || !chapter.isFree;
                        const hasVideo = !!lecture.video?.path;
                        const hasAttachment =
                          lecture.attachments && lecture.attachments.length > 0;
                        const duration = durationMap[lecture.id];

                        return (
                          <div
                            key={lecture.id}
                            className="rounded-2xl border border-slate-100 bg-white px-3 py-3 transition hover:border-blue-100 hover:bg-blue-50/60 dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.055]"
                          >
                            <div className="flex items-start justify-between gap-4">
                              {/* LEFT */}
                              <div className="flex min-w-0 items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
                                  {isLocked ? (
                                    <Lock className="h-4 w-4" />
                                  ) : hasVideo ? (
                                    <PlayCircle className="h-4 w-4 text-blue-700 dark:text-rose-200" />
                                  ) : (
                                    <FileText className="h-4 w-4" />
                                  )}
                                </span>

                                <div className="min-w-0">
                                  <p className="line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {lecture.title}
                                  </p>

                                  {lecture.description && (
                                    <div className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                                      {lecture.description}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* RIGHT */}
                              <div className="flex shrink-0 items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                                {!isLocked && hasVideo && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveVideo({
                                        url: lecture.video?.path || "",
                                        title: lecture.title,
                                      })
                                    }
                                    className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white dark:bg-rose-200/10 dark:text-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
                                  >
                                    Preview
                                  </button>
                                )}

                                {hasVideo && duration && (
                                  <span className="whitespace-nowrap">
                                    {formatDuration(duration)}
                                  </span>
                                )}

                                {!hasVideo && hasAttachment && (
                                  <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <VideoPreviewModal
        videoUrl={activeVideo?.url || null}
        title={activeVideo?.title}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
};
