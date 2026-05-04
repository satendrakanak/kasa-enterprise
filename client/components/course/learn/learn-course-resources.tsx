"use client";

import { Attachment } from "@/types/attachment";
import { Lecture } from "@/types/lecture";
import { getFileIcon } from "@/utils/get-file-type";
import { ChevronDown, Folder } from "lucide-react";

interface LearnCourseResourcesProps {
  lecture: Lecture;
  openMenu: number | null;
  setOpenMenu: (id: number | null) => void;
}

export const LearnCourseResources = ({
  lecture,
  openMenu,
  setOpenMenu,
}: LearnCourseResourcesProps) => {
  return (
    <div className="relative">
      <button
        onClick={() => setOpenMenu(openMenu === lecture.id ? null : lecture.id)}
        className="
            flex items-center gap-1.5
            text-xs font-medium
            border border-primary/40
            text-primary
            px-3 py-1
            rounded-full
            hover:bg-red-50
            transition
            cursor-pointer
        "
      >
        <Folder className="w-3.5 h-3.5" />
        Resources
        <ChevronDown className="w-3 h-3" />
      </button>

      {/* DROPDOWN */}
      {openMenu === lecture.id && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-md z-20 overflow-hidden">
          {lecture.attachments &&
            lecture.attachments.map((file: Attachment) => {
              const Icon = getFileIcon(file.name);

              return (
                <a
                  key={file.id}
                  href={file.file.path}
                  download
                  className="
                    flex items-start gap-2
                    px-3 py-2
                    text-xs
                    hover:bg-gray-100
                "
                >
                  <Icon className="w-4 h-4 text-gray-500 mt-0.5" />

                  <span className="break-all">{file.name}</span>
                </a>
              );
            })}
        </div>
      )}
    </div>
  );
};
