"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const category = article.categories?.[0]?.name;

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Draft";

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative block h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_90px_rgba(37,99,235,0.16)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_25px_70px_rgba(0,0,0,0.36)] dark:hover:border-rose-200/25 dark:hover:shadow-[0_34px_100px_rgba(244,63,94,0.16)]"
    >
      {/* soft hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(251,113,133,0.13),transparent_65%)]" />
      </div>

      {/* IMAGE */}
      <div className="relative h-52 w-full overflow-hidden rounded-[24px] bg-slate-100 dark:bg-white/5">
        <Image
          src={article.featuredImage?.path || "/assets/placeholder.jpg"}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/75 via-[#020617]/10 to-transparent opacity-70 transition group-hover:opacity-85" />

        {category && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-md dark:bg-white/15 dark:text-rose-200">
            {category}
          </span>
        )}

        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          <CalendarDays className="h-3.5 w-3.5" />
          {publishedDate}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[190px] flex-col px-3 pb-3 pt-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-slate-950 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-rose-200">
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {article.excerpt || "No description available"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-sm font-semibold text-blue-700 dark:text-rose-200">
            Read Article
          </span>

          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-rose-200 dark:group-hover:border-rose-200 dark:group-hover:bg-rose-200 dark:group-hover:text-white">
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
