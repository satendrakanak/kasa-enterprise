"use client";

import { CalendarDays, Clock, UserRound } from "lucide-react";
import { Article } from "@/types/article";

export function ArticleMeta({ article }: { article: Article }) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="my-6 flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200 bg-white p-3 text-sm shadow-[0_18px_55px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 font-semibold text-blue-700 dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
        <UserRound className="h-4 w-4" />
        By {article.author?.firstName || "Admin"}
      </span>

      {publishedDate && (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-2 font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
          <CalendarDays className="h-4 w-4 text-blue-700 dark:text-rose-200" />
          {publishedDate}
        </span>
      )}

      <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-2 font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
        <Clock className="h-4 w-4 text-blue-700 dark:text-rose-200" />
        {article.readingTime ? `${article.readingTime} min read` : "Article"}
      </span>
    </div>
  );
}
