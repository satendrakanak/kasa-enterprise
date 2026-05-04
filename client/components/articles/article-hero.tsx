"use client";

import Image from "next/image";
import Container from "@/components/container";
import { Article } from "@/types/article";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <section className="relative overflow-hidden py-14 text-white dark:bg-[#101b2d] md:py-16">
      {/* LIGHT MODE - SAME HERO BLUE THEME */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.84),rgba(2,6,23,0.34),rgba(2,6,23,0.62))]" />
      </div>

      {/* DARK MODE */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="dark-section-shine absolute inset-0 opacity-30" />
      </div>

      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            {article.categories?.[0] && (
              <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(2,6,23,0.20)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
                {article.categories[0].name}
              </span>
            )}

            <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-[46px]">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="relative h-64 overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 shadow-[0_24px_70px_rgba(2,6,23,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_25px_70px_rgba(0,0,0,0.4)] md:h-72">
            <div className="relative h-full overflow-hidden rounded-[24px]">
              <Image
                src={article.featuredImage?.path || "/assets/default-cover.jpg"}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/55 via-[#020617]/10 to-transparent" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
