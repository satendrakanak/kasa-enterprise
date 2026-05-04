"use client";

import { Article } from "@/types/article";

export function ArticleContent({ article }: { article: Article }) {
  return (
    <article
      className="
        prose prose-lg max-w-none rounded-3xl border border-slate-200 bg-white p-4
        shadow-[0_20px_60px_rgba(15,23,42,0.06)]
        prose-headings:text-slate-950
        prose-p:leading-8 prose-p:text-slate-700
        prose-strong:text-slate-950
        prose-a:text-blue-700
        prose-blockquote:border-blue-500 prose-blockquote:text-slate-700
        prose-li:text-slate-700 prose-li:marker:text-blue-600
        prose-img:rounded-2xl
        dark:border-white/10 dark:bg-[#07111f]
        dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]
        dark:prose-headings:text-white
        dark:prose-p:text-slate-300
        dark:prose-strong:text-white
        dark:prose-a:text-rose-200
        dark:prose-blockquote:border-rose-200 dark:prose-blockquote:text-slate-300
        dark:prose-li:text-slate-300 dark:prose-li:marker:text-rose-200
        md:p-5
      "
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );
}
