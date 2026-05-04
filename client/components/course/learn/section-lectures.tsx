"use client";

import { Chapter } from "@/types/chapter";
import { Lecture } from "@/types/lecture";
import { CheckCircle2, FileText, PlayCircle } from "lucide-react";
import { LearnCourseResources } from "./learn-course-resources";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { formatDuration, getVideoDuration } from "@/helpers/get-section-stats";

interface SectionLecturesProps {
  chapter: Chapter;
  openMenu: number | null;
  setOpenMenu: (id: number | null) => void;
  currentLecture: Lecture | null;
  onSelectLecture: (lecture: Lecture) => void;
}

export const SectionLectures = ({
  chapter,
  openMenu,
  setOpenMenu,
  currentLecture,
  onSelectLecture,
}: SectionLecturesProps) => {
  const [durationMap, setDurationMap] = useState<Record<number, number>>({});

  // 🔥 load durations
  useEffect(() => {
    const loadDurations = async () => {
      const map: Record<number, number> = {};

      await Promise.all(
        chapter.lectures.map(async (lecture) => {
          if (lecture.video?.path) {
            const duration = await getVideoDuration(lecture.video.path);
            map[lecture.id] = duration;
          }
        }),
      );

      setDurationMap(map);
    };

    loadDurations();
  }, [chapter]);

  return (
    <div className="bg-white">
      {chapter.lectures?.map((lecture: Lecture) => {
        const isActive = currentLecture?.id === lecture.id;
        const isCompleted = lecture.progress?.isCompleted;

        const hasVideo = !!lecture.video?.path;
        const hasAttachments =
          lecture.attachments && lecture.attachments.length > 0;

        const duration = durationMap[lecture.id];

        return (
          <div
            key={lecture.id}
            className={cn(
              "group px-4 py-3 border-l-4 cursor-pointer transition flex items-start justify-between",
              {
                "border-primary bg-primary/10": isActive,
                "border-transparent hover:bg-gray-50": !isActive,
              },
            )}
          >
            {/* LEFT */}
            <div
              className="flex gap-3 flex-1"
              onClick={() => onSelectLecture(lecture)}
            >
              {/* ICON */}
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : hasVideo ? (
                  <PlayCircle className="w-4 h-4 text-gray-500 group-hover:text-primary transition" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* TEXT */}
              <div className="flex flex-col">
                <p
                  className={cn(
                    "text-sm line-clamp-1",
                    isActive && "text-primary font-medium",
                  )}
                >
                  {lecture.title}
                </p>

                {/* META */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  {hasVideo && duration && (
                    <span>{formatDuration(duration)}</span>
                  )}

                  {hasAttachments && <span className="text-gray-300">•</span>}

                  {hasAttachments && lecture.attachments && (
                    <span>{lecture.attachments.length} files</span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            {hasAttachments && (
              <LearnCourseResources
                lecture={lecture}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
