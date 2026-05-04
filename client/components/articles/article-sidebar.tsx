"use client";

import Link from "next/link";
import { Hash, Layers } from "lucide-react";
import { Article } from "@/types/article";

type SidebarCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export function ArticleSidebar({
  article,
  categories,
}: {
  article: Article;
  categories: SidebarCategory[];
}) {
  return (
    <aside className="space-y-5">
      {/* Categories */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-white/10">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <Layers className="h-5 w-5" />
          </span>

          <div>
            <h4 className="font-semibold text-slate-950 dark:text-white">
              Categories
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse by topic
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {categories.length ? (
            categories.map((cat) => {
              const isActive = article.categories?.some(
                (item) => item.id === cat.id,
              );

              return (
                <Link
                  key={cat.id}
                  href={`/articles?category=${cat.slug}`}
                  className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.22)] dark:bg-rose-200 dark:text-black"
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive
                        ? "bg-white/20 text-white dark:bg-black/10 dark:text-black"
                        : "bg-white text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </Link>
              );
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-400">
              No categories available.
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-white/10">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-white/10 dark:text-rose-200 dark:ring-white/10">
            <Hash className="h-5 w-5" />
          </span>

          <div>
            <h4 className="font-semibold text-slate-950 dark:text-white">
              Tags
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Related keywords
            </p>
          </div>
        </div>

        {article.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-rose-200"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-400">
            No tags added.
          </p>
        )}
      </div>
    </aside>
  );
}
