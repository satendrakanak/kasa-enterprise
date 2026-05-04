"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  CheckCircle,
  Trash2,
  RotateCcw,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Chapter } from "@/types/chapter";
import { LectureForm } from "./lectures/lecture-form";
import { canPublishChapter } from "@/helpers/publish-rules";
import { cn } from "@/lib/utils";

interface ChapterAccordionItemProps {
  chapter: Chapter;
  index: number;
  activeId: number | null;
  setActiveId: (id: number) => void;
  onDelete?: (id: number) => void;
  onTooglePublish: (id: number, value: boolean) => void;
  isPublishedView?: boolean;
  isTemp?: boolean;
  dragHandle?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap;
  };
  onEdit: (chapter: Chapter) => void;
}

export const ChapterAccordionItem = ({
  chapter,
  index,
  activeId,
  setActiveId,
  onDelete,
  onTooglePublish,
  isPublishedView,
  isTemp,
  dragHandle,
  onEdit,
}: ChapterAccordionItemProps) => {
  const isActive = activeId === chapter.id;
  const disabled = !canPublishChapter(chapter);
  return (
    <Collapsible
      open={isActive}
      onOpenChange={(open) => {
        if (open) {
          setActiveId(chapter.id);
        }
      }}
      className={`w-full rounded-lg transition-all ${
        isActive
          ? "border border-(--brand-200) bg-background shadow-sm dark:border-white/15 dark:bg-white/6"
          : "border border-border dark:border-white/10 dark:bg-white/4"
      }`}
    >
      <CollapsibleTrigger
        className={`w-full px-3 py-3 cursor-pointer flex items-center justify-between text-sm font-medium transition-all no-underline hover:no-underline
    ${
      chapter.isPublished
        ? isActive
          ? "bg-green-100 dark:bg-emerald-500/16"
          : "bg-green-50 dark:bg-emerald-500/10"
        : isActive
          ? "bg-primary/10 dark:bg-white/8"
          : "hover:bg-muted dark:hover:bg-white/8"
    }`}
      >
        {/* LEFT */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* DRAG */}
          {dragHandle && (
            <span
              {...dragHandle.attributes}
              {...dragHandle.listeners}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab text-sm text-muted-foreground dark:text-slate-400"
            >
              ☰
            </span>
          )}

          {/* TITLE (ONLY EXPAND + ACTIVE) */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              setActiveId(chapter.id);
            }}
            className="truncate font-medium text-slate-900 dark:text-slate-100"
          >
            {chapter.title || `Untitled ${index + 1}`}
          </span>
        </div>

        {/* RIGHT ACTIONS */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 shrink-0"
        >
          <div className="mr-1 text-slate-500 dark:text-slate-300">
            {isActive ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </div>
          {/* EDIT (Drawer open) */}
          <div
            role="button"
            onClick={() => onEdit(chapter)}
            className="cursor-pointer rounded p-1 hover:bg-muted dark:hover:bg-white/8"
            title="Edit Chapter"
          >
            <Pencil className="size-3" />
          </div>

          {/* Published View */}
          {isPublishedView && (
            <div
              role="button"
              onClick={() => onTooglePublish(chapter.id, false)}
              className="cursor-pointer rounded p-1 text-red-600 hover:bg-red-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
              title="Unpublish"
            >
              <RotateCcw className="size-3" />
            </div>
          )}

          {/* Normal View */}
          {!isPublishedView && (
            <>
              {!chapter.isPublished && !isTemp && (
                <div
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 IMPORTANT (accordion fix)
                    if (disabled) return;

                    onTooglePublish(chapter.id, true);
                  }}
                  onKeyDown={(e) => {
                    if (disabled) return;

                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onTooglePublish(chapter.id, true);
                    }
                  }}
                  className={cn(
                    "rounded p-1 text-green-600 dark:text-emerald-300",
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-green-50 dark:hover:bg-emerald-500/10",
                  )}
                  title={disabled ? "Cannot publish yet" : "Publish"}
                >
                  <CheckCircle className="size-3" />
                </div>
              )}

              {!chapter.isPublished && !isTemp && (
                <div
                  role="button"
                  onClick={() => onDelete?.(chapter.id)}
                  className="cursor-pointer rounded p-1 text-red-500 hover:bg-red-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                  title="Delete Chapter"
                >
                  <Trash2 className="size-3" />
                </div>
              )}
            </>
          )}
        </div>
      </CollapsibleTrigger>

      {/* CONTENT */}
      <CollapsibleContent className="w-full overflow-hidden">
        <div className="min-h-50 max-h-[60vh] overflow-y-auto rounded-b-md bg-muted/30 px-3 pt-3 pb-4 dark:bg-white/3">
          <LectureForm chapter={chapter} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
