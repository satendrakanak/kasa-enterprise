"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/container";
import { Article } from "@/types/article";
import { ArticleCard } from "./article-card";

interface ArticlesSectionProps {
  articles: Article[];
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  if (!articles?.length) return null;

  const visibleArticles = articles.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-[#101b2d]">
      {/* Light mode soft background */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#eef6ff] to-white" />

        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-[120px]" />

        <div className="absolute right-[-160px] bottom-8 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Dark mode glossy background */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="dark-section-shine absolute inset-0 opacity-35" />
      </div>

      <Container className="relative z-10">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-700 shadow-sm backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
              Latest Articles
            </span>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Insights, essays, and practical guidance from our team.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Read useful ideas, expert-backed perspectives, and practical
              guidance to support your learning journey.
            </p>
          </div>

          <Link
            href="/articles"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-blue-200 bg-white/80 px-6 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-rose-200 dark:hover:bg-rose-200 dark:hover:text-black"
          >
            Explore All Articles
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}
