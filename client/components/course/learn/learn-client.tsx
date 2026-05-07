"use client";

import { useEffect, useState } from "react";

import { LearnFooter } from "@/components/layout/learn-footer";
import {
  getNextLecture,
  getResumeLecture,
  mergeCourseProgress,
} from "@/helpers/course-progress";
import { userProgressClientService } from "@/services/user-progress/user-progress.client";
import { Course } from "@/types/course";
import { Lecture } from "@/types/lecture";
import { CourseTabs } from "./course-tabs";
import { LearnCourseSidebar } from "./learn-course-sidebar";
import { PlayerHeader } from "./player-header";
import { VideoPlayer } from "./video-player";

interface LearnClientProps {
  course: Course;
}

export const LearnClient = ({ course }: LearnClientProps) => {
  const [courseData, setCourseData] = useState(course);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);

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

    if (next) {
      setCurrentLecture(next);
    }
  };

  const handleProgressUpdate = (
    lectureId: number,
    progress: number,
    lastTime: number,
    alreadyCompleted?: boolean,
  ) => {
    const nextIsCompleted = alreadyCompleted || progress >= 90;

    setCourseData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lectures: chapter.lectures.map((lecture) =>
          lecture.id === lectureId
            ? {
                ...lecture,
                progress: {
                  isCompleted: nextIsCompleted,
                  progress,
                  lastTime,
                },
              }
            : lecture,
        ),
      })),
    }));

    setCurrentLecture((current) =>
      current?.id === lectureId
        ? {
            ...current,
            progress: {
              isCompleted: nextIsCompleted,
              progress,
              lastTime,
            },
          }
        : current,
    );

  };

  if (!currentLecture) return null;

  return (
    <div className="flex h-screen flex-col bg-background">
      <PlayerHeader course={courseData} />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-foreground">
          <VideoPlayer
            lecture={currentLecture}
            onNext={handleNextLecture}
            onProgressUpdate={handleProgressUpdate}
          />

          <div className="bg-background">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-(--surface-shell)" />
            </div>

            <div className="relative z-10">
              <CourseTabs course={courseData} />
              <LearnFooter />
            </div>
          </div>
        </main>

        <aside className="flex w-90 flex-col border-l border-border bg-card">
          <div className="sticky top-0 z-10 border-b border-border bg-card/95 p-4 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Course content
            </p>

            <h2 className="mt-1 font-semibold text-card-foreground">
              Lessons & chapters
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <LearnCourseSidebar
              course={courseData}
              currentLecture={currentLecture}
              onSelectLecture={setCurrentLecture}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
