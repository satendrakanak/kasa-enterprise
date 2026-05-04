"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowRight } from "lucide-react";

import { Article } from "@/types/article";
import { ArticleCard } from "./article-card";

interface RelatedArticlesProps {
  articles: Article[];
}

export const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (!articles?.length) return null;

  return (
    <section className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-6">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
              Keep Reading
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white lg:text-3xl">
              Related Articles
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Explore more reads connected to this topic.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm font-semibold text-blue-700 dark:text-rose-200 md:flex">
            Swipe to explore
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* SLIDER */}
        <div className="related-articles-slider">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1.08, spaceBetween: 14 },
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {articles.map((article, index) => (
              <SwiperSlide key={article.id || index} className="h-auto">
                <div className="h-full pb-2">
                  <ArticleCard article={article} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
