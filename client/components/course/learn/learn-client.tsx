"use client";

import { useEffect, useState } from "react";
import { PlayerHeader } from "./player-header";
import { VideoPlayer } from "./video-player";
import { LearnCourseSidebar } from "./learn-course-sidebar";
import { CourseTabs } from "./course-tabs";
import { Course } from "@/types/course";
import { userProgressClientService } from "@/services/user-progress/user-progress.client";

import {
  mergeCourseProgress,
  getResumeLecture,
  getNextLecture,
} from "@/helpers/course-progress";
import { Lecture } from "@/types/lecture";
import { LearnFooter } from "@/components/layout/learn-footer";

interface LearnClientProps {
  course: Course;
}

export const LearnClient = ({ course }: LearnClientProps) => {
  const [courseData, setCourseData] = useState(course);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);

  // 🔥 load progress
  useEffect(() => {
    const load = async () => {
      const res = await userProgressClientService.getCourse(course.id);

      const updated = mergeCourseProgress(course, res.data);

      setCourseData(updated);
      setCurrentLecture(getResumeLecture(updated));
    };

    load();
  }, [course]);

  const handleNextLecture = () => {
    if (!currentLecture) return;

    const next = getNextLecture(courseData, currentLecture.id);
    if (next) setCurrentLecture(next);
  };

  const handleProgressUpdate = (
    lectureId: number,
    progress: number,
    lastTime: number,
    alreadyCompleted?: boolean,
  ) => {
    setCourseData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) => ({
        ...c,
        lectures: c.lectures.map((l) =>
          l.id === lectureId
            ? {
                ...l,
                progress: {
                  isCompleted: alreadyCompleted || progress >= 90,
                  progress,
                  lastTime,
                },
              }
            : l,
        ),
      })),
    }));
  };

  if (!currentLecture) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <PlayerHeader course={courseData} />

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* 🔥 LEFT SIDE (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto bg-black">
          <VideoPlayer
            lecture={currentLecture}
            onNext={handleNextLecture}
            onProgressUpdate={handleProgressUpdate}
          />

          <CourseTabs course={courseData} />
          <LearnFooter />
        </div>

        {/* 🔥 RIGHT SIDE (SIDEBAR) */}
        <div className="w-90 border-l bg-white flex flex-col">
          {/* SIDEBAR HEADER FIXED */}
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="font-semibold">Course content</h2>
          </div>

          {/* SIDEBAR SCROLL */}
          <div className="flex-1 overflow-y-auto">
            <LearnCourseSidebar
              course={courseData}
              currentLecture={currentLecture}
              onSelectLecture={setCurrentLecture}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
