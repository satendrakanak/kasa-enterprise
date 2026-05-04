import { Chapter } from "@/types/chapter";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../../sortable-item";
import type { DragEndEvent, DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import ChapterAccordion from "./chapter-accordion";

type SortableRenderProps = {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap;
};
interface PublishedListProps {
  chapters: Chapter[];
  activeId: number | null;
  setActiveId: (id: number | null) => void;
  courseId: number;
  onTooglePublish: (id: number, isPublished: boolean) => void;
  onDelete: (id: number) => void;
  viewType: string;
  handleDragEnd: (event: DragEndEvent) => void;
}

export default function PublishedList({
  chapters,
  activeId,
  setActiveId,
  courseId,
  onTooglePublish,
  viewType,
  onDelete,
  handleDragEnd,
}: PublishedListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/4">
      <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
        Published Chapters
      </h3>

      {chapters.length === 0 && (
        <p className="text-xs text-muted-foreground dark:text-slate-400">
          No published chapters
        </p>
      )}
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.filter((c) => c.isPublished).map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {chapters
              .filter((chapter) => chapter.isPublished)
              .map((chapter, index) => (
                <SortableItem key={chapter.id} id={chapter.id}>
                  {({ attributes, listeners }: SortableRenderProps) => (
                    <ChapterAccordion
                      chapter={chapter}
                      index={index}
                      activeId={activeId}
                      setActiveId={setActiveId}
                      courseId={courseId}
                      onTooglePublish={onTooglePublish}
                      onDelete={onDelete}
                      viewType={viewType}
                      dragHandle={{
                        attributes,
                        listeners,
                      }}
                    />
                  )}
                </SortableItem>
              ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
