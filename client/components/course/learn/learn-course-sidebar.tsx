"use client";

import {
  formatTotalDuration,
  getSectionStats,
} from "@/helpers/get-section-stats";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionLectures } from "./section-lectures";
import { LectureStats } from "@/types/lecture";
import { Chapter } from "@/types/chapter";

export const LearnCourseSidebar = ({
  course,
  currentLecture,
  onSelectLecture,
}: any) => {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [sectionStats, setSectionStats] = useState<
    Record<number, LectureStats>
  >({});

  useEffect(() => {
    const loadStats = async () => {
      const statsMap: Record<number, LectureStats> = {};

      for (const chapter of course.chapters) {
        const stats = await getSectionStats(chapter.lectures);
        statsMap[chapter.id] = stats;
      }

      setSectionStats(statsMap);
    };

    loadStats();
  }, [course]);

  useEffect(() => {
    if (!currentLecture) return;

    // 🔥 find parent chapter
    const parentChapter = course.chapters.find((chapter: Chapter) =>
      chapter.lectures.some((l) => l.id === currentLecture.id),
    );

    if (!parentChapter) return;

    // 🔥 auto expand that section
    setOpenSections((prev) => ({
      ...prev,
      [parentChapter.id]: true,
    }));
  }, [currentLecture, course]);

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-full flex flex-col text-sm">
      {/* <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="font-semibold">Course content</h2>
      </div> */}

      <div className="divide-y">
        {course.chapters.map((chapter: any, index: number) => {
          const isOpen = openSections[chapter.id] ?? index === 0;
          const stats = sectionStats[chapter.id];
          return (
            <div key={chapter.id}>
              {/* SECTION */}
              <button
                onClick={() => toggleSection(chapter.id)}
                className="w-full flex justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div className="text-left">
                  <p className="font-medium">
                    Section {index + 1} : {chapter.title}
                  </p>

                  {stats && (
                    <p className="text-xs text-gray-800 mt-1">
                      {stats.completed}/{stats.total}
                      {stats.totalSeconds > 0 &&
                        ` | ${formatTotalDuration(stats.totalSeconds)}`}
                    </p>
                  )}
                </div>

                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* LECTURES */}
              {isOpen && (
                <SectionLectures
                  chapter={chapter}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  currentLecture={currentLecture}
                  onSelectLecture={onSelectLecture}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
