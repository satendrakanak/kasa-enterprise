"use client";

import { Clock3, UserRound } from "lucide-react";
import { RefundRequest } from "@/types/order";
import { RefundStatusBadge } from "./refund-status-badge";

function formatEventDate(value?: string | null) {
  if (!value) return "NA";

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAction(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function RefundTimeline({
  refundRequest,
  title = "Refund timeline",
}: {
  refundRequest: RefundRequest;
  title?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-white/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <Clock3 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              {title}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Requested on {formatEventDate(refundRequest.createdAt)}
            </p>
          </div>
        </div>

        <RefundStatusBadge status={refundRequest.status} />
      </div>

      <div className="mt-5 space-y-3">
        {refundRequest.logs?.length ? (
          refundRequest.logs.map((log, index) => {
            const actorName = log.actor
              ? `${log.actor.firstName || ""} ${log.actor.lastName || ""}`.trim() ||
                log.actor.email
              : log.actorType;

            return (
              <div key={log.id} className="relative pl-6">
                <div className="absolute left-2 top-0 h-full w-px bg-slate-200 dark:bg-white/10" />

                <div className="absolute left-0 top-4 z-10 h-4 w-4 rounded-full border-2 border-blue-600 bg-white shadow-[0_0_0_4px_rgba(37,99,235,0.08)] dark:border-rose-200 dark:bg-[#07111f] dark:shadow-[0_0_0_4px_rgba(251,207,232,0.08)]" />

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-blue-100 hover:bg-blue-50/60 dark:border-white/10 dark:bg-[#0b1628] dark:hover:border-rose-200/20 dark:hover:bg-white/[0.055]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">
                        {formatAction(log.action)}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <UserRound className="h-3.5 w-3.5 text-blue-700 dark:text-rose-200" />
                          By {actorName || "System"}
                        </span>

                        <span className="text-slate-300 dark:text-slate-600">
                          •
                        </span>

                        <span>{formatEventDate(log.createdAt)}</span>
                      </div>
                    </div>

                    {log.toStatus ? (
                      <RefundStatusBadge
                        status={log.toStatus}
                        className="text-[10px]"
                      />
                    ) : null}
                  </div>

                  {log.message ? (
                    <p className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-[#07111f] dark:text-slate-300">
                      {log.message}
                    </p>
                  ) : null}
                </div>

                {index === refundRequest.logs.length - 1 ? (
                  <div className="absolute left-2 bottom-0 h-4 w-px bg-white dark:bg-[#07111f]" />
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center dark:border-white/10 dark:bg-[#0b1628]">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              No refund events recorded yet
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Updates will appear here when the refund request moves forward.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
