"use client";

import { cn } from "@/lib/utils";
import { RefundRequestStatus } from "@/types/order";

const STATUS_STYLES: Record<RefundRequestStatus, string> = {
  [RefundRequestStatus.REQUESTED]:
    "bg-amber-50 text-amber-700 ring-amber-200",
  [RefundRequestStatus.APPROVED]:
    "bg-sky-50 text-sky-700 ring-sky-200",
  [RefundRequestStatus.REJECTED]:
    "bg-rose-50 text-rose-700 ring-rose-200",
  [RefundRequestStatus.PROCESSING]:
    "bg-violet-50 text-violet-700 ring-violet-200",
  [RefundRequestStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [RefundRequestStatus.FAILED]:
    "bg-red-50 text-red-700 ring-red-200",
};

export function RefundStatusBadge({
  status,
  className,
}: {
  status: RefundRequestStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
