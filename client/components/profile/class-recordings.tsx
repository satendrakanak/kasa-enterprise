import { Download, ExternalLink, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FacultyClassRecording } from "@/types/faculty-workspace";
import { formatDateTime } from "@/utils/formate-date";

type ClassRecordingsProps = {
  recordings: FacultyClassRecording[];
  limit?: number;
};

export function ClassRecordings({ recordings, limit }: ClassRecordingsProps) {
  const visibleRecordings = recordings.slice(0, limit ?? recordings.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Class Recordings
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-card-foreground">
            Watch completed classes
          </h3>
        </div>
        {visibleRecordings.length ? (
          <Badge variant="secondary">{visibleRecordings.length} available</Badge>
        ) : null}
      </div>

      {visibleRecordings.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {visibleRecordings.map((recording) => (
            <article
              key={recording.id}
              className="rounded-2xl border bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PlayCircle className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold">
                    {recording.name}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {recording.course?.title ?? "Course"} ·{" "}
                    {recording.batch?.name ?? "Batch"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {recording.session?.startsAt
                      ? formatDateTime(recording.session.startsAt)
                      : "Completed class"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {recording.playbackUrl ? (
                  <Button asChild size="sm">
                    <a href={recording.playbackUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-4" />
                      Watch
                    </a>
                  </Button>
                ) : null}
                {recording.file?.path ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={recording.file.path} target="_blank" rel="noreferrer">
                      <Download className="size-4" />
                      Download
                    </a>
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-background p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PlayCircle className="size-6" />
          </div>
          <p className="text-sm font-semibold">No recordings available yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Completed class recordings will appear here when faculty allows
            access.
          </p>
        </div>
      )}
    </div>
  );
}
