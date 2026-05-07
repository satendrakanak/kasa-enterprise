"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfirmDeleteDialog } from "@/components/modals/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error-handler";
import { facultyWorkspaceClient } from "@/services/faculty/faculty-workspace.client";
import type {
  FacultyClassSession,
  FacultyCourseBatch,
} from "@/types/faculty-workspace";
import {
  formatMonthTitle,
  formatTime,
  getDateKey,
  getDatedLifecycle,
  parseDateKey,
} from "@/utils/formate-date";

type FacultyCalendarPageProps = {
  sessions: FacultyClassSession[];
  batches: FacultyCourseBatch[];
  todayKey: string;
  nowIso: string;
  initialBatchId?: number;
  initialDate?: string;
  openCreateOnLoad?: boolean;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const REMINDER_PRESETS = [
  { label: "1 day before", value: 1440 },
  { label: "2 hours before", value: 120 },
  { label: "1 hour before", value: 60 },
  { label: "15 minutes before", value: 15 },
];

export function FacultyCalendarPage({
  sessions,
  batches,
  todayKey,
  nowIso,
  initialBatchId,
  initialDate,
  openCreateOnLoad = false,
}: FacultyCalendarPageProps) {
  const [currentNowIso, setCurrentNowIso] = useState(nowIso);
  const schedulableBatches = batches.filter((batch) =>
    isSchedulableBatch(batch, todayKey),
  );
  const [sheetOpen, setSheetOpen] = useState(
    openCreateOnLoad && schedulableBatches.length > 0,
  );
  const [selectedSession, setSelectedSession] =
    useState<FacultyClassSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDate ?? (openCreateOnLoad ? todayKey : null),
  );
  const [monthAnchor, setMonthAnchor] = useState(() =>
    startOfMonth(parseDateKey(initialDate ?? todayKey, todayKey)),
  );
  const [visibleStatuses, setVisibleStatuses] = useState([
    "scheduled",
    "completed",
    "cancelled",
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentNowIso(new Date().toISOString());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredSessions = sessions.filter((session) =>
    visibleStatuses.includes(getSessionDisplayStatus(session, currentNowIso)),
  );
  const sessionsByDate = groupSessionsByDate(filteredSessions);
  const upcomingSessions = sessions.filter(
    (session) =>
      new Date(session.startsAt).getTime() >= new Date(currentNowIso).getTime() &&
      getSessionDisplayStatus(session, currentNowIso) !== "cancelled",
  );
  const todaySessions = sessionsByDate.get(todayKey) ?? [];
  const cancelledSessions = sessions.filter(
    (session) => getSessionDisplayStatus(session, currentNowIso) === "cancelled",
  ).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid min-h-[760px] xl:grid-cols-[320px_minmax(0,1fr)]">
          <CalendarSidebar
            batchesCount={schedulableBatches.length}
            cancelledSessions={cancelledSessions}
            monthAnchor={monthAnchor}
            todayKey={todayKey}
            todaySessions={todaySessions.length}
            upcomingSessions={upcomingSessions.length}
            visibleStatuses={visibleStatuses}
            onCreate={() => {
              if (!schedulableBatches.length) {
                toast.error("No active or upcoming batch is available for classes.");
                return;
              }

              setSelectedDate(todayKey);
              setSelectedSession(null);
              setSheetOpen(true);
            }}
            onMonthChange={setMonthAnchor}
            onToggleStatus={(status) =>
              setVisibleStatuses((current) =>
                current.includes(status)
                  ? current.filter((item) => item !== status)
                  : [...current, status],
              )
            }
          />

          <CalendarBoard
            monthAnchor={monthAnchor}
            todayKey={todayKey}
            nowIso={currentNowIso}
            sessionsByDate={sessionsByDate}
            onAdd={(date) => {
              if (!schedulableBatches.length) {
                toast.error("No active or upcoming batch is available for classes.");
                return;
              }

              setSelectedDate(date);
              setSelectedSession(null);
              setSheetOpen(true);
            }}
            onEdit={(session) => {
              setSelectedDate(getDateKey(session.startsAt));
              setSelectedSession(session);
              setSheetOpen(true);
            }}
            onMonthChange={setMonthAnchor}
          />
        </div>
      </section>

      <SessionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        batches={schedulableBatches}
        session={selectedSession}
        selectedDate={selectedDate}
        initialBatchId={initialBatchId}
        nowIso={currentNowIso}
      />
    </div>
  );
}

function CalendarSidebar({
  batchesCount,
  cancelledSessions,
  monthAnchor,
  todayKey,
  todaySessions,
  upcomingSessions,
  visibleStatuses,
  onCreate,
  onMonthChange,
  onToggleStatus,
}: {
  batchesCount: number;
  cancelledSessions: number;
  monthAnchor: Date;
  todayKey: string;
  todaySessions: number;
  upcomingSessions: number;
  visibleStatuses: string[];
  onCreate: () => void;
  onMonthChange: (date: Date) => void;
  onToggleStatus: (status: string) => void;
}) {
  const miniDays = useMemo(() => getMonthDays(monthAnchor), [monthAnchor]);
  const monthTitle = formatMonthTitle(monthAnchor);

  return (
    <aside className="border-b bg-muted/20 p-5 xl:border-b-0 xl:border-r">
      <Button
        className="h-12 w-full"
        onClick={onCreate}
        disabled={!batchesCount}
      >
        <Plus className="size-4" />
        Add Class
      </Button>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{monthTitle}</h2>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onMonthChange(addMonths(monthAnchor, -1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onMonthChange(addMonths(monthAnchor, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {WEEK_DAYS.map((day) => (
            <span key={day}>{day.slice(0, 3)}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
          {miniDays.map((day, index) =>
            day ? (
              <button
                key={day.key}
                type="button"
                onClick={() => onMonthChange(startOfMonth(parseDateKey(day.key, todayKey)))}
                className="flex h-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-primary/10 hover:text-primary data-[today=true]:bg-primary/10 data-[today=true]:text-primary"
                data-today={day.key === todayKey}
              >
                {day.date}
              </button>
            ) : (
              <span key={`mini-blank-${index}`} className="h-9" />
            ),
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <ListFilter className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Class filters</h2>
        </div>
        <div className="space-y-3">
          <StatusFilter
            checked={visibleStatuses.includes("scheduled")}
            colorClass="bg-violet-500"
            label="Scheduled"
            onCheckedChange={() => onToggleStatus("scheduled")}
          />
          <StatusFilter
            checked={visibleStatuses.includes("completed")}
            colorClass="bg-emerald-500"
            label="Completed"
            onCheckedChange={() => onToggleStatus("completed")}
          />
          <StatusFilter
            checked={visibleStatuses.includes("cancelled")}
            colorClass="bg-rose-500"
            label="Cancelled"
            onCheckedChange={() => onToggleStatus("cancelled")}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        <SideStat label="Today" value={todaySessions} />
        <SideStat label="Upcoming" value={upcomingSessions} />
        <SideStat label="Cancelled" value={cancelledSessions} />
      </div>
    </aside>
  );
}

function CalendarBoard({
  monthAnchor,
  todayKey,
  nowIso,
  sessionsByDate,
  onAdd,
  onEdit,
  onMonthChange,
}: {
  monthAnchor: Date;
  todayKey: string;
  nowIso: string;
  sessionsByDate: Map<string, FacultyClassSession[]>;
  onAdd: (date: string) => void;
  onEdit: (session: FacultyClassSession) => void;
  onMonthChange: (date: Date) => void;
}) {
  const monthDays = useMemo(() => getMonthDays(monthAnchor), [monthAnchor]);
  const monthTitle = formatMonthTitle(monthAnchor);

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onMonthChange(addMonths(monthAnchor, -1))}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onMonthChange(addMonths(monthAnchor, 1))}
          >
            <ChevronRight className="size-5" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{monthTitle}</h1>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b text-center text-sm font-semibold text-muted-foreground">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="border-r py-4 last:border-r-0">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((day, index) =>
          day ? (
            <button
              key={day.key}
              type="button"
              onClick={() => onAdd(day.key)}
              className={[
                "min-h-32 border-b border-r p-3 text-left transition hover:bg-muted/40",
                day.isCurrentMonth ? "bg-card" : "bg-muted/20 text-muted-foreground/60",
                day.key === todayKey ? "bg-primary/5" : "",
                index % 7 === 6 ? "border-r-0" : "",
              ].join(" ")}
            >
              <span className="text-base font-semibold">{day.date}</span>
              <div className="mt-3 space-y-1">
                {(sessionsByDate.get(day.key) ?? []).slice(0, 2).map((session) => (
                  <span
                    key={session.id}
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(session);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        onEdit(session);
                      }
                    }}
                    className={[
                      "block truncate rounded-md px-2 py-1 text-xs font-medium",
                      getSessionColor(getSessionDisplayStatus(session, nowIso)),
                    ].join(" ")}
                  >
                    {formatTime(session.startsAt)} {session.title}
                  </span>
                ))}
                {(sessionsByDate.get(day.key)?.length ?? 0) > 2 ? (
                  <span className="block text-[11px] text-muted-foreground">
                    +{(sessionsByDate.get(day.key)?.length ?? 0) - 2} more
                  </span>
                ) : null}
              </div>
            </button>
          ) : (
            <span key={`blank-${index}`} className="min-h-32 border-b border-r" />
          ),
        )}
      </div>
    </div>
  );
}

function StatusFilter({
  checked,
  colorClass,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  colorClass: string;
  label: string;
  onCheckedChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <span className={`size-2.5 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </label>
  );
}

function SideStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SessionSheet({
  open,
  onOpenChange,
  batches,
  session,
  selectedDate,
  initialBatchId,
  nowIso,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batches: FacultyCourseBatch[];
  session: FacultyClassSession | null;
  selectedDate: string | null;
  initialBatchId?: number;
  nowIso: string;
}) {
  const router = useRouter();
  const selectableBatches = useMemo(
    () => {
      const options = batches.map((batch) => ({
        id: batch.id,
        name: batch.name,
        courseTitle: batch.course.title,
      }));

      if (session && !options.some((batch) => batch.id === session.batch.id)) {
        return [
          {
            id: session.batch.id,
            name: session.batch.name,
            courseTitle: session.course.title,
          },
          ...options,
        ];
      }

      return options;
    },
    [batches, session],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    batchId: batches[0]?.id ? String(batches[0].id) : "",
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
    timezone: "Asia/Kolkata",
    meetingUrl: "",
    location: "",
    status: "scheduled",
    reminderOffsetsMinutes: ["60"],
    customReminderMinutes: "",
  });

  useEffect(() => {
    if (!open) return;
    const defaultStart = selectedDate
      ? `${selectedDate}T10:00`
      : "";
    const defaultEnd = selectedDate
      ? `${selectedDate}T11:00`
      : "";

    const fallbackBatchId =
      initialBatchId && selectableBatches.some((batch) => batch.id === initialBatchId)
        ? String(initialBatchId)
        : selectableBatches[0]?.id
          ? String(selectableBatches[0].id)
          : "";

    setForm({
      batchId: session?.batch.id ? String(session.batch.id) : fallbackBatchId,
      title: session?.title ?? "",
      description: session?.description ?? "",
      startsAt: toInputDateTime(session?.startsAt) || defaultStart,
      endsAt: toInputDateTime(session?.endsAt) || defaultEnd,
      timezone: session?.timezone ?? "Asia/Kolkata",
      meetingUrl: session?.meetingUrl ?? "",
      location: session?.location ?? "",
      status: session?.status ?? "scheduled",
      reminderOffsetsMinutes: getSessionReminderOffsets(session).map(String),
      customReminderMinutes: "",
    });
  }, [initialBatchId, open, selectableBatches, selectedDate, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      const payload = {
        batchId: Number(form.batchId),
        title: form.title,
        description: form.description || undefined,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        timezone: form.timezone || "Asia/Kolkata",
        meetingUrl: form.meetingUrl || undefined,
        location: form.location || undefined,
        status: form.status,
        reminderBeforeMinutes: getReminderOffsetPayload(form)[0] ?? 60,
        reminderOffsetsMinutes: getReminderOffsetPayload(form),
      };

      if (session) {
        await facultyWorkspaceClient.updateSession(session.id, payload);
        toast.success("Session updated");
      } else {
        await facultyWorkspaceClient.createSession(payload);
        toast.success("Session scheduled");
      }

      onOpenChange(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCancelSession() {
    if (!session) return;

    try {
      setIsSaving(true);
      await facultyWorkspaceClient.updateSession(session.id, {
        status: "cancelled",
      });
      toast.success("Session cancelled");
      onOpenChange(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSession() {
    if (!session) return;

    try {
      setIsDeleting(true);
      await facultyWorkspaceClient.deleteSession(session.id);
      toast.success("Session deleted");
      setDeleteOpen(false);
      onOpenChange(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl">
          <SheetHeader className="border-b p-6">
            <SheetTitle>{session ? "Update Class" : "Add Class"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Batch">
                <NativeSelect
                  value={form.batchId}
                  onChange={(event) => setForm({ ...form, batchId: event.target.value })}
                  required
                >
                  {selectableBatches.map((batch) => (
                    <NativeSelectOption key={batch.id} value={String(batch.id)}>
                      {batch.name} - {batch.courseTitle}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Status">
                <NativeSelect
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <NativeSelectOption value="scheduled">Scheduled</NativeSelectOption>
                  <NativeSelectOption value="completed">Completed</NativeSelectOption>
                  <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field label="Title">
                <Input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                />
              </Field>
              <Field label="Timezone">
                <Input
                  value={form.timezone}
                  onChange={(event) => setForm({ ...form, timezone: event.target.value })}
                />
              </Field>
              <Field label="Starts at">
                <Input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) => setForm({ ...form, startsAt: event.target.value })}
                  required
                />
              </Field>
              <Field label="Ends at">
                <Input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(event) => setForm({ ...form, endsAt: event.target.value })}
                  required
                />
              </Field>
              <Field label="Meeting URL">
                <Input
                  value={form.meetingUrl}
                  onChange={(event) => setForm({ ...form, meetingUrl: event.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Location">
                <Input
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                />
              </Field>
            </div>
            <Field label="Reminders">
              <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
                {REMINDER_PRESETS.map((preset) => {
                  const value = String(preset.value);

                return (
                  <label
                    key={preset.value}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={form.reminderOffsetsMinutes.includes(value)}
                      onCheckedChange={(checked) =>
                        setForm((current) => ({
                          ...current,
                          reminderOffsetsMinutes: checked
                            ? [...new Set([...current.reminderOffsetsMinutes, value])]
                            : current.reminderOffsetsMinutes.filter(
                                (item) => item !== value,
                              ),
                        }))
                      }
                    />
                    <span>{preset.label}</span>
                  </label>
                );
              })}
              <div className="sm:col-span-2">
                <Input
                  type="number"
                  min="1"
                  value={form.customReminderMinutes}
                  onChange={(event) =>
                    setForm({ ...form, customReminderMinutes: event.target.value })
                  }
                  placeholder="Custom minutes before class"
                />
              </div>
            </div>
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows={3}
            />
          </Field>
          <SheetFooter className="px-0 pb-0">
            <Button type="submit" disabled={isSaving || !selectableBatches.length}>
              {isSaving ? "Saving..." : "Save Class"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {session && getSessionDisplayStatus(session, nowIso) !== "cancelled" ? (
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={handleCancelSession}
              >
                Mark Cancelled
              </Button>
            ) : null}
            {session ? (
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={() => setDeleteOpen(true)}
              >
                {isDeleting ? "Deleting..." : "Delete Class"}
              </Button>
            ) : null}
          </SheetFooter>
        </form>
        </SheetContent>
      </Sheet>
      <ConfirmDeleteDialog
        deleteText="class"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteSession}
        loading={isDeleting}
      />
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function toInputDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function isSchedulableBatch(batch: FacultyCourseBatch, todayKey: string) {
  const lifecycle = getDatedLifecycle(batch, todayKey);

  return lifecycle === "active" || lifecycle === "upcoming";
}

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function addMonths(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

function getSessionColor(status: string) {
  if (status === "completed") {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
  }

  if (status === "cancelled") {
    return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  }

  return "bg-violet-500/15 text-violet-700 dark:text-violet-300";
}

function getSessionDisplayStatus(
  session: FacultyClassSession,
  nowIso: string,
) {
  if (session.status !== "scheduled") return session.status;

  return new Date(session.endsAt).getTime() <= new Date(nowIso).getTime()
    ? "completed"
    : "scheduled";
}

function getSessionReminderOffsets(session: FacultyClassSession | null) {
  if (session?.reminderOffsetsMinutes?.length) {
    return session.reminderOffsetsMinutes;
  }

  return [session?.reminderBeforeMinutes ?? 60];
}

function getReminderOffsetPayload(form: {
  reminderOffsetsMinutes: string[];
  customReminderMinutes: string;
}) {
  const values = [
    ...form.reminderOffsetsMinutes.map(Number),
    form.customReminderMinutes ? Number(form.customReminderMinutes) : null,
  ];

  return [...new Set(values)]
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value) && value > 0,
    )
    .sort((a, b) => b - a);
}

function groupSessionsByDate(sessions: FacultyClassSession[]) {
  return sessions.reduce((map, session) => {
    const key = getDateKey(session.startsAt);
    const list = map.get(key) ?? [];
    list.push(session);
    map.set(key, list);
    return map;
  }, new Map<string, FacultyClassSession[]>());
}

function getMonthDays(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstDay = new Date(year, month, 1);
  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return {
      date: date.getDate(),
      key: getDateKey(date),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}
