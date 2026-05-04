"use client";

import { flexRender, Table as TableType } from "@tanstack/react-table";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { DraggableRow } from "./draggable-row";
import { useEffect, useId, useMemo, useState } from "react";

interface DataTableContentProps<TData> {
  table: TableType<TData>;
  data: TData[];
  getRowId: (row: TData) => UniqueIdentifier; // 🔥 IMPORTANT
}

export function DataTableContent<TData>({
  table,
  data: initialData,
  getRowId,
}: DataTableContentProps<TData>) {
  const [data, setData] = useState(initialData);

  const sortableId = useId();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  // 🔥 dynamic id extraction
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map((item) => getRowId(item)),
    [data, getRowId],
  );

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = dataIds.indexOf(active.id);
    const newIndex = dataIds.indexOf(over.id);

    const newData = arrayMove(data, oldIndex, newIndex);
    setData(newData);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-[rgba(17,27,46,0.96)]">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          {/* 🔥 HEADER */}
          <TableHeader className="sticky top-0 z-10 bg-sidebar-primary dark:bg-[rgba(49,26,25,0.96)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* 🔥 BODY */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length} // 🔥 FIX
                  className="h-24 text-center text-slate-500 dark:text-slate-400"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
