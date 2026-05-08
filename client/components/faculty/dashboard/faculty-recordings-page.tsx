"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  Download,
  ExternalLink,
  RefreshCw,
  Search,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { getErrorMessage } from "@/lib/error-handler";
import { facultyWorkspaceClient } from "@/services/faculty/faculty-workspace.client";
import type { FacultyClassRecording } from "@/types/faculty-workspace";
import { formatDateTime } from "@/utils/formate-date";

type FacultyRecordingsPageProps = {
  recordings: FacultyClassRecording[];
  title?: string;
  description?: string;
  calendarHref?: string;
};

export function FacultyRecordingsPage({
  recordings,
  title = "Class Recordings",
  description = "Review past BBB classes, sync processed recordings, and download archived copies.",
  calendarHref = "/faculty/calendar",
}: FacultyRecordingsPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [syncingSessionId, setSyncingSessionId] = useState<number | null>(null);

  const filteredRecordings = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return recordings.filter((recording) => {
      const matchesStatus = status === "all" || recording.status === status;
      const haystack = [
        recording.name,
        recording.session?.title,
        recording.course?.title,
        recording.batch?.name,
        recording.faculty
          ? [recording.faculty.firstName, recording.faculty.lastName]
              .filter(Boolean)
              .join(" ")
          : "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [query, recordings, status]);

  async function handleSync(sessionId?: number | null) {
    if (!sessionId) return;

    try {
      setSyncingSessionId(sessionId);
      await facultyWorkspaceClient.syncSessionRecordings(sessionId);
      toast.success("Recordings synced");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setSyncingSessionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-5 border-b bg-muted/20 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              BBB archive
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={calendarHref}>
              <CalendarDays className="size-4" />
              Open calendar
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 border-b p-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search by class, course, batch, or faculty"
            />
          </div>
          <NativeSelect
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <NativeSelectOption value="all">All status</NativeSelectOption>
            <NativeSelectOption value="archived">Archived</NativeSelectOption>
            <NativeSelectOption value="available">Available</NativeSelectOption>
            <NativeSelectOption value="processing">Processing</NativeSelectOption>
            <NativeSelectOption value="failed">Failed</NativeSelectOption>
          </NativeSelect>
        </div>

        <div className="divide-y">
          {filteredRecordings.length ? (
            filteredRecordings.map((recording) => {
              const sessionId = recording.session?.id;
              const facultyName = recording.faculty
                ? [recording.faculty.firstName, recording.faculty.lastName]
                    .filter(Boolean)
                    .join(" ") || recording.faculty.email
                : "Faculty";

              return (
                <article
                  key={recording.id}
                  className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(240px,0.7fr)_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Video className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold">
                          {recording.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {recording.course?.title ?? "Course"} ·{" "}
                          {recording.batch?.name ?? "Batch"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge label={recording.status} />
                      <span>{recording.format}</span>
                      <span>{formatDuration(recording.durationSeconds)}</span>
                      {recording.participants ? (
                        <span>{recording.participants} participants</span>
                      ) : null}
                    </div>
                    {recording.archiveError ? (
                      <p className="mt-2 text-sm text-destructive">
                        {recording.archiveError}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">
                      {recording.session?.title ?? "Class session"}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {recording.session?.startsAt
                        ? formatDateTime(recording.session.startsAt)
                        : "Date unavailable"}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Faculty: {facultyName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 xl:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!sessionId || syncingSessionId === sessionId}
                      onClick={() => handleSync(sessionId)}
                    >
                      <RefreshCw
                        className={[
                          "size-4",
                          syncingSessionId === sessionId ? "animate-spin" : "",
                        ].join(" ")}
                      />
                      Sync
                    </Button>
                    {recording.file?.path ? (
                      <Button asChild type="button" variant="outline">
                        <a href={recording.file.path} target="_blank" rel="noreferrer">
                          <Download className="size-4" />
                          Download
                        </a>
                      </Button>
                    ) : null}
                    {recording.playbackUrl ? (
                      <Button asChild type="button">
                        <a
                          href={recording.playbackUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="size-4" />
                          Review
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Video className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">No recordings yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Complete a BBB class, then sync recordings from the calendar or this
                archive page.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 font-medium capitalize text-foreground">
      {label}
    </span>
  );
}

function formatDuration(seconds?: number | null) {
  if (!seconds) return "Duration unavailable";

  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${minutes} min`;

  return remainingMinutes ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
}
